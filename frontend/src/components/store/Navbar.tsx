"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Phone,
  ShieldCheck,
  Zap,
  Clock
} from "lucide-react";

export function Navbar() {
  const { totalItems, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#222222]">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#111111] border-b border-[#222222]/60 px-4 py-1.5 text-xs text-[#A1A1A1] flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Cash on Delivery Available Nationwide in Pakistan</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs">
          <Link href="/track-order" className="hover:text-[#D4AF37] transition flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#D4AF37]" /> Track Order
          </Link>
          <a
            href="https://wa.me/923152720915"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#D4AF37] transition flex items-center gap-1 text-[#D4AF37]"
          >
            <Phone className="w-3 h-3" /> WhatsApp: 0315-2720915
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-black/40 border border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.25)] flex items-center justify-center group-hover:border-[#D4AF37] transition-all">
              <Image
                src="/logo.png"
                alt="Hamza Gadgets Logo"
                width={44}
                height={44}
                className="object-contain w-full h-full p-1"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                HAMZA <span className="text-[#D4AF37]">GADGETS</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#A1A1A1]">
                Luxury Tech Pakistan
              </span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-6 relative"
          >
            <input
              type="text"
              placeholder="Search earbuds, smartwatches, fast chargers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141414] border border-[#2A2A2A] rounded-full py-2.5 pl-11 pr-4 text-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition"
            />
            <Search className="w-4 h-4 text-[#A1A1A1] absolute left-4 top-3.5" />
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#A1A1A1]">
            <Link href="/" className="hover:text-[#D4AF37] transition">
              Home
            </Link>
            <Link href="/shop" className="hover:text-[#D4AF37] transition">
              All Gadgets
            </Link>
            <Link href="/shop?category=wireless-earbuds" className="hover:text-[#D4AF37] transition">
              Earbuds
            </Link>
            <Link href="/shop?category=smartwatches" className="hover:text-[#D4AF37] transition">
              Smartwatches
            </Link>
            <Link href="/shop?category=power-banks" className="hover:text-[#D4AF37] transition">
              Power Banks
            </Link>
            <Link href="/about" className="hover:text-[#D4AF37] transition">
              About
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-xl bg-[#141414] border border-[#2A2A2A] hover:border-[#D4AF37] text-white hover:text-[#D4AF37] transition group"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-[#141414] border border-[#2A2A2A] text-white"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search gadgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141414] border border-[#2A2A2A] rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#D4AF37]"
            />
            <Search className="w-4 h-4 text-[#A1A1A1] absolute left-3.5 top-3" />
          </form>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0F0F0F] border-b border-[#2A2A2A] px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-white hover:text-[#D4AF37] font-medium border-b border-[#222222]"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-white hover:text-[#D4AF37] font-medium border-b border-[#222222]"
          >
            All Gadgets
          </Link>
          <Link
            href="/shop?category=wireless-earbuds"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-[#A1A1A1] hover:text-[#D4AF37]"
          >
            Wireless Earbuds
          </Link>
          <Link
            href="/shop?category=smartwatches"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-[#A1A1A1] hover:text-[#D4AF37]"
          >
            Smartwatches
          </Link>
          <Link
            href="/shop?category=power-banks"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-[#A1A1A1] hover:text-[#D4AF37]"
          >
            Power Banks
          </Link>
          <Link
            href="/shop?category=chargers-adapters"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-[#A1A1A1] hover:text-[#D4AF37]"
          >
            Fast Chargers
          </Link>
          <Link
            href="/track-order"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-[#D4AF37] font-medium"
          >
            Track Order
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-[#A1A1A1] hover:text-white"
          >
            Contact & Support
          </Link>
        </div>
      )}
    </header>
  );
}
