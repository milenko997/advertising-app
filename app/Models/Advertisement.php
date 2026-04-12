<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Advertisement extends Model
{
    use HasFactory;
    use SoftDeletes;

    const EXPIRY_DAYS = 60;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'description',
        'price',
        'payload',
        'availability',
        'image',
        'phone',
        'location',
        'category_id',
        'is_pinned',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (Advertisement $ad) {
            $ad->expires_at ??= now()->addDays(self::EXPIRY_DAYS);
        });
    }

    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    public function scopeActive($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function images()
    {
        return $this->hasMany(AdvertisementImage::class)->orderBy('order');
    }
}
