"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import type { CurrencySettings } from "@/types/cms";

const DEFAULT_CURRENCY: CurrencySettings = {
  code: "USD",
  symbol: "$",
  symbol_position: "before",
  decimal_places: 2,
  exchange_rate: 1,
};

interface CurrencyContextValue {
  currency: CurrencySettings;
  formatPrice: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({
  children,
  currency,
}: {
  children: ReactNode;
  currency?: CurrencySettings;
}) {
  const active = currency ?? DEFAULT_CURRENCY;

  const formatPrice = useCallback(
    (amount: number) => {
      const converted = amount * active.exchange_rate;
      const formatted = converted.toLocaleString("en-US", {
        minimumFractionDigits: active.decimal_places,
        maximumFractionDigits: active.decimal_places,
      });

      return active.symbol_position === "after" ? `${formatted}${active.symbol}` : `${active.symbol}${formatted}`;
    },
    [active]
  );

  const value = useMemo(() => ({ currency: active, formatPrice }), [active, formatPrice]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return ctx;
}
