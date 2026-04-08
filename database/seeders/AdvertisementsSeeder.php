<?php

namespace Database\Seeders;

use App\Models\Advertisement;
use App\Models\Category;
use App\Models\User;
use App\Services\SlugService;
use Illuminate\Database\Seeder;

class AdvertisementsSeeder extends Seeder
{
    public function run()
    {
        $faker      = \Faker\Factory::create();
        $userIds    = User::pluck('id')->toArray();
        $categoryIds = Category::pluck('id')->toArray();

        foreach (range(1, 20) as $index) {
            $title = $faker->sentence(3, true);

            Advertisement::create([
                'user_id'     => $faker->randomElement($userIds),
                'category_id' => $faker->randomElement($categoryIds),
                'title'       => $title,
                'slug'        => SlugService::generate($title),
                'description' => $faker->paragraph(3, true),
                'price'       => $faker->numberBetween(100, 1000),
                'condition'   => $faker->randomElement(['New', 'Used']),
                'phone'       => $faker->numerify('06########'),
                'location'    => $faker->city(),
                'image'       => null,
            ]);
        }
    }
}
