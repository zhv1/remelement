import { Link } from '@inertiajs/react';
import PositionBadge from './PositionBadge';
import type { Product } from '@/types/product';

interface Props {
  product: Product;
  highlight?: boolean;
}

export default function SimilarProductCard({ product, highlight = false }: Props) {
  const image = product.pictures_urls?.[0] || '/images/placeholder.png';
  const inStock = product.amount > 0;

  return (
    <Link
      href={`/catalog/${product.id}`}
      className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden group block ${
        highlight ? 'ring-2 ring-accent' : ''
      }`}
    >
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {inStock && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
            В наличии
          </span>
        )}
        <PositionBadge
          leftRight={product.characteristics?.left_right_rus}
          frontBack={product.characteristics?.front_back_rus}
          highlight={highlight}
        />
      </div>

      <div className="p-3 lg:p-4">
        <h3 className="font-medium text-sm lg:text-base mb-2 line-clamp-2 group-hover:text-accent transition-colors">
          {product.name}
        </h3>

        {product.characteristics?.manufacturer && (
          <p className="text-xs text-gray-500 mb-2">
            {product.characteristics.manufacturer}
          </p>
        )}

        <div className="text-lg font-bold text-accent">
          {product.price.toLocaleString('ru-RU')} ₽
        </div>
      </div>
    </Link>
  );
}