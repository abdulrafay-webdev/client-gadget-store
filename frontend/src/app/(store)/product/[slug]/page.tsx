"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Product } from "@/types";
import { api } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { formatPKR, calculateDiscountPercent } from "@/lib/utils";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ProductCard } from "@/components/store/ProductCard";
import {
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RefreshCw,
  Plus,
  Minus,
  CheckCircle2,
  ChevronRight,
  ArrowLeft
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const p = await api.getProduct(slug);
        setProduct(p);
        const related = await api.getRelatedProducts(slug, 4);
        setRelatedProducts(related);
      } catch (e) {
        console.error("Failed to load product", e);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-8">
        <div className="h-6 w-1/4 bg-[#1C1C1C] rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-[#141414] rounded-2xl" />
          <div className="space-y-6">
            <div className="h-8 w-3/4 bg-[#1C1C1C] rounded" />
            <div className="h-6 w-1/3 bg-[#1C1C1C] rounded" />
            <div className="h-24 w-full bg-[#161616] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
        <p className="text-sm text-[#A1A1A1]">The gadget you are searching for does not exist or has been removed.</p>
        <Link href="/shop" className="btn-gold inline-flex text-sm py-2 px-6">
          Back to Shop
        </Link>
      </div>
    );
  }

  const effectivePrice = product.discount_price || product.price;
  const discountPercent = calculateDiscountPercent(product.price, product.discount_price);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#888888]">
        <Link href="/" className="hover:text-white transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-white transition">Shop</Link>
        {product.category_name && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/shop?category=${product.category_id}`} className="hover:text-white transition">
              {product.category_name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#D4AF37] font-medium line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left: Gallery */}
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Details & Buying Box */}
        <div className="space-y-6">
          {/* Header & Badges */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {discountPercent > 0 && (
                <span className="bg-[#D4AF37] text-black text-xs font-black uppercase px-2.5 py-0.5 rounded shadow">
                  Save {discountPercent}%
                </span>
              )}
              {product.stock > 0 ? (
                <span className="bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="bg-red-950 border border-red-800 text-red-400 text-xs font-semibold px-2.5 py-0.5 rounded">
                  Out of Stock
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {product.name}
            </h1>
            <p className="text-xs text-[#777777] mt-1 font-mono">SKU: {product.sku}</p>
          </div>

          {/* Pricing Highlight */}
          <div className="p-4 rounded-xl bg-[#121212] border border-[#222222] flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-black text-[#D4AF37]">
              {formatPKR(effectivePrice)}
            </span>
            {product.discount_price && product.discount_price < product.price && (
              <span className="text-base text-[#666666] line-through font-medium">
                {formatPKR(product.price)}
              </span>
            )}
            <span className="text-xs text-[#888888] ml-auto">Inclusive of all taxes</span>
          </div>

          {/* Description */}
          <div className="prose prose-invert text-sm text-[#A1A1A1] leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Quantity Selector & Action CTAs */}
          <div className="space-y-4 pt-4 border-t border-[#222222]">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center bg-[#161616] border border-[#333333] rounded-xl">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-[#A1A1A1] hover:text-[#D4AF37] transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-white min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="p-2 text-[#A1A1A1] hover:text-[#D4AF37] transition disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-gold-outline py-3.5 text-sm font-bold flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{added ? "Added to Cart!" : "Add to Cart"}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="btn-gold py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now (Cash on Delivery)</span>
              </button>
            </div>
          </div>

          {/* Delivery & Assurance Strip */}
          <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] space-y-2.5 text-xs text-[#A1A1A1]">
            <div className="flex items-center gap-2.5 text-white">
              <Truck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span><strong>Cash on Delivery (COD)</strong> delivered in 2–4 business days across Pakistan.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>100% Original product tested for performance & durability.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>7-Day Hassle-free Checking Warranty & exchange support.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="pt-10 border-t border-[#222222] space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Technical Details
            </span>
            <h2 className="text-2xl font-extrabold text-white">Product Specifications</h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#222222] bg-[#111111]">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-[#1F1F1F]">
                {Object.entries(product.specs).map(([key, val], idx) => (
                  <tr key={key} className={idx % 2 === 0 ? "bg-[#111111]" : "bg-[#141414]"}>
                    <td className="py-3.5 px-6 font-semibold text-[#D4AF37] w-1/3 text-xs sm:text-sm">
                      {key}
                    </td>
                    <td className="py-3.5 px-6 text-[#E0E0E0] text-xs sm:text-sm font-medium">
                      {String(val)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-[#222222] space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Similar Tech
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-1">Related Gadgets You May Like</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((relProd) => (
              <ProductCard key={relProd.id} product={relProd} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
