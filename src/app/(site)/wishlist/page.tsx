"use client";

import Link from "next/link";
import { useWishlist } from "@/components/wishlist/WishlistContext";
import { useCart } from "@/components/cart/CartContext";
import ProductCard from "@/components/home/ProductCard";

export default function WishlistPage() {
  const { items, loading, remove } = useWishlist();
  const { addItem } = useCart();

  const moveAllToCart = () => {
    items.forEach((product) => {
      addItem({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        imageUrl: product.image_url,
        price: product.price,
        compareAtPrice: product.compare_at_price,
        variant: null,
      });
    });
  };

  const clearWishlist = () => {
    items.forEach((product) => remove(product.id));
  };

  return (
    <main className="pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 pt-8 pb-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs md:text-sm text-black/45 mb-5">
          <Link href="/" className="hover:text-ink transition">
            Home
          </Link>
          <i className="fa-solid fa-chevron-right text-[9px]" />
          <span className="text-ink font-medium">Wishlist</span>
        </nav>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold">Wishlist</h1>
            <p className="text-black/50 text-sm md:text-base mt-2">Save your favorite handbags for later.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 pb-16 md:pb-24">
          <p className="text-center text-black/40 text-sm py-16">Loading your wishlist…</p>
        </section>
      ) : items.length > 0 ? (
        <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 pb-16 md:pb-24">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <p className="text-sm text-black/50">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={moveAllToCart}
                className="font-display text-xs font-semibold uppercase tracking-wide bg-ink text-white rounded-full px-5 py-2.5 hover:bg-black/80 transition"
              >
                Move All to Cart
              </button>
              <button
                type="button"
                onClick={clearWishlist}
                className="font-display text-xs font-semibold uppercase tracking-wide border border-black/10 rounded-full px-5 py-2.5 hover:bg-black/5 transition"
              >
                Clear Wishlist
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-7">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <section className="max-w-3xl mx-auto px-5 md:px-8 py-16 md:py-24 text-center fade-up">
          <div className="w-40 h-40 md:w-48 md:h-48 mx-auto mb-8 rounded-full bg-primary/15 grid place-items-center">
            <i className="fa-regular fa-heart text-5xl md:text-6xl text-primary-dark" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3">Your Wishlist is Empty</h2>
          <p className="text-black/50 text-sm md:text-base mb-8">
            Save the pieces you love so you never lose track of them.
          </p>
          <Link
            href="/shop"
            className="btn-ripple inline-block bg-primary text-ink font-display font-semibold text-sm uppercase tracking-wide px-8 py-4 rounded-full hover:bg-primary-dark transition"
          >
            Discover Collection
          </Link>
        </section>
      )}
    </main>
  );
}
