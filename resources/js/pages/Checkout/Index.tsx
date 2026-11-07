import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import { useCart } from '@/contexts/CartContext';
import axios from 'axios';

const DELIVERY_COST = 300;

type DeliveryMethod = 'pickup' | 'cdek' | 'energia';

/** Маска телефона: +7 (999) 000-00-00 */
function formatPhone(value: string): string {
  let d = value.replace(/\D/g, '');
  if (d.startsWith('8')) d = '7' + d.slice(1);
  if (d && !d.startsWith('7')) d = '7' + d;
  d = d.slice(0, 11);

  let out = '';
  if (d.length > 0) out = '+7';
  if (d.length > 1) out += ' (' + d.slice(1, 4);
  if (d.length >= 4) out += ')';
  if (d.length > 4) out += ' ' + d.slice(4, 7);
  if (d.length > 7) out += '-' + d.slice(7, 9);
  if (d.length > 9) out += '-' + d.slice(9, 11);
  return out;
}

const inputCls = 'w-full border border-gray-300 rounded px-4 py-2 focus:border-accent focus:outline-none';

export default function CheckoutIndex() {
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({
    customer_name: '', customer_lastname: '', customer_middlename: '',
    customer_phone: '', customer_email: '', customer_comment: '',
    delivery_city: '', delivery_point: '',
  });
  const [method, setMethod] = useState<DeliveryMethod>('pickup');
  const [cdekCities, setCdekCities] = useState<string[]>([]);
  const [cdekPoints, setCdekPoints] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const isDelivery = method !== 'pickup';

  // Справочник городов СДЭК
  useEffect(() => {
    axios.get('/api/delivery/cdek-points').then((r) => setCdekCities(r.data.cities || [])).catch(() => {});
  }, []);

  // Пункты выдачи при выборе города (только СДЭК)
  useEffect(() => {
    if (method !== 'cdek' || !form.delivery_city.trim()) {
      setCdekPoints([]);
      return;
    }
    const t = setTimeout(() => {
      axios.get('/api/delivery/cdek-points', { params: { city: form.delivery_city.trim() } })
        .then((r) => setCdekPoints(r.data.points || []))
        .catch(() => setCdekPoints([]));
    }, 300);
    return () => clearTimeout(t);
  }, [method, form.delivery_city]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const response = await axios.post('/orders', {
        customer_name: form.customer_name,
        customer_lastname: isDelivery ? form.customer_lastname : null,
        customer_middlename: isDelivery ? form.customer_middlename : null,
        customer_phone: form.customer_phone,
        customer_email: form.customer_email || null,
        customer_comment: form.customer_comment || null,
        delivery_type: isDelivery ? 'delivery' : 'pickup',
        delivery_company: isDelivery ? method : null,
        delivery_city: isDelivery ? form.delivery_city : null,
        delivery_point: method === 'cdek' ? form.delivery_point : null,
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const grandTotal = total + (isDelivery ? DELIVERY_COST : 0);

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
                {isDelivery && (
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Фамилия *</label>
                      <input type="text" value={form.customer_lastname} onChange={set('customer_lastname')} className={inputCls} placeholder="Иванов" />
                      {errors.customer_lastname && <p className="text-red-500 text-sm mt-1">{errors.customer_lastname}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Имя *</label>
                      <input type="text" value={form.customer_name} onChange={set('customer_name')} className={inputCls} placeholder="Иван" />
                      {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Отчество *</label>
                      <input type="text" value={form.customer_middlename} onChange={set('customer_middlename')} className={inputCls} placeholder="Иванович" />
                      {errors.customer_middlename && <p className="text-red-500 text-sm mt-1">{errors.customer_middlename}</p>}
                    </div>
                  </div>
                )}
                {!isDelivery && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Имя *</label>
                    <input type="text" value={form.customer_name} onChange={set('customer_name')} className={inputCls} />
                    {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>}
                  </div>
                )}
                {isDelivery && (
                  <p className="text-xs text-gray-500">Полные ФИО нужны транспортной компании — груз выдают по паспорту.</p>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">Телефон *</label>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={form.customer_phone}
                    onChange={(e) => setForm({ ...form, customer_phone: formatPhone(e.target.value) })}
                    className={inputCls}
                    placeholder="+7 (999) 000-00-00"
                  />
                  {errors.customer_phone && <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={form.customer_email} onChange={set('customer_email')} className={inputCls} />
                  {errors.customer_email && <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Комментарий</label>
                  <textarea rows={3} value={form.customer_comment} onChange={set('customer_comment')} className={inputCls} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="font-display text-xl font-bold uppercase mb-4">Доставка</h2>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="radio" name="delivery_method" className="mt-1" checked={method === 'pickup'} onChange={() => setMethod('pickup')} />
                  <span>
                    <span className="font-medium">Самовывоз</span>
                    <span className="block text-sm text-gray-500">г. Новосибирск, ул. Софийская, 12/2 — бесплатно</span>
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="radio" name="delivery_method" className="mt-1" checked={method === 'cdek'} onChange={() => setMethod('cdek')} />
                  <span>
                    <span className="font-medium">СДЭК — до пункта выдачи</span>
                    <span className="block text-sm text-gray-500">Доставка до терминала ТК — {DELIVERY_COST} ₽, далее по тарифам СДЭК при получении</span>
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="radio" name="delivery_method" className="mt-1" checked={method === 'energia'} onChange={() => setMethod('energia')} />
                  <span>
                    <span className="font-medium">Энергия — до терминала</span>
                    <span className="block text-sm text-gray-500">Доставка до терминала ТК — {DELIVERY_COST} ₽, далее по тарифам ТК при получении</span>
                  </span>
                </label>
                {errors.delivery_company && <p className="text-red-500 text-sm">{errors.delivery_company}</p>}

                {isDelivery && (
                  <div className="mt-4 space-y-4 border-t pt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Город получения *</label>
                      <input
                        type="text"
                        value={form.delivery_city}
                        onChange={set('delivery_city')}
                        className={inputCls}
                        placeholder="Например: Красноярск"
                        list={method === 'cdek' ? 'cdek-cities' : undefined}
                      />
                      {method === 'cdek' && (
                        <datalist id="cdek-cities">
                          {cdekCities.map((c) => <option key={c} value={c} />)}
                        </datalist>
                      )}
                      {errors.delivery_city && <p className="text-red-500 text-sm mt-1">{errors.delivery_city}</p>}
                    </div>

                    {method === 'cdek' && form.delivery_city.trim() && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Пункт выдачи СДЭК *</label>
                        {cdekPoints.length > 0 ? (
                          <select value={form.delivery_point} onChange={set('delivery_point')} className={inputCls}>
                            <option value="">— Выберите пункт выдачи —</option>
                            {cdekPoints.map((p) => <option key={p} value={p}>{p}</option>)}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={form.delivery_point}
                            onChange={set('delivery_point')}
                            className={inputCls}
                            placeholder="Укажите удобный ПВЗ или район — менеджер уточнит"
                          />
                        )}
                        {errors.delivery_point && <p className="text-red-500 text-sm mt-1">{errors.delivery_point}</p>}
                      </div>
                    )}
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
                {isDelivery && (
                  <div className="flex justify-between text-sm border-b pb-2">
                    <div>
                      <p className="font-medium">Доставка до ТК ({method === 'cdek' ? 'СДЭК' : 'Энергия'})</p>
                      <p className="text-gray-500">до терминала в Новосибирске</p>
                    </div>
                    <span className="font-semibold">{DELIVERY_COST.toLocaleString('ru-RU')} ₽</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-baseline border-t pt-4 mb-6">
                <span className="font-semibold">Итого:</span>
                <span className="text-2xl font-bold text-accent">{grandTotal.toLocaleString('ru-RU')} ₽</span>
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
