<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'google_id',
        'points',
        'is_admin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_admin' => 'boolean',
    ];

    public function recipes()
    {
        return $this->hasMany(Recipe::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function scopeLeaderboard($query)
    {
        return $query->withCount('recipes')
            ->orderByDesc('points')
            ->orderByDesc('recipes_count')
            ->orderBy('name');
    }
}
