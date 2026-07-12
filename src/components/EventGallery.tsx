"use client";

import { useState } from "react";
import Image from "next/image";

export default function EventGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const gallery = images.length > 0 ? images : ["https://picsum.photos/id/1080/800/600"];

  return (
    <div>
      <div className="relative h-72 w-full overflow-hidden rounded-card bg-stage sm:h-96">
        <Image src={gallery[active]} alt={title} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" priority />
      </div>
      {gallery.length > 1 && (
        <div className="mt-3 flex gap-3">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                active === i ? "border-spotlight" : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`Show image ${i + 1}`}
            >
              <Image src={src} alt={`${title} thumbnail ${i + 1}`} fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
