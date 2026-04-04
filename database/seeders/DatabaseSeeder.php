<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            'Breakfast',
            'Lunch',
            'Dinner',
            'Dessert',
            'Vegan',
            'Street Food',
            'Quick Meals',
            'Seafood',
            'Italian',
            'Bengali',
        ] as $categoryName) {
            Category::firstOrCreate(['name' => $categoryName]);
        }

    }
}
