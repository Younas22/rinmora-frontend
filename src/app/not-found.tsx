import Image from "next/image";
import Link from "next/link";
import { getProducts, getSiteSettings } from "@/lib/api";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";

export default async function NotFound() {
  const [products, settings] = await Promise.all([
    getProducts({ per_page: 4 }).catch(() => null),
    getSiteSettings().catch(() => null),
  ]);

  return (
    <>
    <SiteHeader logoUrl={settings?.branding.logo_url} />
    <main className="pt-16 md:pt-20">
      <section className="relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 md:w-96 md:h-96 rounded-full bg-primary/20 blur-2xl" />
        <div className="absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-primary/15 blur-2xl" />

        <div className="relative max-w-2xl mx-auto px-5 md:px-8 pt-14 md:pt-20 pb-12 text-center fade-up">
          <div className="w-40 h-40 md:w-52 md:h-52 mx-auto mb-8 rounded-full bg-primary/15 grid place-items-center">
            <i className="fa-solid fa-bag-shopping text-6xl md:text-7xl text-primary-dark" />
          </div>

          <span className="font-display text-xs tracking-[0.25em] uppercase text-primary-dark font-semibold">
            Error 404
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-semibold mt-3">Oops!</h1>
          <h2 className="font-display text-xl md:text-2xl font-semibold mt-2">We Couldn&apos;t Find That Page</h2>
          <p className="text-black/50 text-sm md:text-base mt-4 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s get you back to
            something beautiful.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-9">
            <Link
              href="/"
              className="w-full sm:w-auto bg-primary text-ink font-display font-semibold text-sm uppercase tracking-wide px-8 py-4 rounded-full hover:bg-primary-dark transition"
            >
              Go Home
            </Link>
            <Link
              href="/shop"
              className="w-full sm:w-auto border border-ink/15 font-display font-semibold text-sm uppercase tracking-wide px-8 py-4 rounded-full hover:bg-black/5 transition"
            >
              Continue Shopping
            </Link>
          </div>

          <form action="/search" method="get" className="relative max-w-sm mx-auto mt-6">
            <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-black/30 text-sm" />
            <label htmlFor="notfound-search" className="sr-only">
              Search products
            </label>
            <input
              id="notfound-search"
              name="q"
              type="text"
              placeholder="Search products..."
              className="w-full pl-12 pr-5 py-3.5 rounded-full border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </form>
        </div>
      </section>

      {products && products.data.length > 0 && (
        <section className="bg-black/[0.02] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10">
            <h2 className="font-display text-xl md:text-2xl font-semibold text-center mb-8">Featured Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.data.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group bg-white rounded-3xl shadow-card overflow-hidden flex flex-col"
                >
                  <div className="img-zoom relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={product.image_url ?? `https://picsum.photos/seed/product-${product.id}/400/500`}
                      alt={product.name}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col gap-1">
                    <h3 className="font-display text-sm font-medium">{product.name}</h3>
                    <span className="font-display font-semibold text-sm">${product.price.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 text-center">
          <Link
            href="/categories"
            className="inline-block font-display text-sm font-semibold uppercase tracking-wide text-black/60 hover:text-ink transition"
          >
            Browse All Categories
          </Link>
        </div>
      </section>
    </main>
    <SiteFooter socialLinks={settings?.social} logoUrl={settings?.branding.logo_url} />
    </>
  );
}
