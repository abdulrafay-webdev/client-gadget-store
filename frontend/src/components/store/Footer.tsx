import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Shield, Truck, RefreshCw, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[#222222] text-[#A1A1A1] pt-16 pb-10">
      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-[#1E1E1E]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#111111] border border-[#2A2A2A] flex items-center justify-center text-[#D4AF37] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Nationwide COD</h4>
              <p className="text-xs text-[#A1A1A1]">Cash on delivery in 2-4 days</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#111111] border border-[#2A2A2A] flex items-center justify-center text-[#D4AF37] shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Genuine</h4>
              <p className="text-xs text-[#A1A1A1]">Authentic premium gadgets</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#111111] border border-[#2A2A2A] flex items-center justify-center text-[#D4AF37] shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">7 Days Checking</h4>
              <p className="text-xs text-[#A1A1A1]">Hassle-free replacement policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#111111] border border-[#2A2A2A] flex items-center justify-center text-[#D4AF37] shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Luxury Quality</h4>
              <p className="text-xs text-[#A1A1A1]">Tested for maximum durability</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">
        {/* Brand Info */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-black/40 border border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.2)] flex items-center justify-center group-hover:border-[#D4AF37] transition-all">
              <Image
                src="/logo.png"
                alt="Hamza Gadgets Logo"
                width={40}
                height={40}
                className="object-contain w-full h-full p-1"
              />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              HAMZA <span className="text-[#D4AF37]">GADGETS</span>
            </span>
          </Link>
          <p className="text-sm text-[#888888] leading-relaxed">
            Pakistan’s premier destination for luxury tech essentials. Engineered for superior audio, endurance, and everyday sophistication.
          </p>
          <div className="pt-2 text-xs text-[#A1A1A1]">
            <span className="text-white font-medium">Customer Support Hours:</span> Mon – Sat: 11:00 AM – 9:00 PM
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-2">
            Explore Gadgets
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/shop?category=wireless-earbuds" className="hover:text-[#D4AF37] transition">
                Wireless Earbuds & Audio
              </Link>
            </li>
            <li>
              <Link href="/shop?category=smartwatches" className="hover:text-[#D4AF37] transition">
                AMOLED Smartwatches
              </Link>
            </li>
            <li>
              <Link href="/shop?category=power-banks" className="hover:text-[#D4AF37] transition">
                Fast Power Banks
              </Link>
            </li>
            <li>
              <Link href="/shop?category=chargers-adapters" className="hover:text-[#D4AF37] transition">
                GaN Fast Wall Chargers
              </Link>
            </li>
            <li>
              <Link href="/shop?category=cables-hubs" className="hover:text-[#D4AF37] transition">
                Braided Cables & Hubs
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-2">
            Customer Care
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/track-order" className="text-[#D4AF37] font-medium hover:underline">
                Track Your Order
              </Link>
            </li>
            <li>
              <Link href="/shipping-returns" className="hover:text-[#D4AF37] transition">
                Shipping & Returns Policy
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#D4AF37] transition">
                About Hamza Gadget Store
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-[#D4AF37] transition">
                Privacy & Data Policy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#D4AF37] transition">
                Contact & Complaints
              </Link>
            </li>
          </ul>
        </div>

        {/* Direct Contact & WhatsApp */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-2">
            Contact & Location
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>Shop #4, Gadget Plaza, Hall Road, Lahore, Pakistan</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <a href="tel:+923152720915" className="hover:text-white transition">
                0315-2720915
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <a href="mailto:hamzagadgethouse@gmail.com" className="hover:text-white transition">
                hamzagadgethouse@gmail.com
              </a>
            </li>
          </ul>

          <div className="mt-5">
            <a
              href="https://wa.me/923152720915"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full text-xs py-2.5"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Sub-footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#1C1C1C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777777]">
        <p>© {new Date().getFullYear()} Hamza Gadget Store. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span>Curated for Tech Enthusiasts in Pakistan</span>
          <Link href="/admin/login" className="hover:text-[#D4AF37] transition">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
