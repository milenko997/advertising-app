<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

trait GeneratesSlug
{
    public static function generateUniqueSlug(string $name, ?int $excludeId = null): string
    {
        $base    = Str::slug($name);
        $slug    = $base;
        $counter = 1;

        $usesTrashed = in_array(SoftDeletes::class, class_uses_recursive(static::class));

        while (
            ($usesTrashed ? static::withTrashed() : static::query())
                ->where('slug', $slug)
                ->when($excludeId, fn ($q) => $q->where('id', '!=', $excludeId))
                ->exists()
        ) {
            $slug = $base . '-' . $counter++;
        }

        return $slug;
    }
}
