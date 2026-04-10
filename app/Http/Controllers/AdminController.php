<?php

namespace App\Http\Controllers;

use App\Models\ContactSubmission;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AdminController extends Controller
{
    private const UPLOAD_REWARD = 10;

    public function dashboard()
    {
        return response()->json([
            'stats' => [
                'users' => User::count(),
                'recipes' => Recipe::count(),
                'reviews' => \App\Models\Review::count(),
                'contacts' => ContactSubmission::count(),
            ],
            'recent_contacts' => ContactSubmission::latest()->limit(10)->get(),
            'recent_recipes' => Recipe::with(['user:id,name', 'categories:id,name'])->latest()->limit(10)->get(),
        ]);
    }

    public function deleteRecipe(Recipe $recipe)
    {
        $owner = $recipe->user;
        $deduction = min($owner->points, self::UPLOAD_REWARD);
        $owner->decrement('points', $deduction);
        $recipe->favoritedByUsers()->detach();
        $recipe->delete();

        return response()->json([
            'message' => 'Recipe deleted successfully by admin.',
        ]);
    }

    public function deleteUser(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'Admin accounts cannot delete themselves.',
            ], Response::HTTP_FORBIDDEN);
        }

        $user->reviews()->delete();
        $user->favorites()->detach();
        $user->recipes->each(function (Recipe $recipe) {
            $recipe->favoritedByUsers()->detach();
        });
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully by admin.',
        ]);
    }
}
