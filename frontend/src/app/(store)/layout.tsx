import React from "react";
import { Navbar } from "@/components/store/Navbar";
import { Footer } from "@/components/store/Footer";
import { CartDrawer } from "@/components/store/CartDrawer";
import { WhatsAppButton } from "@/components/store/WhatsAppButton";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white selection:bg-[#D4AF37] selection:text-black">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}
