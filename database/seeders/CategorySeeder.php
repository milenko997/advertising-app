<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            'Electronics' => ['Phones', 'Computers', 'Cameras'],
            'Vehicles' => ['Cars', 'Motorcycles', 'Bicycles'],
            'Home & Garden' => ['Furniture', 'Kitchen', 'Garden'],
        ];

        foreach ($categories as $parentName => $children) {
            $parent = Category::create([
                'name' => $parentName,
                'slug' => Str::slug($parentName),
                'parent_id' => null,
            ]);

            foreach ($children as $childName) {
                Category::create([
                    'name' => $childName,
                    'slug' => Str::slug($childName),
                    'parent_id' => $parent->id,
                ]);
            }
        }
    }
}
