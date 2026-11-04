<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carsrc extends Model
{
    protected $fillable = [
        'bazon_id', 'number', 'mark', 'model', 'body',
        'motor', 'year', 'vin', 'color',
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}