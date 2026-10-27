<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Audit log of what admins did in the admin panel. Descriptions are snapshots (titles, names)
 * so entries stay readable after the ad, user or category is gone.
 */
class AdminAction extends Model
{
    const UPDATED_AT = null;

    protected $fillable = ['admin_id', 'admin_name', 'action', 'description'];

    public const LABELS = [
        'ad_updated'        => 'Izmena oglasa',
        'ad_deleted'        => 'Brisanje oglasa',
        'ad_renewed'        => 'Obnova oglasa',
        'ad_pinned'         => 'Kačenje oglasa',
        'ad_unpinned'       => 'Otkačinjanje oglasa',
        'user_created'      => 'Novi korisnik',
        'user_updated'      => 'Izmena korisnika',
        'user_deleted'      => 'Brisanje korisnika',
        'category_created'  => 'Nova kategorija',
        'category_updated'  => 'Izmena kategorije',
        'category_deleted'  => 'Brisanje kategorije',
        'report_resolved'   => 'Prijava rešena',
        'report_reopened'   => 'Prijava ponovo otvorena',
        'report_deleted'    => 'Brisanje prijave',
        'feedback_deleted'  => 'Brisanje utiska',
    ];

    public static function record(string $action, string $description): void
    {
        $admin = auth()->user();

        static::create([
            'admin_id'    => $admin?->id,
            'admin_name'  => $admin?->name ?? 'sistem',
            'action'      => $action,
            'description' => Str::limit($description, 1000),
        ]);
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
