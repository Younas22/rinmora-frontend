"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/types/storefront";

const PRICE_RANGES = [
  { key: "any", label: "Price: Any" },
  { key: "0-50", label: "Under $50" },
  { key: "50-100", label: "$50 – $100" },
  { key: "100-200", label: "$100 – $200" },
  { key: "200-", label: "$200+" },
];

const SORT_OPTIONS = [
  { key: "latest", label: "Sort: Featured" },
  { key: "price_asc", label: "Price: Low to High" },
  { key: "price_desc", label: "Price: High to Low" },
  { key: "popular", label: "Best Rating" },
];

export default function ShopFilterBar({ basePath, categories }: { basePath: string; categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") ?? "";
  const currentSort = searchParams.get("sort") ?? "latest";
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");

  const currentPriceKey =
    PRICE_RANGES.find((r) => {
      if (r.key === "any") return !minPrice && !maxPrice;
      const [min, max] = r.key.split("-");
      return (min ? minPrice === min : !minPrice) && (max ? maxPrice === max : !maxPrice);
    })?.key ?? "any";

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

  const handlePriceChange = (key: string) => {
    if (key === "any") {
      navigate({ min_price: null, max_price: null });
      return;
    }
    const [min, max] = key.split("-");
    navigate({ min_price: min || null, max_price: max || null });
  };

  const hasActiveFilters = Boolean(currentCategory) || currentPriceKey !== "any" || currentSort !== "latest";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <select
          aria-label="Filter by category"
          value={currentCategory}
          onChange={(e) => navigate({ category: e.target.value || null })}
          className="appearance-none border border-black/10 rounded-full pl-5 pr-9 py-2.5 text-xs font-display font-medium uppercase tracking-wide bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Category: All</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
        <i className="fa-solid fa-chevron-down text-[10px] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      <div className="relative">
        <select
          aria-label="Filter by price"
          value={currentPriceKey}
          onChange={(e) => handlePriceChange(e.target.value)}
          className="appearance-none border border-black/10 rounded-full pl-5 pr-9 py-2.5 text-xs font-display font-medium uppercase tracking-wide bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {PRICE_RANGES.map((range) => (
            <option key={range.key} value={range.key}>
              {range.label}
            </option>
          ))}
        </select>
        <i className="fa-solid fa-chevron-down text-[10px] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      <div className="relative">
        <select
          aria-label="Sort products"
          value={currentSort}
          onChange={(e) => navigate({ sort: e.target.value })}
          className="appearance-none border border-black/10 rounded-full pl-5 pr-9 py-2.5 text-xs font-display font-medium uppercase tracking-wide bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {SORT_OPTIONS.map((sort) => (
            <option key={sort.key} value={sort.key}>
              {sort.label}
            </option>
          ))}
        </select>
        <i className="fa-solid fa-chevron-down text-[10px] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => navigate({ category: null, min_price: null, max_price: null, sort: null })}
          className="font-display text-xs font-semibold uppercase tracking-wide text-black/50 hover:text-ink underline underline-offset-4 transition ml-1"
        >
          Reset
        </button>
      )}
    </div>
  );
}
