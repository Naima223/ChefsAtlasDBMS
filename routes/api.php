<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\TipController;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('auth/google', [AuthController::class, 'google']);

Route::get('categories', [CategoryController::class, 'index']);
Route::get('recipes', [RecipeController::class, 'index']);
Route::get('recipes/{recipe}', [RecipeController::class, 'show']);
Route::get('recipe-images/{path}', [RecipeController::class, 'image'])->where('path', '.*');
Route::get('leaderboards', [DashboardController::class, 'leaderboards']);
Route::get('users/{user}/tips', [TipController::class, 'show']);
Route::post('contact', [ContactController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('dashboard', [DashboardController::class, 'user']);

    Route::post('recipes', [RecipeController::class, 'store']);
    Route::put('recipes/{recipe}', [RecipeController::class, 'update']);
    Route::post('recipes/{recipe}', [RecipeController::class, 'update']);
    Route::delete('recipes/{recipe}', [RecipeController::class, 'destroy']);
    Route::post('recipes/{recipe}/favorite', [FavoriteController::class, 'store']);
    Route::delete('recipes/{recipe}/favorite', [FavoriteController::class, 'destroy']);
    Route::post('recipes/{recipe}/reviews', [ReviewController::class, 'store']);
    Route::delete('recipes/{recipe}/reviews/{review}', [ReviewController::class, 'destroy']);
    Route::post('tips', [TipController::class, 'store']);

    Route::middleware('admin')->group(function () {
        Route::get('admin/dashboard', [AdminController::class, 'dashboard']);
        Route::delete('admin/recipes/{recipe}', [AdminController::class, 'deleteRecipe']);
        Route::delete('admin/users/{user}', [AdminController::class, 'deleteUser']);
        Route::delete('admin/reviews/{review}', [AdminController::class, 'deleteReview']);
        Route::delete('admin/contacts/{contact}', [AdminController::class, 'deleteContact']);
    });
});
