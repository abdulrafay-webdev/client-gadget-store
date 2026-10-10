"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  LogOut,
  Sparkles
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Layers },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Hero Banners", href: "/admin/banners", icon: ImageIcon },
  { label: "Store Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout, admin } = useAdminAuth();

  return (
    <aside className="w-64 bg-[#0A0A0A] border-r border-[#222222] flex flex-col justify-between h-screen sticky top-0 shrink-0 z-30">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#222222]">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-black/40 border border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.25)] flex items-center justify-center group-hover:border-[#D4AF37] transition-all">
              <Image
                src="/logo.png"
                alt="Hamza Gadget Admin Logo"
                width={40}
                height={40}
                className="object-contain w-full h-full p-1"
              />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block">
                HAMZA <span className="text-[#D4AF37]">ADMIN</span>
              </span>
              <span className="text-[10px] text-[#777777] uppercase tracking-wider block">
                Control Center
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                    : "text-[#A1A1A1] hover:text-white hover:bg-[#141414]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Actions */}
      <div className="p-4 border-t border-[#222222] space-y-3">
        {/* View Storefront */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#141414] hover:bg-[#1A1A1A] text-xs text-[#A1A1A1] hover:text-[#D4AF37] border border-[#222222] transition"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" /> View Live Store
          </span>
          <span className="text-[10px] text-[#666666]">Storefront</span>
        </Link>

        {/* User Card */}
        {admin && (
          <div className="px-3 py-2 text-xs">
            <div className="font-bold text-white truncate">{admin.full_name}</div>
            <div className="text-[11px] text-[#777777] truncate">{admin.email}</div>
          </div>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-bold border border-red-900/50 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
