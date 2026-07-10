import Image from "next/image";
import type { Category } from "@/types/storefront";

export default function CategoriesSection({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section id="categories" className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 py-16 md:py-24">
      <div className="flex items-end justify-between mb-10 md:mb-14">
        <div>
          <span className="font-display text-xs tracking-[0.25em] uppercase text-primary-dark font-semibold">
            Explore
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-semibold mt-2">Shop by Category</h2>
        </div>
      </div>

      <div className="flex md:grid md:grid-cols-6 gap-6 md:gap-6 overflow-x-auto snap-row -mx-5 px-5 md:mx-0 md:px-0 md:overflow-visible">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#`}
            className="snap-item shrink-0 w-32 md:w-auto flex flex-col items-center gap-4 group"
          >
            <div className="relative w-32 h-32 md:w-full md:h-auto md:aspect-square rounded-full overflow-hidden shadow-card img-zoom">
              <Image
                src={category.image_url ?? `https://picsum.photos/seed/category-${category.id}/400/400`}
                alt={category.name}
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
            <p className="font-display text-sm font-medium text-center">{category.name}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
