import Image from "next/image";
import RippleLink from "./RippleLink";

const DEFAULT_EYEBROW = "Signature Collection";
const DEFAULT_DESCRIPTION =
  "Premium handbags designed for confident women. Crafted from the finest materials for every chapter of your story.";
const DEFAULT_IMAGE = "https://picsum.photos/seed/rinmora-hero/900/1100";

export default function Hero({
  eyebrow,
  heading,
  description,
  image,
  ctaText = "Shop Now",
  ctaLink = "#bestsellers",
}: {
  eyebrow?: string | null;
  heading?: string | null;
  description?: string | null;
  image?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
}) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute -top-24 -right-24 w-72 h-72 md:w-[30rem] md:h-[30rem] rounded-full bg-primary/20 blur-2xl" />
      <div className="absolute -bottom-32 -left-20 w-72 h-72 md:w-[26rem] md:h-[26rem] rounded-full bg-primary/15 blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-5 md:px-8 lg:px-10 pt-8 md:pt-14 lg:pt-20 pb-10 md:pb-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="fade-up order-2 lg:order-1 text-center lg:text-left">
            <span className="inline-block font-display text-xs tracking-[0.25em] uppercase text-primary-dark font-semibold mb-4">
              {eyebrow || DEFAULT_EYEBROW}
            </span>
            {heading ? (
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] mb-5">
                {heading}
              </h1>
            ) : (
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] mb-5">
                Elegance You
                <br className="hidden sm:block" /> Can Carry.
              </h1>
            )}
            <p className="text-base md:text-lg text-black/60 max-w-md mx-auto lg:mx-0 mb-8">
              {description || DEFAULT_DESCRIPTION}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <RippleLink
                href={ctaLink || "#bestsellers"}
                className="w-full sm:w-auto text-center bg-primary hover:bg-primary-dark transition-colors font-display font-semibold text-sm tracking-wide uppercase px-9 py-4 rounded-full shadow-card"
              >
                {ctaText || "Shop Now"}
              </RippleLink>
              <RippleLink
                href="#promo"
                className="w-full sm:w-auto text-center border border-ink/80 hover:bg-ink hover:text-white transition-colors font-display font-semibold text-sm tracking-wide uppercase px-9 py-4 rounded-full"
              >
                New Collection
              </RippleLink>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none aspect-[4/5] rounded-4xl overflow-hidden shadow-soft img-zoom">
              <Image
                src={image || DEFAULT_IMAGE}
                alt="Rinmora signature handbag"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="hidden md:flex absolute -bottom-6 -left-6 bg-white rounded-3xl shadow-card px-6 py-4 items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-primary/30 grid place-items-center">
                <i className="fa-solid fa-star text-primary-dark" />
              </div>
              <div>
                <p className="font-display font-semibold text-sm leading-none">4.9 / 5.0</p>
                <p className="text-xs text-black/50 mt-1">32 reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
