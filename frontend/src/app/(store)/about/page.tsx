import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Award, Truck, Zap, Headphones, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Intro */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden bg-black/50 border border-[#D4AF37]/30 shadow-[0_0_25px_rgba(212,175,55,0.25)] flex items-center justify-center p-2">
          <Image
            src="/logo.png"
            alt="Hamza Gadget Store Logo"
            width={72}
            height={72}
            className="object-contain w-full h-full"
            priority
          />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
          Our Legacy & Vision
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Welcome to <span className="gold-gradient-text">Hamza Gadget Store</span>
        </h1>
        <p className="text-base text-[#A1A1A1] leading-relaxed">
          Founded with a passion for cutting-edge technology, Hamza Gadget Store is Pakistan’s dedicated portal for high-performance audio, premium wearable tech, and lightning-fast charging accessories.
        </p>
      </div>

      {/* Hero Visual Card */}
      <div className="relative aspect-16/9 w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#2A2A2A] bg-[#141414] shadow-2xl">
        <Image
          src="/about.jpeg"
          alt="About Hamza Gadget Store"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="object-cover object-center"
        />
      </div>

      {/* Mission Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#2E2E2E] flex items-center justify-center text-[#D4AF37]">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Uncompromising Quality</h3>
          <p className="text-xs sm:text-sm text-[#888888] leading-relaxed">
            We partner only with verified manufacturers to deliver true battery endurance, authentic Bluetooth 5.3 standards, and military-grade durability.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#2E2E2E] flex items-center justify-center text-[#D4AF37]">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Seamless Delivery</h3>
          <p className="text-xs sm:text-sm text-[#888888] leading-relaxed">
            Our nationwide logistics network ensures that whether you reside in Karachi, Lahore, Peshawar, or Gilgit, your package arrives swiftly and safely.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#2E2E2E] flex items-center justify-center text-[#D4AF37]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Customer Satisfaction</h3>
          <p className="text-xs sm:text-sm text-[#888888] leading-relaxed">
            With our 7-day checking warranty and prompt WhatsApp customer assistance, your purchase is completely safeguarded.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-10 rounded-3xl bg-[#121212] border border-[#D4AF37]/30 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Experience the Future of Smart Gadgets</h2>
        <p className="text-sm text-[#A1A1A1] max-w-lg mx-auto">
          Explore our latest collection of true wireless audio, rugged smartwatches, and high-power GaN chargers.
        </p>
        <div className="pt-2">
          <Link href="/shop" className="btn-gold py-3 px-8 text-sm">
            Explore All Gadgets
          </Link>
        </div>
      </div>
    </div>
  );
}
