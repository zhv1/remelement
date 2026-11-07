import { Head, Link } from '@inertiajs/react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ProductCard from '@/components/ProductCard';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import type { Product } from '@/types/product';

const advantages = [
  {
    icon: '📐',
    title: 'Точная геометрия',
    text: 'Лицензированные лекала — детали повторяют оригинальный контур кузова и встают без подгонки.',
  },
  {
    icon: '⚙️',
    title: 'Качественная сталь',
    text: 'Жёсткость конструкции и увеличенный срок службы за счёт сертифицированного металла.',
  },
  {
    icon: '📦',
    title: 'Большой выбор',
    text: 'Тысячи запчастей в наличии на складе в Новосибирске — пороги, арки, оптика, б⁠/⁠у детали с разборки.',
  },
  {
    icon: '🚚',
    title: 'Доставка по РФ и СНГ',
    text: 'Отправляем проверенными транспортными компаниями в день оплаты или на следующий день.',
  },
];

type HomeStats = { products: number; brands: number };

export default function Home({
  featured = [],
  stats,
}: {
  featured?: Product[];
  stats?: HomeStats;
}) {
  return (
    <>
      <Head title="Ремэлемент — пороги, арки и автозапчасти в Новосибирске" />
      <SiteHeader withSearch={false} />

      {/* Hero */}
      <section className="relative bg-brand-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark to-accent/25" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 12px)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-4">
                Производство и авторазборка · Новосибирск
              </p>
              <h1 className="font-display text-4xl md:text-6xl font-bold uppercase leading-tight mb-6">
                Пороги, арки<br />
                и&nbsp;запчасти<br />
                <span className="text-accent">для любых авто</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                Собственное производство кузовных деталей и тысячи <span className="whitespace-nowrap">б/у</span> запчастей
                в наличии. Отгрузка в день заказа, доставка по всей России.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/catalog"
                  className="bg-accent hover:bg-accent-hover text-white font-semibold uppercase tracking-wide px-8 py-4 rounded-lg transition-colors"
                >
                  Смотреть каталог
                </Link>
                <a
                  href="tel:+79513860392"
                  className="border-2 border-white/40 hover:border-accent hover:text-accent text-white font-semibold uppercase tracking-wide px-8 py-4 rounded-lg transition-colors"
                >
                  +7 951 386-03-92
                </a>
              </div>
            </div>

            {/* Быстрый подбор + статистика */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 lg:p-8 shadow-2xl">
              <h2 className="font-display text-xl font-bold uppercase mb-1">
                Быстрый подбор детали
              </h2>
              <p className="text-sm text-gray-300 mb-5">
                По названию, артикулу или бренду
              </p>
              <div className="mb-6">
                <SearchAutocomplete />
              </div>
              {stats && (
                <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-5 text-center">
                  <div>
                    <div className="font-display text-2xl font-bold text-accent">
                      {stats.products.toLocaleString('ru-RU')}
                    </div>
                    <div className="text-xs text-gray-300 mt-1">товаров в наличии</div>
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold text-accent">
                      {stats.brands.toLocaleString('ru-RU')}
                    </div>
                    <div className="text-xs text-gray-300 mt-1">брендов</div>
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold text-accent">1 день</div>
                    <div className="text-xs text-gray-300 mt-1">отгрузка заказа</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="bg-brand-light py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl lg:text-4xl font-bold uppercase text-center mb-12">
            Почему выбирают нас
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((a) => (
              <div
                key={a.title}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="text-4xl mb-4">{a.icon}</div>
                <h3 className="font-display text-lg font-bold uppercase mb-2">{a.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Хиты каталога */}
      {featured.length > 0 && (
        <section className="bg-white py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-2">
                  В наличии на складе
                </p>
                <h2 className="font-display text-3xl lg:text-4xl font-bold uppercase">
                  Свежие поступления
                </h2>
              </div>
              <Link
                href="/catalog"
                className="hidden sm:inline-block text-accent font-semibold hover:underline whitespace-nowrap"
              >
                Весь каталог →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link href="/catalog" className="text-accent font-semibold hover:underline">
                Весь каталог →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Производство на заказ + доставка */}
      <section className="bg-brand-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8">
          <div className="bg-brand-dark text-white rounded-2xl p-8 lg:p-10">
            <h3 className="font-display text-2xl font-bold uppercase mb-4 text-accent">
              Изготовим на заказ
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              Нужна деталь, которой нет в каталоге? Изготовим порог, арку
              или ремонтный элемент по вашим размерам или образцу.
            </p>
            <Link
              href="/about"
              className="inline-block border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold uppercase tracking-wide px-6 py-3 rounded-lg transition-colors"
            >
              О производстве
            </Link>
          </div>
          <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm">
            <h3 className="font-display text-2xl font-bold uppercase mb-4">
              Доставка без хлопот
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Самовывоз со склада на Софийской, 12/2 или отправка транспортной
              компанией в любой город России и СНГ. Трек-номер — в день отгрузки.
            </p>
            <Link
              href="/delivery"
              className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold uppercase tracking-wide px-6 py-3 rounded-lg transition-colors"
            >
              Условия доставки
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
