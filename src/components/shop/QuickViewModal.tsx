"use client";

import { useEffect, useState } from "react";
import { useQuickView } from "./QuickViewContext";
import { getProductBySlug } from "@/lib/api";
import ProductGallery from "./ProductGallery";
import ProductPurchasePanel from "./ProductPurchasePanel";
import type { ProductDetail } from "@/types/storefront";

export default function QuickViewModal() {
  const { slug, close } = useQuickView();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting loading/data before an in-flight fetch is the documented React data-fetching pattern
    setLoading(true);
    setProduct(null);

    getProductBySlug(slug)
      .then((payload) => {
        if (!cancelled) setProduct(payload?.product ?? null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [slug, close]);

  const open = Boolean(slug);

  return (
    <div
      className={`fixed inset-0 z-[70] ${open ? "" : "invisible pointer-events-none"}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="qvProductName"
    >
      <div
        className={`absolute inset-0 transition-colors duration-300 ${open ? "bg-black/50" : "bg-black/0"}`}
        onClick={close}
      />

      <div className="relative h-full flex items-end sm:items-center justify-center p-0 sm:p-6">
        <div
          className={`w-full sm:max-w-[960px] max-h-[92vh] sm:max-h-[88vh] overflow-y-auto bg-white rounded-t-4xl sm:rounded-4xl shadow-soft transition-all duration-300 ease-out ${
            open ? "opacity-100 translate-y-0 sm:scale-100" : "opacity-0 translate-y-6 sm:scale-95"
          }`}
        >
          {product ? (
            <>
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md flex items-center justify-between px-6 md:px-8 py-5 border-b border-black/5">
                <h2 id="qvProductName" className="font-display text-base md:text-lg font-semibold truncate pr-4">
                  {product.name}
                </h2>
                <button
                  type="button"
                  aria-label="Close quick view"
                  onClick={close}
                  className="shrink-0 w-9 h-9 grid place-items-center rounded-full hover:bg-black/5 transition"
                >
                  <i className="fa-solid fa-xmark text-lg" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 md:gap-10 p-6 md:p-8">
                <ProductGallery
                  images={product.images.map((image) => image.url)}
                  name={product.name}
                  fallbackSeed={`product-${product.id}`}
                />
                <ProductPurchasePanel product={product} showViewDetailsLink onViewDetailsClick={close} />
              </div>
            </>
          ) : (
            open && (
              <div className="p-16 text-center text-black/40 text-sm">
                {loading ? "Loading…" : "Product not found."}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
