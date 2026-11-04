<?php

use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->text('search_index')->nullable()->after('manufacturer');
        });

        // Бэкфилл: SQLite LIKE не складывает регистр кириллицы,
        // поэтому храним заранее приведённый к нижнему регистру индекс.
        Product::withoutEvents(function () {
            Product::query()
                ->select('id', 'name', 'partname_name', 'mfrnumber', 'manufacturer')
                ->chunkById(500, function ($products) {
                    foreach ($products as $product) {
                        DB::table('products')
                            ->where('id', $product->id)
                            ->update([
                                'search_index' => Product::buildSearchIndex(
                                    $product->name,
                                    $product->partname_name,
                                    $product->mfrnumber,
                                    $product->manufacturer,
                                ),
                            ]);
                    }
                });
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('search_index');
        });
    }
};
