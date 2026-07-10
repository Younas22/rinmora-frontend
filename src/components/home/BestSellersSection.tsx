import type { Product } from "@/types/storefront";
import ProductCard from "./ProductCard";

export default function BestSellersSection({ products }: { products: Product[] }) {
  return (
    <section id="bestsellers" className="bg-black/[0.02] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10">
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <span className="font-display text-xs tracking-[0.25em] uppercase text-primary-dark font-semibold">
              Most Loved
            </span>
            <h2 className="font-display text-2xl md:text-4xl font-semibold mt-2">Best Sellers</h2>
          </div>
          <a
            href="#"
            className="hidden md:inline-block font-display text-sm font-semibold underline underline-offset-4 hover:text-primary-dark transition"
          >
            View All
          </a>
        </div>

        {products.length === 0 ? (
          <p className="text-black/50 text-sm">New arrivals are on their way — check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-7">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <a href="#" className="font-display text-sm font-semibold underline underline-offset-4">
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
}
