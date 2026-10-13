"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Zap,
  Clock,
  ChevronDown,
  LayoutGrid,
  Radio
} from "lucide-react";
import { api } from "@/lib/api";
import { Category } from "@/types";

// Default categories fallback with correct spellings
const DEFAULT_CATEGORIES = [
  { name: "Smart Watches", slug: "smart-watches" },
  { name: "Watches", slug: "watches" },
  { name: "AirPods & Earbuds", slug: "airpods-earbuds" },
  { name: "Chargers", slug: "chargers" },
  { name: "Cables", slug: "cables" },
  { name: "Power Banks", slug: "power-banks" },
  { name: "Mobile Covers", slug: "mobile-covers" },
  { name: "Tempered Glass", slug: "tempered-glass" },
  { name: "Headphones & Handsfree", slug: "headphones-handsfree" },
  { name: "Speakers", slug: "speakers" },
  { name: "Mobile Holders", slug: "mobile-holders" },
  { name: "Gaming Accessories", slug: "gaming-accessories" },
  { name: "Memory Cards", slug: "memory-cards" },
  { name: "USB / OTG", slug: "usb-otg" },
  { name: "Car Accessories", slug: "car-accessories" },
];

export function Navbar() {
  const { totalItems, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>(DEFAULT_CATEGORIES);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch live categories from backend
  useEffect(() => {
    let isMounted = true;
    api.getCategories()
      .then((data: Category[]) => {
        if (isMounted && data && data.length > 0) {
          setCategories(data.map((c) => ({ name: c.name, slug: c.slug })));
        }
      })
      .catch(() => {
        // Fallback to default categories
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
      setIsCategoriesOpen(false);
    }
  };

  const handleCategoryClick = (slug: string) => {
    router.push(`/shop?category=${slug}`);
    setIsCategoriesOpen(false);
    setIsMobileMenuOpen(false);
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
          <a
            href="https://whatsapp.com/channel/0029Vb9HelgCnA7miThMdt16"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#D4AF37] transition flex items-center gap-1 text-[#A1A1A1]"
          >
            <Radio className="w-3 h-3 text-[#25D366]" /> WhatsApp Channel
          </a>
          <Link href="/track-order" className="hover:text-[#D4AF37] transition flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#D4AF37]" /> Track Order
          </Link>
          <a
            href="https://wa.me/923121080916"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#D4AF37] transition flex items-center gap-1 text-[#D4AF37] font-semibold"
          >
            <Phone className="w-3 h-3" /> WhatsApp: 0312-1080916
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
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-[#A1A1A1]">
            <Link href="/" className="hover:text-[#D4AF37] transition">
              Home
            </Link>

            {/* Categories Dropdown Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className={`flex items-center gap-1.5 py-2 px-3 rounded-lg border transition font-semibold ${
                  isCategoriesOpen
                    ? "bg-[#181818] border-[#D4AF37] text-[#D4AF37]"
                    : "border-transparent hover:border-[#333333] hover:text-[#D4AF37] text-white"
                }`}
                aria-expanded={isCategoriesOpen}
              >
                <LayoutGrid className="w-4 h-4 text-[#D4AF37]" />
                <span>Categories</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isCategoriesOpen ? "rotate-180 text-[#D4AF37]" : ""
                  }`}
                />
              </button>

              {/* Categories Floating Mega Menu */}
              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 max-h-[480px] overflow-y-auto bg-[#111111]/98 backdrop-blur-xl border border-[#2A2A2A] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-3 z-50 scrollbar-thin">
                  <div className="px-3 py-2 border-b border-[#222222] mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
                      Browse All Categories
                    </span>
                    <Link
                      href="/shop"
                      onClick={() => setIsCategoriesOpen(false)}
                      className="text-[11px] text-[#A1A1A1] hover:text-white"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => handleCategoryClick(cat.slug)}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-white hover:bg-[#1A1A1A] hover:text-[#D4AF37] transition flex items-center justify-between group"
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[#555555] group-hover:text-[#D4AF37] transition text-xs">
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/shop" className="hover:text-[#D4AF37] transition">
              All Gadgets
            </Link>
            <Link href="/about" className="hover:text-[#D4AF37] transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-[#D4AF37] transition">
              Contact
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

          {/* Mobile Categories Accordion */}
          <div className="border-b border-[#222222] pb-2">
            <button
              onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
              className="w-full flex items-center justify-between py-2 text-white font-medium hover:text-[#D4AF37]"
            >
              <span className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-[#D4AF37]" />
                <span>Categories</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#A1A1A1] transition-transform ${
                  isMobileCategoriesOpen ? "rotate-180 text-[#D4AF37]" : ""
                }`}
              />
            </button>
            {isMobileCategoriesOpen && (
              <div className="pl-3 py-2 space-y-1 bg-[#141414] rounded-xl my-2 max-h-64 overflow-y-auto border border-[#222222]">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategoryClick(cat.slug)}
                    className="w-full text-left py-2 px-2 text-xs text-[#A1A1A1] hover:text-[#D4AF37] hover:bg-[#1A1A1A] rounded block truncate"
                  >
                    • {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/track-order"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-[#D4AF37] font-medium"
          >
            Track Order
          </Link>
          <a
            href="https://whatsapp.com/channel/0029Vb9HelgCnA7miThMdt16"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-[#25D366] font-medium"
          >
            Official WhatsApp Channel
          </a>
          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-[#A1A1A1] hover:text-white"
          >
            About Hamza Gadget Store
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
