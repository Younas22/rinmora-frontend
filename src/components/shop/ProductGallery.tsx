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

  return (
    <div>
      <div className="img-zoom relative aspect-[4/5] rounded-3xl overflow-hidden bg-black/[0.03]">
        <Image
          src={gallery[active]}
          alt={name}
          fill
          sizes="(min-width: 768px) 480px, 100vw"
          className="object-cover"
        />
      </div>

      {gallery.length > 1 && (
        <div className="grid grid-cols-4 gap-3 mt-4">
          {gallery.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square rounded-2xl overflow-hidden ring-2 transition ${
                i === active ? "ring-primary-dark" : "ring-transparent hover:ring-black/15"
              }`}
            >
              <Image src={src} alt={`${name} view ${i + 1}`} fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
