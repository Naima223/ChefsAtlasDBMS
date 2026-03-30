<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserLeaderboard extends Model
{
    use HasFactory;

    protected $table = 'user_leaderboard';

    protected $fillable = [
        'user_id',
        'points',
        'rank',
        'period_type',
        'generated_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
