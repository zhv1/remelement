<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id', 'number', 'customer_name', 'customer_lastname', 'customer_middlename',
        'customer_phone', 'customer_email',
        'customer_comment', 'delivery_type', 'delivery_address',
        'delivery_company', 'delivery_city', 'delivery_point', 'delivery_cost',
        'total', 'status', 'email_sent',
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'delivery_cost' => 'decimal:2',
        'email_sent' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public static function generateNumber(): string
    {
        $lastOrder = static::orderBy('id', 'desc')->first();
        $nextId = $lastOrder ? $lastOrder->id + 1 : 1;
        return 'ORD-' . str_pad($nextId, 5, '0', STR_PAD_LEFT);
    }
}