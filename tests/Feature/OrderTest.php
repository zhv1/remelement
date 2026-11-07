<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\User;

function makeProduct(array $attrs = []): Product
{
    static $bazonId = 1000;

    return Product::create(array_merge([
        'bazon_id' => $bazonId++,
        'name' => 'Тестовый товар',
        'type' => 'part',
        'price' => 1000,
        'amount' => 10,
        'reserved' => 0,
    ], $attrs));
}

function orderPayload(Product $product, int $quantity = 1, array $overrides = []): array
{
    return array_merge([
        'customer_name' => 'Иван Иванов',
        'customer_phone' => '+79990000000',
        'delivery_type' => 'pickup',
        'items' => [
            ['product_id' => $product->id, 'quantity' => $quantity],
        ],
    ], $overrides);
}

test('guest can place an order and total is calculated server-side', function () {
    $product = makeProduct(['price' => 1500]);

    $response = $this->postJson('/orders', orderPayload($product, 2));

    $response->assertOk()->assertJson(['success' => true]);

    $order = Order::first();
    expect($order)->not->toBeNull()
        ->and((float) $order->total)->toBe(3000.0)
        ->and($order->user_id)->toBeNull()
        ->and($order->items)->toHaveCount(1)
        ->and((float) $order->items->first()->subtotal)->toBe(3000.0);
});

test('order reserves stock atomically', function () {
    $product = makeProduct(['amount' => 5, 'reserved' => 1]);

    $this->postJson('/orders', orderPayload($product, 2))->assertOk();

    expect((float) $product->refresh()->reserved)->toBe(3.0);
});

test('order fails when requested quantity exceeds available stock', function () {
    $product = makeProduct(['amount' => 3, 'reserved' => 1]);

    $response = $this->postJson('/orders', orderPayload($product, 3));

    $response->assertStatus(422)
        ->assertJsonPath('success', false)
        ->assertJsonStructure(['errors' => ['items']]);

    expect(Order::count())->toBe(0)
        ->and((float) $product->refresh()->reserved)->toBe(1.0);
});

test('order validation rejects invalid payload', function () {
    $this->postJson('/orders', [])->assertStatus(422);

    $this->postJson('/orders', [
        'customer_name' => 'Иван',
        'customer_phone' => '+7 (999) 000-00-00',
        'delivery_type' => 'delivery', // без ТК, города и ФИО — ошибки
        'items' => [['product_id' => makeProduct()->id, 'quantity' => 1]],
    ])->assertJsonValidationErrors(['delivery_company', 'delivery_city', 'customer_lastname', 'customer_middlename']);
});

test('delivery order adds 300 rubles delivery fee and stores ФИО', function () {
    $product = makeProduct(['price' => 1500]);

    $response = $this->postJson('/orders', orderPayload($product, 2, [
        'delivery_type' => 'delivery',
        'delivery_company' => 'cdek',
        'delivery_city' => 'Красноярск',
        'delivery_point' => 'ПВЗ на ул. Мира (центр)',
        'customer_name' => 'Иван',
        'customer_lastname' => 'Иванов',
        'customer_middlename' => 'Иванович',
    ]));

    $response->assertOk()->assertJson(['success' => true]);

    $order = Order::first();
    expect((float) $order->delivery_cost)->toBe(300.0)
        ->and((float) $order->total)->toBe(3300.0) // 1500×2 + 300
        ->and($order->customer_name)->toBe('Иванов Иван Иванович')
        ->and($order->delivery_company)->toBe('cdek')
        ->and($order->delivery_city)->toBe('Красноярск')
        ->and($order->delivery_point)->toContain('Мира');
});

test('cdek delivery requires pickup point, energia does not', function () {
    $product = makeProduct();

    // СДЭК без пункта выдачи — ошибка
    $this->postJson('/orders', orderPayload($product, 1, [
        'delivery_type' => 'delivery',
        'delivery_company' => 'cdek',
        'delivery_city' => 'Омск',
        'customer_lastname' => 'Петров',
        'customer_middlename' => 'Петрович',
    ]))->assertJsonValidationErrors('delivery_point');

    // Энергия без пункта — ок (доставка до терминала города)
    $this->postJson('/orders', orderPayload($product, 1, [
        'delivery_type' => 'delivery',
        'delivery_company' => 'energia',
        'delivery_city' => 'Омск',
        'customer_lastname' => 'Петров',
        'customer_middlename' => 'Петрович',
    ]))->assertOk()->assertJson(['success' => true]);

    $order = Order::first();
    expect($order->delivery_company)->toBe('energia')
        ->and($order->delivery_point)->toBeNull();
});

test('pickup order has no delivery fee and no delivery fields', function () {
    $product = makeProduct(['price' => 1000]);

    $this->postJson('/orders', orderPayload($product))->assertOk();

    $order = Order::first();
    expect((float) $order->delivery_cost)->toBe(0.0)
        ->and((float) $order->total)->toBe(1000.0)
        ->and($order->delivery_company)->toBeNull()
        ->and($order->delivery_city)->toBeNull();
});

test('phone is normalized to mask format', function () {
    $product = makeProduct();

    $this->postJson('/orders', orderPayload($product, 1, [
        'customer_phone' => '8 999 1234567',
    ]))->assertOk();

    expect(Order::first()->customer_phone)->toBe('+7 (999) 123-45-67');

    // Неполный номер — ошибка
    $this->postJson('/orders', orderPayload($product, 1, [
        'customer_phone' => '8999',
    ]))->assertJsonValidationErrors('customer_phone');
});

test('order success page is not accessible to other visitors (IDOR)', function () {
    $product = makeProduct();

    $this->postJson('/orders', orderPayload($product))->assertOk();
    $order = Order::first();

    // Та же сессия — заказ виден
    $this->get("/checkout/success?order_id={$order->id}")->assertOk();

    // «Другой посетитель» (чистая сессия) — 403
    $this->flushSession();
    $this->get("/checkout/success?order_id={$order->id}")->assertForbidden();
});

test('order owner can view success page after re-login, others cannot', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $product = makeProduct();

    $this->actingAs($user)->postJson('/orders', orderPayload($product))->assertOk();
    $order = Order::first();

    expect($order->user_id)->toBe($user->id);

    // Владелец, новая сессия — доступ есть
    $this->flushSession();
    $this->actingAs($user)->get("/checkout/success?order_id={$order->id}")->assertOk();

    // Чужой пользователь — 403
    $this->actingAs($other)->get("/checkout/success?order_id={$order->id}")->assertForbidden();
});

test('order creation is rate limited', function () {
    $product = makeProduct(['amount' => 100]);

    for ($i = 0; $i < 5; $i++) {
        $this->postJson('/orders', orderPayload($product))->assertOk();
    }

    $this->postJson('/orders', orderPayload($product))->assertStatus(429);
});

test('order history shows only own orders', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $product = makeProduct();

    $this->actingAs($user)->postJson('/orders', orderPayload($product));
    $this->actingAs($other)->postJson('/orders', orderPayload($product));

    $response = $this->actingAs($user)->get('/my-orders');

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Orders/Index')
            ->has('orders.data', 1)
            ->where('orders.data.0.user_id', $user->id)
        );
});

test('guest is redirected from order history to login', function () {
    $this->get('/my-orders')->assertRedirect('/login');
});
