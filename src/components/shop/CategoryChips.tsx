import Link from "next/link";
import type { Category } from "@/types/storefront";

export default function CategoryChips({
  categories,
  activeSlug,
  basePath,
}: {
  categories: Category[];
  activeSlug?: string;
  basePath: string;
}) {
  const isAllActive = !activeSlug;

  return (
    <div className="flex gap-3 overflow-x-auto snap-row -mx-5 px-5 md:mx-0 md:px-0 md:flex-wrap">
      <Link
        href={basePath}
        className={`snap-item shrink-0 font-display text-xs md:text-sm font-semibold uppercase tracking-wide px-5 py-2.5 rounded-full transition ${
          isAllActive ? "bg-ink text-white" : "border border-black/10 hover:bg-black/5"
        }`}
      >
        All Bags
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`${basePath}?category=${cat.slug}`}
          className={`snap-item shrink-0 font-display text-xs md:text-sm font-medium uppercase tracking-wide px-5 py-2.5 rounded-full transition ${
            activeSlug === cat.slug ? "bg-ink text-white" : "border border-black/10 hover:bg-black/5"
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
