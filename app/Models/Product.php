<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'bazon_id', 'name', 'type', 'price', 'amount', 'reserved',
        'characteristics', 'pictures_urls', 'carsrc_id', 'category_slug',
        'partname_name', 'mfrnumber', 'manufacturer',
        'left_right_rus', 'front_back_rus',
    ];

    protected $casts = [
        'characteristics' => 'array',
        'pictures_urls' => 'array',
    ];

    protected static function booted(): void
    {
        // Поддерживаем поисковый индекс при любом сохранении (синк, админка, тесты)
        static::saving(function (Product $product) {
            $product->search_index = self::buildSearchIndex(
                $product->name,
                $product->partname_name,
                $product->mfrnumber,
                $product->manufacturer,
            );
        });
    }

    /**
     * Нижний регистр всех поисковых полей (ё→е) — обходит ограничение SQLite LIKE
     * (case-insensitive только для латиницы) и упрощает запрос до одной колонки.
     */
    public static function buildSearchIndex(?string ...$fields): string
    {
        return \App\Support\RuStemmer::normalize(implode(' ', array_filter($fields)));
    }

    public function carsrc()
    {
        return $this->belongsTo(Carsrc::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_slug', 'slug');
    }
}