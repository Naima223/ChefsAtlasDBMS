<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class RecipeController extends Controller
{
    private const UPLOAD_REWARD = 10;

    public function index(Request $request)
    {
        $query = Recipe::with(['user:id,name,username', 'categories:id,name', 'reviews.user:id,name,username'])
            ->withCount('reviews')
            ->latest();

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->string('search') . '%');
        }

        if ($request->filled('categories')) {
            $categories = collect(explode(',', (string) $request->string('categories')))
                ->map(fn ($value) => trim($value))
                ->filter();

            if ($categories->isNotEmpty()) {
                $query->whereHas('categories', function ($builder) use ($categories) {
                    $builder->whereIn('name', $categories);
                });
            }
        }

        $recipes = $query->paginate(5)->withQueryString();
        $favoriteIds = $this->favoriteIdsForUser($request);

        $recipes->getCollection()->each(function (Recipe $recipe) use ($favoriteIds) {
            $recipe->setAttribute('favorited_by_auth_user', $favoriteIds->contains($recipe->id));
        });

        return response()->json([
            'data' => $recipes->items(),
            'meta' => [
                'current_page' => $recipes->currentPage(),
                'last_page' => $recipes->lastPage(),
                'per_page' => $recipes->perPage(),
                'total' => $recipes->total(),
                'from' => $recipes->firstItem(),
                'to' => $recipes->lastItem(),
            ],
        ]);
    }

    public function show(Request $request, Recipe $recipe)
    {
        $recipe->load(['user:id,name,username', 'categories:id,name', 'reviews.user:id,name,username']);
        $recipe->setAttribute(
            'favorited_by_auth_user',
            $this->favoriteIdsForUser($request)->contains($recipe->id)
        );

        return response()->json([
            'data' => $recipe,
        ]);
    }

    public function image(string $path)
    {
        abort_unless(Storage::disk('public')->exists($path), Response::HTTP_NOT_FOUND);

        return Storage::disk('public')->response($path);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:2000',
            'ingredients' => 'required|array|min:1',
            'ingredients.*' => 'required|string|max:255',
            'instructions' => 'required|array|min:1',
            'instructions.*' => 'required|string|max:2000',
            'categories' => 'required|array|min:1',
            'categories.*' => 'required|string|max:100',
            'image' => 'nullable|image|max:5120',
        ]);

        $recipe = $user->recipes()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'ingredients' => array_values($validated['ingredients']),
            'instructions' => array_values($validated['instructions']),
            'image_path' => $request->hasFile('image')
                ? $request->file('image')->store('recipes', 'public')
                : null,
        ]);

        $categoryIds = $this->resolveCategoryIds($validated['categories']);
        $recipe->categories()->sync($categoryIds);
        $user->increment('points', self::UPLOAD_REWARD);

        return response()->json([
            'message' => 'Recipe created successfully.',
            'data' => $recipe->load(['user:id,name,username', 'categories:id,name']),
        ], Response::HTTP_CREATED);
    }

    public function update(Request $request, Recipe $recipe)
    {
        $user = $request->user();

        if (!$recipe || (string) $recipe->user_id !== (string) $user->id) {
            return response()->json([
                'message' => 'You can only update your own recipe.',
            ], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|max:2000',
            'ingredients' => 'sometimes|array|min:1',
            'ingredients.*' => 'required|string|max:255',
            'instructions' => 'sometimes|array|min:1',
            'instructions.*' => 'required|string|max:2000',
            'categories' => 'sometimes|array|min:1',
            'categories.*' => 'required|string|max:100',
            'image' => 'nullable|image|max:5120',
            'remove_image' => 'sometimes|boolean',
        ]);

        if (array_key_exists('ingredients', $validated)) {
            $validated['ingredients'] = array_values($validated['ingredients']);
        }

        if (array_key_exists('instructions', $validated)) {
            $validated['instructions'] = array_values($validated['instructions']);
        }

        if ($request->hasFile('image')) {
            if ($recipe->image_path) {
                Storage::disk('public')->delete($recipe->image_path);
            }

            $validated['image_path'] = $request->file('image')->store('recipes', 'public');
        } elseif (($validated['remove_image'] ?? false) && $recipe->image_path) {
            Storage::disk('public')->delete($recipe->image_path);
            $validated['image_path'] = null;
        }

        $recipe->fill(collect($validated)->except(['categories', 'image', 'remove_image'])->all());
        $recipe->save();

        if (array_key_exists('categories', $validated)) {
            $recipe->categories()->sync($this->resolveCategoryIds($validated['categories']));
        }

        return response()->json([
            'message' => 'Recipe updated successfully.',
            'data' => $recipe->load(['user:id,name,username', 'categories:id,name', 'reviews.user:id,name,username']),
        ]);
    }

    public function destroy(Request $request, Recipe $recipe)
    {
        $user = $request->user();

        if (!$recipe || (string) $recipe->user_id !== (string) $user->id) {
            return response()->json([
                'message' => 'You can only delete your own recipe.',
            ], Response::HTTP_FORBIDDEN);
        }

        $owner = User::find($recipe->user_id);
        if ($owner) {
            $owner->decrement('points', min($owner->points, self::UPLOAD_REWARD));
        }

        if ($recipe->image_path) {
            Storage::disk('public')->delete($recipe->image_path);
        }

        $recipe->reviews()->delete();
        $recipe->categories()->detach();
        $recipe->favoritedByUsers()->detach();
        $recipe->delete();

        return response()->json([
            'message' => 'Recipe deleted successfully.',
        ]);
    }

    private function resolveCategoryIds(array $categories)
    {
        return collect($categories)
            ->map(fn ($name) => trim($name))
            ->filter()
            ->unique()
            ->map(fn ($name) => Category::firstOrCreate(['name' => $name])->id)
            ->values();
    }

    private function favoriteIdsForUser(Request $request)
    {
        $user = $request->user('sanctum') ?? $request->user();

        if (!$user) {
            return collect();
        }

        return $user->favorites()->pluck('recipes.id');
    }
}
