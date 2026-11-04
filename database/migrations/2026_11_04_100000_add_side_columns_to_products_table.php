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
            $table->string('left_right_rus')->nullable()->after('manufacturer');
            $table->string('front_back_rus')->nullable()->after('left_right_rus');
        });

        // Бэкфилл из JSON-колонки characteristics
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
                        'left_right_rus' => $chars['left_right_rus'] ?? null,
                        'front_back_rus' => $chars['front_back_rus'] ?? null,
                    ]);
                }
            });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['left_right_rus', 'front_back_rus']);
        });
    }
};
