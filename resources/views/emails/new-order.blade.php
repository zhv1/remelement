<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Новый заказ</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333; max-width: 640px; margin: 0 auto; padding: 20px;">
    <div style="background: #1a1a1a; color: #fff; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Новый заказ {{ $order->number }}</h1>
    </div>

    <div style="background: #f5f5f5; padding: 20px; margin-top: 20px;">
        <h2 style="margin-top: 0;">Данные клиента</h2>
        <p><strong>Имя:</strong> {{ $order->customer_name }}</p>
        <p><strong>Телефон:</strong> {{ $order->customer_phone }}</p>
        @if($order->customer_email)
            <p><strong>Email:</strong> {{ $order->customer_email }}</p>
        @endif
        @if($order->customer_comment)
            <p><strong>Комментарий:</strong> {{ $order->customer_comment }}</p>
        @endif
        <p><strong>Доставка:</strong>
            @if($order->delivery_type === 'pickup')
                Самовывоз (Новосибирск, ул. Софийская, 12/2)
            @else
                ТК {{ $order->delivery_company === 'cdek' ? 'СДЭК' : 'Энергия' }},
                г. {{ $order->delivery_city }}
                @if($order->delivery_point)
                    — {{ $order->delivery_point }}
                @endif
                (+{{ number_format($order->delivery_cost, 0, '.', ' ') }} ₽ до терминала ТК)
            @endif
        </p>
    </div>

    <div style="margin-top: 20px;">
        <h2>Состав заказа</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: #1a1a1a; color: #fff;">
                    <th style="padding: 10px; text-align: left;">Товар</th>
                    <th style="padding: 10px; text-align: right;">Цена</th>
                    <th style="padding: 10px; text-align: center;">Кол-во</th>
                    <th style="padding: 10px; text-align: right;">Итого</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 10px;">{{ $item->name }}</td>
                        <td style="padding: 10px; text-align: right;">{{ number_format($item->price, 0, '.', ' ') }} ₽</td>
                        <td style="padding: 10px; text-align: center;">{{ $item->quantity }}</td>
                        <td style="padding: 10px; text-align: right;">{{ number_format($item->subtotal, 0, '.', ' ') }} ₽</td>
                    </tr>
                @endforeach
                @if($order->delivery_cost > 0)
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 10px;">Доставка до ТК</td>
                        <td style="padding: 10px; text-align: right;">{{ number_format($order->delivery_cost, 0, '.', ' ') }} ₽</td>
                        <td style="padding: 10px; text-align: center;">1</td>
                        <td style="padding: 10px; text-align: right;">{{ number_format($order->delivery_cost, 0, '.', ' ') }} ₽</td>
                    </tr>
                @endif
                <tr style="background: #f5f5f5; font-weight: bold;">
                    <td colspan="3" style="padding: 10px; text-align: right;">Итого:</td>
                    <td style="padding: 10px; text-align: right;">{{ number_format($order->total, 0, '.', ' ') }} ₽</td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>