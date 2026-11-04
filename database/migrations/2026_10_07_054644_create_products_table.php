<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->integer('bazon_id')->unique();
            $table->string('name');
            $table->string('type');
            $table->decimal('price', 10, 2)->default(0);
            $table->decimal('amount', 10, 2)->default(0);
            $table->decimal('reserved', 10, 2)->default(0);
            $table->json('characteristics')->nullable();
            $table->json('pictures_urls')->nullable();
            $table->integer('carsrc_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};