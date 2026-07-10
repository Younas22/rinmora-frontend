import Image from "next/image";
import RippleLink from "./RippleLink";

const DEFAULT_EYEBROW = "Fall / Winter";
const DEFAULT_DESCRIPTION =
  "Discover handcrafted silhouettes in rich textures, designed to move effortlessly from day to evening.";
const DEFAULT_IMAGE = "https://picsum.photos/seed/rinmora-season/900/900";

export default function PromoBanner({
  eyebrow,
  heading,
  description,
  image,
  ctaText = "Explore Collection",
  ctaLink = "#",
}: {
  eyebrow?: string | null;
  heading?: string | null;
  description?: string | null;
  image?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
}) {
  return (
    <section id="promo" className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 py-16 md:py-24">
      <div className="grid lg:grid-cols-2 rounded-4xl overflow-hidden shadow-soft">
        <div className="relative img-zoom aspect-[4/3] lg:aspect-auto">
          <Image
            src={image || DEFAULT_IMAGE}
            alt="New Season Collection"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="bg-primary/15 flex items-center">
          <div className="p-8 md:p-12 lg:p-16">
            <span className="font-display text-xs tracking-[0.25em] uppercase text-primary-dark font-semibold">
              {eyebrow || DEFAULT_EYEBROW}
            </span>
            {heading ? (
              <h2 className="font-display text-3xl md:text-4xl font-semibold mt-3 mb-4 leading-tight">{heading}</h2>
            ) : (
              <h2 className="font-display text-3xl md:text-4xl font-semibold mt-3 mb-4 leading-tight">
                New Season
                <br />
                Collection
              </h2>
            )}
            <p className="text-black/60 max-w-sm mb-8">{description || DEFAULT_DESCRIPTION}</p>
            <RippleLink
              href={ctaLink || "#"}
              className="inline-block bg-ink text-white font-display font-semibold text-sm tracking-wide uppercase px-9 py-4 rounded-full hover:bg-black/80 transition"
            >
              {ctaText || "Explore Collection"}
            </RippleLink>
          </div>
        </div>
      </div>
    </section>
  );
}
