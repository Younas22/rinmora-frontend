import Image from "next/image";
import Link from "next/link";
import RippleLink from "@/components/home/RippleLink";
import type { Product } from "@/types/storefront";

export default function ProductScrollRow({
  title,
  viewAllHref,
  products,
}: {
  title: string;
  viewAllHref: string;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl md:text-2xl font-semibold">{title}</h2>
        <RippleLink
          href={viewAllHref}
          className="group inline-flex items-center gap-1.5 shrink-0 border border-ink/15 rounded-full px-4 py-2 font-display text-xs font-semibold uppercase tracking-wide text-ink/70 hover:bg-ink hover:text-white hover:border-ink transition-colors"
        >
          View All
          <i className="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-0.5" />
        </RippleLink>
      </div>
      <div className="flex gap-4 md:gap-5 overflow-x-auto snap-row -mx-5 px-5 md:mx-0 md:px-0">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`} className="snap-item shrink-0 w-40 md:w-48">
            <div className="relative img-zoom aspect-square rounded-2xl overflow-hidden shadow-card">
              <Image
                src={product.image_url ?? `https://picsum.photos/seed/product-${product.id}/300/300`}
                alt={product.name}
                fill
                sizes="192px"
                className="object-cover"
              />
            </div>
            <p className="font-display text-xs font-medium mt-2 truncate">{product.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
