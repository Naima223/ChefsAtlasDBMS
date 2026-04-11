<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'ingredients',
        'instructions',
        'image_path',
        'average_rating',
    ];

    protected $casts = [
        'ingredients' => 'array',
        'instructions' => 'array',
        'average_rating' => 'float',
    ];

    protected $appends = [
        'image_url',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function favoritedByUsers()
    {
        return $this->belongsToMany(User::class, 'favorite_recipe')
            ->withTimestamps();
    }

    public function getImageUrlAttribute()
    {
        return $this->image_path ? '/api/recipe-images/' . $this->image_path : null;
    }
}
