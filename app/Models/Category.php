<?php

namespace App\Models;

use App\Models\Concerns\GeneratesSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory, GeneratesSlug;

    protected $fillable = [
        'name',
        'slug',
        'parent_id',
    ];

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            $category->slug = static::generateUniqueSlug($category->name);
        });

        static::updating(function ($category) {
            if ($category->isDirty('name')) {
                $category->slug = static::generateUniqueSlug($category->name, $category->id);
            }
        });
    }

    public function advertisements()
    {
        return $this->hasMany(\App\Models\Advertisement::class);
    }

    public function getUrlAttribute()
    {
        if ($this->parent) {
            return route('advertisements.byCategory', [
                'parent' => $this->parent->slug,
                'child' => $this->slug,
            ]);
        }

        return route('advertisements.byCategory', [
            'parent' => $this->slug,
        ]);
    }
}
