<?php

namespace App\Http\Services;

use App\Models\Recipe;
use Illuminate\Database\Eloquent\Collection;

class RecipeService
{
    public function getRecipes(): Collection
    {
        return Recipe::with(['user', 'categories'])
            ->latest()
            ->get();
    }

    public function getRecipeById(int $id): ?Recipe
    {
        return Recipe::with(['user', 'categories'])
            ->find($id);
    }

    public function createRecipe(array $data): Recipe
    {
        $categories = $data['categories'] ?? [];
        unset($data['categories']);

        $recipe = Recipe::create($data);

        if (!empty($categories)) {
            $recipe->categories()->sync($categories);
        }

        return $recipe->load(['user', 'categories']);
    }

    public function updateRecipe(int $id, array $data): ?Recipe
    {
        $recipe = Recipe::find($id);

        if (!$recipe) {
            return null;
        }

        $categories = $data['categories'] ?? null;
        unset($data['categories']);

        $recipe->update($data);

        if ($categories !== null) {
            $recipe->categories()->sync($categories);
        }

        return $recipe->load(['user', 'categories']);
    }

    public function deleteRecipe(int $id): bool
    {
        $recipe = Recipe::find($id);

        if (!$recipe) {
            return false;
        }

        return $recipe->delete();
    }

}