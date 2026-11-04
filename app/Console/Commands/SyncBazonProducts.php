<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Models\Carsrc;
use App\Services\BazonService;
use Illuminate\Console\Command;

class SyncBazonProducts extends Command
{
    protected $signature = 'bazon:sync-products';
    protected $description = 'Синхронизация товаров из Bazon';

    public function handle(BazonService $bazon)
    {
        $this->info('Синхронизация автомобилей-доноров...');
        $this->syncCarsrcs($bazon);

        $this->info('Синхронизация товаров...');
        $offset = 0;
        $limit = 500;
        $total = 0;

        do {
            $data = $bazon->getProductsWithChars($offset, $limit);
            $products = $data['products_with_chars'] ?? [];
            $found = $data['found'] ?? 0;

            foreach ($products as $productData) {
                $this->saveProduct($productData);
                $total++;
            }

            $offset += $limit;
            $this->info("Обработано: {$offset} из {$found}");
        } while ($offset < $found);

        // Сбрасываем кеши, которые зависят от состава товаров
        \Illuminate\Support\Facades\Cache::forget('catalog_categories');
        \Illuminate\Support\Facades\Cache::forget('catalog_partnames_v3');
        \Illuminate\Support\Facades\Cache::forget('home_stats');

        $this->info("Готово. Всего товаров: {$total}");
    }

    protected function syncCarsrcs(BazonService $bazon): void
    {
        $offset = 0;
        $limit = 500;

        do {
            $data = $bazon->getCarsrcs($offset, $limit);
            $carsrcs = $data['carsrcs'] ?? [];
            $found = $data['found'] ?? 0;

            foreach ($carsrcs as $carData) {
                Carsrc::updateOrCreate(
                    ['bazon_id' => $carData['id']],
                    [
                        'number' => $carData['number'] ?? null,
                        'mark' => $carData['mark'] ?? null,
                        'model' => $carData['model'] ?? null,
                        'body' => $carData['body'] ?? null,
                        'motor' => $carData['motor'] ?? null,
                        'year' => $carData['year'] ?? null,
                        'vin' => $carData['vin'] ?? null,
                        'color' => $carData['color'] ?? null,
                    ]
                );
            }

            $offset += $limit;
        } while ($offset < $found);
    }

    protected function saveProduct(array $data): void
    {
        // Определяем категорию по типу товара
        $categorySlug = match ($data['type']) {
            'part' => 'zapchasti',
            'tire' => 'shiny',
            'disk' => 'diski',
            'wheel' => 'kolesa',
            'service' => 'uslugi',
            default => 'prochee',
        };

        $productData = [
            'bazon_id' => $data['id'],
            'name' => $data['name'],
            'type' => $data['type'],
            'price' => $data['price'] ?? 0,
            'amount' => $data['amount'] ?? 0,
            'reserved' => $data['reserved'] ?? 0,
            'pictures_urls' => $data['pictures_urls'] ?? [],
            'carsrc_id' => $data['carsrc_id'] ?? null,
            'category_slug' => $categorySlug,
            // Денормализованные колонки для быстрой фильтрации и поиска
            'partname_name' => $data['partname_name'] ?? null,
            'mfrnumber' => $data['mfrnumber'] ?? null,
            'manufacturer' => $data['manufacturer'] ?? null,
            'left_right_rus' => $data['left_right_rus'] ?? null,
            'front_back_rus' => $data['front_back_rus'] ?? null,
        ];

        $characteristics = [];

        if ($data['type'] === 'part') {
            $characteristics = [
                'manufacturer' => $data['manufacturer'] ?? null,
                'mfrnumber' => $data['mfrnumber'] ?? null,
                'crossnumbers' => $data['crossnumbers'] ?? [],
                'partname_name' => $data['partname_name'] ?? null,
                'comment' => $data['comment'] ?? null,
                'color' => $data['color'] ?? null,
                'marking' => $data['marking'] ?? null,
                'left_right_rus' => $data['left_right_rus'] ?? null,
                'front_back_rus' => $data['front_back_rus'] ?? null,
            ];
        } elseif ($data['type'] === 'tire') {
            $characteristics = [
                'tire_model' => $data['tire_model'] ?? null,
                'tire_producer' => $data['tire_producer'] ?? null,
                'tire_season_rus' => $data['tire_season_rus'] ?? null,
                'tire_width' => $data['tire_width'] ?? null,
                'tire_height' => $data['tire_height'] ?? null,
                'tire_load_coef' => $data['tire_load_coef'] ?? null,
                'tire_speed_index' => $data['tire_speed_index'] ?? null,
                'comment' => $data['comment'] ?? null,
            ];
        } elseif ($data['type'] === 'disk') {
            $characteristics = [
                'disk_model' => $data['disk_model'] ?? null,
                'disk_dia' => $data['disk_dia'] ?? null,
                'disk_et' => $data['disk_et'] ?? null,
                'disk_pcd' => $data['disk_pcd'] ?? null,
                'disk_width' => $data['disk_width'] ?? null,
                'disk_producer' => $data['disk_producer'] ?? null,
                'comment' => $data['comment'] ?? null,
            ];
        } elseif ($data['type'] === 'wheel') {
            $characteristics = [
                'disk_model' => $data['disk_model'] ?? null,
                'disk_dia' => $data['disk_dia'] ?? null,
                'disk_et' => $data['disk_et'] ?? null,
                'disk_pcd' => $data['disk_pcd'] ?? null,
                'tire_model' => $data['tire_model'] ?? null,
                'tire_producer' => $data['tire_producer'] ?? null,
                'tire_season_rus' => $data['tire_season_rus'] ?? null,
                'comment' => $data['comment'] ?? null,
            ];
        } elseif ($data['type'] === 'service') {
            $characteristics = [
                'comment' => $data['comment'] ?? null,
            ];
        }

        $productData['characteristics'] = $characteristics;

        Product::updateOrCreate(
            ['bazon_id' => $productData['bazon_id']],
            $productData
        );
    }
}