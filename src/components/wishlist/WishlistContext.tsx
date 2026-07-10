"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { getWishlist, mergeWishlist, toggleWishlist as toggleWishlistApi } from "@/lib/api";
import type { Product } from "@/types/storefront";

const GUEST_KEY = "rinmora_wishlist_guest";

interface WishlistContextValue {
  items: Product[];
  loading: boolean;
  isWishlisted: (productId: number) => boolean;
  toggle: (product: Product) => void;
  remove: (productId: number) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function readGuestWishlist(): Product[] {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
}

function writeGuestWishlist(items: Product[]) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(items));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, token, loading: authLoading } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    (async () => {
      if (user && token) {
        const guestItems = readGuestWishlist();

        try {
          const serverItems =
            guestItems.length > 0 ? await mergeWishlist(guestItems.map((p) => p.id), token) : await getWishlist(token);

          if (guestItems.length > 0) {
            localStorage.removeItem(GUEST_KEY);
          }

          if (!cancelled) setItems(serverItems);
        } catch {
          if (!cancelled) setItems([]);
        } finally {
          if (!cancelled) setLoading(false);
        }
      } else {
        if (!cancelled) {
          setItems(readGuestWishlist());
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, token, authLoading]);

  const isWishlisted = useCallback((productId: number) => items.some((p) => p.id === productId), [items]);

  const toggle = useCallback(
    (product: Product) => {
      const wasWishlisted = items.some((p) => p.id === product.id);
      const next = wasWishlisted ? items.filter((p) => p.id !== product.id) : [product, ...items];
      setItems(next);

      if (user && token) {
        toggleWishlistApi(product.id, token).catch(() => {
          setItems(items);
        });
      } else {
        writeGuestWishlist(next);
      }
    },
    [items, user, token]
  );

  const remove = useCallback(
    (productId: number) => {
      const next = items.filter((p) => p.id !== productId);
      setItems(next);

      if (user && token) {
        toggleWishlistApi(productId, token).catch(() => {
          setItems(items);
        });
      } else {
        writeGuestWishlist(next);
      }
    },
    [items, user, token]
  );

  const value = useMemo(
    () => ({ items, loading, isWishlisted, toggle, remove }),
    [items, loading, isWishlisted, toggle, remove]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
}
