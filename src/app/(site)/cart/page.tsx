"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import { formatCurrency } from "@/lib/currency";
import { getProducts, validateCart } from "@/lib/api";
import ProductCard from "@/components/home/ProductCard";
import type { Product } from "@/types/storefront";

export default function CartPage() {
  const { items, removeItem, setQty, subtotal, replaceItems } = useCart();
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const hasValidatedRef = useRef(false);

  useEffect(() => {
    if (hasValidatedRef.current || items.length === 0) return;
    hasValidatedRef.current = true;

    validateCart(items.map((i) => ({ product_id: i.productId, variant_id: i.variant?.id ?? null, qty: i.qty })))
      .then((results) => {
        const stillAvailable = results.filter((r) => r.available);
        const removedCount = results.length - stillAvailable.length;

        const next = stillAvailable
          .map((r) => {
            const original = items.find(
              (i) => i.productId === r.product_id && (i.variant?.id ?? null) === (r.variant_id ?? null)
            );
            if (!original) return null;
            return {
              ...original,
              name: r.name ?? original.name,
              slug: r.slug ?? original.slug,
              imageUrl: r.image_url ?? original.imageUrl,
              price: r.price ?? original.price,
              compareAtPrice: r.compare_at_price ?? original.compareAtPrice,
            };
          })
          .filter((line): line is NonNullable<typeof line> => line !== null);

        replaceItems(next);

        if (removedCount > 0) {
          setSyncNotice(
            removedCount === 1
              ? "One item was removed because it's no longer available."
              : `${removedCount} items were removed because they're no longer available.`
          );
        }
      })
      .catch(() => {
        // Keep the local cart as-is if validation fails (e.g. offline).
      });
  }, [items, replaceItems]);

  useEffect(() => {
    getProducts({ sort: "popular", per_page: 4 })
      .then((res) => setSuggestions(res.data))
      .catch(() => {});
  }, []);

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
        <span className="text-ink font-medium">Shopping Cart</span>
      </nav>

      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 pt-4 pb-8 md:pb-10">
        <h1 className="font-display text-3xl md:text-4xl font-semibold">Shopping Cart</h1>
        <p className="text-black/50 text-sm md:text-base mt-2">Review your selected handbags before checkout.</p>
      </div>

      {items.length > 0 ? (
        <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 pb-16 md:pb-24">
          {syncNotice && (
            <p className="mb-6 text-sm text-black/60 bg-primary/15 border border-primary/30 rounded-2xl px-5 py-3.5">
              <i className="fa-solid fa-circle-info text-primary-dark mr-2" />
              {syncNotice}
            </p>
          )}

          <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-10 lg:items-start">
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="font-display text-sm font-semibold uppercase tracking-wide text-black/50">
                  {items.length} {items.length === 1 ? "Item" : "Items"} in Your Bag
                </p>
              </div>

              <div className="space-y-5">
                {items.map((item) => (
                  <article
                    key={`${item.productId}:${item.variant?.id ?? "base"}`}
                    className="bg-white rounded-3xl shadow-card p-5 md:p-6 flex flex-col sm:flex-row gap-5"
                  >
                    <Link
                      href={`/products/${item.slug}`}
                      className="shrink-0 w-full sm:w-32 md:w-36 aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden img-zoom relative"
                    >
                      <Image
                        src={item.imageUrl ?? `https://picsum.photos/seed/product-${item.productId}/400/500`}
                        alt={item.name}
                        fill
                        sizes="144px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-base md:text-lg font-semibold">{item.name}</h3>
                          {item.variant && <p className="text-black/50 text-xs md:text-sm mt-1">{item.variant.label}</p>}
                        </div>
                        <button
                          type="button"
                          aria-label="Remove item"
                          onClick={() => removeItem(item.productId, item.variant?.id)}
                          className="shrink-0 w-9 h-9 rounded-full grid place-items-center hover:bg-black/5 transition text-black/40 hover:text-ink"
                        >
                          <i className="fa-regular fa-trash-can text-sm" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                        <div className="inline-flex items-center gap-1 border border-black/10 rounded-full p-1">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => setQty(item.productId, item.variant?.id, item.qty - 1)}
                            className="w-8 h-8 rounded-full grid place-items-center hover:bg-black/5 transition"
                          >
                            <i className="fa-solid fa-minus text-xs" />
                          </button>
                          <span className="w-8 text-center font-display font-semibold text-sm select-none">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => setQty(item.productId, item.variant?.id, item.qty + 1)}
                            className="w-8 h-8 rounded-full grid place-items-center hover:bg-black/5 transition"
                          >
                            <i className="fa-solid fa-plus text-xs" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-display font-semibold text-base">{formatCurrency(item.price)}</p>
                          {item.compareAtPrice && item.compareAtPrice > item.price && (
                            <p className="text-black/35 text-xs line-through">{formatCurrency(item.compareAtPrice)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 mt-8 font-display text-xs font-semibold uppercase tracking-wide text-black/60 hover:text-ink transition"
              >
                <i className="fa-solid fa-arrow-left text-[10px]" />
                Continue Shopping
              </Link>
            </div>

            <aside className="mt-10 lg:mt-0 lg:sticky lg:top-28 space-y-6 h-fit">
              <div className="bg-white rounded-3xl shadow-card p-6 md:p-7">
                <h2 className="font-display text-lg font-semibold mb-5">Order Summary</h2>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-black/55">Subtotal</dt>
                    <dd className="font-medium">{formatCurrency(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-black/55">Shipping</dt>
                    <dd className="font-medium text-black/45">Calculated at checkout</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-black/55">Tax</dt>
                    <dd className="font-medium text-black/45">Calculated at checkout</dd>
                  </div>
                </dl>

                <div className="border-t border-black/10 my-5" />

                <div className="flex justify-between items-baseline mb-6">
                  <span className="font-display font-semibold text-base">Subtotal</span>
                  <span className="font-display font-semibold text-2xl">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    href="/checkout"
                    className="btn-ripple w-full text-center bg-primary text-ink font-display font-semibold text-sm uppercase tracking-wide py-4 rounded-full hover:bg-primary-dark transition"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    href="/shop"
                    className="w-full text-center border border-ink/15 font-display font-semibold text-sm uppercase tracking-wide py-4 rounded-full hover:bg-black/5 transition"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-card p-6 grid grid-cols-2 gap-4 text-xs text-black/60">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-lock text-primary-dark" /> Secure Checkout
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-shield-halved text-primary-dark" /> SSL Protected
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-money-bill-wave text-primary-dark" /> Cash on Delivery
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-rotate-left text-primary-dark" /> Easy Returns
                </div>
              </div>
            </aside>
          </div>
        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 pb-20 md:pb-28">
          <div className="max-w-md mx-auto text-center py-10 md:py-16 fade-up">
            <div className="w-40 h-40 md:w-48 md:h-48 mx-auto mb-8 rounded-full bg-primary/15 grid place-items-center">
              <i className="fa-solid fa-bag-shopping text-5xl md:text-6xl text-primary-dark" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3">Your Cart is Empty</h2>
            <p className="text-black/50 text-sm md:text-base mb-8">Looks like you haven&apos;t added any handbags yet.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/shop"
                className="btn-ripple w-full sm:w-auto bg-primary text-ink font-display font-semibold text-sm uppercase tracking-wide px-8 py-4 rounded-full hover:bg-primary-dark transition"
              >
                Start Shopping
              </Link>
              <Link
                href="/shop?sort=latest"
                className="w-full sm:w-auto border border-ink/15 font-display font-semibold text-sm uppercase tracking-wide px-8 py-4 rounded-full hover:bg-black/5 transition"
              >
                Browse New Collection
              </Link>
            </div>
          </div>
        </section>
      )}

      {suggestions.length > 0 && (
        <section className="bg-black/[0.02] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10">
            <div className="mb-8 md:mb-10">
              <span className="font-display text-xs tracking-[0.25em] uppercase text-primary-dark font-semibold">
                Curated For You
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mt-2">You May Also Like</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-7">
              {suggestions.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
