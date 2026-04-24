<?php

namespace App\Models;

use App\Enums\UserRole;
use App\Models\Concerns\GeneratesSlug;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, GeneratesSlug, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'slug',
        'phone',
        'avatar',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (User $user) {
            $user->slug = static::generateUniqueSlug($user->name);
        });

        static::updating(function (User $user) {
            if ($user->isDirty('name')) {
                $user->slug = static::generateUniqueSlug($user->name, $user->id);
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'role'              => UserRole::class,
    ];

    public function isSuperAdmin(): bool
    {
        return $this->role === UserRole::SuperAdmin;
    }

    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin || $this->role === UserRole::SuperAdmin;
    }

    public function isCustomer(): bool
    {
        return $this->role === UserRole::Customer;
    }

    public function advertisements()
    {
        return $this->hasMany(\App\Models\Advertisement::class);
    }

    public function favorites()
    {
        return $this->hasMany(\App\Models\Favorite::class);
    }
}
