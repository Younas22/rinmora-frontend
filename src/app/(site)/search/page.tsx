import Link from "next/link";
import type { Metadata } from "next";
import { getProducts } from "@/lib/api";
import ShopFilterBar from "@/components/shop/ShopFilterBar";
import SortSelect from "@/components/shop/SortSelect";
import Pagination from "@/components/shop/Pagination";
import ProductCard from "@/components/home/ProductCard";
import type { ProductSort } from "@/types/storefront";

const SORT_VALUES: ProductSort[] = ["latest", "price_asc", "price_desc", "popular"];

export const metadata: Metadata = {
  title: "Search — Rinmora",
  description: "Search the Rinmora handbag collection.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const q = typeof params.q === "string" ? params.q : "";
  const sortParam = typeof params.sort === "string" ? params.sort : undefined;
  const sort: ProductSort = SORT_VALUES.includes(sortParam as ProductSort) ? (sortParam as ProductSort) : "latest";
  const minPrice = typeof params.min_price === "string" ? Number(params.min_price) : undefined;
  const maxPrice = typeof params.max_price === "string" ? Number(params.max_price) : undefined;
  const page = typeof params.page === "string" ? Math.max(1, Number(params.page) || 1) : 1;

  const products = q ? await getProducts({ q, sort, min_price: minPrice, max_price: maxPrice, page, per_page: 12 }) : null;

  const buildHref = (targetPage: number) => {
    const p = new URLSearchParams();
    p.set("q", q);
    if (sort !== "latest") p.set("sort", sort);
    if (minPrice !== undefined) p.set("min_price", String(minPrice));
    if (maxPrice !== undefined) p.set("max_price", String(maxPrice));
    if (targetPage > 1) p.set("page", String(targetPage));
    return `/search?${p.toString()}`;
  };

  return (
    <main className="pt-16 md:pt-20">
      <section className="max-w-4xl mx-auto px-5 md:px-8 pt-10 md:pt-14">
        <form action="/search" method="get" className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-black/30" />
          <label htmlFor="mainSearch" className="sr-only">
            Search products
          </label>
          <input
            id="mainSearch"
            name="q"
            type="text"
            defaultValue={q}
            placeholder="Search handbags, categories, styles..."
            className="w-full pl-14 pr-6 py-5 rounded-full border border-black/10 text-base focus:outline-none focus:ring-2 focus:ring-primary shadow-card transition"
          />
        </form>
      </section>

      {!q && (
        <section className="max-w-4xl mx-auto px-5 md:px-8 pt-8">
          <div className="grid sm:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-wide text-black/40 mb-3">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {["Leather Tote", "Mini Bags", "Crossbody"].map((term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="px-3.5 py-1.5 rounded-full bg-black/[0.04] text-black/60 hover:bg-black/10 transition"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-wide text-black/40 mb-3">
                Suggested Categories
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/categories" className="px-3.5 py-1.5 rounded-full bg-black/[0.04] text-black/60 hover:bg-black/10 transition">
                  Browse Categories
                </Link>
                <Link href="/shop" className="px-3.5 py-1.5 rounded-full bg-black/[0.04] text-black/60 hover:bg-black/10 transition">
                  Shop All
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {q && products && products.data.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 py-10 md:py-14">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <p className="text-sm text-black/50">
              Showing <span className="font-semibold text-ink">{products.meta.total} results</span> for &quot;
              <span className="font-semibold text-ink">{q}</span>&quot;
            </p>
            <div className="flex items-center gap-3">
              <ShopFilterBar basePath="/search" />
              <SortSelect basePath="/search" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-7">
            {products.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination currentPage={products.meta.current_page} lastPage={products.meta.last_page} buildHref={buildHref} />
        </section>
      )}

      {q && products && products.data.length === 0 && (
        <section className="max-w-2xl mx-auto px-5 md:px-8 py-16 md:py-20 text-center fade-up">
          <div className="w-36 h-36 md:w-40 md:h-40 mx-auto mb-8 rounded-full bg-primary/15 grid place-items-center">
            <i className="fa-solid fa-magnifying-glass text-4xl md:text-5xl text-primary-dark" />
          </div>
          <h2 className="font-display text-2xl font-semibold mb-3">No Results Found</h2>
          <p className="text-black/50 text-sm mb-8">
            We couldn&apos;t find anything matching &quot;{q}&quot;. Try checking your spelling or use a more general term.
          </p>
          <Link
            href="/shop"
            className="btn-ripple inline-block bg-primary text-ink font-display font-semibold text-sm uppercase tracking-wide px-8 py-4 rounded-full hover:bg-primary-dark transition"
          >
            Continue Shopping
          </Link>
        </section>
      )}
    </main>
  );
}
