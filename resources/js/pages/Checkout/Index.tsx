import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import { useCart } from '@/contexts/CartContext';
import axios from 'axios';

export default function CheckoutIndex() {
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({
    customer_name: '', customer_phone: '', customer_email: '',
    customer_comment: '', delivery_type: 'pickup', delivery_address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const response = await axios.post('/orders', {
        ...form,
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
      });
      if (response.data.success) {
        clearCart();
        router.visit(`/checkout/success?order_id=${response.data.order_id}`);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        const apiErrors: Record<string, string> = {};
        Object.entries(err.response.data.errors || {}).forEach(([key, val]) => {
          apiErrors[key] = Array.isArray(val) ? String(val[0]) : String(val);
        });
        setErrors(apiErrors);
      } else if (axios.isAxiosError(err) && err.response?.status === 429) {
        setErrors({ items: 'Слишком много попыток. Подождите минуту и попробуйте снова.' });
      } else {
        alert('Не удалось оформить заказ.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Head title="Оформление заказа" />
        <SiteHeader />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Корзина пуста</h1>
          <a href="/catalog" className="text-accent hover:underline">Перейти в каталог</a>
        </div>
      </>
    );
  }

  return (
    <>
      <Head title="Оформление заказа — Ремэлемент" />
      <SiteHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-4xl font-bold uppercase mb-8">Оформление заказа</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="font-display text-xl font-bold uppercase mb-4">Контактные данные</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Имя *</label>
                  <input type="text" required value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="w-full border border-gray-300 rounded px-4 py-2 focus:border-accent" />
                  {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Телефон *</label>
                  <input type="tel" required value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} className="w-full border border-gray-300 rounded px-4 py-2 focus:border-accent" />
                  {errors.customer_phone && <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} className="w-full border border-gray-300 rounded px-4 py-2 focus:border-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Комментарий</label>
                  <textarea rows={3} value={form.customer_comment} onChange={(e) => setForm({ ...form, customer_comment: e.target.value })} className="w-full border border-gray-300 rounded px-4 py-2 focus:border-accent" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="font-display text-xl font-bold uppercase mb-4">Доставка</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="delivery_type" value="pickup" checked={form.delivery_type === 'pickup'} onChange={(e) => setForm({ ...form, delivery_type: e.target.value })} />
                  <span>Самовывоз (г. Новосибирск, ул. Софийская, 12/2)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="delivery_type" value="delivery" checked={form.delivery_type === 'delivery'} onChange={(e) => setForm({ ...form, delivery_type: e.target.value })} />
                  <span>Доставка транспортной компанией</span>
                </label>
                {form.delivery_type === 'delivery' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium mb-1">Адрес доставки *</label>
                    <input type="text" value={form.delivery_address} onChange={(e) => setForm({ ...form, delivery_address: e.target.value })} className="w-full border border-gray-300 rounded px-4 py-2 focus:border-accent" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              <h2 className="font-display text-xl font-bold uppercase mb-4">Ваш заказ</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product_id} className="flex justify-between text-sm border-b pb-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500">{item.quantity} × {item.price.toLocaleString('ru-RU')} ₽</p>
                    </div>
                    <span className="font-semibold">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-baseline border-t pt-4 mb-6">
                <span className="font-semibold">Итого:</span>
                <span className="text-2xl font-bold text-accent">{total.toLocaleString('ru-RU')} ₽</span>
              </div>
              {errors.items && <p className="text-red-500 text-sm mb-3">{errors.items}</p>}
              <button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent-hover disabled:bg-gray-400 text-white font-semibold uppercase tracking-wide py-4 rounded transition-colors">
                {loading ? 'Отправляем...' : 'Оформить заказ'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}