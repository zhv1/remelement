import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SimilarProductCard from '@/components/SimilarProductCard';
import PositionBadge from '@/components/PositionBadge';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/types/product';

interface ProductDetail extends Product {
  reserved: number;
  carsrc?: {
    mark: string;
    model: string;
    year: string;
  };
}

interface Props {
  product: ProductDetail;
  similar: Product[];
}

export default function ProductShow({ product, similar }: Props) {
  const { items, addItem, removeItem } = useCart();

  const images = product.pictures_urls?.length > 0
    ? product.pictures_urls
    : ['/images/placeholder.png'];

  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const inStock = product.amount > 0;
  const inCart = items.some((item) => item.product_id === product.id);

  const handleToggleCart = () => {
    if (inCart) {
      removeItem(product.id);
    } else {
      addItem({
        product_id: product.id,
        bazon_id: product.bazon_id,
        name: product.name,
        price: product.price,
        image: images[0],
        stock: product.amount,
      });
    }
  };

  const nextImage = useCallback(() => {
    setActiveImage((i) => (i + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setActiveImage((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, nextImage, prevImage]);

  return (
    <>
      <Head title={`${product.name} — Ремэлемент`} />
      <SiteHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        {/* Кнопка "Назад" — только на мобильных */}
        <div className="lg:hidden mb-4">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад в каталог
          </Link>
        </div>

        {/* Хлебные крошки */}
        <nav className="hidden lg:block text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-accent">Главная</Link>
          <span className="mx-2">/</span>
          <Link href="/catalog" className="hover:text-accent">Каталог</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-dark">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ГАЛЕРЕЯ */}
          <div>
            <div
              className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 cursor-zoom-in relative group"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-contain"
              />

              <PositionBadge
                leftRight={product.characteristics?.left_right_rus}
                frontBack={product.characteristics?.front_back_rus}
                className="bottom-4 left-4 !text-sm"
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-brand-dark px-4 py-2 rounded font-medium transition-opacity">
                  🔍 Увеличить
                </span>
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 lg:grid-cols-5 gap-2 lg:gap-3">
                {images.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square bg-gray-100 rounded overflow-hidden border-2 ${
                      idx === activeImage ? 'border-accent' : 'border-transparent'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ИНФОРМАЦИЯ */}
          <div>
            <h1 className="font-display text-2xl lg:text-4xl font-bold mb-4">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl lg:text-4xl font-bold text-accent">
                {product.price.toLocaleString('ru-RU')} ₽
              </span>
            </div>

            {inStock ? (
              <div className="text-green-600 font-semibold mb-6">
                ✓ В наличии ({product.amount} шт.)
              </div>
            ) : (
              <div className="text-gray-500 font-semibold mb-6">Под заказ</div>
            )}

            {product.carsrc && (
              <div className="bg-brand-light p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">Донор:</p>
                <p className="font-semibold">
                  {product.carsrc.mark} {product.carsrc.model} ({product.carsrc.year})
                </p>
              </div>
            )}

            <button
              onClick={handleToggleCart}
              disabled={!inStock}
              className={`w-full font-semibold uppercase tracking-wide py-4 rounded transition-colors text-lg mb-6 ${
                !inStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : inCart
                  ? 'bg-green-600 hover:bg-red-600 text-white'
                  : 'bg-accent hover:bg-accent-hover text-white'
              }`}
            >
              {!inStock ? 'Под заказ' : inCart ? '✓ В корзине' : 'В корзину'}
            </button>

            {inCart && (
              <p className="text-xs text-gray-500 text-center -mt-4 mb-6">
                Нажмите ещё раз, чтобы убрать из корзины
              </p>
            )}

            {/* Описание — со сворачиванием */}
            {product.characteristics?.comment && (
              <DescriptionBlock text={product.characteristics.comment} />
            )}

            {/* Характеристики */}
            {product.characteristics && Object.keys(product.characteristics).length > 0 && (
              <div className="bg-brand-light p-4 lg:p-6 rounded-lg">
                <h3 className="font-display text-base lg:text-lg font-bold uppercase mb-4">
                  Характеристики
                </h3>
                <dl className="space-y-2">
                  {Object.entries(product.characteristics).map(([key, value]) => {
                    if (!value || (Array.isArray(value) && value.length === 0)) return null;
                    if (key === 'comment') return null;

                    const labels: Record<string, string> = {
                      manufacturer: 'Производитель',
                      mfrnumber: 'Артикул',
                      partname_name: 'Наименование',
                      crossnumbers: 'Кросс-номера',
                      color: 'Цвет',
                      marking: 'Маркировка',
                      left_right_rus: 'Сторона',
                      front_back_rus: 'Расположение',
                      tire_model: 'Модель',
                      tire_producer: 'Производитель',
                      tire_season_rus: 'Сезон',
                      tire_width: 'Ширина',
                      tire_height: 'Высота',
                      tire_load_coef: 'Индекс нагрузки',
                      tire_speed_index: 'Индекс скорости',
                      disk_model: 'Модель',
                      disk_dia: 'Диаметр',
                      disk_et: 'Вылет (ET)',
                      disk_pcd: 'PCD',
                      disk_width: 'Ширина',
                      disk_producer: 'Производитель',
                    };
                    return (
                      <div
                        key={key}
                        className="flex justify-between border-b border-gray-200 pb-2 text-sm lg:text-base"
                      >
                        <dt className="text-gray-600">{labels[key] || key}</dt>
                        <dd className="font-medium text-right max-w-[60%]">
                          {Array.isArray(value) ? value.join(', ') : value}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* ПОХОЖИЕ ТОВАРЫ */}
        {similar && similar.length > 0 && (
          <div className="mt-16 lg:mt-24">
            <h2 className="font-display text-2xl lg:text-3xl font-bold uppercase mb-6 lg:mb-8">
              Похожие товары
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
              {similar.map((item, idx) => (
                <SimilarProductCard
                  key={item.id}
                  product={item}
                  highlight={idx === 0}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ЛАЙТБОКС */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-accent transition-colors z-10"
            onClick={() => setLightboxOpen(false)}
            aria-label="Закрыть"
          >
            ×
          </button>

          {images.length > 1 && (
            <button
              className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white text-4xl lg:text-5xl w-12 lg:w-14 h-12 lg:h-14 flex items-center justify-center rounded-full transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Предыдущее фото"
            >
              ‹
            </button>
          )}

          <img
            src={images[activeImage]}
            alt={product.name}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <button
              className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white text-4xl lg:text-5xl w-12 lg:w-14 h-12 lg:h-14 flex items-center justify-center rounded-full transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Следующее фото"
            >
              ›
            </button>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {activeImage + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}

/**
 * Блок описания с возможностью свернуть/развернуть.
 * Сворачивает, если текст длиннее 300 символов.
 */
function DescriptionBlock({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  const COLLAPSE_THRESHOLD = 300;
  const shouldCollapse = text.length > COLLAPSE_THRESHOLD;

  const collapsedText = shouldCollapse
    ? text.slice(0, COLLAPSE_THRESHOLD).trim() + '...'
    : text;

  return (
    <div className="mb-6">
      <h3 className="font-display text-lg font-bold uppercase mb-3">Описание</h3>

      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {expanded || !shouldCollapse ? text : collapsedText}
      </p>

      {shouldCollapse && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-accent hover:text-accent-hover font-semibold text-sm inline-flex items-center gap-1 transition-colors"
        >
          {expanded ? (
            <>
              Свернуть
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              Показать полностью
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      )}
    </div>
  );
}