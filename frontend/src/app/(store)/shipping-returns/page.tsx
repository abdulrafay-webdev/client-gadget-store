import React from "react";
import { Truck, RotateCcw, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ShippingReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
          Policies & Terms
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Shipping & Returns</h1>
        <p className="text-sm text-[#A1A1A1]">
          Transparent, customer-friendly policies designed for worry-free shopping across Pakistan.
        </p>
      </div>

      <div className="space-y-8">
        {/* Shipping Policy */}
        <div className="p-8 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
          <div className="flex items-center gap-3 text-white border-b border-[#222222] pb-4">
            <Truck className="w-6 h-6 text-[#D4AF37]" />
            <h2 className="text-xl font-bold">Nationwide Shipping Policy</h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-[#A1A1A1] leading-relaxed">
            <p>
              • <strong>Courier Partners:</strong> We work with leading courier providers (TCS, Leopards, Call Courier, Trax) to ensure reliable Cash on Delivery delivery.
            </p>
            <p>
              • <strong>Delivery Times:</strong> Major cities (Karachi, Lahore, Islamabad, Rawalpindi) typically receive deliveries within <strong>2 to 3 business days</strong>. Other regional cities take <strong>3 to 5 business days</strong>.
            </p>
            <p>
              • <strong>Free Delivery:</strong> Orders exceeding <strong>Rs. 3,500</strong> automatically qualify for Free Nationwide Shipping. Standard shipping fee for orders below this threshold is <strong>Rs. 250</strong>.
            </p>
            <p>
              • <strong>Order Verification:</strong> All Cash on Delivery orders undergo quick verification via WhatsApp or phone call prior to courier handover.
            </p>
          </div>
        </div>

        {/* 7-Day Return & Replacement Policy */}
        <div className="p-8 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
          <div className="flex items-center gap-3 text-white border-b border-[#222222] pb-4">
            <RotateCcw className="w-6 h-6 text-[#D4AF37]" />
            <h2 className="text-xl font-bold">7-Day Checking Warranty</h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-[#A1A1A1] leading-relaxed">
            <p>
              • <strong>Coverage:</strong> If you receive an item with any manufacturing defect, physical transit damage, or functional failure, you are eligible for an immediate replacement within <strong>7 days</strong> of delivery.
            </p>
            <p>
              • <strong>Return Conditions:</strong> The product must be returned with its original packaging, cables, charging case, and warranty cards intact.
            </p>
            <p>
              • <strong>Process:</strong> Simply take a short video showing the issue and message our WhatsApp support desk at <strong>0315-2720915</strong>. Our claims team will process your exchange within 48 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
