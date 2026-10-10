"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, Category, Banner } from "@/types";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/store/ProductCard";
import { SkeletonGrid } from "@/components/store/SkeletonCard";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Zap,
  Headphones,
  Watch,
  BatteryCharging,
  Smartphone,
  CheckCircle2,
  Sparkles,
  PhoneCall
} from "lucide-react";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes, banRes] = await Promise.allSettled([
          api.getFeaturedProducts(8),
          api.getCategories(),
          api.getBanners(),
        ]);

        if (prodRes.status === "fulfilled") setFeaturedProducts(prodRes.value);
        if (catRes.status === "fulfilled") setCategories(catRes.value);
        if (banRes.status === "fulfilled") setBanners(banRes.value);
      } catch (e) {
        console.error("Error loading home page data", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const heroBanner = banners[0] || {
    title: "Upgrade Your Tech Lifestyle",
    subtitle: "Discover high-fidelity wireless earbuds, AMOLED smartwatches, and ultra-fast GaN chargers engineered for perfection.",
    badge: "PREMIUM TECH PAKISTAN",
    link_url: "/shop",
    image_url: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1600&q=85",
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#141414] via-[#0D0D0D] to-[#0A0A0A] border-b border-[#222222]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Main Hero Content */}
            <div className="space-y-4 sm:space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] sm:text-xs font-bold tracking-wide uppercase shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{heroBanner.badge || "PREMIUM TECH PAKISTAN"}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Luxury Gadgets. <br className="hidden sm:inline" />
                <span className="gold-gradient-text">Exceptional Performance.</span>
              </h1>

              {/* Mobile-Only Hero Banner Card: Instantly visible on mobile above the fold */}
              <div className="w-full lg:hidden my-1">
                <Link
                  href={heroBanner.link_url || "/shop"}
                  className="block relative aspect-16/10 rounded-2xl overflow-hidden bg-[#161616] border border-[#D4AF37]/40 shadow-[0_0_25px_rgba(212,175,55,0.2)] group"
                >
                  <Image
                    src={heroBanner.image_url}
                    alt={heroBanner.title}
                    fill
                    priority
                    className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-4">
                    <div className="text-left">
                      <span className="bg-[#D4AF37] text-black text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow">
                        Featured Gadget
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1 line-clamp-1">
                        {heroBanner.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>

              <p className="text-xs sm:text-base lg:text-lg text-[#A1A1A1] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {heroBanner.subtitle}
              </p>

              <div className="grid grid-cols-2 sm:flex sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-1 w-full sm:w-auto">
                <Link
                  href="/shop"
                  className="btn-gold py-2.5 sm:py-3.5 px-4 sm:px-8 text-xs sm:text-base shadow-[0_0_20px_rgba(212,175,55,0.25)] flex items-center justify-center gap-1.5 sm:gap-2 group whitespace-nowrap"
                >
                  <span>Explore Gadgets</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition" />
                </Link>
                <Link
                  href="/shop?category=wireless-earbuds"
                  className="btn-gold-outline py-2.5 sm:py-3.5 px-4 sm:px-8 text-xs sm:text-base flex items-center justify-center whitespace-nowrap"
                >
                  Featured Earbuds
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-3 sm:pt-6 border-t border-[#222222]/80 text-center lg:text-left w-full">
                <div className="p-2 sm:p-0 rounded-lg bg-[#141414]/70 sm:bg-transparent border border-[#222222] sm:border-0">
                  <div className="text-sm sm:text-2xl font-black text-white">COD</div>
                  <div className="text-[10px] sm:text-xs text-[#888888] font-medium">Nationwide</div>
                </div>
                <div className="p-2 sm:p-0 rounded-lg bg-[#141414]/70 sm:bg-transparent border border-[#222222] sm:border-0">
                  <div className="text-sm sm:text-2xl font-black text-[#D4AF37]">7 Days</div>
                  <div className="text-[10px] sm:text-xs text-[#888888] font-medium">Warranty</div>
                </div>
                <div className="p-2 sm:p-0 rounded-lg bg-[#141414]/70 sm:bg-transparent border border-[#222222] sm:border-0">
                  <div className="text-sm sm:text-2xl font-black text-white">100%</div>
                  <div className="text-[10px] sm:text-xs text-[#888888] font-medium">Original</div>
                </div>
              </div>
            </div>

            {/* Desktop Hero Image Card (Hidden on mobile) */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden bg-[#161616] border border-[#2A2A2A] shadow-2xl p-2 group hover:border-[#D4AF37]/50 transition-all duration-300">
                <Image
                  src={heroBanner.image_url}
                  alt={heroBanner.title}
                  fill
                  priority
                  className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-xl flex items-end p-6">
                  <div>
                    <span className="bg-[#D4AF37] text-black text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded">
                      Featured Gadget
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                      {heroBanner.title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-[#D4AF37] hover:text-[#E6C65C] flex items-center gap-1 group transition"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group p-3 sm:p-4 rounded-xl bg-[#111111] border border-[#2A2A2A] hover:border-[#D4AF37]/60 hover:bg-[#141414] transition-all duration-300 flex flex-col items-center text-center space-y-2 sm:space-y-3"
              >
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden p-2 group-hover:border-[#D4AF37] transition">
                  <Image
                    src={cat.image_url || "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&q=80"}
                    alt={cat.name}
                    fill
                    className="object-cover rounded-full group-hover:scale-110 transition duration-300"
                    sizes="64px"
                  />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition line-clamp-1">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] sm:text-[11px] text-[#777777] mt-0.5 block">
                    {cat.product_count !== undefined ? `${cat.product_count} Items` : "Explore"}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-[#141414] animate-pulse border border-[#222222]" />
            ))
          )}
        </div>
      </section>

      {/* 3. Featured Products / Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Handpicked Deals
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Featured Tech & Best Sellers
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/shop"
              className="text-xs sm:text-sm font-semibold btn-gold-outline py-2 px-4"
            >
              Browse Complete Catalog
            </Link>
          </div>
        </div>

        {loading ? (
          <SkeletonGrid count={8} />
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[#111111] border border-[#222222]">
            <p className="text-[#A1A1A1]">No featured products available at the moment.</p>
          </div>
        )}
      </section>

      {/* 4. Promotional Banner Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#181818] via-[#141414] to-[#0F0F0F] border border-[#D4AF37]/30 p-8 sm:p-12 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="bg-[#D4AF37] text-black text-xs font-black uppercase px-3 py-1 rounded-md">
                Fast Charging Revolution
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                GaN III Fast Chargers & PD Power Banks
              </h3>
              <p className="text-sm sm:text-base text-[#A1A1A1]">
                Charge your laptops, iPhones, and Android phones in minutes with ultra-safe, high-efficiency GaN technology.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop?category=chargers-adapters"
                  className="btn-gold py-3 px-6 text-sm"
                >
                  Shop Fast Chargers
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#262626] space-y-2">
                <Zap className="w-6 h-6 text-[#D4AF37]" />
                <h4 className="text-sm font-bold text-white">Up to 67W / 100W</h4>
                <p className="text-xs text-[#888888]">Laptop & Smartphone PD fast charge</p>
              </div>
              <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#262626] space-y-2">
                <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
                <h4 className="text-sm font-bold text-white">10-Layer Protection</h4>
                <p className="text-xs text-[#888888]">Smart temperature & surge guard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Hamza Gadgets */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            The Hamza Gadgets Standard
          </span>
          <h2 className="text-3xl font-extrabold text-white">Why Buy From Us?</h2>
          <p className="text-sm text-[#A1A1A1]">
            We bridge the gap between world-class gadget technology and reliable shopping in Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#D4AF37]/40 transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#191919] border border-[#333333] flex items-center justify-center text-[#D4AF37]">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Nationwide COD</h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              Order with complete peace of mind. Pay cash at your doorstep in Karachi, Lahore, Islamabad, Faisalabad, and 200+ cities.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#D4AF37]/40 transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#191919] border border-[#333333] flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Authentic Stock</h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              Every earbud, charger, and smartwatch is strictly checked for original build quality, battery health, and sound clarity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#D4AF37]/40 transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#191919] border border-[#333333] flex items-center justify-center text-[#D4AF37]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">7-Day Checking Warranty</h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              Received a defective item? We offer swift replacement without unnecessary complications.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#D4AF37]/40 transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#191919] border border-[#333333] flex items-center justify-center text-[#D4AF37]">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">WhatsApp Support</h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              Have questions about compatibility or features? Chat directly with our gadget specialists on WhatsApp anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
