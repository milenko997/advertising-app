<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // ── Admin (keep as-is) ─────────────────────────────────────────
        User::forceCreate([
            'name'     => 'Milenko Ilic',
            'email'    => 'milenko.ilic997@gmail.com',
            'password' => Hash::make('123456789'),
            'role'     => 'admin',
        ]);

        // ── Regular customers ──────────────────────────────────────────
        $users = [
            [
                'name'  => 'Marko Petrović',
                'email' => 'marko.petrovic@gmail.com',
                'phone' => '0641234567',
            ],
            [
                'name'  => 'Stefan Nikolić',
                'email' => 'stefan.nikolic@gmail.com',
                'phone' => '0652345678',
            ],
            [
                'name'  => 'Dragan Jovanović',
                'email' => 'dragan.jovanovic@yahoo.com',
                'phone' => '0603456789',
            ],
            [
                'name'  => 'Nikola Đorđević',
                'email' => 'nikola.djordjevic@gmail.com',
                'phone' => '0674567890',
            ],
            [
                'name'  => 'Aleksandar Stojanović',
                'email' => 'aleksandar.stojanovic@hotmail.com',
                'phone' => '0615678901',
            ],
            [
                'name'  => 'Vladimir Milošević',
                'email' => 'vladimir.milosevic@gmail.com',
                'phone' => '0626789012',
            ],
            [
                'name'  => 'Zoran Stanković',
                'email' => 'zoran.stankovic@gmail.com',
                'phone' => '0637890123',
            ],
            [
                'name'  => 'Dejan Pavlović',
                'email' => 'dejan.pavlovic@gmail.com',
                'phone' => '0648901234',
            ],
            [
                'name'  => 'Igor Tomić',
                'email' => 'igor.tomic@gmail.com',
                'phone' => '0659012345',
            ],
            [
                'name'  => 'Miloš Živković',
                'email' => 'milos.zivkovic@gmail.com',
                'phone' => '0660123456',
            ],
            [
                'name'  => 'Petar Marinković',
                'email' => 'petar.marinkovic@gmail.com',
                'phone' => '0671234567',
            ],
            [
                'name'  => 'Jovan Radović',
                'email' => 'jovan.radovic@gmail.com',
                'phone' => '0682345678',
            ],
            [
                'name'  => 'Branko Lazović',
                'email' => 'branko.lazovic@gmail.com',
                'phone' => '0693456789',
            ],
            [
                'name'  => 'Slobodan Ilić',
                'email' => 'slobodan.ilic@gmail.com',
                'phone' => '0614567890',
            ],
            [
                'name'  => 'Nenad Vasić',
                'email' => 'nenad.vasic@gmail.com',
                'phone' => '0625678901',
            ],
        ];

        foreach ($users as $u) {
            User::forceCreate([
                'name'     => $u['name'],
                'email'    => $u['email'],
                'password' => Hash::make('123456789'),
                'role'     => 'customer',
                'phone'    => $u['phone'],
            ]);
        }
    }
}
