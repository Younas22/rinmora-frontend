import Link from "next/link";
import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/api";
import CategoryChips from "@/components/shop/CategoryChips";
import ShopFilterBar from "@/components/shop/ShopFilterBar";
import ShopSidebar from "@/components/shop/ShopSidebar";
import SortSelect from "@/components/shop/SortSelect";
import Pagination from "@/components/shop/Pagination";
import ProductCard from "@/components/home/ProductCard";
import type { ProductSort } from "@/types/storefront";

const SORT_VALUES: ProductSort[] = ["latest", "price_asc", "price_desc", "popular"];

export const metadata: Metadata = {
  title: "Shop — Rinmora",
  description: "Shop the full Rinmora handbag collection — premium totes, crossbody, shoulder bags, clutches and more.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const category = typeof params.category === "string" ? params.category : undefined;
  const sortParam = typeof params.sort === "string" ? params.sort : undefined;
  const sort: ProductSort = SORT_VALUES.includes(sortParam as ProductSort) ? (sortParam as ProductSort) : "latest";
  const minPrice = typeof params.min_price === "string" ? Number(params.min_price) : undefined;
  const maxPrice = typeof params.max_price === "string" ? Number(params.max_price) : undefined;
  const page = typeof params.page === "string" ? Math.max(1, Number(params.page) || 1) : 1;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ category, sort, min_price: minPrice, max_price: maxPrice, page, per_page: 12 }),
  ]);

  const buildHref = (targetPage: number) => {
    const p = new URLSearchParams();
    if (category) p.set("category", category);
    if (sort !== "latest") p.set("sort", sort);
    if (minPrice !== undefined) p.set("min_price", String(minPrice));
    if (maxPrice !== undefined) p.set("max_price", String(maxPrice));
    if (targetPage > 1) p.set("page", String(targetPage));
    const qs = p.toString();
    return `/shop${qs ? `?${qs}` : ""}`;
  };

  const activeCategoryName = category ? categories.find((c) => c.slug === category)?.name : undefined;

  return (
    <main className="pt-16 md:pt-20">
      <nav
        aria-label="Breadcrumb"
        className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 pt-6 pb-2 flex items-center gap-2 text-xs md:text-sm text-black/45"
      >
        <Link href="/" className="hover:text-ink transition">
          Home
        </Link>
        <i className="fa-solid fa-chevron-right text-[9px]" />
        <span className="text-ink font-medium">{activeCategoryName ?? "Shop"}</span>
      </nav>

      <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 pb-6 lg:hidden">
        <CategoryChips categories={categories} activeSlug={category} basePath="/shop" />
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 pb-16 md:pb-24">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10 lg:items-start">
          <ShopSidebar basePath="/shop" categories={categories} />

          <div>
            <div className="mb-6 lg:hidden">
              <ShopFilterBar basePath="/shop" />
            </div>

            <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-xs md:text-sm text-black/50">
                {products.meta.total > 0
                  ? `Showing ${products.meta.from}–${products.meta.to} of ${products.meta.total} Products`
                  : "No products found"}
              </p>
              <SortSelect basePath="/shop" />
            </div>

            {products.data.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-7">
                {products.data.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-black/50 text-sm">No products match these filters.</div>
            )}

            <Pagination currentPage={products.meta.current_page} lastPage={products.meta.last_page} buildHref={buildHref} />
          </div>
        </div>
      </section>
    </main>
  );
}
