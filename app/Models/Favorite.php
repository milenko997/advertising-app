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
        return static::where('user_id', $userId)->pluck('advertisement_id')->all();
    }
}
