import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/api";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductPurchasePanel from "@/components/shop/ProductPurchasePanel";
import ProductReviews from "@/components/shop/ProductReviews";
import WriteReviewForm from "@/components/shop/WriteReviewForm";
import ProductCard from "@/components/home/ProductCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getProductBySlug(slug);

  if (!payload) {
    return { title: "Product Not Found — Rinmora" };
  }

  return {
    title: `${payload.product.name} — Rinmora`,
    description: payload.product.short_description ?? undefined,
  };
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const reviewsPage = typeof query.reviews_page === "string" ? Math.max(1, Number(query.reviews_page) || 1) : 1;

  const payload = await getProductBySlug(slug, reviewsPage);

  if (!payload) {
    notFound();
  }

  const { product, reviews, related_products: relatedProducts } = payload;

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
        <Link href="/shop" className="hover:text-ink transition">
          Shop
        </Link>
        {product.category && (
          <>
            <i className="fa-solid fa-chevron-right text-[9px]" />
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-ink transition">
              {product.category.name}
            </Link>
          </>
        )}
        <i className="fa-solid fa-chevron-right text-[9px]" />
        <span className="text-ink font-medium truncate">{product.name}</span>
      </nav>

      <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <ProductGallery
            images={product.images.map((image) => image.url)}
            name={product.name}
            fallbackSeed={`product-${product.id}`}
          />
          <ProductPurchasePanel product={product} />
        </div>
      </section>

      {product.description && (
        <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 py-10 md:py-14 border-t border-black/5">
          <h2 className="font-display text-xl md:text-2xl font-semibold mb-6">Product Details</h2>
          <div
            className="max-w-3xl text-black/65 text-sm md:text-base leading-relaxed whitespace-pre-line [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:mt-6 [&_h2]:mb-2 [&_h2:first-child]:mt-0 [&_h3]:font-display [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:mb-4 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:mb-4 [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-2"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </section>
      )}

      <section id="reviews" className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 py-10 md:py-14 border-t border-black/5">
        <h2 className="font-display text-xl md:text-2xl font-semibold mb-8">Customer Reviews</h2>
        <div className="mb-10">
          <WriteReviewForm productId={product.id} slug={product.slug} />
        </div>
        <ProductReviews reviews={reviews} slug={product.slug} />
      </section>

      {relatedProducts.length > 0 && (
        <section className="bg-black/[0.02] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10">
            <h2 className="font-display text-xl md:text-2xl font-semibold text-center mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-7">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
