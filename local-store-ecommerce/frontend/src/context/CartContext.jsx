import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "harvest-corner-cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, qty: Math.min(i.qty + qty, product.stock) } : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          image: product.image,
          stock: product.stock,
          qty,
        },
      ];
    });
  }, []);

  const updateQty = useCallback((productId, qty) => {
    setItems((prev) =>
      prev
        .map((i) => (i.productId === productId ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const deliveryFee = subtotal === 0 || subtotal >= 35 ? 0 : 4.99;
    const tax = Math.round(subtotal * 0.07 * 100) / 100;
    const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;
    return { subtotal: Math.round(subtotal * 100) / 100, count, deliveryFee, tax, total };
  }, [items]);

  const value = { items, addItem, updateQty, removeItem, clearCart, ...totals };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
