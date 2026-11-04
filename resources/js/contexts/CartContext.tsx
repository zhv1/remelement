import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export interface CartItem {
  product_id: number;
  bazon_id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  stock?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = 'remelem_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  // Ленивая инициализация из localStorage — без setState внутри эффекта
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as CartItem[]) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((prev) => {
      const stock = item.stock ?? Infinity;
      const existing = prev.find((i) => i.product_id === item.product_id);
      if (existing) {
        return prev.map((i) =>
          i.product_id === item.product_id
            ? { ...i, quantity: Math.min(i.quantity + quantity, stock), stock: item.stock ?? i.stock }
            : i
        );
      }
      return [...prev, { ...item, quantity: Math.min(quantity, stock) }];
    });
  };

  const removeItem = (productId: number) => setItems((prev) => prev.filter((i) => i.product_id !== productId));

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) { removeItem(productId); return; }
    setItems((prev) =>
      prev.map((i) => {
        if (i.product_id !== productId) return i;
        const stock = i.stock ?? Infinity;
        return { ...i, quantity: Math.min(quantity, stock) };
      })
    );
  };

  const clearCart = () => setItems([]);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart должен использоваться внутри CartProvider');
  return ctx;
}