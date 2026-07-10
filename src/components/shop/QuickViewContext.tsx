"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface QuickViewContextValue {
  slug: string | null;
  open: (slug: string) => void;
  close: () => void;
}

const QuickViewContext = createContext<QuickViewContextValue | null>(null);

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [slug, setSlug] = useState<string | null>(null);

  const open = useCallback((s: string) => setSlug(s), []);
  const close = useCallback(() => setSlug(null), []);

  const value = useMemo(() => ({ slug, open, close }), [slug, open, close]);

  return <QuickViewContext.Provider value={value}>{children}</QuickViewContext.Provider>;
}

export function useQuickView() {
  const ctx = useContext(QuickViewContext);
  if (!ctx) {
    throw new Error("useQuickView must be used within a QuickViewProvider");
  }
  return ctx;
}
