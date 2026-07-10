import Image from "next/image";
import RippleLink from "./RippleLink";

const POSTS = Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/insta-${i + 1}/400/400`);

export default function InstagramGallery() {
  return (
    <section className="bg-black/[0.02] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10">
        <div className="text-center mb-10 md:mb-12">
          <span className="font-display text-xs tracking-[0.25em] uppercase text-primary-dark font-semibold">
            Follow The Story
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-semibold mt-2">@Rinmora on Instagram</h2>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-10">
          {POSTS.map((src, i) => (
            <div key={src} className="relative img-zoom aspect-square rounded-2xl overflow-hidden">
              <Image src={src} alt={`Instagram post ${i + 1}`} fill sizes="33vw" className="object-cover" />
            </div>
          ))}
        </div>

        <div className="text-center">
          <RippleLink
            href="#"
            className="inline-block bg-ink text-white font-display font-semibold text-sm tracking-wide uppercase px-9 py-4 rounded-full hover:bg-black/80 transition"
          >
            Follow @Rinmora
          </RippleLink>
        </div>
      </div>
    </section>
  );
}
