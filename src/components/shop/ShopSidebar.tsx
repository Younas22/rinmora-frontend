"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCurrency } from "@/components/currency/CurrencyContext";
import type { Category } from "@/types/storefront";

// Base-currency bounds for the slider; only the label is converted to the
// active display currency. The API filter params stay in base currency.
const DEFAULT_PRICE_MIN = 0;
const DEFAULT_PRICE_MAX = 1000;
const PRICE_STEP = 10;

export default function ShopSidebar({
  basePath,
  categories,
  priceBounds,
}: {
  basePath: string;
  categories: Category[];
  priceBounds?: { min: number; max: number };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formatPrice } = useCurrency();

  const PRICE_MIN = priceBounds?.min ?? DEFAULT_PRICE_MIN;
  const PRICE_MAX = priceBounds?.max ?? DEFAULT_PRICE_MAX;

  const currentCategory = searchParams.get("category") ?? "";
  const urlMinPrice = searchParams.get("min_price");
  const urlMaxPrice = searchParams.get("max_price");
  const urlMin = urlMinPrice ? Number(urlMinPrice) : PRICE_MIN;
  const urlMax = urlMaxPrice ? Number(urlMaxPrice) : PRICE_MAX;

  const [draftMin, setDraftMin] = useState(urlMin);
  const [draftMax, setDraftMax] = useState(urlMax);

  const priceFilterActive = urlMin > PRICE_MIN || urlMax < PRICE_MAX;
  const hasActiveFilters = Boolean(currentCategory) || priceFilterActive;

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
  };

  const clearPriceFilter = () => {
    setDraftMin(PRICE_MIN);
    setDraftMax(PRICE_MAX);
    navigate({ min_price: null, max_price: null });
  };

  const clearAllFilters = () => {
    setDraftMin(PRICE_MIN);
    setDraftMax(PRICE_MAX);
    navigate({ category: null, min_price: null, max_price: null });
  };

  const minPercent = ((draftMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxPercent = ((draftMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <aside className="hidden lg:block">
      <div className="bg-white rounded-3xl shadow-card p-6 sticky top-28">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide">Filters</h2>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="cursor-pointer text-[11px] font-display font-semibold uppercase tracking-wide text-black/40 hover:text-ink underline underline-offset-4 transition"
            >
              Clear All
            </button>
          )}
        </div>

        <h3 className="font-display text-xs font-semibold uppercase tracking-wide text-black/40 mb-3">Category</h3>
        <div className="flex flex-col gap-1 mb-7">
          <Link
            href={basePath}
            className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
              !currentCategory ? "bg-ink text-white" : "hover:bg-black/5"
            }`}
          >
            All Bags
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`${basePath}?category=${cat.slug}`}
              className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                currentCategory === cat.slug ? "bg-ink text-white" : "hover:bg-black/5"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <h3 className="font-display text-xs font-semibold uppercase tracking-wide text-black/40 mb-3">Price Range</h3>
        <p className="font-display font-semibold text-sm mb-5">
          {formatPrice(draftMin)} – {formatPrice(draftMax)}
        </p>
        <div className="range-slider relative h-1.5 mb-7 mx-1.5">
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
        <div className="flex gap-2">
          <button
            type="button"
            onClick={clearPriceFilter}
            className="cursor-pointer flex-1 border border-black/10 rounded-full py-2.5 text-[11px] font-display font-semibold uppercase tracking-wide hover:bg-black/5 transition"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={applyPriceFilter}
            className="cursor-pointer flex-1 bg-primary text-ink rounded-full py-2.5 text-[11px] font-display font-semibold uppercase tracking-wide hover:bg-primary-dark transition"
          >
            Apply
          </button>
        </div>
      </div>
    </aside>
  );
}
