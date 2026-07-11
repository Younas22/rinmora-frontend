"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { key: "latest", label: "Featured" },
  { key: "price_asc", label: "Price: Low to High" },
  { key: "price_desc", label: "Price: High to Low" },
  { key: "popular", label: "Best Rating" },
];

export default function SortSelect({ basePath }: { basePath: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "latest";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "latest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(`${basePath}${qs ? `?${qs}` : ""}`);
  };

  return (
    <div className="relative max-w-[52%] sm:max-w-none">
      <select
        aria-label="Sort products"
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full appearance-none truncate border border-black/10 rounded-full pl-5 pr-9 py-2.5 text-xs font-display font-medium uppercase tracking-wide bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {SORT_OPTIONS.map((sort) => (
          <option key={sort.key} value={sort.key}>
            Sort: {sort.label}
          </option>
        ))}
      </select>
      <i className="fa-solid fa-chevron-down text-[10px] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}
