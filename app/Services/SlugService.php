<?php

namespace App\Services;

use App\Models\Advertisement;
use Illuminate\Support\Str;

class SlugService
{
    public function generate(string $title, ?int $excludeId = null): string
    {
        $base = Str::slug($title) ?: 'oglas';
        $slug = $base;
        $counter = 1;

        while (
            Advertisement::withTrashed()
                ->where('slug', $slug)
                ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
                ->exists()
        ) {
            $slug = $base . '-' . $counter++;
        }

        return $slug;
    }
}
