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

    /** Стоимость доставки до терминала ТК в Новосибирске, ₽ */
    public const DELIVERY_COST = 300;

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name'    => 'required|string|max:255',
            'customer_lastname'   => 'required_if:delivery_type,delivery|nullable|string|max:255',
            'customer_middlename' => 'required_if:delivery_type,delivery|nullable|string|max:255',
            'customer_phone'   => ['required', 'string', 'max:25', function ($attr, $value, $fail) {
                $digits = preg_replace('/\D/', '', (string) $value);
                if (strlen($digits) !== 11 || ! in_array($digits[0], ['7', '8'], true)) {
                    $fail('Введите телефон полностью, например: +7 (999) 000-00-00');
                }
            }],
            'customer_email'   => 'nullable|email|max:255',
            'customer_comment' => 'nullable|string|max:2000',
            'delivery_type'    => 'required|in:pickup,delivery',
            'delivery_company' => 'required_if:delivery_type,delivery|nullable|in:cdek,energia',
            'delivery_city'    => 'required_if:delivery_type,delivery|nullable|string|max:255',
            'delivery_point'   => 'required_if:delivery_company,cdek|nullable|string|max:500',
            'delivery_address' => 'nullable|string|max:500',
            'items'            => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1|max:999',
        ], [
            'customer_lastname.required_if' => 'Укажите фамилию — требуется для отправки транспортной компанией.',
            'customer_middlename.required_if' => 'Укажите отчество — требуется для отправки транспортной компанией.',
            'delivery_company.required_if' => 'Выберите транспортную компанию.',
            'delivery_city.required_if' => 'Укажите город получения.',
            'delivery_point.required_if' => 'Выберите пункт выдачи СДЭК.',
        ]);

        // Нормализуем телефон к виду +7 (XXX) XXX-XX-XX
        $digits = preg_replace('/\D/', '', $validated['customer_phone']);
        if ($digits[0] === '8') {
            $digits = '7' . substr($digits, 1);
        }
        $phone = '+7 (' . substr($digits, 1, 3) . ') ' . substr($digits, 4, 3)
            . '-' . substr($digits, 7, 2) . '-' . substr($digits, 9, 2);

        $isDelivery = $validated['delivery_type'] === 'delivery';
        $deliveryCost = $isDelivery ? self::DELIVERY_COST : 0;

        // Для отправки ТК customer_name хранит полное ФИО
        $customerName = $isDelivery
            ? trim($validated['customer_lastname'] . ' ' . $validated['customer_name'] . ' ' . $validated['customer_middlename'])
            : $validated['customer_name'];

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
                'customer_name'    => $customerName,
                'customer_lastname'   => $isDelivery ? $validated['customer_lastname'] : null,
                'customer_middlename' => $isDelivery ? $validated['customer_middlename'] : null,
                'customer_phone'   => $phone,
                'customer_email'   => $validated['customer_email'] ?? null,
                'customer_comment' => $validated['customer_comment'] ?? null,
                'delivery_type'    => $validated['delivery_type'],
                'delivery_company' => $isDelivery ? $validated['delivery_company'] : null,
                'delivery_city'    => $isDelivery ? $validated['delivery_city'] : null,
                'delivery_point'   => ($isDelivery && ($validated['delivery_company'] ?? null) === 'cdek')
                    ? ($validated['delivery_point'] ?? null)
                    : null,
                'delivery_cost'    => $deliveryCost,
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

            $order->update(['total' => $total + $deliveryCost]);

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