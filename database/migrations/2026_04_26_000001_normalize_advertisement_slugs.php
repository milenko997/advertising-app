<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $ads = DB::table('advertisements')->orderBy('id')->get(['id', 'slug']);

        foreach ($ads as $ad) {
            $newSlug = str_replace('_', '-', $ad->slug);

            if ($newSlug === $ad->slug) {
                continue;
            }

            // Resolve collisions by appending a counter
            $candidate = $newSlug;
            $counter   = 1;
            while (DB::table('advertisements')->where('slug', $candidate)->where('id', '!=', $ad->id)->exists()) {
                $candidate = $newSlug . '-' . $counter++;
            }

            DB::table('advertisements')->where('id', $ad->id)->update(['slug' => $candidate]);
        }
    }

    public function down(): void
    {
        // Reversing slug normalization is not safe — slugs may have changed due to collision resolution
    }
};
