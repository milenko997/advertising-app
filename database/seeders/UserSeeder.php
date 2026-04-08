<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name'     => 'Milenko Ilic',
            'email'    => 'milenko.ilic997@gmail.com',
            'password' => Hash::make('123456789'),
            'role'     => 'admin',
        ]);

        User::create([
            'name'     => 'Test User',
            'email'    => 'test@gmail.com',
            'password' => Hash::make('123456789'),
            'role'     => 'customer',
        ]);
    }
}
