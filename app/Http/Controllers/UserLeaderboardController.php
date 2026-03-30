<?php

namespace App\Http\Controllers;

use App\Models\UserLeaderboard;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class UserLeaderboardController extends Controller
{
    // GET /api/leaderboard
    public function index()
    {
        $entries = UserLeaderboard::with('user')
            ->orderByDesc('points')
            ->orderBy('rank')
            ->get();
        return response()->json([
            'success' => true,
            'data' => $entries->map(function($entry) {
                return [
                    'id' => $entry->id,
                    'user_id' => $entry->user_id,
                    'name' => $entry->user->name ?? null,
                    'email' => $entry->user->email ?? null,
                    'points' => $entry->points,
                    'rank' => $entry->rank,
                    'period_type' => $entry->period_type,
                    'generated_at' => $entry->generated_at,
                ];
            })
        ]);
    }

    // GET /api/leaderboard/{period_type}
    public function show($period_type)
    {
        $validPeriods = ['weekly', 'monthly', 'all_time'];
        if (!in_array($period_type, $validPeriods)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid period_type.'
            ], 422);
        }
        $entries = UserLeaderboard::with('user')
            ->where('period_type', $period_type)
            ->orderByDesc('points')
            ->orderBy('rank')
            ->get();
        return response()->json([
            'success' => true,
            'data' => $entries->map(function($entry) {
                return [
                    'id' => $entry->id,
                    'user_id' => $entry->user_id,
                    'name' => $entry->user->name ?? null,
                    'email' => $entry->user->email ?? null,
                    'points' => $entry->points,
                    'rank' => $entry->rank,
                    'period_type' => $entry->period_type,
                    'generated_at' => $entry->generated_at,
                ];
            })
        ]);
    }

    // POST /api/leaderboard
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,user_id'],
            'points' => ['required', 'integer', 'min:0'],
            'period_type' => ['required', Rule::in(['weekly', 'monthly', 'all_time'])],
            'generated_at' => ['required', 'date'],
        ]);

        // Find or create leaderboard entry for this user & period
        $entry = UserLeaderboard::firstOrNew([
            'user_id' => $validated['user_id'],
            'period_type' => $validated['period_type'],
            'generated_at' => $validated['generated_at'],
        ]);
        $entry->points = $validated['points'];
        $entry->save();

        // Recalculate ranks for this period
        $this->recalculateRanks($validated['period_type'], $validated['generated_at']);

        return response()->json([
            'success' => true,
            'message' => 'Leaderboard entry saved and ranks updated.',
            'data' => $entry
        ], 201);
    }

    private function recalculateRanks($period_type, $generated_at)
    {
        $entries = UserLeaderboard::where('period_type', $period_type)
            ->where('generated_at', $generated_at)
            ->orderByDesc('points')
            ->get();
        $rank = 1;
        foreach ($entries as $entry) {
            $entry->rank = $rank++;
            $entry->save();
        }
    }
}
