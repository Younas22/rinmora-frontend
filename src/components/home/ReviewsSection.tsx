import type { Review } from "@/types/storefront";

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10">
        <div className="text-center mb-12 md:mb-14">
          <span className="font-display text-xs tracking-[0.25em] uppercase text-primary-dark font-semibold">
            Testimonials
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-semibold mt-2">Loved By Our Customers</h2>
        </div>

        <div className="flex gap-5 md:gap-7 overflow-x-auto snap-row -mx-5 px-5 md:mx-0 md:px-0 md:grid md:grid-cols-3">
          {reviews.map((review) => (
            <figure
              key={review.id}
              className="snap-item shrink-0 w-[85%] sm:w-[60%] md:w-auto bg-black/[0.02] rounded-3xl p-7 md:p-8 flex flex-col gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/30 grid place-items-center font-display font-semibold text-primary-dark">
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
              <blockquote className="text-black/60 text-sm leading-relaxed">&ldquo;{review.body}&rdquo;</blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
