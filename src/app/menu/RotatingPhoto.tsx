"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function RotatingPhoto({
  images,
  alt,
  sizes = "42vw",
  interval = 3500,
  imgClass = "object-center",
}: {
  images: string[];
  alt: string;
  sizes?: string;
  interval?: number;
  imgClass?: string;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setCurrent((i) => (i + 1) % images.length),
      interval
    );
    return () => clearInterval(id);
  }, [images.length, interval]);

  return (
    <div className="relative w-full h-full">
      {images.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className={`object-cover ${imgClass}`}
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  );
}
