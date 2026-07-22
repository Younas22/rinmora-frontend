"use client";

import Image from "next/image";
import { useCurrency } from "@/components/currency/CurrencyContext";
import AddToCartButton from "@/components/shared/AddToCartButton";
import WishlistButton from "@/components/shared/WishlistButton";
import { useCart } from "@/components/cart/CartContext";
import { useQuickView } from "@/components/shop/QuickViewContext";
import type { Product } from "@/types/storefront";

export default function ProductCard({ product }: { product: Product }) {
  const { open } = useQuickView();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  const badge = product.discount_percent
    ? `-${product.discount_percent}%`
    : product.is_new
      ? "New"
      : null;

  return (
    <article className="group bg-white rounded-3xl shadow-card overflow-hidden flex flex-col">
      <div className="relative img-zoom aspect-[4/5]">
        <Image
          src={product.image_url ?? `https://picsum.photos/seed/product-${product.id}/500/620`}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover"
        />
        {badge && (
          <span
            className={`absolute top-3 left-3 text-[10px] font-display font-semibold tracking-wide uppercase px-3 py-1 rounded-full ${
              badge === "New" ? "bg-primary text-ink" : "bg-ink text-white"
            }`}
          >
            {badge}
          </span>
        )}
        <WishlistButton
          product={product}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 grid place-items-center hover:bg-primary transition"
        />
        <button
          type="button"
          onClick={() => open(product.slug)}
          className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/95 backdrop-blur text-center text-xs font-display font-semibold tracking-wide uppercase py-2.5"
        >
          Quick View
        </button>
      </div>
      <div className="p-4 md:p-5 flex flex-col gap-1.5">
        <h3 className="font-display text-sm md:text-base font-medium">{product.name}</h3>
        {product.reviews_count > 0 ? (
          <div className="text-primary-dark text-xs">
            {"★".repeat(Math.round(product.rating ?? 0))}
            {"☆".repeat(5 - Math.round(product.rating ?? 0))}
          </div>
        ) : (
          <div className="text-black/40 text-xs">No reviews yet</div>
        )}
        <div className="flex items-baseline gap-2">
          <span className="font-display font-semibold text-sm md:text-base">{formatPrice(product.price)}</span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-black/40 text-xs line-through">{formatPrice(product.compare_at_price)}</span>
          )}
        </div>
        <AddToCartButton
          disabled={product.stock_status === "Out of Stock"}
          className="mt-2 w-full bg-ink text-white text-xs font-display font-semibold tracking-wide uppercase py-3 rounded-full hover:bg-black/80 transition"
          onAdd={() =>
            addItem({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              imageUrl: product.image_url,
              price: product.price,
              compareAtPrice: product.compare_at_price,
              variant: null,
            })
          }
        >
          {product.stock_status === "Out of Stock" ? "Out of Stock" : "Add to Cart"}
        </AddToCartButton>
      </div>
    </article>
  );
}
