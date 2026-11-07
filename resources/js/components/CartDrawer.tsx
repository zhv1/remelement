import { useCart } from '@/contexts/CartContext';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, removeItem, updateQuantity, total, count } = useCart();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative bg-accent hover:bg-accent-hover text-white font-semibold px-4 py-2 rounded transition-colors flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span>Корзина</span>
        {count > 0 && (
          <span className="bg-white text-accent text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {count}
          </span>
        )}
      </button>

      {open && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white text-brand-dark shadow-2xl z-50 transform transition-transform ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h2 className="font-display text-xl font-bold uppercase text-brand-dark">
              Корзина
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="text-2xl text-gray-500 hover:text-brand-dark"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {items.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Корзина пуста</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product_id} className="flex gap-3 border-b border-gray-200 pb-3">
                    {item.image && (
                      <div className="w-20 h-20 bg-white border border-gray-200 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-brand-dark line-clamp-2">{item.name}</p>
                      <p className="text-accent font-bold mt-1">
                        {item.price.toLocaleString('ru-RU')} ₽
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="w-7 h-7 border border-gray-300 rounded hover:bg-gray-100 text-brand-dark"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-brand-dark font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          disabled={item.stock !== undefined && item.quantity >= item.stock}
                          className="w-7 h-7 border border-gray-300 rounded hover:bg-gray-100 text-brand-dark disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="ml-auto text-sm text-red-500 hover:underline"
                        >
                          Удалить
                        </button>
                      </div>
                      {item.stock !== undefined && (
                        <p className="text-xs text-gray-400 mt-1">В наличии: {item.stock} шт.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-gray-200 p-5">
              <div className="flex justify-between items-baseline mb-4">
                <span className="font-semibold text-brand-dark">Итого:</span>
                <span className="text-2xl font-bold text-accent">
                  {total.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="block w-full text-center bg-accent hover:bg-accent-hover text-white font-semibold uppercase tracking-wide py-3 rounded transition-colors"
              >
                Оформить заказ
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}