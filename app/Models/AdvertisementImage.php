<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdvertisementImage extends Model
{
    protected $fillable = ['advertisement_id', 'path', 'order'];

    public function advertisement()
    {
        return $this->belongsTo(Advertisement::class);
    }
}
