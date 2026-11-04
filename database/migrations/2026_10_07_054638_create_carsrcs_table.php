<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carsrcs', function (Blueprint $table) {
            $table->id();
            $table->integer('bazon_id')->unique();
            $table->string('number')->nullable();
            $table->string('mark')->nullable();
            $table->string('model')->nullable();
            $table->string('body')->nullable();
            $table->string('motor')->nullable();
            $table->string('year')->nullable();
            $table->string('vin')->nullable();
            $table->string('color')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carsrcs');
    }
};