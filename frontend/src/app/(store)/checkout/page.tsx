"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";
import { formatPKR, PAKISTAN_CITIES } from "@/lib/utils";
import { Truck, ShieldCheck, CheckCircle2, Lock, ArrowLeft, Loader2, CreditCard } from "lucide-react";

export default function CheckoutPage() {
  const { items, subtotal, shippingFee, grandTotal, clearCart } = useCart();
  const router = useRouter();

  // Form Fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [city, setCity] = useState("Karachi");
  const [customCity, setCustomCity] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-sm text-[#A1A1A1]">Please add items to your cart before proceeding to checkout.</p>
        <Link href="/shop" className="btn-gold inline-flex text-sm py-2 px-6">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!customerName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid Pakistani phone number (e.g. 0300 1234567).");
      return;
    }
    if (!address.trim()) {
      setError("Please provide your complete delivery street address.");
      return;
    }

    const finalCity = city === "Other" ? (customCity.trim() || "Pakistan") : city;

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_email: customerEmail.trim() || undefined,
        city: finalCity,
        address: address.trim(),
        notes: notes.trim() || undefined,
        payment_method: paymentMethod,
        items: items.map((it) => ({
          product_id: it.product.id,
          quantity: it.quantity,
        })),
      };

      const createdOrder = await api.createOrder(orderPayload);
      clearCart();
      router.push(`/order-success/${encodeURIComponent(createdOrder.order_number)}`);
    } catch (err: any) {
      setError(err.message || "Failed to place order. Please try again or reach out on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Back button */}
      <div>
        <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs text-[#A1A1A1] hover:text-[#D4AF37] transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Customer Information & Delivery Form */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Guest <span className="text-[#D4AF37]">Checkout</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#A1A1A1] mt-1">
              No account required. Please fill in your shipping details below for Cash on Delivery.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmitOrder} className="space-y-6">
            {/* Contact Details */}
            <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
              <h2 className="text-base font-bold text-white border-b border-[#222222] pb-3">
                1. Customer Contact
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                    Full Name <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hamza Ali"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                    Phone / WhatsApp Number <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0300 1234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                  Email Address <span className="text-[#666666] font-normal">(Optional for invoice receipt)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. hamza@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
              <h2 className="text-base font-bold text-white border-b border-[#222222] pb-3">
                2. Shipping Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                    City <span className="text-[#D4AF37]">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    {PAKISTAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {city === "Other" && (
                  <div>
                    <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                      Specify City <span className="text-[#D4AF37]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your city name"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                  Full Street Address <span className="text-[#D4AF37]">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="House/Apartment #, Street, Sector / Area, Landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                  Order Delivery Instructions / Notes <span className="text-[#666666] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Please deliver after 3 PM or call on arrival"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Payment Options */}
            <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
              <h2 className="text-base font-bold text-white border-b border-[#222222] pb-3">
                3. Payment Method
              </h2>

              <div className="space-y-3">
                {/* Cash On Delivery (Default) */}
                <label
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    paymentMethod === "COD"
                      ? "bg-[#181818] border-[#D4AF37] ring-1 ring-[#D4AF37]"
                      : "bg-[#141414] border-[#2A2A2A]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-[#D4AF37] flex items-center justify-center">
                      {paymentMethod === "COD" && <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block">Cash on Delivery (COD)</span>
                      <span className="text-xs text-[#888888]">Pay with cash when courier arrives at your doorstep</span>
                    </div>
                  </div>
                  <Truck className="w-5 h-5 text-[#D4AF37]" />
                </label>

                {/* Online Payment (Extensible Architecture) */}
                <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] opacity-60 flex items-center justify-between cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-[#444444]" />
                    <div>
                      <span className="text-sm font-semibold text-white block">Credit / Debit Card / JazzCash</span>
                      <span className="text-xs text-[#888888]">Online card gateway (Launching soon)</span>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-[#666666]" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-gold py-4 text-base font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Placing Your Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm Order ({formatPKR(grandTotal)})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-6">
            <h2 className="text-base font-bold text-white border-b border-[#222222] pb-3 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs bg-[#1A1A1A] border border-[#333333] text-[#D4AF37] px-2.5 py-0.5 rounded-full">
                {items.length} Item{items.length === 1 ? "" : "s"}
              </span>
            </h2>

            {/* Item Previews */}
            <div className="max-h-72 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              {items.map((item) => {
                const effectivePrice = item.product.discount_price || item.product.price;
                const thumb = item.selectedImage || item.product.images?.[0]?.image_url || "/placeholder-gadget.png";

                return (
                  <div key={item.product.id} className="flex items-center gap-3 py-1">
                    <div className="relative w-14 h-14 rounded-lg bg-[#181818] border border-[#2A2A2A] overflow-hidden shrink-0">
                      <Image
                        src={thumb}
                        alt={item.product.name}
                        fill
                        className="object-cover object-center"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">{item.product.name}</h4>
                      <div className="text-[11px] text-[#A1A1A1]">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-xs font-bold text-[#D4AF37]">
                      {formatPKR(effectivePrice * item.quantity)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 pt-4 border-t border-[#222222] text-sm">
              <div className="flex justify-between text-[#A1A1A1]">
                <span>Items Subtotal</span>
                <span className="text-white font-medium">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#A1A1A1]">
                <span>Delivery (Nationwide)</span>
                <span className="text-white font-medium">
                  {shippingFee === 0 ? <strong className="text-[#D4AF37]">FREE</strong> : formatPKR(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-3 border-t border-[#222222]">
                <span>Grand Total (PKR)</span>
                <span className="text-[#D4AF37] text-xl">{formatPKR(grandTotal)}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141414] border border-[#222222] text-xs text-[#888888] space-y-1.5">
              <div className="flex items-center gap-1.5 text-white font-medium">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Buyer Protection Guarantee</span>
              </div>
              <p>You only pay the courier when you physically receive the sealed package.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
