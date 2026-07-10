import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/api";
import ProductScrollRow from "@/components/shop/ProductScrollRow";

export const metadata: Metadata = {
  title: "Shop by Category — Rinmora",
  description: "Explore the full Rinmora handbag range by category.",
};

export default async function CategoriesPage() {
  const [categories, trending, newest, bestSellers] = await Promise.all([
    getCategories(),
    getProducts({ per_page: 4 }),
    getProducts({ sort: "latest", per_page: 4 }),
    getProducts({ sort: "popular", per_page: 4 }),
  ]);

  const featured = categories[0];

  return (
    <main className="pt-16 md:pt-20">
      <section className="relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 md:w-96 md:h-96 rounded-full bg-primary/20 blur-2xl" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 lg:px-10 pt-10 md:pt-16 pb-8 text-center">
          <span className="font-display text-xs tracking-[0.25em] uppercase text-primary-dark font-semibold">
            Explore Rinmora
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-semibold mt-3">Shop by Category</h1>
          <p className="text-black/50 text-sm md:text-base mt-3 max-w-lg mx-auto">
            Find the perfect silhouette for every occasion, from everyday totes to evening clutches.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 pb-16 md:pb-24">
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className="group bg-white rounded-3xl shadow-card overflow-hidden"
              >
                <div className="relative img-zoom aspect-square overflow-hidden">
                  <Image
                    src={category.image_url ?? `https://picsum.photos/seed/cat-${category.slug}/400/400`}
                    alt={category.name}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-sm font-semibold">{category.name}</h3>
                  <p className="text-black/45 text-xs mt-0.5">{category.products_count} Products</p>
                  <span className="inline-flex items-center gap-1.5 mt-3 font-display text-xs font-semibold uppercase tracking-wide text-black/60 group-hover:text-ink transition">
                    Explore <i className="fa-solid fa-arrow-right text-[10px]" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-black/50 text-sm">No categories available yet.</p>
        )}
      </section>

      {featured && (
        <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 pb-16 md:pb-24">
          <div className="grid lg:grid-cols-2 rounded-4xl overflow-hidden shadow-soft">
            <div className="relative img-zoom aspect-[4/3] lg:aspect-auto">
              <Image
                src={featured.image_url ?? `https://picsum.photos/seed/featured-${featured.slug}/900/900`}
                alt={featured.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="bg-primary/15 flex items-center">
              <div className="p-8 md:p-12 lg:p-16">
                <span className="font-display text-xs tracking-[0.25em] uppercase text-primary-dark font-semibold">
                  Featured Category
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-semibold mt-3 mb-4 leading-tight">
                  {featured.name}
                </h2>
                <p className="text-black/60 max-w-sm mb-8">
                  Spacious, structured, and endlessly versatile — a Rinmora essential every wardrobe needs.
                </p>
                <Link
                  href={`/shop?category=${featured.slug}`}
                  className="btn-ripple inline-block bg-ink text-white font-display font-semibold text-sm tracking-wide uppercase px-9 py-4 rounded-full hover:bg-black/80 transition"
                >
                  Shop {featured.name}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-black/[0.02] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 space-y-10">
          <ProductScrollRow title="Trending Collections" viewAllHref="/shop" products={trending.data} />
          <ProductScrollRow title="Newest Arrivals" viewAllHref="/shop?sort=latest" products={newest.data} />
          <ProductScrollRow title="Best Sellers" viewAllHref="/shop?sort=popular" products={bestSellers.data} />
        </div>
      </section>
    </main>
  );
}
