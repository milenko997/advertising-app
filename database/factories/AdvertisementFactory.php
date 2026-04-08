<?php

namespace Database\Factories;

use App\Models\Advertisement;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class AdvertisementFactory extends Factory
{
    protected $model = Advertisement::class;

    public function definition(): array
    {
        $title = $this->faker->sentence(4);
        return [
            'user_id'     => User::factory(),
            'category_id' => Category::factory(),
            'title'       => $title,
            'slug'        => Str::slug($title, '_') . '_' . $this->faker->unique()->randomNumber(5),
            'description' => $this->faker->paragraph(),
            'price'       => $this->faker->numberBetween(10, 10000) . ' USD',
            'condition'   => $this->faker->randomElement(['new', 'used', 'refurbished']),
            'image'       => null,
            'phone'       => '0612345678',
            'location'    => $this->faker->city(),
        ];
    }
}
