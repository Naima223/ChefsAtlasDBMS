<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function user(Request $request)
    {
        $user = $request->user()->load([
            'recipes.categories',
            'recipes.reviews.user',
        ]);

        return response()->json([
            'user' => $user,
            'stats' => [
                'recipes_count' => $user->recipes->count(),
                'points' => $user->points,
                'average_recipe_rating' => round((float) $user->recipes->avg('average_rating'), 2),
            ],
        ]);
    }

    public function leaderboards()
    {
        $topUsers = User::leaderboard()->limit(10)->get(['id', 'name', 'username', 'points']);

        $topRecipes = Recipe::with(['user:id,name', 'categories:id,name'])
            ->withCount('reviews')
            ->orderByDesc('average_rating')
            ->orderByDesc('reviews_count')
            ->latest()
            ->limit(10)
            ->get();

        return response()->json([
            'top_users' => $topUsers,
            'top_recipes' => $topRecipes,
        ]);
    }
}
