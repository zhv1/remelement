<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('partname_name')->nullable()->index()->after('characteristics');
            $table->string('mfrnumber')->nullable()->index()->after('partname_name');
            $table->string('manufacturer')->nullable()->index()->after('mfrnumber');
        });

        // Бэкфилл из JSON-колонки characteristics (кириллица в JSON не ищется через LIKE,
        // поэтому выносим в обычные колонки с индексами)
        DB::table('products')
            ->whereNotNull('characteristics')
            ->orderBy('id')
            ->chunk(500, function ($products) {
                foreach ($products as $product) {
                    $chars = json_decode($product->characteristics, true);
                    if (!is_array($chars)) {
                        continue;
                    }

                    DB::table('products')->where('id', $product->id)->update([
                        'partname_name' => $chars['partname_name'] ?? null,
                        'mfrnumber'     => $chars['mfrnumber'] ?? null,
                        'manufacturer'  => $chars['manufacturer'] ?? null,
                    ]);
                }
            });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['partname_name']);
            $table->dropIndex(['mfrnumber']);
            $table->dropIndex(['manufacturer']);
            $table->dropColumn(['partname_name', 'mfrnumber', 'manufacturer']);
        });
    }
};
