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
            'wrong_category' => 'Wrong category',
            'duplicate_spam' => 'Duplicated ad / spam',
            'against_rules'  => 'Against the rules',
            'ignore_user'    => 'Ignore all ads of this user',
        ];
    }
}
