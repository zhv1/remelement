import { Head } from '@inertiajs/react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

interface OrderItem {
  id: number;
  name: string;
  price: string | number;
  quantity: number;
  subtotal: string | number;
}

interface Order {
  id: number;
  number: string;
  customer_name: string;
  total: string | number;
  delivery_type: 'pickup' | 'delivery';
  delivery_company: 'cdek' | 'energia' | null;
  delivery_city: string | null;
  delivery_point: string | null;
  delivery_cost: string | number;
  items?: OrderItem[];
}

const companyNames: Record<string, string> = {
  cdek: 'СДЭК',
  energia: 'Энергия',
};

export default function CheckoutSuccess({ order }: { order: Order | null }) {
  if (!order) {
    return (
      <>
        <Head title="Заказ не найден" />
        <SiteHeader />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Заказ не найден</h1>
          <a href="/catalog" className="text-accent hover:underline">Перейти в каталог</a>
        </div>
      </>
    );
  }

  const deliveryCost = Number(order.delivery_cost || 0);
  const fmt = (v: string | number) => Number(v).toLocaleString('ru-RU');

  return (
    <>
      <Head title="Заказ оформлен — Ремэлемент" />
      <SiteHeader />
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Заказ {order.number} оформлен!</h1>
        <p className="text-lg text-gray-600 mb-8">Спасибо, {order.customer_name}! Мы свяжемся с вами в ближайшее время.</p>

        {order.delivery_type === 'delivery' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 text-left">
            <h2 className="font-display text-lg font-bold uppercase mb-3">Доставка</h2>
            <p className="text-sm text-gray-700">
              Транспортная компания: <strong>{companyNames[order.delivery_company ?? ''] ?? order.delivery_company}</strong>
            </p>
            <p className="text-sm text-gray-700">Город: <strong>{order.delivery_city}</strong></p>
            {order.delivery_point && (
              <p className="text-sm text-gray-700">Пункт выдачи: <strong>{order.delivery_point}</strong></p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Тариф ТК оплачивается при получении. Трек-номер отправим после отгрузки.
            </p>
          </div>
        )}

        <div className="bg-brand-light p-6 rounded-lg mb-8 text-left max-w-md mx-auto">
          {order.items?.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-1">
              <span>{item.name} × {item.quantity}</span>
              <span className="font-medium">{fmt(item.subtotal)} ₽</span>
            </div>
          ))}
          {deliveryCost > 0 && (
            <div className="flex justify-between text-sm py-1 border-t mt-2 pt-2">
              <span>Доставка до ТК</span>
              <span className="font-medium">{fmt(deliveryCost)} ₽</span>
            </div>
          )}
          <div className="flex justify-between items-baseline border-t mt-2 pt-3">
            <span className="font-semibold">Итого:</span>
            <span className="text-2xl font-bold text-accent">{fmt(order.total)} ₽</span>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <a href="/catalog" className="bg-brand-dark hover:bg-accent text-white font-semibold uppercase px-6 py-3 rounded transition-colors">Продолжить покупки</a>
          <a href="/" className="border-2 border-brand-dark hover:bg-brand-dark hover:text-white font-semibold uppercase px-6 py-3 rounded transition-colors">На главную</a>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
