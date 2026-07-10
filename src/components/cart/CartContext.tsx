"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem } from "@/types/cart";

const CART_KEY = "rinmora_cart";

function lineKey(productId: number, variantId?: number | null) {
  return `${productId}:${variantId ?? "base"}`;
}

interface CartContextValue {
  items: CartItem[];
  hydrated: boolean;
  totalCount: number;
  subtotal: number;
  notice: string | null;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (productId: number, variantId?: number | null) => void;
  setQty: (productId: number, variantId: number | null | undefined, qty: number) => void;
  clear: () => void;
  replaceItems: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    // Hydrating client-only cart state from localStorage — no server round trip
    // involved, so this genuinely has to happen post-mount, not during render.
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  const addItem = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((current) => {
      const key = lineKey(item.productId, item.variant?.id);
      const existingIndex = current.findIndex((line) => lineKey(line.productId, line.variant?.id) === key);
      if (existingIndex >= 0) {
        const next = [...current];
        next[existingIndex] = { ...next[existingIndex], qty: next[existingIndex].qty + qty };
        return next;
      }
      return [...current, { ...item, qty }];
    });
    setNotice(`${item.name} added to cart`);
  }, []);

  const removeItem = useCallback((productId: number, variantId?: number | null) => {
    const key = lineKey(productId, variantId);
    setItems((current) => current.filter((line) => lineKey(line.productId, line.variant?.id) !== key));
  }, []);

  const setQty = useCallback((productId: number, variantId: number | null | undefined, qty: number) => {
    const key = lineKey(productId, variantId);
    setItems((current) => {
      if (qty <= 0) {
        return current.filter((line) => lineKey(line.productId, line.variant?.id) !== key);
      }
      return current.map((line) => (lineKey(line.productId, line.variant?.id) === key ? { ...line, qty } : line));
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const replaceItems = useCallback((next: CartItem[]) => setItems(next), []);

  const totalCount = useMemo(() => items.reduce((sum, line) => sum + line.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, line) => sum + line.price * line.qty, 0), [items]);

  const value = useMemo(
    () => ({ items, hydrated, totalCount, subtotal, notice, addItem, removeItem, setQty, clear, replaceItems }),
    [items, hydrated, totalCount, subtotal, notice, addItem, removeItem, setQty, clear, replaceItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
