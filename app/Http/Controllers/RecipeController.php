<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

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

        return response()->json([
            'data' => $query->get(),
        ]);
    }

    public function show(Recipe $recipe)
    {
        return response()->json([
            'data' => $recipe->load(['user:id,name,username', 'categories:id,name', 'reviews.user:id,name,username']),
        ]);
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
        ]);

        $recipe = $user->recipes()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'ingredients' => array_values($validated['ingredients']),
            'instructions' => array_values($validated['instructions']),
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

        if (!$recipe || $recipe->user_id !== $user->id) {
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
        ]);

        if (array_key_exists('ingredients', $validated)) {
            $validated['ingredients'] = array_values($validated['ingredients']);
        }

        if (array_key_exists('instructions', $validated)) {
            $validated['instructions'] = array_values($validated['instructions']);
        }

        $recipe->fill(collect($validated)->except('categories')->all());
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

        if (!$recipe || $recipe->user_id !== $user->id) {
            return response()->json([
                'message' => 'You can only delete your own recipe.',
            ], Response::HTTP_FORBIDDEN);
        }

        $owner = User::find($recipe->user_id);
        if ($owner) {
            $owner->decrement('points', min($owner->points, self::UPLOAD_REWARD));
        }

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
}
