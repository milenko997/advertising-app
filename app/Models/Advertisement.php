<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;

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
        'is_pinned_category',
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

        static::deleting(function (Advertisement $ad) {
            // Clean up favorites for all users who saved this ad
            $userIds = Favorite::where('advertisement_id', $ad->id)->pluck('user_id');
            if ($userIds->isNotEmpty()) {
                Favorite::where('advertisement_id', $ad->id)->delete();
                foreach ($userIds as $uid) {
                    Cache::forget('favorite_ids_' . $uid);
                    Cache::forget('saved_ads_count_' . $uid);
                }
            }

            if ($ad->isForceDeleting()) {
                $imageService = app(\App\Services\ImageService::class);
                foreach ($ad->images as $img) {
                    $imageService->delete($img->path);
                }
                $imageService->delete($ad->image);
            }
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
