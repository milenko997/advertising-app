<?php

namespace Database\Seeders;

use App\Models\Advertisement;
use Illuminate\Database\Seeder;

class AdvertisementsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = \Faker\Factory::create();

        foreach (range(1, 20) as $index) {
            Advertisement::create([
                'user_id' => rand(1, 2),
                'category_id' => rand(1, 5),
                'title' => $faker->sentence(3, true),
                'slug' => \Illuminate\Support\Str::slug($faker->unique()->sentence(3)),
                'description' => $faker->paragraph(3, true),
                'price' => $faker->numberBetween(100, 1000),
                'condition' => $faker->randomElement(['New', 'Used']),
                'phone' => $faker->phoneNumber,
                'location' => $faker->city,
                'image' => 'ads/' . $faker->image('public/storage/ads', 640, 480, null, false),
            ]);
        }
    }
}
