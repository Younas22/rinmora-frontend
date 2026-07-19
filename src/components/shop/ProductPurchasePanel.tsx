"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyContext";
import AddToCartButton from "@/components/shared/AddToCartButton";
import WishlistButton from "@/components/shared/WishlistButton";
import { useCart } from "@/components/cart/CartContext";
import type { ProductDetail } from "@/types/storefront";

export default function ProductPurchasePanel({
  product,
  showViewDetailsLink = false,
  onViewDetailsClick,
}: {
  product: ProductDetail;
  showViewDetailsLink?: boolean;
  onViewDetailsClick?: () => void;
}) {
  const router = useRouter();
  const { items: cartItems, addItem } = useCart();
  const { formatPrice } = useCurrency();

  const optionGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};
    for (const variant of product.variants) {
      for (const [key, value] of Object.entries(variant.option_values)) {
        if (!groups[key]) groups[key] = [];
        if (!groups[key].includes(value)) groups[key].push(value);
      }
    }
    return groups;
  }, [product.variants]);

  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const [key, values] of Object.entries(optionGroups)) {
      initial[key] = values[0];
    }
    return initial;
  });

  const [qty, setQty] = useState(1);

  const selectedVariant = useMemo(() => {
    if (product.variants.length === 0) return null;
    return (
      product.variants.find((variant) =>
        Object.entries(selected).every(([key, value]) => variant.option_values[key] === value)
      ) ?? null
    );
  }, [product.variants, selected]);

  const effectivePrice = selectedVariant?.price ?? product.price;
  const stockQuantity = selectedVariant ? selectedVariant.quantity : product.quantity;
  const inStock = stockQuantity > 0;
  const lowStock = inStock && stockQuantity < 5;

  const cartQty = useMemo(() => {
    const line = cartItems.find(
      (item) => item.productId === product.id && (item.variant?.id ?? null) === (selectedVariant?.id ?? null)
    );
    return line?.qty ?? 0;
  }, [cartItems, product.id, selectedVariant]);

  const remainingStock = Math.max(0, stockQuantity - cartQty);
  const canAddToCart = inStock && remainingStock > 0;

  useEffect(() => {
    setQty((q) => Math.min(q, Math.max(remainingStock, 1)));
  }, [remainingStock]);

  return (
    <div className="flex flex-col">
      {product.category && (
        <p className="text-[11px] uppercase tracking-wide text-black/40 font-medium mb-1">{product.category.name}</p>
      )}
      <h3 className="font-display text-2xl font-semibold mb-2">{product.name}</h3>

      <div className="flex items-center gap-2 mb-4">
        {product.reviews_count > 0 ? (
          <>
            <span className="text-primary-dark text-sm">
              {"★".repeat(Math.round(product.rating ?? 0))}
              {"☆".repeat(5 - Math.round(product.rating ?? 0))}
            </span>
            <span className="text-xs text-black/45">({product.reviews_count} Reviews)</span>
          </>
        ) : (
          <span className="text-xs text-black/45">No reviews yet</span>
        )}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="font-display text-2xl font-semibold">{formatPrice(effectivePrice)}</span>
        {product.compare_at_price && product.compare_at_price > effectivePrice && (
          <span className="text-black/35 text-base line-through">{formatPrice(product.compare_at_price)}</span>
        )}
        {product.discount_percent && (
          <span className="bg-ink text-white text-[10px] font-display font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">
            -{product.discount_percent}%
          </span>
        )}
      </div>

      {product.short_description && (
        <p className="text-black/60 text-sm leading-relaxed mb-5">{product.short_description}</p>
      )}

      <dl className="grid grid-cols-2 gap-y-2 text-xs text-black/55 mb-6">
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Availability</dt>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              !inStock ? "bg-red-500" : lowStock ? "bg-amber-500" : "bg-green-600"
            }`}
          />
          <dd className={lowStock ? "text-amber-600 font-medium" : undefined}>
            {!inStock ? "Out of Stock" : lowStock ? `Only ${stockQuantity} left in stock` : "In Stock"}
          </dd>
        </div>
        <div>
          <dt className="inline text-black/40">SKU:</dt> <dd className="inline">{selectedVariant?.sku ?? product.sku}</dd>
        </div>
        {product.category && (
          <div>
            <dt className="inline text-black/40">Category:</dt> <dd className="inline">{product.category.name}</dd>
          </div>
        )}
        {product.brand && (
          <div>
            <dt className="inline text-black/40">Brand:</dt> <dd className="inline">{product.brand.name}</dd>
          </div>
        )}
      </dl>

      {Object.entries(optionGroups).map(([key, values]) => (
        <div className="mb-5" key={key}>
          <p className="font-display text-xs font-semibold uppercase tracking-wide mb-3">
            {key} — <span className="font-normal normal-case text-black/45">{selected[key]}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {values.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelected((s) => ({ ...s, [key]: value }))}
                className={`px-5 py-2 rounded-full text-sm font-display transition ${
                  selected[key] === value
                    ? "bg-primary text-ink font-semibold"
                    : "border border-black/10 font-medium hover:bg-black/5"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="mb-6">
        <p className="font-display text-xs font-semibold uppercase tracking-wide mb-3">Quantity</p>
        <div className="inline-flex items-center gap-1 border border-black/10 rounded-full p-1">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            className="w-9 h-9 rounded-full grid place-items-center hover:bg-black/5 transition disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-minus text-xs" />
          </button>
          <span className="w-10 text-center font-display font-semibold text-sm select-none">{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => Math.min(remainingStock, q + 1))}
            disabled={qty >= remainingStock}
            className="w-9 h-9 rounded-full grid place-items-center hover:bg-black/5 transition disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-plus text-xs" />
          </button>
        </div>
        {inStock && cartQty > 0 && (
          <p className="text-[11px] text-black/40 mt-2">
            {remainingStock > 0
              ? `${cartQty} already in your cart · ${remainingStock} more available`
              : "Maximum available quantity is already in your cart"}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-7">
        <AddToCartButton
          disabled={!canAddToCart}
          className="flex-1 min-w-[140px] bg-ink text-white font-display font-semibold text-sm tracking-wide uppercase py-3.5 rounded-full hover:bg-black/80 transition"
          onAdd={() =>
            addItem(
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                imageUrl: product.images[0]?.url ?? null,
                price: effectivePrice,
                compareAtPrice: product.compare_at_price,
                variant: selectedVariant ? { id: selectedVariant.id, label: selectedVariant.label } : null,
              },
              qty
            )
          }
        >
          Add to Cart
        </AddToCartButton>
        <AddToCartButton
          disabled={!canAddToCart}
          className="flex-1 min-w-[140px] bg-primary text-ink font-display font-semibold text-sm tracking-wide uppercase py-3.5 rounded-full hover:bg-primary-dark transition"
          onAdd={() => {
            addItem(
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                imageUrl: product.images[0]?.url ?? null,
                price: effectivePrice,
                compareAtPrice: product.compare_at_price,
                variant: selectedVariant ? { id: selectedVariant.id, label: selectedVariant.label } : null,
              },
              qty
            );
            router.push("/cart");
          }}
        >
          Buy Now
        </AddToCartButton>
        <WishlistButton
          product={product}
          className="w-12 h-12 shrink-0 rounded-full border border-black/10 grid place-items-center hover:bg-black/5 transition"
          iconClassName="text-base"
        />
        <button
          type="button"
          aria-label="Share product"
          className="w-12 h-12 shrink-0 rounded-full border border-black/10 grid place-items-center hover:bg-black/5 transition"
        >
          <i className="fa-solid fa-share-nodes" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-5 border-t border-black/5 text-xs text-black/60">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-check text-primary-dark" />
          <span>Premium Quality</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-check text-primary-dark" />
          <span>Cash on Delivery</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-check text-primary-dark" />
          <span>Fast Shipping</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-check text-primary-dark" />
          <span>Easy Returns</span>
        </div>
      </div>

      {showViewDetailsLink && (
        <Link
          href={`/products/${product.slug}`}
          onClick={onViewDetailsClick}
          className="inline-flex items-center gap-1.5 font-display text-xs font-semibold uppercase tracking-wide text-black/60 hover:text-ink transition pt-5 border-t border-black/5"
        >
          View Full Product Details
          <i className="fa-solid fa-arrow-right text-[10px]" />
        </Link>
      )}
    </div>
  );
}
