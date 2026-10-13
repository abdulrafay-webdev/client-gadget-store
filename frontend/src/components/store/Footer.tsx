"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Shield, Truck, RefreshCw, Award, Radio } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#222222] text-[#A1A1A1] pt-16 pb-12 mt-20">
      {/* Trust & Guarantee Badges Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#1C1C1C] mb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#2A2A2A] flex items-center justify-center text-[#D4AF37] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Cash on Delivery</h4>
              <p className="text-xs text-[#777777]">Pay upon physical arrival nationwide</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#2A2A2A] flex items-center justify-center text-[#D4AF37] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Genuine Tech</h4>
              <p className="text-xs text-[#777777]">Rigorous quality verification</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#2A2A2A] flex items-center justify-center text-[#D4AF37] shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">7-Day Warranty</h4>
              <p className="text-xs text-[#777777]">Smooth checking & replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#2A2A2A] flex items-center justify-center text-[#D4AF37] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Priority Assistance</h4>
              <p className="text-xs text-[#777777]">Direct WhatsApp support desk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">
        {/* Brand Info & Social Links */}
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

          {/* Social Media Channels */}
          <div className="pt-2 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block">
              Follow Our Channels
            </span>
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1Egkytf2Gd/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Page"
                className="w-9 h-9 rounded-xl bg-[#141414] border border-[#2A2A2A] hover:border-[#1877F2] text-[#A1A1A1] hover:text-[#1877F2] flex items-center justify-center transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/hamzagadgetstore?dlrf=MXYwdTJsazJ1OTg3YQ=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                className="w-9 h-9 rounded-xl bg-[#141414] border border-[#2A2A2A] hover:border-[#E4405F] text-[#A1A1A1] hover:text-[#E4405F] flex items-center justify-center transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@hamzagadget.store?_r=1&_t=ZS-9AUywpQ8HEC"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok Account"
                className="w-9 h-9 rounded-xl bg-[#141414] border border-[#2A2A2A] hover:border-white text-[#A1A1A1] hover:text-white flex items-center justify-center transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.87-4.47V8.6a8.16 8.16 0 0 0 4.9 1.63v-3.54z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@hamzagadgetstore-78?si=Nfl_Vl4erm3TsHGh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Channel"
                className="w-9 h-9 rounded-xl bg-[#141414] border border-[#2A2A2A] hover:border-[#FF0000] text-[#A1A1A1] hover:text-[#FF0000] flex items-center justify-center transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* WhatsApp Channel */}
              <a
                href="https://whatsapp.com/channel/0029Vb9HelgCnA7miThMdt16"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Channel"
                className="w-9 h-9 rounded-xl bg-[#141414] border border-[#2A2A2A] hover:border-[#25D366] text-[#A1A1A1] hover:text-[#25D366] flex items-center justify-center transition-all hover:scale-105"
              >
                <Radio className="w-4 h-4 text-[#25D366]" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-2">
            Popular Categories
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/shop?category=smart-watches" className="hover:text-[#D4AF37] transition">
                Smart Watches & Bands
              </Link>
            </li>
            <li>
              <Link href="/shop?category=airpods-earbuds" className="hover:text-[#D4AF37] transition">
                AirPods & Wireless Earbuds
              </Link>
            </li>
            <li>
              <Link href="/shop?category=power-banks" className="hover:text-[#D4AF37] transition">
                Fast Power Banks
              </Link>
            </li>
            <li>
              <Link href="/shop?category=chargers" className="hover:text-[#D4AF37] transition">
                GaN Wall Chargers
              </Link>
            </li>
            <li>
              <Link href="/shop?category=cables" className="hover:text-[#D4AF37] transition">
                PD & Fast Charging Cables
              </Link>
            </li>
            <li>
              <Link href="/shop?category=gaming-accessories" className="hover:text-[#D4AF37] transition">
                Gaming Accessories
              </Link>
            </li>
          </ul>
        </div>

        {/* Policies & Assistance */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-2">
            Help & Information
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
            Contact & Support
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>Shop #4, Gadget Plaza, Hall Road, Lahore, Pakistan</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <a href="tel:+923121080916" className="hover:text-white transition">
                0312-1080916
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <a href="mailto:hamzagadgetstore@gmail.com" className="hover:text-white transition">
                hamzagadgetstore@gmail.com
              </a>
            </li>
          </ul>

          <div className="mt-5 space-y-2">
            <a
              href="https://wa.me/923121080916"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full text-xs py-2.5 flex items-center justify-center gap-2"
            >
              <span>Chat on WhatsApp</span>
            </a>
            <a
              href="https://whatsapp.com/channel/0029Vb9HelgCnA7miThMdt16"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold-outline w-full text-xs py-2 flex items-center justify-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Join WhatsApp Channel</span>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Sub-footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#1C1C1C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777777]">
        <p>© {new Date().getFullYear()} Hamza Gadget Store. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span>Official Social & Customer Care Verified</span>
          <Link href="/admin/login" className="hover:text-[#D4AF37] transition">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
