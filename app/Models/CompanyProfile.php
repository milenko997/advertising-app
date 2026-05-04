<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_name',
        'pib',
        'maticni_broj',
        'address',
        'city',
        'website',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
