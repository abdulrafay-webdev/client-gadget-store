"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPKR } from "@/lib/utils";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from "lucide-react";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingFee,
    grandTotal,
    freeShippingThreshold,
  } = useCart();

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#141414] border border-[#2A2A2A] flex items-center justify-center text-[#D4AF37]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white">Your Cart is Empty</h1>
          <p className="text-sm text-[#A1A1A1] max-w-md mx-auto">
            You don&apos;t have any gadgets in your shopping bag yet. Browse our collection of audio, smartwatches, and fast chargers.
          </p>
        </div>
        <div>
          <Link href="/shop" className="btn-gold py-3 px-8 text-sm">
            Browse All Gadgets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="flex items-center justify-between pb-6 border-b border-[#222222]">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Shopping Cart</h1>
          <p className="text-sm text-[#A1A1A1] mt-1">Review your selected items before checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-[#A1A1A1] hover:text-red-400 transition"
        >
          Clear Cart
        </button>
      </div>

      {/* Free Shipping Alert */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-[#222222] space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-white">
            <Truck className="w-4 h-4 text-[#D4AF37]" />
            {remainingForFreeShipping > 0 ? (
              <span>
                Add <strong className="text-[#D4AF37]">{formatPKR(remainingForFreeShipping)}</strong> more to unlock <strong className="text-white">FREE Nationwide Delivery</strong>
              </span>
            ) : (
              <span className="text-[#D4AF37] font-bold">🎉 You have qualified for FREE Delivery!</span>
            )}
          </div>
          <span className="text-xs text-[#888888] font-mono">{progressPercent}%</span>
        </div>
        <div className="w-full bg-[#222222] rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#B8941F] to-[#E6C65C] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const effectivePrice = item.product.discount_price || item.product.price;
            const thumb = item.selectedImage || item.product.images?.[0]?.image_url || "/placeholder-gadget.png";

            return (
              <div
                key={item.product.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#111111] border border-[#222222] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-xl bg-[#181818] border border-[#2A2A2A] overflow-hidden shrink-0 flex items-center justify-center p-2">
                    <Image
                      src={thumb}
                      alt={item.product.name}
                      fill
                      className="object-contain p-1"
                      sizes="80px"
                    />
                  </div>
                  <div className="space-y-1">
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="text-sm font-bold text-white hover:text-[#D4AF37] transition line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <div className="text-xs text-[#D4AF37] font-semibold">
                      {formatPKR(effectivePrice)}
                    </div>
                    <span className="text-[11px] text-[#777777] block font-mono">
                      SKU: {item.product.sku}
                    </span>
                  </div>
                </div>

                {/* Counter & Subtotal */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#222222]">
                  <div className="flex items-center bg-[#161616] border border-[#333333] rounded-xl">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 text-[#A1A1A1] hover:text-[#D4AF37] transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-white min-w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="p-1.5 text-[#A1A1A1] hover:text-[#D4AF37] transition disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-sm font-extrabold text-white min-w-24 text-right">
                    {formatPKR(effectivePrice * item.quantity)}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-[#666666] hover:text-red-400 p-1.5 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Box */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-6">
          <h2 className="text-lg font-bold text-white pb-3 border-b border-[#222222]">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-[#A1A1A1]">
              <span>Subtotal</span>
              <span className="text-white font-medium">{formatPKR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#A1A1A1]">
              <span>Nationwide Shipping</span>
              <span className="text-white font-medium">
                {shippingFee === 0 ? <strong className="text-[#D4AF37]">FREE</strong> : formatPKR(shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-white pt-4 border-t border-[#222222]">
              <span>Total (PKR)</span>
              <span className="text-[#D4AF37] text-xl">{formatPKR(grandTotal)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full btn-gold py-3.5 text-base font-bold flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(212,175,55,0.2)]"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>

          <div className="pt-2 text-xs text-[#777777] flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Guaranteed Safe Guest Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
