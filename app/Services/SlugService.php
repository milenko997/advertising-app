<?php

namespace App\Services;

use App\Models\Advertisement;
use Illuminate\Support\Str;

class SlugService
{
    public static function generate(string $title, ?int $excludeId = null): string
    {
        $base = Str::slug($title, '_');
        $slug = $base;
        $counter = 1;

        while (
            Advertisement::withTrashed()
                ->where('slug', $slug)
                ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
                ->exists()
        ) {
            $slug = $base . '_' . $counter++;
        }

        return $slug;
    }
}
