"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({
  images,
  name,
  fallbackSeed,
}: {
  images: string[];
  name: string;
  fallbackSeed: string;
}) {
  const gallery = images.length > 0 ? images : [`https://picsum.photos/seed/${fallbackSeed}/700/860`];
  const [active, setActive] = useState(0);
  const hasMultiple = gallery.length > 1;

  const goPrev = () => setActive((a) => (a - 1 + gallery.length) % gallery.length);
  const goNext = () => setActive((a) => (a + 1) % gallery.length);

  const thumbs = (orientation: "vertical" | "horizontal") => (
    <div
      className={
        orientation === "vertical"
          ? "hidden md:flex flex-col gap-3 w-20 shrink-0 max-h-[480px] overflow-y-auto pr-1"
          : "flex md:hidden gap-3 mt-4 overflow-x-auto"
      }
    >
      {gallery.map((src, i) => (
        <button
          key={`${src}-${i}`}
          type="button"
          onClick={() => setActive(i)}
          className={`relative aspect-square w-full shrink-0 md:w-auto ${
            orientation === "horizontal" ? "w-16" : ""
          } rounded-2xl overflow-hidden ring-2 transition ${
            i === active ? "ring-primary-dark" : "ring-transparent hover:ring-black/15"
          }`}
        >
          <Image src={src} alt={`${name} view ${i + 1}`} fill sizes="120px" className="object-cover" />
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex gap-3 md:gap-4">
      {hasMultiple && thumbs("vertical")}

      <div className="flex-1 min-w-0">
        <div className="img-zoom group relative aspect-[4/5] max-w-[420px] mx-auto md:mx-0 rounded-3xl overflow-hidden bg-black/[0.03]">
          <Image
            src={gallery[active]}
            alt={name}
            fill
            sizes="(min-width: 768px) 420px, 100vw"
            className="object-cover"
          />

          {hasMultiple && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 shadow-sm grid place-items-center hover:bg-white transition cursor-pointer"
              >
                <i className="fa-solid fa-chevron-left text-xs" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 shadow-sm grid place-items-center hover:bg-white transition cursor-pointer"
              >
                <i className="fa-solid fa-chevron-right text-xs" />
              </button>
            </>
          )}
        </div>

        {hasMultiple && thumbs("horizontal")}
      </div>
    </div>
  );
}
