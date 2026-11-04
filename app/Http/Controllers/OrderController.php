<?php

namespace App\Http\Controllers;

use App\Mail\NewOrderMail;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render('Checkout/Index');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name'    => 'required|string|max:255',
            'customer_phone'   => 'required|string|max:50',
            'customer_email'   => 'nullable|email|max:255',
            'customer_comment' => 'nullable|string|max:2000',
            'delivery_type'    => 'required|in:pickup,delivery',
            'delivery_address' => 'required_if:delivery_type,delivery|nullable|string|max:500',
            'items'            => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1|max:999',
        ]);

        DB::beginTransaction();

        try {
            // Проверяем остатки и атомарно резервируем товары под заказ.
            // lockForUpdate защищает от гонки при параллельных заказах.
            $lockedProducts = [];
            foreach ($validated['items'] as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                $available = (float) $product->amount - (float) $product->reserved;
                if ($available < $item['quantity']) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'errors'  => [
                            'items' => ["Недостаточно товара «{$product->name}» на складе: доступно {$available} шт."],
                        ],
                    ], 422);
                }

                $product->increment('reserved', $item['quantity']);
                $lockedProducts[] = [$product, $item['quantity']];
            }

            $order = Order::create([
                'user_id'          => $request->user()?->id,
                'number'           => Order::generateNumber(),
                'customer_name'    => $validated['customer_name'],
                'customer_phone'   => $validated['customer_phone'],
                'customer_email'   => $validated['customer_email'] ?? null,
                'customer_comment' => $validated['customer_comment'] ?? null,
                'delivery_type'    => $validated['delivery_type'],
                'delivery_address' => $validated['delivery_address'] ?? null,
                'status'           => 'new',
                'total'            => 0,
            ]);

            $total = 0;
            foreach ($lockedProducts as [$product, $quantity]) {
                $subtotal = $product->price * $quantity;
                $total += $subtotal;

                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $product->id,
                    'bazon_id'   => $product->bazon_id,
                    'name'       => $product->name,
                    'price'      => $product->price,
                    'quantity'   => $quantity,
                    'subtotal'   => $subtotal,
                ]);
            }

            $order->update(['total' => $total]);

            try {
                Mail::send(new NewOrderMail($order->fresh('items')));
                $order->update(['email_sent' => true]);
            } catch (\Exception $e) {
                \Log::error('Не удалось отправить письмо: ' . $e->getMessage());
            }

            DB::commit();

            // Запоминаем заказ в сессии: страницу успеха увидит только оформивший
            $request->session()->put('last_order_id', $order->id);

            return response()->json([
                'success' => true,
                'order_number' => $order->number,
                'order_id' => $order->id,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Ошибка создания заказа: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Не удалось создать заказ.',
            ], 500);
        }
    }

    public function success(Request $request)
    {
        $orderId = (int) $request->query('order_id');

        // Защита от перебора чужих заказов (IDOR):
        // заказ виден только в сессии, где он был оформлен,
        // либо авторизованному владельцу заказа
        $ownsBySession = $orderId && (int) $request->session()->get('last_order_id') === $orderId;

        if (!$ownsBySession) {
            $order = Order::find($orderId);
            abort_unless(
                $order && $request->user() && $order->user_id === $request->user()->id,
                403
            );
        }

        $order = Order::with('items')->findOrFail($orderId);

        return Inertia::render('Checkout/Success', [
            'order' => $order,
        ]);
    }

    /**
     * История заказов авторизованного пользователя (личный кабинет).
     */
    public function history(Request $request)
    {
        $orders = $request->user()
            ->orders()
            ->with('items')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }
}