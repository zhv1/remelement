import { Link } from '@inertiajs/react';
import { useCart } from '@/contexts/CartContext';
import PositionBadge from './PositionBadge';
import type { Product } from '@/types/product';

export default function ProductCard({ product }: { product: Product }) {
  const { items, addItem, removeItem } = useCart();
  const image = product.pictures_urls?.[0] || '/images/placeholder.png';
  const inStock = product.amount > 0;
  const oldPrice = Math.round(product.price * 1.1);

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
        image,
        stock: product.amount,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
      <Link
        href={`/catalog/${product.id}`}
        className="relative aspect-square bg-gray-100 overflow-hidden block"
      >
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {inStock && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded">
            В наличии
          </span>
        )}

        <PositionBadge
          leftRight={product.characteristics?.left_right_rus}
          frontBack={product.characteristics?.front_back_rus}
        />
      </Link>

      <div className="p-5">
        <Link href={`/catalog/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.characteristics?.manufacturer && (
          <p className="text-sm text-gray-500 mb-3">{product.characteristics.manufacturer}</p>
        )}

        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-2xl font-bold text-accent">
            {product.price.toLocaleString('ru-RU')} ₽
          </span>
          <span className="text-sm text-gray-400 line-through">
            {oldPrice.toLocaleString('ru-RU')} ₽
          </span>
        </div>

        <div className="text-xs text-accent font-semibold uppercase mb-3">
          🔥 Скидка при заказе на сайте
        </div>

        <button
          onClick={handleToggleCart}
          disabled={!inStock}
          className={`block w-full text-center font-semibold uppercase tracking-wide py-3 rounded transition-colors ${
            !inStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : inCart
              ? 'bg-green-600 hover:bg-red-600 text-white'
              : 'bg-brand-dark hover:bg-accent text-white'
          }`}
        >
          {!inStock ? 'Под заказ' : inCart ? '✓ В корзине' : 'В корзину'}
        </button>
      </div>
    </div>
  );
}