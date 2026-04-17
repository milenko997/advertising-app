<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    public $timestamps = false;

    protected $fillable = ['user_id', 'advertisement_id'];

    public function advertisement()
    {
        return $this->belongsTo(Advertisement::class);
    }

    public static function idsForUser(?int $userId): array
    {
        if (!$userId) return [];
        return \Illuminate\Support\Facades\Cache::remember(
            'favorite_ids_' . $userId, 60, fn() =>
            static::where('user_id', $userId)->pluck('advertisement_id')->all()
        );
    }
}
