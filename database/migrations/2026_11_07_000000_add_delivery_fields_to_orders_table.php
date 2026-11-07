<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('customer_lastname')->nullable()->after('customer_name');
            $table->string('customer_middlename')->nullable()->after('customer_lastname');
            $table->string('delivery_company')->nullable()->after('delivery_type'); // cdek | energia
            $table->string('delivery_city')->nullable()->after('delivery_company');
            $table->string('delivery_point')->nullable()->after('delivery_city');
            $table->decimal('delivery_cost', 10, 2)->default(0)->after('delivery_point');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'customer_lastname', 'customer_middlename',
                'delivery_company', 'delivery_city', 'delivery_point', 'delivery_cost',
            ]);
        });
    }
};
