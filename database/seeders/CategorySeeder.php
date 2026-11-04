<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['slug' => 'zapchasti', 'name' => 'Запчасти', 'sort_order' => 1],
            ['slug' => 'shiny', 'name' => 'Шины', 'sort_order' => 2],
            ['slug' => 'diski', 'name' => 'Диски', 'sort_order' => 3],
            ['slug' => 'kolesa', 'name' => 'Колёса', 'sort_order' => 4],
            ['slug' => 'uslugi', 'name' => 'Услуги', 'sort_order' => 5],
            ['slug' => 'prochee', 'name' => 'Прочее', 'sort_order' => 6],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}