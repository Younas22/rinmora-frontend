import Pagination from "./Pagination";
import type { Paginated, Review } from "@/types/storefront";

export default function ProductReviews({
  reviews,
  slug,
}: {
  reviews: Paginated<Review>;
  slug: string;
}) {
  if (reviews.meta.total === 0) {
    return (
      <div className="text-center py-10 text-black/45 text-sm">
        No reviews yet — be the first to review this product.
      </div>
    );
  }

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-5 md:gap-6">
        {reviews.data.map((review) => (
          <figure key={review.id} className="bg-black/[0.02] rounded-3xl p-6 md:p-7 flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-primary/30 grid place-items-center font-display font-semibold text-primary-dark">
                {review.customer_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <figcaption className="font-display font-semibold text-sm">{review.customer_name}</figcaption>
                <div className="text-primary-dark text-xs">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
              </div>
            </div>
            {review.title && <p className="font-display font-semibold text-sm">{review.title}</p>}
            <blockquote className="text-black/60 text-sm leading-relaxed">&ldquo;{review.body}&rdquo;</blockquote>
            {review.photo_url && (
              <a href={review.photo_url} target="_blank" rel="noopener noreferrer" className="block w-20 h-20 rounded-xl overflow-hidden border border-black/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={review.photo_url} alt="Photo shared by reviewer" className="w-full h-full object-cover" />
              </a>
            )}
          </figure>
        ))}
      </div>

      <Pagination
        currentPage={reviews.meta.current_page}
        lastPage={reviews.meta.last_page}
        buildHref={(page) => `/products/${slug}?reviews_page=${page}#reviews`}
      />
    </div>
  );
}
