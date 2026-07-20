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

const GALLERY = [
  { src: "/logo/logo-01.png", alt: "Rinmora primary logo", fit: "contain", bg: "bg-white" },
  { src: "/logo/98px-01.jpg", alt: "Rinmora logo mark, tan background", fit: "contain", bg: "bg-white" },
  { src: "/instagram/insta5.png", alt: "Rinmora tote styled in a modern living room" },
  { src: "/instagram/insta3.png", alt: "Rinmora bag on display" },
];

export default function AboutPage() {
  return (
    <main className="pt-16 md:pt-20">
      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/instagram/insta6.png"
          alt="Woman wearing a Rinmora handbag"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative max-w-4xl mx-auto px-5 md:px-8 py-16 md:py-20 text-center text-white">
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

      <section className="py-14 md:py-20 border-b border-black/5">
        <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-wide mb-3">Rinmora</h2>
          <p className="font-display text-lg md:text-xl text-black/55 tracking-wide">Where Style Meets Grace</p>
        </div>
      </section>

      <section className="relative overflow-hidden py-10 md:py-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/instagram/insta2.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-white/35" />
        <div className="relative max-w-6xl mx-auto px-5 md:px-8 lg:px-10">
          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-5 md:p-6 shadow-card">
              <div className="w-11 h-11 rounded-full bg-primary/20 grid place-items-center mb-4">
                <i className="fa-solid fa-book-open text-primary-dark" />
              </div>
              <h2 className="font-display text-base font-semibold mb-2">Our Story</h2>
              <p className="text-black/55 text-sm leading-relaxed">
                Founded in 2019, Rinmora began as a small atelier dedicated to reimagining the everyday handbag —
                blending timeless silhouettes with modern craftsmanship.
              </p>
            </div>
            <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-5 md:p-6 shadow-card">
              <div className="w-11 h-11 rounded-full bg-primary/20 grid place-items-center mb-4">
                <i className="fa-solid fa-bullseye text-primary-dark" />
              </div>
              <h2 className="font-display text-base font-semibold mb-2">Our Mission</h2>
              <p className="text-black/55 text-sm leading-relaxed">
                To create beautifully crafted handbags that empower women to feel confident, elegant, and
                effortlessly put-together every day.
              </p>
            </div>
            <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-5 md:p-6 shadow-card">
              <div className="w-11 h-11 rounded-full bg-primary/20 grid place-items-center mb-4">
                <i className="fa-regular fa-eye text-primary-dark" />
              </div>
              <h2 className="font-display text-base font-semibold mb-2">Our Vision</h2>
              <p className="text-black/55 text-sm leading-relaxed">
                To become the most trusted name in accessible luxury, known for quality, integrity, and designs
                that stand the test of time.
              </p>
            </div>
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

      <section className="max-w-6xl mx-auto px-5 md:px-8 lg:px-10 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative rounded-4xl bg-gradient-to-b from-primary/15 via-primary/5 to-white overflow-hidden h-[420px] md:h-[560px] flex items-end justify-center pt-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/ceo.png"
              alt="Tahira Younas, Founder & CEO of Rinmora"
              className="h-full w-auto max-w-full object-contain object-bottom"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-64 md:h-72"
              style={{
                background:
                  "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 15%, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0.55) 48%, rgba(255,255,255,0.28) 66%, rgba(255,255,255,0.1) 82%, rgba(255,255,255,0) 100%)",
              }}
            />
          </div>
          <div>
            <span className="font-display text-xs tracking-[0.25em] uppercase text-primary-dark font-semibold">
              Meet Our Founder
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-semibold mt-2 mb-1">Tahira Younas</h2>
            <p className="text-black/45 text-sm font-medium mb-6">Founder &amp; CEO, Rinmora</p>
            <p className="text-black/60 text-sm md:text-base leading-relaxed mb-4">
              Tahira Younas started Rinmora with little more than a sketchbook, a sewing table, and an unshakable
              belief that Pakistani craftsmanship deserved a place on the world stage. What began as late nights
              perfecting a single prototype has grown into a brand carried by thousands of women across the
              country — without ever losing the personal touch that started it all.
            </p>
            <p className="text-black/60 text-sm md:text-base leading-relaxed mb-6">
              &quot;Every bag we make carries a piece of the woman who carries it,&quot; she says. &quot;My job
              isn&apos;t just to build a company — it&apos;s to make sure every customer feels seen, valued, and a
              little more confident every time she steps out the door.&quot;
            </p>
            <p className="font-display text-sm font-semibold text-ink">— Tahira Younas</p>
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
          <div className="relative rounded-2xl overflow-hidden aspect-[3/4] md:col-span-2 md:row-span-2 bg-gradient-to-br from-neutral-900 via-black to-neutral-800 grid place-items-center p-8 md:p-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/flyer.png"
              alt="Rinmora packaging and thank-you card"
              className="max-w-[75%] max-h-[85%] object-contain rounded-xl shadow-2xl -rotate-2"
            />
          </div>
          {GALLERY.map((item) => (
            <div
              key={item.src}
              className={`rounded-2xl overflow-hidden aspect-square ${item.bg ?? ""} ${
                item.fit === "contain" ? "grid place-items-center p-6" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                className={
                  item.fit === "contain" ? "max-w-full max-h-full object-contain" : "w-full h-full object-cover"
                }
              />
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 pb-16 md:pb-24">
        <div className="relative rounded-4xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/instagram/insta4.png"
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
