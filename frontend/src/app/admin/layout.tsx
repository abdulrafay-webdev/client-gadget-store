"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [isLoading, isAuthenticated, isLoginPage, router]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#0A0A0A] text-white">{children}</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center space-y-4 text-white">
        <div className="w-12 h-12 rounded-xl bg-[#141414] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-xs text-[#A1A1A1] font-mono tracking-wider">Verifying Admin Authorization...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-[#0A0A0A] overflow-y-auto">
        <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
