import { Head } from '@inertiajs/react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

interface Order {
  id: number;
  number: string;
  customer_name: string;
  total: string | number;
}

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

  return (
    <>
      <Head title="Заказ оформлен — Ремэлемент" />
      <SiteHeader />
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Заказ {order.number} оформлен!</h1>
        <p className="text-lg text-gray-600 mb-8">Спасибо, {order.customer_name}! Мы свяжемся с вами в ближайшее время.</p>
        <div className="bg-brand-light p-6 rounded-lg mb-8 inline-block">
          <p className="text-sm text-gray-600">Сумма заказа</p>
          <p className="text-3xl font-bold text-accent">{Number(order.total).toLocaleString('ru-RU')} ₽</p>
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