<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            'Electronics'  => ['Phones', 'Computers', 'Cameras'],
            'Vehicles'     => ['Cars', 'Motorcycles', 'Bicycles'],
            'Home & Garden' => ['Furniture', 'Kitchen', 'Garden'],
        ];

        foreach ($categories as $parentName => $children) {
            $parent = Category::create(['name' => $parentName]);

            foreach ($children as $childName) {
                Category::create(['name' => $childName, 'parent_id' => $parent->id]);
            }
        }
    }
}
