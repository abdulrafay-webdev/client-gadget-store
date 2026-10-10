"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/types";
import { api } from "@/lib/api";
import { ProductForm } from "@/components/admin/ProductForm";
import { Loader2 } from "lucide-react";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const p = await api.getProduct(id);
        setProduct(p);
      } catch (e) {
        console.error("Failed to load product for edit", e);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
        <span className="text-xs text-[#A1A1A1]">Loading product details...</span>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20 text-white">Product not found.</div>;
  }

  return <ProductForm initialData={product} isEdit={true} />;
}
