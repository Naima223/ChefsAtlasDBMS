<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favorite_recipe', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('recipe_id')->constrained()->noActionOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'recipe_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorite_recipe');
    }
};
