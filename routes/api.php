<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\UserLeaderboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// Users CRUD operations
Route::apiResource('users', UserController::class);

// Leaderboard routes
Route::get('/leaderboard', [UserLeaderboardController::class, 'index']);
Route::get('/leaderboard/{period_type}', [UserLeaderboardController::class, 'show']);
Route::post('/leaderboard', [UserLeaderboardController::class, 'store']);
