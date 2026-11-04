import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const ADDRESS = 'г. Новосибирск, ул. Софийская, 12/2';
const PHONE = '+7 951 386-03-92';
const PHONE_HREF = 'tel:+79513860392';

// Виджет 2ГИС (makemap) — точка склада: Софийская, 12/2
const gis2Embed =
  'https://makemap.2gis.ru/widget?data=eJyFklFvmzAUhf-L9xjUXgwGg7SHzdGybCgL3aaKVXlg4FKvBCPjdEui_PdeSKCqNmlICPyd6-vjYx-JNqU0slxIvZXWKNmR-O5I7L6VJCYfZG53RhKHtEa30thBP5JSdoVRrVW6wSqUO2v0oxS61gbBG8o8_jOc-K0q7QOJ6Tj-0uaFsnsSuw45LJtS_sHfk0Oqs4l9v8TFQaIa-RV9NRV2KzS6VU1uB5d3nF5FIdDQc5h_xZnrbZyBBRGH8MICl07U90fq-y_Ui_yRcr7ZoA1Vop2I8ZPz3yCKccdAuXtPUbfK1v0M-DxPbSk4ZF66i4QLyaEfR5At32LZ6wTXH9_N4NP1TbUSM0h-pTYSe0jC1K4W7yFL0s6K2XIlAsjWvYY1SfpULhLIvleQfMPGCwHJ_LLQI7IK3_u0W4lryPrvuc9u_vupmPu9gSl3GJ9_H8Baq8b-lf05OuqzKeYpODcITxuHbPN2rTt13uCR1Lkl8VBLKY08nMIYdwOH1L0-nCQ68YAxFlKGN-Wg9Ra7BdgWk9J1ffsgZf1joNbs5OkZ0KTRgg';

// Виджет конструктора Яндекс Карт — та же точка склада
const yandexConstructorSrc =
  'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A113eb14323ab967176c714032096a33869dad51d23c232d593da4e5f6f7ec3b8&width=100%25&height=450&lang=ru_RU&scroll=true&id=yandex-map';

type MapProvider = '2gis' | 'yandex';

const providers: { id: MapProvider; label: string }[] = [
  { id: '2gis', label: '2ГИС' },
  { id: 'yandex', label: 'Яндекс Карты' },
];

export default function Contacts() {
  const [provider, setProvider] = useState<MapProvider>('2gis');
  const yandexLoaded = useRef(false);

  // Конструктор Яндекс Карт грузим лениво — при первом переключении на вкладку.
  // Важно: контейнер #yandex-map к этому моменту уже виден (эффект после рендера).
  useEffect(() => {
    if (provider !== 'yandex' || yandexLoaded.current) return;
    yandexLoaded.current = true;

    const script = document.createElement('script');
    script.src = yandexConstructorSrc;
    script.async = true;
    document.body.appendChild(script);
  }, [provider]);

  return (
    <>
      <Head title="Контакты — Ремэлемент" />
      <SiteHeader />

      {/* Hero */}
      <section className="relative bg-brand-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark to-accent/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-4">
            Контакты
          </p>
          <h1 className="font-display text-4xl lg:text-6xl font-bold uppercase leading-tight">
            Мы всегда на связи
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl">
            Подберём деталь, рассчитаем доставку и ответим на любые вопросы
            по кузовному ремонту.
          </p>
        </div>
      </section>

      {/* Карточки контактов */}
      <section className="bg-brand-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              href={PHONE_HREF}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all block"
            >
              <div className="text-3xl mb-3">📞</div>
              <h3 className="font-bold mb-1">Телефон</h3>
              <p className="text-accent font-semibold">{PHONE}</p>
              <p className="text-xs text-gray-500 mt-1">Звоните — подберём деталь</p>
            </a>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-bold mb-1">Адрес</h3>
              <p className="text-gray-700">{ADDRESS}</p>
              <p className="text-xs text-gray-500 mt-1">Склад и пункт самовывоза</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-3xl mb-3">🕘</div>
              <h3 className="font-bold mb-1">Режим работы</h3>
              <p className="text-gray-700">Ежедневно</p>
              <p className="text-gray-700">с 9:00 до 17:00</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-3xl mb-3">🏢</div>
              <h3 className="font-bold mb-1">Реквизиты</h3>
              <p className="text-gray-700">ООО «Ремэлемент»</p>
              <p className="text-gray-700">ИНН: 5473025681</p>
            </div>
          </div>
        </div>
      </section>

      {/* Карта */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h2 className="font-display text-3xl font-bold uppercase">Мы на карте</h2>
            {/* Переключатель карт */}
            <div
              role="tablist"
              aria-label="Выбор карты"
              className="inline-flex rounded-lg bg-gray-100 p-1"
            >
              {providers.map((p) => (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={provider === p.id}
                  onClick={() => setProvider(p.id)}
                  className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors ${
                    provider === p.id
                      ? 'bg-brand-dark text-white shadow-sm'
                      : 'text-gray-600 hover:text-brand-dark'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            {/* Обе карты остаются смонтированными — переключаем видимость,
                чтобы Яндекс-конструктор не терял карту при повторном открытии */}
            <div className={provider === '2gis' ? 'block' : 'hidden'}>
              <iframe
                src={gis2Embed}
                width="100%"
                height="450"
                loading="lazy"
                title="Ремэлемент на карте 2ГИС"
                className="block w-full border-0"
                sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
              />
            </div>
            <div className={provider === 'yandex' ? 'block' : 'hidden'}>
              <div
                id="yandex-map"
                role="img"
                aria-label="Ремэлемент на Яндекс Картах"
                style={{ width: '100%', height: 450 }}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-6">
            <a
              href="https://yandex.ru/maps/65/novosibirsk/house/sofiyskaya_ulitsa_12_2/bEsYfwFpSkwAQFtufXR0cHlrbA==/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-dark hover:bg-accent text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Открыть в Яндекс Картах
            </a>
            <a
              href="https://2gis.ru/novosibirsk/geo/141373143559269"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Открыть в 2ГИС
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-brand-dark to-accent/80 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl lg:text-3xl font-bold uppercase mb-3">
            Не нашли нужную деталь?
          </h2>
          <p className="text-gray-200 mb-6">
            Позвоните — подберём из наличия или изготовим на заказ.
          </p>
          <a
            href={PHONE_HREF}
            className="inline-block bg-white text-brand-dark font-semibold uppercase tracking-wide px-10 py-4 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {PHONE}
          </a>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
