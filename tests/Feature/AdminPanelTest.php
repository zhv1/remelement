<?php

use App\Models\Order;
use App\Models\User;

test('guest is redirected from admin panel to admin login', function () {
    $this->get('/admin')->assertRedirectContains('/admin/login');
});

test('user with admin email can access admin panel, others get 403', function () {
    $_ENV['ADMIN_EMAILS'] = $_SERVER['ADMIN_EMAILS'] = 'admin@example.com';

    $admin = User::factory()->create(['email' => 'admin@example.com']);
    $regular = User::factory()->create(['email' => 'user@example.com']);

    $this->actingAs($admin)->get('/admin/orders')->assertOk();
    $this->actingAs($regular)->get('/admin/orders')->assertForbidden();
});

test('order status can be changed via resource model', function () {
    $order = Order::create([
        'number' => 'ORD-TEST1',
        'customer_name' => 'Тест',
        'customer_phone' => '+79990000001',
        'delivery_type' => 'pickup',
        'status' => 'new',
        'total' => 0,
    ]);

    $order->update(['status' => 'ready']);

    expect($order->refresh()->status)->toBe('ready');
});
