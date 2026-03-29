<?php

namespace App\Http\Controllers;

use App\Http\Services\RecipeService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RecipeController extends Controller
{
    private RecipeService $recipeService;

    public function __construct(RecipeService $recipeService)
    {
        $this->recipeService = $recipeService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       return $this->recipeService->getRecipes();
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return $this->recipeService->getRecipeById($id);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'descriptions' => 'required|string',
            'ingredients' => 'required|string',
            'instructions' => 'required|string',
            'categories' => 'array',
            'categories.*' => 'exists:categories,id',
        ]);

        $validated['user_id'] = $user->id;

        $recipe = $this->recipeService->createRecipe($validated);

        return response()->json([
            'message' => 'Recipe created successfully',
            'data' => $recipe
        ], Response::HTTP_CREATED);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();

        $recipe = $this->recipeService->getRecipeById($id);

        if (!$recipe || $recipe->user_id !== $user->id) {
            return response()->json([
                'message' => 'Forbidden'
            ], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'descriptions' => 'sometimes|string',
            'ingredients' => 'sometimes|string',
            'instructions' => 'sometimes|string',
            'categories' => 'sometimes|array',
            'categories.*' => 'exists:categories,id',
        ]);

        $updatedRecipe = $this->recipeService->updateRecipe($id, $validated);

        return response()->json([
            'message' => 'Recipe updated successfully',
            'data' => $updatedRecipe
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        $recipe = $this->recipeService->getRecipeById($id);

        if (!$recipe || $recipe->user_id !== $user->id) {
            return response()->json([
                'message' => 'Forbidden'
            ], Response::HTTP_FORBIDDEN);
        }

        $this->recipeService->deleteRecipe($id);

        return response()->json([
            'message' => 'Recipe deleted successfully'
        ]);
    }

}