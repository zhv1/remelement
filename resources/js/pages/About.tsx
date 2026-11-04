import { Head, Link } from '@inertiajs/react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const advantages = [
  {
    icon: '📐',
    title: 'Точная геометрия',
    text: 'Используем лицензированные лекала — пороги и арки повторяют оригинальный контур кузова и встают без доработок.',
  },
  {
    icon: '⚙️',
    title: 'Качественная сталь',
    text: 'Работаем только с сертифицированным металлом — детали получаются жёсткими и служат заметно дольше дешёвых аналогов.',
  },
  {
    icon: '🏭',
    title: 'Собственное производство',
    text: 'Современное оборудование и полный цикл изготовления в Новосибирске — от листа металла до готовой детали.',
  },
  {
    icon: '🚚',
    title: 'Доставка по России и СНГ',
    text: 'Отправляем заказы проверенными транспортными компаниями в любой регион — от Калининграда до Владивостока.',
  },
];

const stats = [
  { value: '10+', label: 'лет на рынке' },
  { value: '2 000+', label: 'наименований деталей' },
  { value: '50 000+', label: 'довольных клиентов' },
  { value: '100%', label: 'контроль качества' },
];

export default function About() {
  return (
    <>
      <Head title="О компании — Ремэлемент" />
      <SiteHeader />

      {/* Hero */}
      <section className="relative bg-brand-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark to-accent/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-4">
            О компании
          </p>
          <h1 className="font-display text-4xl lg:text-6xl font-bold uppercase leading-tight max-w-3xl">
            Кузовные детали, которым доверяют
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl">
            «Ремэлемент» — новосибирский производитель автомобильных порогов, арок
            и ремонтных элементов кузова. Мы знаем о кузовном ремонте всё
            и делаем детали, которые не нужно «допиливать» на месте.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/catalog"
              className="bg-accent hover:bg-accent-hover text-white font-semibold uppercase tracking-wide px-8 py-4 rounded-lg transition-colors"
            >
              Перейти в каталог
            </Link>
            <Link
              href="/contacts"
              className="border-2 border-white/30 hover:border-accent hover:text-accent text-white font-semibold uppercase tracking-wide px-8 py-4 rounded-lg transition-colors"
            >
              Связаться с нами
            </Link>
          </div>
        </div>
      </section>

      {/* Цифры */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-4xl lg:text-5xl font-bold text-accent">
                  {s.value}
                </div>
                <div className="mt-2 text-sm text-gray-500 uppercase tracking-wide">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* О нас */}
      <section className="bg-brand-light py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold uppercase mb-6">
                Кто мы
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Мы начинали как небольшой цех кузовного ремонта и хорошо знаем
                  проблему мастеров: ремонтные элементы с рынка часто приходится
                  подгонять молотком и болгаркой. Поэтому решили делать детали сами —
                  такие, которые встают на место с первого раза.
                </p>
                <p>
                  Сегодня «Ремэлемент» — это собственное производство полного цикла:
                  пороги, арки, ремонтные вставки и другие элементы кузова для
                  большинства популярных марок — от Lada до Lexus. Каждая деталь
                  выгибается по оригинальному лекалу и проходит контроль геометрии.
                </p>
                <p>
                  Кроме серийной продукции изготавливаем детали на заказ — по вашим
                  размерам или образцу. А на витрине магазина вы найдёте тысячи
                  б/у запчастей с авторазборки в отличном состоянии.
                </p>
              </div>
            </div>
            <div className="bg-brand-dark rounded-2xl p-8 lg:p-10 text-white shadow-xl">
              <h3 className="font-display text-2xl font-bold uppercase mb-6 text-accent">
                Гарантия качества
              </h3>
              <ul className="space-y-4">
                {[
                  'Только высококачественная сталь с сертификатами',
                  'Контроль геометрии каждой партии по лекалам',
                  'Честные фото и описание состояния б/у деталей',
                  'Возврат и обмен при несоответствии описанию',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-accent text-xl leading-none">✓</span>
                    <span className="text-gray-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl lg:text-4xl font-bold uppercase text-center mb-4">
            Наши преимущества
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            Почему автосервисы и частные мастера выбирают нас
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((a) => (
              <div
                key={a.title}
                className="bg-brand-light rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="text-4xl mb-4">{a.icon}</div>
                <h3 className="font-display text-lg font-bold uppercase mb-2">
                  {a.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-brand-dark to-accent/80 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-bold uppercase mb-4">
            Нужна деталь, которой нет в каталоге?
          </h2>
          <p className="text-gray-200 mb-8">
            Изготовим по вашим размерам или образцу. Сроки и цена обсуждаются индивидуально.
          </p>
          <a
            href="tel:+79513860392"
            className="inline-block bg-white text-brand-dark font-semibold uppercase tracking-wide px-10 py-4 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Позвонить: +7 951 386-03-92
          </a>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
