"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPKR } from "@/lib/utils";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    grandTotal,
    freeShippingThreshold,
  } = useCart();

  if (!isCartOpen) return null;

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0F0F0F] border-l border-[#222222] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[#222222] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-lg font-bold text-white">Your Shopping Cart</h2>
              <span className="text-xs bg-[#1A1A1A] border border-[#333333] text-[#D4AF37] px-2 py-0.5 rounded-full font-semibold">
                {items.length}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-lg text-[#A1A1A1] hover:text-white hover:bg-[#1A1A1A] transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-6 py-3.5 bg-[#141414] border-b border-[#222222]">
            <div className="flex items-center gap-2 text-xs text-white mb-1.5">
              <Truck className="w-4 h-4 text-[#D4AF37]" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-[#D4AF37]">{formatPKR(remainingForFreeShipping)}</strong> more for <strong className="text-white">FREE Delivery</strong>
                </span>
              ) : (
                <span className="text-[#D4AF37] font-semibold">🎉 Congratulations! You have FREE Delivery</span>
              )}
            </div>
            <div className="w-full bg-[#222222] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#B8941F] to-[#E6C65C] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#D4AF37]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Your cart is empty</h3>
                  <p className="text-sm text-[#A1A1A1] mt-1">
                    Explore our luxury gadgets catalog and upgrade your setup today.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="btn-gold text-sm mt-2"
                >
                  <Link href="/shop" onClick={closeCart}>
                    Browse Products
                  </Link>
                </button>
              </div>
            ) : (
              items.map((item) => {
                const effectivePrice = item.product.discount_price || item.product.price;
                const thumb = item.selectedImage || item.product.images?.[0]?.image_url || "/placeholder-gadget.png";

                return (
                  <div
                    key={item.product.id}
                    className="p-3.5 rounded-xl bg-[#141414] border border-[#222222] hover:border-[#333333] transition flex gap-3.5"
                  >
                    {/* Thumbnail Container */}
                    <div className="relative w-20 h-20 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden shrink-0">
                      <Image
                        src={thumb}
                        alt={item.product.name}
                        fill
                        className="object-cover object-center"
                        sizes="80px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product/${item.product.slug}`}
                            onClick={closeCart}
                            className="text-sm font-semibold text-white hover:text-[#D4AF37] transition line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-[#666666] hover:text-red-400 p-1 transition"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-xs text-[#D4AF37] font-semibold mt-0.5">
                          {formatPKR(effectivePrice)}
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#222222]/60">
                        <div className="flex items-center bg-[#1E1E1E] border border-[#333333] rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:text-[#D4AF37] transition text-[#A1A1A1]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-white min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1 hover:text-[#D4AF37] transition text-[#A1A1A1] disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-white">
                          {formatPKR(effectivePrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-[#141414] border-t border-[#222222] space-y-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-[#A1A1A1]">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#A1A1A1]">
                  <span>Delivery Fee (Nationwide)</span>
                  <span className="text-white font-medium">
                    {shippingFee === 0 ? <span className="text-[#D4AF37] font-bold">FREE</span> : formatPKR(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#222222]">
                  <span>Estimated Total</span>
                  <span className="text-[#D4AF37] text-lg">{formatPKR(grandTotal)}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full btn-gold py-3 text-base font-bold flex items-center justify-center gap-2 group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </Link>
              </div>

              <div className="text-center">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="text-xs text-[#A1A1A1] hover:text-[#D4AF37] underline transition"
                >
                  View Full Cart Details
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
