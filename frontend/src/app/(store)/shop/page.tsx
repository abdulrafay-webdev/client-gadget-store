"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product, Category, ProductListResponse } from "@/types";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/store/ProductCard";
import { SkeletonGrid } from "@/components/store/SkeletonCard";
import { Search, Filter, SlidersHorizontal, X, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";
  const initialSort = searchParams.get("sort") || "newest";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [productsData, setProductsData] = useState<ProductListResponse>({
    items: [],
    total: 0,
    page: 1,
    limit: 12,
    total_pages: 1,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortOption, setSortOption] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Load categories once
  useEffect(() => {
    async function fetchCategories() {
      try {
        const cats = await api.getCategories();
        setCategories(cats);
      } catch (e) {
        console.error("Failed to load categories", e);
      }
    }
    fetchCategories();
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await api.getProducts({
          page: currentPage,
          limit: 12,
          category: selectedCategory || undefined,
          search: searchQuery || undefined,
          sort: sortOption,
        });
        setProductsData(res);
      } catch (e) {
        console.error("Failed to fetch products", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory, searchQuery, sortOption, currentPage]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug === selectedCategory ? "" : slug);
    setCurrentPage(1);
    setIsMobileFilterOpen(false);
  };

  const resetFilters = () => {
    setSelectedCategory("");
    setSearchQuery("");
    setSortOption("newest");
    setCurrentPage(1);
    router.push("/shop");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Top Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Gadgets <span className="text-[#D4AF37]">Catalog</span>
          </h1>
          <p className="text-sm text-[#A1A1A1] mt-1">
            Showing {productsData.total} premium gadget{productsData.total === 1 ? "" : "s"} across Pakistan
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden p-2.5 rounded-xl bg-[#141414] border border-[#2A2A2A] text-white flex items-center gap-2 text-sm font-medium"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
            Filters
          </button>

          <div className="flex items-center gap-2">
            <label className="text-xs text-[#888888] hidden sm:block">Sort by:</label>
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#141414] border border-[#2A2A2A] text-white text-xs sm:text-sm rounded-xl py-2 px-3 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block space-y-6">
          <div className="p-5 rounded-2xl bg-[#111111] border border-[#222222] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#D4AF37]" /> Filter By
              </h3>
              {(selectedCategory || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold text-[#A1A1A1] uppercase tracking-wider mb-3">
                Categories
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleCategorySelect("")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    selectedCategory === ""
                      ? "bg-[#D4AF37] text-black"
                      : "text-[#A1A1A1] hover:text-white hover:bg-[#1A1A1A]"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
                      selectedCategory === cat.slug
                        ? "bg-[#D4AF37] text-black"
                        : "text-[#A1A1A1] hover:text-white hover:bg-[#1A1A1A]"
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat.product_count !== undefined && (
                      <span className="text-[10px] opacity-70">({cat.product_count})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Keyword Search */}
            <div>
              <h4 className="text-xs font-bold text-[#A1A1A1] uppercase tracking-wider mb-3">
                Keyword Search
              </h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter name or specs..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#D4AF37]"
                />
                <Search className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-2.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filters Modal */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center md:hidden">
            <div className="w-full max-w-sm bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
                <h3 className="text-base font-bold text-white">Filter Categories</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-[#A1A1A1] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                <button
                  onClick={() => handleCategorySelect("")}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                    selectedCategory === "" ? "bg-[#D4AF37] text-black" : "text-white bg-[#1A1A1A]"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                      selectedCategory === cat.slug ? "bg-[#D4AF37] text-black" : "text-white bg-[#1A1A1A]"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 btn-gold-outline text-xs py-2.5"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 btn-gold text-xs py-2.5"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="md:col-span-3 space-y-8">
          {/* Active Filter Chips */}
          {(selectedCategory || searchQuery) && (
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[#888888]">Active Filters:</span>
              {selectedCategory && (
                <span className="bg-[#1A1A1A] border border-[#333333] text-[#D4AF37] px-3 py-1 rounded-full flex items-center gap-1.5 font-medium">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory("")}>
                    <X className="w-3 h-3 hover:text-white" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="bg-[#1A1A1A] border border-[#333333] text-[#D4AF37] px-3 py-1 rounded-full flex items-center gap-1.5 font-medium">
                  Search: &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery("")}>
                    <X className="w-3 h-3 hover:text-white" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-[#A1A1A1] hover:text-[#D4AF37] underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {loading ? (
            <SkeletonGrid count={9} />
          ) : productsData.items.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {productsData.items.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="p-16 rounded-2xl bg-[#111111] border border-[#222222] text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#181818] border border-[#2A2A2A] flex items-center justify-center text-[#D4AF37]">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">No products found</h3>
              <p className="text-sm text-[#A1A1A1] max-w-md mx-auto">
                We couldn&apos;t find any gadgets matching your criteria. Try adjusting the keywords or clear your filters.
              </p>
              <button onClick={resetFilters} className="btn-gold text-xs py-2 px-6">
                Reset Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {productsData.total_pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8 border-t border-[#222222]">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2.5 rounded-xl bg-[#141414] border border-[#2A2A2A] text-white hover:border-[#D4AF37] disabled:opacity-30 disabled:hover:border-[#2A2A2A] transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: productsData.total_pages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition ${
                      currentPage === pageNum
                        ? "bg-[#D4AF37] text-black shadow-lg"
                        : "bg-[#141414] border border-[#2A2A2A] text-white hover:border-[#D4AF37]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={currentPage >= productsData.total_pages}
                onClick={() => setCurrentPage((p) => Math.min(productsData.total_pages, p + 1))}
                className="p-2.5 rounded-xl bg-[#141414] border border-[#2A2A2A] text-white hover:border-[#D4AF37] disabled:opacity-30 disabled:hover:border-[#2A2A2A] transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12"><SkeletonGrid count={8} /></div>}>
      <ShopContent />
    </Suspense>
  );
}
