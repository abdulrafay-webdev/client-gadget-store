"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const whatsappNumber = process.env.NEXT_PUBLIC_STORE_WHATSAPP || "03152720915";
  const cleanNumber = whatsappNumber.replace(/\D/g, "");
  const formattedNumber = cleanNumber.startsWith("0") ? `92${cleanNumber.slice(1)}` : cleanNumber;
  const message = encodeURIComponent("Hello Hamza Gadgets! I would like to inquire about your products.");

  return (
    <aside
      aria-label="Direct WhatsApp Contact Support"
      className="fixed bottom-6 right-6 z-50 flex items-center group pointer-events-auto"
    >
      <span className="mr-3 px-3 py-1.5 rounded-full bg-[#141414]/90 backdrop-blur-md border border-[#2A2A2A] text-xs font-semibold text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-2 group-hover:translate-x-0 hidden sm:inline-block">
        Chat with us on WhatsApp
      </span>
      <a
        href={`https://wa.me/${formattedNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_28px_rgba(37,211,102,0.6)] hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        <MessageCircle className="w-7 h-7 fill-white stroke-none relative z-10" />
      </a>
    </aside>
  );
}
