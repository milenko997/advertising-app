<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('advertisements', function (Blueprint $table) {
            $table->index(['deleted_at', 'expires_at']); // active() scope: always queried together
            $table->index('user_id');
            $table->index('category_id');
            $table->index('is_pinned');
            $table->index('is_pinned_category');
        });

        Schema::table('reports', function (Blueprint $table) {
            $table->index('resolved');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->index('reviewed_user_id');
        });
    }

    public function down(): void
    {
        Schema::table('advertisements', function (Blueprint $table) {
            $table->dropIndex(['deleted_at', 'expires_at']);
            $table->dropIndex(['user_id']);
            $table->dropIndex(['category_id']);
            $table->dropIndex(['is_pinned']);
            $table->dropIndex(['is_pinned_category']);
        });

        Schema::table('reports', function (Blueprint $table) {
            $table->dropIndex(['resolved']);
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropIndex(['reviewed_user_id']);
        });
    }
};
