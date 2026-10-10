"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/types";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const displayImages = images.length > 0
    ? [...images].sort((a, b) => a.display_order - b.display_order)
    : [{ id: "placeholder", product_id: "", image_url: "/placeholder-gadget.png", display_order: 0, is_thumbnail: true, created_at: "" }];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = displayImages[activeIndex] || displayImages[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Stage */}
      <div className="relative aspect-square w-full rounded-2xl bg-[#141414] border border-[#2A2A2A] overflow-hidden flex items-center justify-center p-6">
        <Image
          src={activeImage.image_url}
          alt={`${productName} view ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-4 hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {displayImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 h-20 rounded-xl bg-[#161616] border overflow-hidden shrink-0 transition-all p-1 ${
                activeIndex === idx
                  ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                  : "border-[#2A2A2A] hover:border-[#444444]"
              }`}
            >
              <Image
                src={img.image_url}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
