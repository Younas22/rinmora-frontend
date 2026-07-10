import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — Rinmora",
  description: "The Rinmora story — crafted for women who appreciate elegance.",
};

const VALUES = [
  {
    icon: "fa-gem",
    title: "Premium Materials",
    body: "Ethically sourced leathers and hardware chosen for durability and a luxurious finish.",
  },
  {
    icon: "fa-hand-sparkles",
    title: "Craftsmanship",
    body: "Every piece is finished by skilled artisans who take pride in every stitch and seam.",
  },
  {
    icon: "fa-award",
    title: "Quality Promise",
    body: "Every handbag is quality-checked twice before it ever reaches your hands.",
  },
];

const STATS = [
  { value: "50K+", label: "Happy Customers" },
  { value: "120K+", label: "Orders Delivered" },
  { value: "180+", label: "Premium Designs" },
  { value: "24", label: "Countries Served" },
];

const TESTIMONIALS = [
  { name: "Sana K.", quote: "Every detail feels intentional. Rinmora bags are the first thing people notice." },
  { name: "Amina R.", quote: "Quality that genuinely rivals designer brands, at a fraction of the price." },
  { name: "Hira M.", quote: "My Rinmora tote has been through everything with me and still looks brand new." },
];

export default function AboutPage() {
  return (
    <main className="pt-16 md:pt-20">
      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://picsum.photos/seed/rinmora-about-hero/1600/900"
          alt="Woman wearing a Rinmora handbag"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative max-w-4xl mx-auto px-5 md:px-8 py-24 md:py-36 text-center text-white">
          <span className="font-display text-xs tracking-[0.25em] uppercase text-primary font-semibold">
            Our Story
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-semibold mt-4 leading-tight">
            Crafted for Women Who Appreciate Elegance
          </h1>
          <p className="text-white/70 text-sm md:text-base mt-5 max-w-xl mx-auto">
            Rinmora was founded on a simple belief — that everyday essentials deserve the same care and craftsmanship
            as fine jewelry.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 md:px-8 lg:px-10 py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          <div>
            <div className="w-12 h-12 rounded-full bg-primary/20 grid place-items-center mb-5">
              <i className="fa-solid fa-book-open text-primary-dark" />
            </div>
            <h2 className="font-display text-lg font-semibold mb-3">Our Story</h2>
            <p className="text-black/55 text-sm leading-relaxed">
              Founded in 2019, Rinmora began as a small atelier dedicated to reimagining the everyday handbag —
              blending timeless silhouettes with modern craftsmanship.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 rounded-full bg-primary/20 grid place-items-center mb-5">
              <i className="fa-solid fa-bullseye text-primary-dark" />
            </div>
            <h2 className="font-display text-lg font-semibold mb-3">Our Mission</h2>
            <p className="text-black/55 text-sm leading-relaxed">
              To create beautifully crafted handbags that empower women to feel confident, elegant, and effortlessly
              put-together every day.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 rounded-full bg-primary/20 grid place-items-center mb-5">
              <i className="fa-regular fa-eye text-primary-dark" />
            </div>
            <h2 className="font-display text-lg font-semibold mb-3">Our Vision</h2>
            <p className="text-black/55 text-sm leading-relaxed">
              To become the most trusted name in accessible luxury, known for quality, integrity, and designs that
              stand the test of time.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-black/[0.02] py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-10">
          <div className="text-center mb-12">
            <span className="font-display text-xs tracking-[0.25em] uppercase text-primary-dark font-semibold">
              What We Stand For
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-semibold mt-2">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {VALUES.map((value) => (
              <div key={value.title} className="bg-white rounded-3xl shadow-card p-7 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/20 grid place-items-center mx-auto mb-4">
                  <i className={`fa-solid ${value.icon} text-primary-dark`} />
                </div>
                <h3 className="font-display font-semibold mb-2">{value.title}</h3>
                <p className="text-black/55 text-sm leading-relaxed">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 py-16 md:py-24">
        <div className="text-center mb-10">
          <span className="font-display text-xs tracking-[0.25em] uppercase text-primary-dark font-semibold">
            Behind the Scenes
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-semibold mt-2">Meet Our Brand</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="rounded-2xl overflow-hidden aspect-[3/4] md:col-span-2 md:row-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://picsum.photos/seed/brand-1/700/900"
              alt="Rinmora atelier"
              className="w-full h-full object-cover"
            />
          </div>
          {["brand-2", "brand-3", "brand-4", "brand-5"].map((seed) => (
            <div key={seed} className="rounded-2xl overflow-hidden aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://picsum.photos/seed/${seed}/400/400`}
                alt="Rinmora craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl md:text-4xl font-semibold text-primary">{stat.value}</p>
                <p className="text-white/60 text-xs md:text-sm mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-10">
          <div className="text-center mb-12">
            <span className="font-display text-xs tracking-[0.25em] uppercase text-primary-dark font-semibold">
              Testimonials
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-semibold mt-2">Loved By Our Customers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <figure key={t.name} className="bg-black/[0.02] rounded-3xl p-7 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://picsum.photos/seed/about-review-${i + 1}/80/80`}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <figcaption className="font-display font-semibold text-sm">{t.name}</figcaption>
                    <div className="text-primary-dark text-xs">★★★★★</div>
                  </div>
                </div>
                <blockquote className="text-black/60 text-sm leading-relaxed">&quot;{t.quote}&quot;</blockquote>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 pb-16 md:pb-24">
        <div className="relative rounded-4xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://picsum.photos/seed/about-cta/1400/500"
            alt="Rinmora handbag collection"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/55" />
          <div className="relative px-6 py-16 md:py-20 text-center text-white max-w-lg mx-auto">
            <h2 className="font-display text-2xl md:text-4xl font-semibold mb-4">Discover the Collection</h2>
            <p className="text-white/70 text-sm md:text-base mb-8">
              Explore handbags crafted with the same passion that built Rinmora.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-primary text-ink font-display font-semibold text-sm tracking-wide uppercase px-9 py-4 rounded-full hover:bg-primary-dark transition"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
