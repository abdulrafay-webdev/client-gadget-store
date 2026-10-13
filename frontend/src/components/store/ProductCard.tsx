"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatPKR, calculateDiscountPercent } from "@/lib/utils";
import { ShoppingBag, Eye, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  const discountPercent = calculateDiscountPercent(product.price, product.discount_price);
  const effectivePrice = product.discount_price || product.price;
  const thumbnail = product.images?.[0]?.image_url || "/placeholder-gadget.png";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative bg-[#111111] hover:bg-[#141414] border border-[#2A2A2A] hover:border-[#D4AF37]/60 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]">
      <div>
        {/* Image Container with auto-cropped 1:1 square display */}
        <Link href={`/product/${product.slug}`} className="block relative aspect-square w-full bg-[#181818] overflow-hidden">
          <Image
            src={thumbnail}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
            {discountPercent > 0 && (
              <span className="bg-[#D4AF37] text-black text-[9px] sm:text-[11px] font-extrabold px-1.5 sm:px-2.5 py-0.5 rounded shadow-md uppercase tracking-wider">
                {discountPercent}% OFF
              </span>
            )}
            {product.is_featured && (
              <span className="bg-black/80 border border-[#D4AF37]/50 text-[#D4AF37] text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded backdrop-blur-sm">
                FEATURED
              </span>
            )}
          </div>

          {/* Low Stock Badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-red-950/80 border border-red-800/60 text-red-300 text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded backdrop-blur-sm z-10">
              Only {product.stock} left!
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-10">
              <span className="bg-red-900/90 text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}
        </Link>

        {/* Content Details */}
        <div className="p-2.5 sm:p-4 space-y-1 sm:space-y-2">
          {product.category_name && (
            <span className="text-[9px] sm:text-[11px] font-medium text-[#888888] uppercase tracking-wider block truncate">
              {product.category_name}
            </span>
          )}

          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#D4AF37] transition line-clamp-2 leading-snug min-h-[2rem] sm:min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          {/* Pricing Highlight */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 pt-0.5">
            <span className="text-sm sm:text-base font-extrabold text-[#D4AF37]">
              {formatPKR(effectivePrice)}
            </span>
            {product.discount_price && product.discount_price < product.price && (
              <span className="text-[10px] sm:text-xs text-[#666666] line-through truncate">
                {formatPKR(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-2.5 sm:p-4 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1 sm:gap-1.5 ${
            added
              ? "bg-emerald-600 text-white"
              : product.stock === 0
              ? "bg-[#222222] text-[#666666] cursor-not-allowed"
              : "bg-[#1A1A1A] hover:bg-[#D4AF37] text-white hover:text-black border border-[#2A2A2A] hover:border-[#D4AF37]"
          }`}
        >
          {added ? (
            <>
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>Added</span>
            </>
          ) : product.stock === 0 ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
