"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, Category, ProductListResponse } from "@/types";
import { api } from "@/lib/api";
import { formatPKR } from "@/lib/utils";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Package,
  AlertTriangle,
  Loader2
} from "lucide-react";

export default function AdminProductsPage() {
  const [data, setData] = useState<ProductListResponse>({
    items: [],
    total: 0,
    page: 1,
    limit: 20,
    total_pages: 1,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        api.getAdminProducts({ page, limit: 20, search: search || undefined, category_id: categoryId || undefined }),
        api.getAdminCategories(),
      ]);
      setData(prods);
      setCategories(cats);
    } catch (e) {
      console.error("Failed to load admin products", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, categoryId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"? All associated images will also be removed from ImageKit.`)) {
      return;
    }
    setDeletingId(productId);
    try {
      await api.deleteProduct(productId);
      fetchProducts();
    } catch (e: any) {
      alert(e.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Product <span className="text-[#D4AF37]">Catalog</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1A1] mt-1">
            Manage gadgets inventory, pricing in PKR, specifications, and ImageKit assets.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="btn-gold py-2.5 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 self-start sm:self-auto shadow-[0_0_15px_rgba(212,175,55,0.2)]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Gadget</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#111111] border border-[#222222] flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-[#666666] focus:outline-none focus:border-[#D4AF37]"
          />
          <Search className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-2.5" />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto bg-[#181818] border border-[#2A2A2A] text-white text-xs rounded-xl py-2 px-3 focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
        {loading ? (
          <div className="py-16 text-center text-[#A1A1A1] flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" />
            <span className="text-xs">Loading gadgets catalog...</span>
          </div>
        ) : data.items.length === 0 ? (
          <div className="py-16 text-center text-[#A1A1A1] space-y-2">
            <Package className="w-10 h-10 mx-auto text-[#666666]" />
            <p className="text-sm font-bold text-white">No products found</p>
            <p className="text-xs">Add your first gadget product to populate the catalog.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161616] text-[#888888] uppercase tracking-wider border-b border-[#222222]">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C1C]">
                {data.items.map((prod) => {
                  const thumb = prod.images?.[0]?.image_url || "/placeholder-gadget.png";

                  return (
                    <tr key={prod.id} className="hover:bg-[#141414] transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg bg-[#181818] border border-[#2A2A2A] overflow-hidden shrink-0 flex items-center justify-center p-1">
                            <Image
                              src={thumb}
                              alt={prod.name}
                              fill
                              className="object-contain p-1"
                              sizes="48px"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/product/${prod.slug}`}
                              target="_blank"
                              className="font-bold text-white hover:text-[#D4AF37] transition flex items-center gap-1 line-clamp-1"
                            >
                              <span>{prod.name}</span>
                              <ExternalLink className="w-3 h-3 text-[#666666]" />
                            </Link>
                            {prod.is_featured && (
                              <span className="text-[10px] text-[#D4AF37] font-semibold">
                                ★ Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[#A1A1A1]">{prod.sku}</td>

                      <td className="py-3.5 px-4 text-[#A1A1A1]">
                        {prod.category_name || "Uncategorized"}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#D4AF37]">
                          {formatPKR(prod.discount_price || prod.price)}
                        </div>
                        {prod.discount_price && (
                          <span className="text-[10px] text-[#666666] line-through block">
                            {formatPKR(prod.price)}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {prod.stock <= 5 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-800">
                            <AlertTriangle className="w-3 h-3" /> {prod.stock} left
                          </span>
                        ) : (
                          <span className="font-semibold text-white">{prod.stock} units</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {prod.is_active ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#777777]">
                            <XCircle className="w-3.5 h-3.5" /> Inactive
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/admin/products/${prod.id}/edit`}
                            className="p-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#D4AF37] text-white hover:text-black border border-[#2A2A2A] transition"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            disabled={deletingId === prod.id}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/80 text-red-300 border border-red-900/60 transition disabled:opacity-30"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
