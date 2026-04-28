<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        $adminEmail    = env('SEED_ADMIN_EMAIL', 'admin@example.com');
        $adminPassword = env('SEED_ADMIN_PASSWORD', 'change-me-before-use');
        $seedPassword  = env('SEED_USER_PASSWORD',  'change-me-before-use');

        // ── Admin ──────────────────────────────────────────────────────
        User::forceCreate([
            'name'     => 'Admin',
            'email'    => $adminEmail,
            'password' => Hash::make($adminPassword),
            'role'     => 'admin',
        ]);

        // ── Regular customers ──────────────────────────────────────────
        $users = [
            [
                'name'  => 'Marko Petrović',
                'email' => 'marko.petrovic@example.com',
                'phone' => '0641234567',
            ],
            [
                'name'  => 'Stefan Nikolić',
                'email' => 'stefan.nikolic@example.com',
                'phone' => '0652345678',
            ],
            [
                'name'  => 'Dragan Jovanović',
                'email' => 'dragan.jovanovic@example.com',
                'phone' => '0603456789',
            ],
            [
                'name'  => 'Nikola Đorđević',
                'email' => 'nikola.djordjevic@example.com',
                'phone' => '0674567890',
            ],
            [
                'name'  => 'Aleksandar Stojanović',
                'email' => 'aleksandar.stojanovic@example.com',
                'phone' => '0615678901',
            ],
            [
                'name'  => 'Vladimir Milošević',
                'email' => 'vladimir.milosevic@example.com',
                'phone' => '0626789012',
            ],
            [
                'name'  => 'Zoran Stanković',
                'email' => 'zoran.stankovic@example.com',
                'phone' => '0637890123',
            ],
            [
                'name'  => 'Dejan Pavlović',
                'email' => 'dejan.pavlovic@example.com',
                'phone' => '0648901234',
            ],
            [
                'name'  => 'Igor Tomić',
                'email' => 'igor.tomic@example.com',
                'phone' => '0659012345',
            ],
            [
                'name'  => 'Miloš Živković',
                'email' => 'milos.zivkovic@example.com',
                'phone' => '0660123456',
            ],
            [
                'name'  => 'Petar Marinković',
                'email' => 'petar.marinkovic@example.com',
                'phone' => '0671234567',
            ],
            [
                'name'  => 'Jovan Radović',
                'email' => 'jovan.radovic@example.com',
                'phone' => '0682345678',
            ],
            [
                'name'  => 'Branko Lazović',
                'email' => 'branko.lazovic@example.com',
                'phone' => '0693456789',
            ],
            [
                'name'  => 'Slobodan Ilić',
                'email' => 'slobodan.ilic@example.com',
                'phone' => '0614567890',
            ],
            [
                'name'  => 'Nenad Vasić',
                'email' => 'nenad.vasic@example.com',
                'phone' => '0625678901',
            ],
        ];

        foreach ($users as $u) {
            User::forceCreate([
                'name'     => $u['name'],
                'email'    => $u['email'],
                'password' => Hash::make($seedPassword),
                'role'     => 'customer',
                'phone'    => $u['phone'],
            ]);
        }
    }
}
