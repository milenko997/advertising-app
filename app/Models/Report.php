<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = ['advertisement_id', 'reporter_id', 'type', 'resolved'];

    public function advertisement()
    {
        return $this->belongsTo(Advertisement::class)->withTrashed();
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public static function typeLabels(): array
    {
        return [
            'wrong_category' => 'Pogrešna kategorija',
            'duplicate_spam' => 'Duplikat oglasa / spam',
            'against_rules'  => 'Krši pravila',
            'ignore_user'    => 'Ignoriši sve oglase ovog korisnika',
        ];
    }
}
