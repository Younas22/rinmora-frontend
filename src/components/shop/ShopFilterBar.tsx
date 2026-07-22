"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCurrency } from "@/components/currency/CurrencyContext";

// Base-currency bounds for the slider; only the label is converted to the
// active display currency. The API filter params stay in base currency.
const DEFAULT_PRICE_MIN = 0;
const DEFAULT_PRICE_MAX = 1000;
const PRICE_STEP = 10;

export default function ShopFilterBar({
  basePath,
  priceBounds,
}: {
  basePath: string;
  priceBounds?: { min: number; max: number };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formatPrice } = useCurrency();

  const PRICE_MIN = priceBounds?.min ?? DEFAULT_PRICE_MIN;
  const PRICE_MAX = priceBounds?.max ?? DEFAULT_PRICE_MAX;

  const urlMinPrice = searchParams.get("min_price");
  const urlMaxPrice = searchParams.get("max_price");
  const urlMin = urlMinPrice ? Number(urlMinPrice) : PRICE_MIN;
  const urlMax = urlMaxPrice ? Number(urlMaxPrice) : PRICE_MAX;

  const [panelOpen, setPanelOpen] = useState(false);
  const [draftMin, setDraftMin] = useState(urlMin);
  const [draftMax, setDraftMax] = useState(urlMax);

  const openPanel = () => {
    setDraftMin(urlMin);
    setDraftMax(urlMax);
    setPanelOpen(true);
  };

  useEffect(() => {
    if (!panelOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [panelOpen]);

  const priceFilterActive = urlMin > PRICE_MIN || urlMax < PRICE_MAX;

  const navigate = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    params.delete("page");
    const qs = params.toString();
    router.push(`${basePath}${qs ? `?${qs}` : ""}`);
  };

  const handleMinChange = (value: number) => {
    setDraftMin(Math.min(value, draftMax - PRICE_STEP));
  };

  const handleMaxChange = (value: number) => {
    setDraftMax(Math.max(value, draftMin + PRICE_STEP));
  };

  const applyPriceFilter = () => {
    navigate({
      min_price: draftMin > PRICE_MIN ? String(draftMin) : null,
      max_price: draftMax < PRICE_MAX ? String(draftMax) : null,
    });
    setPanelOpen(false);
  };

  const clearPriceFilter = () => {
    setDraftMin(PRICE_MIN);
    setDraftMax(PRICE_MAX);
    navigate({ min_price: null, max_price: null });
    setPanelOpen(false);
  };

  const range = Math.max(PRICE_MAX - PRICE_MIN, 1);
  const minPercent = ((draftMin - PRICE_MIN) / range) * 100;
  const maxPercent = ((draftMax - PRICE_MIN) / range) * 100;

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={openPanel}
        className="cursor-pointer relative w-full flex items-center gap-3 bg-white border border-black/10 rounded-2xl px-4 py-3.5 text-sm font-display font-semibold hover:bg-black/[0.03] transition"
      >
        <span className="w-8 h-8 rounded-full bg-primary/20 grid place-items-center shrink-0">
          <i className="fa-solid fa-sliders text-[12px] text-primary-dark" />
        </span>
        <span className="flex-1 text-left">
          {priceFilterActive ? `${formatPrice(urlMin)} – ${formatPrice(urlMax)}` : "Filter by Price"}
        </span>
        {priceFilterActive && <span className="w-2 h-2 rounded-full bg-primary-dark shrink-0" />}
        <i className="fa-solid fa-chevron-right text-[11px] text-black/30 shrink-0" />
      </button>

      {priceFilterActive && (
        <div className="flex items-center gap-2 mt-3">
          <span className="inline-flex items-center gap-2 text-xs font-display font-medium bg-black/[0.03] rounded-full pl-4 pr-2 py-2">
            {formatPrice(urlMin)} – {formatPrice(urlMax)}
            <button
              type="button"
              onClick={clearPriceFilter}
              aria-label="Clear price filter"
              className="cursor-pointer w-5 h-5 rounded-full grid place-items-center hover:bg-black/10 transition"
            >
              <i className="fa-solid fa-xmark text-[10px]" />
            </button>
          </span>
        </div>
      )}

      {panelOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPanelOpen(false)} />
          <div className="relative bg-white w-full rounded-t-4xl max-h-[85vh] overflow-y-auto p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-soft animate-slide-up">
            <div className="w-10 h-1.5 rounded-full bg-black/10 mx-auto mb-4 sm:hidden" />
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-lg font-semibold">Filter by Price</h2>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                aria-label="Close"
                className="cursor-pointer w-9 h-9 rounded-full grid place-items-center hover:bg-black/5 transition"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <p className="text-black/50 text-sm mb-7">Drag the handles to set your budget.</p>

            <p className="font-display font-semibold text-center mb-6">
              {formatPrice(draftMin)} <span className="text-black/30">–</span> {formatPrice(draftMax)}
            </p>

            <div className="range-slider relative h-1.5 mb-3 mx-1.5">
              <div className="absolute inset-0 rounded-full bg-black/10" />
              <div
                className="absolute h-full rounded-full bg-primary-dark"
                style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
              />
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={PRICE_STEP}
                value={draftMin}
                onChange={(e) => handleMinChange(Number(e.target.value))}
                aria-label="Minimum price"
                style={{ zIndex: draftMin > PRICE_MAX - PRICE_STEP * 5 ? 5 : 3 }}
              />
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={PRICE_STEP}
                value={draftMax}
                onChange={(e) => handleMaxChange(Number(e.target.value))}
                aria-label="Maximum price"
                style={{ zIndex: 4 }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-black/35 mb-9">
              <span>{formatPrice(PRICE_MIN)}</span>
              <span>{formatPrice(PRICE_MAX)}</span>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={clearPriceFilter}
                className="cursor-pointer flex-1 border border-black/10 rounded-full py-3.5 text-xs font-display font-semibold uppercase tracking-wide hover:bg-black/5 transition"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={applyPriceFilter}
                className="cursor-pointer flex-1 bg-primary text-ink rounded-full py-3.5 text-xs font-display font-semibold uppercase tracking-wide hover:bg-primary-dark transition"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
