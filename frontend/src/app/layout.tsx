import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Hamza Gadget Store | Luxury Tech & Premium Gadgets Pakistan",
  description: "Shop premium wireless earbuds, AMOLED smartwatches, GaN fast chargers, high-capacity power banks, and tech accessories with Cash on Delivery across Pakistan.",
  keywords: [
    "Hamza Gadget Store",
    "Earbuds Pakistan",
    "Smartwatches Pakistan",
    "Fast Chargers Pakistan",
    "Power Banks Pakistan",
    "Gadgets COD Pakistan",
  ],
  authors: [{ name: "Hamza Gadget Store" }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Hamza Gadget Store | Luxury Tech & Premium Gadgets Pakistan",
    description: "Shop top-tier gadgets with nationwide Cash on Delivery and 7-day checking warranty.",
    type: "website",
    locale: "en_PK",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-white">
        <AdminAuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
