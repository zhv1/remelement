<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['slug', 'name', 'parent_slug', 'sort_order'];

    public function products()
    {
        return $this->hasMany(Product::class, 'category_slug', 'slug');
    }
}