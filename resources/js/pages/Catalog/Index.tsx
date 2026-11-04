import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import ProductCard from '@/components/ProductCard';
import type { Category, Paginated, PaginationLink, Product } from '@/types/product';

interface Props {
  products: Paginated<Product>;
  categories: Category[];
  partnames?: { name: string; count: number }[];
  filters: {
    search?: string;
    category?: string;
    type?: string;
    in_stock?: boolean;
    price_min?: string;
    price_max?: string;
    carsrc_id?: string;
    partname?: string;
    sort?: string;
  };
}

// Метки пагинации Laravel приходят с HTML-сущностями — декодируем в текст
const decodeLabel = (label: string) =>
  label
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&hellip;/g, '…')
    .replace(/&amp;/g, '&');

export default function CatalogIndex({
  products,
  categories,
  partnames = [],
  filters,
}: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [form, setForm] = useState({
    search: filters.search || '',
    category: filters.category || '',
    in_stock: filters.in_stock !== undefined ? filters.in_stock : true,
    price_min: filters.price_min || '',
    price_max: filters.price_max || '',
    partname: filters.partname || '',
    sort: filters.sort || 'newest',
  });

  const applyFilters = () => {
    const params: Record<string, string | number> = {};
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'in_stock') {
        params[key] = value ? 1 : 0;
      } else if (value !== '' && value !== false) {
        params[key] = String(value);
      }
    });
    router.get('/catalog', params, { preserveState: true });
  };

  const resetFilters = () => {
    setForm({
      search: '',
      category: '',
      in_stock: true,
      price_min: '',
      price_max: '',
      partname: '',
      sort: 'newest',
    });
    router.get('/catalog', {}, { preserveState: true });
  };

  return (
    <>
      <Head title="Каталог товаров — Ремэлемент" />
      <SiteHeader />

      <div className="bg-brand-light py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-2xl lg:text-4xl font-bold uppercase mb-6 lg:mb-8">
            Каталог
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Кнопка фильтров на мобильных */}
            <div className="lg:hidden">
              <button
                onClick={() => setFiltersOpen(true)}
                className="w-full bg-white border border-gray-300 rounded px-4 py-3 flex items-center justify-between font-medium"
              >
                <span>🔧 Фильтры и сортировка</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Боковая панель */}
            <aside
              className={`
                lg:col-span-1
                fixed lg:static inset-0 z-40 lg:z-auto
                ${filtersOpen ? 'visible' : 'invisible'} lg:visible
              `}
            >
              <div
                className={`absolute inset-0 bg-black/50 lg:hidden transition-opacity ${
                  filtersOpen ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={() => setFiltersOpen(false)}
              />

              <div
                className={`
                  relative bg-white h-full lg:h-auto overflow-y-auto
                  w-full max-w-sm lg:max-w-none
                  p-6 lg:rounded-lg lg:shadow-sm
                  lg:sticky lg:top-24
                  transform transition-transform
                  ${filtersOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
              >
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h3 className="font-display text-lg font-bold uppercase">Фильтры</h3>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="text-2xl text-gray-500 hover:text-brand-dark"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Поиск */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Поиск</label>
                    <input
                      type="text"
                      value={form.search}
                      onChange={(e) => setForm({ ...form, search: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                      placeholder="Название, артикул..."
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:border-accent focus:outline-none"
                    />
                  </div>

                  {/* Категории */}
                  {categories.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Категория</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            checked={form.category === ''}
                            onChange={() => setForm({ ...form, category: '' })}
                          />
                          <span>Все категории</span>
                        </label>
                        {categories.map((cat) => (
                          <label key={cat.slug} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="category"
                              checked={form.category === cat.slug}
                              onChange={() => setForm({ ...form, category: cat.slug })}
                            />
                            <span>{cat.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Наименование */}
                  {partnames.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Наименование
                        {form.partname && (
                          <button
                            onClick={() => setForm({ ...form, partname: '' })}
                            className="ml-2 text-xs text-accent hover:underline"
                          >
                            сбросить
                          </button>
                        )}
                      </label>
                      <select
                        value={form.partname}
                        onChange={(e) => setForm({ ...form, partname: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-accent focus:outline-none"
                      >
                        <option value="">Все наименования</option>
                        {partnames.map((item) => (
                          <option key={item.name} value={item.name}>
                            {item.name} ({item.count})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Наличие */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.in_stock}
                        onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
                      />
                      <span className="text-sm">Только в наличии</span>
                    </label>
                  </div>

                  {/* Цена */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Цена, ₽</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="от"
                        value={form.price_min}
                        onChange={(e) => setForm({ ...form, price_min: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-accent focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="до"
                        value={form.price_max}
                        onChange={(e) => setForm({ ...form, price_max: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Сортировка */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Сортировка</label>
                    <select
                      value={form.sort}
                      onChange={(e) => setForm({ ...form, sort: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-accent focus:outline-none"
                    >
                      <option value="newest">Сначала новые</option>
                      <option value="price_asc">Цена: по возрастанию</option>
                      <option value="price_desc">Цена: по убыванию</option>
                      <option value="name_asc">По названию</option>
                    </select>
                  </div>

                  {/* Кнопки */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => {
                        applyFilters();
                        setFiltersOpen(false);
                      }}
                      className="w-full bg-accent hover:bg-accent-hover text-white font-semibold uppercase py-3 rounded transition-colors"
                    >
                      Применить
                    </button>
                    <button
                      onClick={() => {
                        resetFilters();
                        setFiltersOpen(false);
                      }}
                      className="w-full border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded transition-colors text-sm"
                    >
                      Сбросить
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Сетка товаров */}
            <div className="lg:col-span-3">
              {products.data.length === 0 ? (
                <div className="text-center py-16 text-gray-500 bg-white rounded-lg">
                  Товары не найдены
                </div>
              ) : (
                <>
                  <div className="mb-4 text-sm text-gray-600">
                    Найдено: {products.total.toLocaleString('ru-RU')} товаров
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
                    {products.data.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              )}

              {/* Пагинация */}
              {products.last_page > 1 && (
                <div className="flex flex-wrap justify-center gap-2 mt-12">
                  {products.links.map((link: PaginationLink, idx: number) => {
                    if (!link.url) {
                      return (
                        <span
                          key={idx}
                          className="px-4 py-2 rounded font-medium text-sm opacity-50 bg-white"
                        >
                          {decodeLabel(link.label)}
                        </span>
                      );
                    }
                    return (
                      <Link
                        key={idx}
                        href={link.url}
                        className={`px-4 py-2 rounded font-medium text-sm ${
                          link.active
                            ? 'bg-accent text-white'
                            : 'bg-white text-brand-dark hover:bg-gray-100'
                        }`}
                      >
                        {decodeLabel(link.label)}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}