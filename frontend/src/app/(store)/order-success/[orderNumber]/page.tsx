"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Copy, Truck, Clock, ArrowRight, ShieldCheck, Home } from "lucide-react";

export default function OrderSuccessPage() {
  const params = useParams();
  const orderNumber = decodeURIComponent(params.orderNumber as string);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 space-y-8 text-center">
      {/* Brand & Success Badge */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-black/40 border border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.25)] flex items-center justify-center p-1.5">
          <Image
            src="/logo.png"
            alt="Hamza Gadgets Logo"
            width={60}
            height={60}
            className="object-contain w-full h-full"
            priority
          />
        </div>
        <div className="w-14 h-14 rounded-full bg-[#141414] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)]">
          <CheckCircle2 className="w-7 h-7" />
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
          Order Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Thank You for Your Order!
        </h1>
        <p className="text-sm sm:text-base text-[#A1A1A1] max-w-lg mx-auto">
          We have received your order. Our fulfillment team is preparing your gadget package for dispatch.
        </p>
      </div>

      {/* Order Number Box */}
      <div className="p-6 rounded-2xl bg-[#111111] border border-[#2A2A2A] max-w-md mx-auto space-y-3">
        <span className="text-xs text-[#888888] font-semibold uppercase tracking-wider block">
          Your Order Number
        </span>
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl font-black text-[#D4AF37] tracking-wider font-mono">
            {orderNumber}
          </span>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-[#181818] border border-[#333333] hover:border-[#D4AF37] text-[#A1A1A1] hover:text-white transition"
            title="Copy Order ID"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
        {copied && <span className="text-xs text-emerald-400 block">Copied to clipboard!</span>}
        <p className="text-[11px] text-[#666666]">
          Save this order number to track your package status anytime.
        </p>
      </div>

      {/* Delivery Steps Timeline */}
      <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] text-left max-w-lg mx-auto space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-[#222222] pb-2">
          What Happens Next?
        </h3>

        <div className="space-y-3 text-xs text-[#A1A1A1]">
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Order Verification</strong>
              <span>You will receive a confirmation message or WhatsApp message within 2–4 hours.</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Truck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Courier Dispatch</strong>
              <span>Dispatched via priority courier with tracking provided right to your door.</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Cash on Delivery & Inspection</strong>
              <span>Pay the exact total to the rider in cash when the package arrives.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href={`/track-order?order_number=${encodeURIComponent(orderNumber)}`}
          className="w-full sm:w-auto btn-gold py-3 px-6 text-sm flex items-center justify-center gap-2"
        >
          <span>Track This Order</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/shop"
          className="w-full sm:w-auto btn-gold-outline py-3 px-6 text-sm flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
}
