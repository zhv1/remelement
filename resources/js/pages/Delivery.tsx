import { Head } from '@inertiajs/react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const companies = [
  { name: 'СДЭК', note: 'До пункта выдачи в вашем городе — пункт можно выбрать при оформлении заказа' },
  { name: 'Энергия', note: 'До терминала в вашем городе — удобно для крупногабаритных деталей' },
];

const steps = [
  { num: '01', title: 'Оформляете заказ', text: 'На сайте или по телефону — менеджер подтвердит наличие и стоимость доставки.' },
  { num: '02', title: 'Мы комплектуем и упаковываем', text: 'Деталь проверяется, надёжно упаковывается и маркируется. Отправка — в день оплаты или на следующий день.' },
  { num: '03', title: 'Передаём в транспортную компанию', text: 'Отправляем вам трек-номер для отслеживания груза.' },
  { name: '04', title: 'Получаете заказ', text: 'В пункте выдачи вашего города или с доставкой до двери.' },
];

export default function Delivery() {
  return (
    <>
      <Head title="Доставка и оплата — Ремэлемент" />
      <SiteHeader />

      {/* Hero */}
      <section className="relative bg-brand-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark to-accent/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-4">
            Доставка и оплата
          </p>
          <h1 className="font-display text-4xl lg:text-6xl font-bold uppercase leading-tight max-w-3xl">
            Доставим в любую точку России и СНГ
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl">
            Работаем с проверенными транспортными компаниями. Кузовные детали —
            груз непростой, поэтому мы уделяем упаковке особое внимание.
          </p>
        </div>
      </section>

      {/* Способы получения */}
      <section className="bg-brand-light py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🏪</div>
              <h2 className="font-display text-2xl font-bold uppercase mb-4">Самовывоз</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Заберите заказ самостоятельно с нашего склада в Новосибирске —
                быстро, бесплатно и с возможностью осмотреть деталь на месте.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="text-accent font-bold">📍</span>
                  <span>г. Новосибирск, ул. Софийская, 12/2</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold">🕘</span>
                  <span>Ежедневно с 9:00 до 17:00</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold">💳</span>
                  <span>Оплата при получении: наличные или карта</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🚚</div>
              <h2 className="font-display text-2xl font-bold uppercase mb-4">
                Транспортной компанией
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Отправляем заказы по всей России и в страны СНГ транспортными
                компаниями СДЭК и Энергия. Доставка заказа до терминала ТК
                в Новосибирске — 300 ₽, тариф ТК оплачивается при получении.
              </p>
              <ul className="space-y-3">
                {companies.map((c) => (
                  <li key={c.name} className="border-b border-gray-100 pb-3 text-sm">
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-gray-500">{c.note}</p>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 mt-4">
                Для отправки понадобятся ФИО получателя полностью и город —
                груз выдают по паспорту.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Как это работает */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl lg:text-4xl font-bold uppercase text-center mb-12">
            Как проходит доставка
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="relative bg-brand-light rounded-2xl p-6 pt-10">
                <div className="absolute -top-5 left-6 w-10 h-10 bg-accent text-white font-display font-bold rounded-xl flex items-center justify-center">
                  {s.num}
                </div>
                <h3 className="font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Оплата */}
      <section className="bg-brand-dark text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold uppercase mb-10 text-center">
            Способы оплаты
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="text-3xl mb-3">💵</div>
              <h3 className="font-bold mb-2">Наличными или картой</h3>
              <p className="text-sm text-gray-300">При самовывозе со склада в Новосибирске.</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="text-3xl mb-3">🏦</div>
              <h3 className="font-bold mb-2">Перевод на карту</h3>
              <p className="text-sm text-gray-300">Для заказов с доставкой — реквизиты вышлет менеджер после подтверждения.</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="text-3xl mb-3">🧾</div>
              <h3 className="font-bold mb-2">Безнал для юрлиц</h3>
              <p className="text-sm text-gray-300">Работаем с организациями по счёту, предоставляем закрывающие документы.</p>
            </div>
          </div>
          <p className="text-center text-gray-400 text-sm mt-10">
            Остались вопросы по доставке? Звоните:{' '}
            <a href="tel:+79513860392" className="text-accent hover:underline font-semibold">
              +7 951 386-03-92
            </a>
          </p>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
