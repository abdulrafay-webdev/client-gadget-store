"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Order } from "@/types";
import { api } from "@/lib/api";
import { formatPKR, formatDate } from "@/lib/utils";
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  PackageCheck,
  AlertCircle,
  Loader2,
  MapPin,
  Calendar,
  XCircle
} from "lucide-react";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get("order_number") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) {
      setError("Please enter both your Order Number and Phone Number.");
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const data = await api.trackOrder(orderNumber.trim(), phone.trim());
      setOrder(data);
    } catch (err: any) {
      setError(err.message || "Order not found. Please double-check your Order ID and phone number.");
    } finally {
      setLoading(false);
    }
  };

  // Status mapping for progress stepper
  const steps = [
    { key: "pending", label: "Order Placed", icon: Clock },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
    { key: "shipped", label: "Dispatched / In Transit", icon: Truck },
    { key: "delivered", label: "Delivered", icon: PackageCheck },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case "pending": return 0;
      case "confirmed": return 1;
      case "shipped": return 2;
      case "delivered": return 3;
      case "cancelled": return -1;
      default: return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
          Live Tracking
        </span>
        <h1 className="text-3xl font-extrabold text-white">Track Your Order</h1>
        <p className="text-sm text-[#A1A1A1] max-w-md mx-auto">
          Enter your Order Number and checkout phone number below to view live courier status.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] shadow-xl">
        <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
              Order Number <span className="text-[#D4AF37]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. HGS-202610-1001"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#D4AF37] font-mono"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
              Phone Number <span className="text-[#D4AF37]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 0300 1234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-2.5 text-sm font-bold flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Track Order</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Tracking Result View */}
      {order && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#111111] border border-[#2A2A2A] space-y-8 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#222222] gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white font-mono">{order.order_number}</h2>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  order.status === "delivered" ? "bg-emerald-950 text-emerald-400 border border-emerald-800" :
                  order.status === "cancelled" ? "bg-red-950 text-red-400 border border-red-800" :
                  order.status === "shipped" ? "bg-blue-950 text-blue-400 border border-blue-800" :
                  "bg-amber-950 text-amber-400 border border-amber-800"
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#888888] mt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Placed on {formatDate(order.created_at)}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#888888] block">Total Amount (COD)</span>
              <span className="text-2xl font-black text-[#D4AF37]">{formatPKR(order.grand_total)}</span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          {order.status === "cancelled" ? (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center gap-3 text-red-300 text-sm">
              <XCircle className="w-6 h-6 text-red-400 shrink-0" />
              <div>
                <strong>This order has been cancelled.</strong>
                <p className="text-xs text-red-300/80">If you have any questions, please reach out to customer care on WhatsApp.</p>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <div className="grid grid-cols-4 gap-2 relative">
                {steps.map((st, idx) => {
                  const Icon = st.icon;
                  const isDone = currentStep >= idx;
                  const isCurrent = currentStep === idx;

                  return (
                    <div key={st.key} className="flex flex-col items-center text-center space-y-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isDone
                            ? "bg-[#D4AF37] text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                            : "bg-[#181818] border border-[#333333] text-[#666666]"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          isCurrent
                            ? "text-[#D4AF37]"
                            : isDone
                            ? "text-white"
                            : "text-[#666666]"
                        }`}
                      >
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customer & Shipping Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-[#141414] border border-[#222222] text-xs">
            <div className="space-y-1">
              <span className="text-[#888888] block">Delivery Recipient</span>
              <div className="text-white font-bold">{order.customer_name}</div>
              <div className="text-[#A1A1A1]">{order.customer_phone}</div>
              {order.customer_email && <div className="text-[#888888]">{order.customer_email}</div>}
            </div>

            <div className="space-y-1">
              <span className="text-[#888888] block">Destination Address</span>
              <div className="text-white font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> {order.city}
              </div>
              <div className="text-[#A1A1A1]">{order.address}</div>
            </div>
          </div>

          {/* Ordered Line Items (with Snapshots) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#A1A1A1] uppercase tracking-wider">
              Ordered Items
            </h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#161616] border border-[#222222] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg bg-[#1F1F1F] border border-[#2A2A2A] overflow-hidden shrink-0 flex items-center justify-center p-1">
                      <Image
                        src={item.product_image_url || "/placeholder-gadget.png"}
                        alt={item.product_name}
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{item.product_name}</h4>
                      <span className="text-[11px] text-[#888888]">Qty: {item.quantity} × {formatPKR(item.product_price)}</span>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-[#D4AF37]">
                    {formatPKR(item.line_total)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-16 text-center text-[#A1A1A1]">Loading tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
