"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product, Category } from "@/types";
import { api } from "@/lib/api";
import {
  Upload,
  Trash2,
  Plus,
  Check,
  Star,
  Loader2,
  ArrowLeft,
  X,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

interface ProductFormProps {
  initialData?: Product;
  isEdit?: boolean;
}

interface ImageUploadItem {
  image_url: string;
  image_file_id?: string;
  display_order: number;
  is_thumbnail: boolean;
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  // Form Fields
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [sku, setSku] = useState(initialData?.sku || "");
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : "");
  const [discountPrice, setDiscountPrice] = useState(
    initialData?.discount_price ? String(initialData.discount_price) : ""
  );
  const [stock, setStock] = useState(initialData?.stock !== undefined ? String(initialData.stock) : "10");
  const [description, setDescription] = useState(initialData?.description || "");
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);

  // Dynamic Specs (Key-Value)
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(
    initialData?.specs
      ? Object.entries(initialData.specs).map(([key, value]) => ({ key, value: String(value) }))
      : [
          { key: "Battery", value: "30 Hours total" },
          { key: "Connectivity", value: "Bluetooth 5.3" },
          { key: "Warranty", value: "6 Months Replacement" },
        ]
  );

  // Images state
  const [images, setImages] = useState<ImageUploadItem[]>(
    initialData?.images?.map((img, idx) => ({
      image_url: img.image_url,
      image_file_id: img.image_file_id,
      display_order: img.display_order ?? idx,
      is_thumbnail: img.is_thumbnail ?? (idx === 0),
    })) || []
  );

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await api.getAdminCategories();
        setCategories(cats);
        if (!categoryId && cats.length > 0) {
          setCategoryId(cats[0].id);
        }
      } catch (e) {
        console.error("Failed to load categories", e);
      }
    }
    loadCategories();
  }, [categoryId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await api.uploadImage(file);
        setImages((prev) => [
          ...prev,
          {
            image_url: res.url,
            image_file_id: res.file_id,
            display_order: prev.length,
            is_thumbnail: prev.length === 0,
          },
        ]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image to ImageKit. Check ImageKit credentials.");
    } finally {
      setUploadingImage(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleRemoveImage = async (index: number) => {
    const target = images[index];
    if (target.image_file_id) {
      try {
        await api.deleteImage(target.image_file_id);
      } catch (e) {
        console.warn("ImageKit cleanup warning", e);
      }
    }
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some((img) => img.is_thumbnail)) {
        updated[0].is_thumbnail = true;
      }
      return updated;
    });
  };

  const handleSetThumbnail = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        is_thumbnail: i === index,
        display_order: i === index ? 0 : i + 1,
      }))
    );
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: "key" | "value", val: string) => {
    setSpecs((prev) =>
      prev.map((sp, i) => (i === index ? { ...sp, [field]: val } : sp))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }
    if (!sku.trim()) {
      setError("Product SKU is required.");
      return;
    }
    if (!categoryId) {
      setError("Please select a category.");
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setError("Please enter a valid price in PKR.");
      return;
    }

    // Convert specs to JSON dict
    const specsDict: Record<string, string> = {};
    specs.forEach((sp) => {
      if (sp.key.trim() && sp.value.trim()) {
        specsDict[sp.key.trim()] = sp.value.trim();
      }
    });

    const payload = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      sku: sku.trim().toUpperCase(),
      category_id: categoryId,
      price: parseFloat(price),
      discount_price: discountPrice ? parseFloat(discountPrice) : null,
      stock: parseInt(stock, 10) || 0,
      description: description.trim(),
      is_featured: isFeatured,
      is_active: isActive,
      specs: specsDict,
      images: images.map((img, idx) => ({
        image_url: img.image_url,
        image_file_id: img.image_file_id || undefined,
        display_order: idx,
        is_thumbnail: img.is_thumbnail,
      })),
    };

    setSubmitting(true);
    try {
      if (isEdit && initialData) {
        await api.updateProduct(initialData.id, payload);
      } else {
        await api.createProduct(payload);
      }
      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "Failed to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-[#A1A1A1] hover:text-[#D4AF37] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
        </Link>
      </div>

      <div className="flex items-center justify-between pb-6 border-b border-[#222222]">
        <h1 className="text-2xl font-extrabold text-white">
          {isEdit ? "Edit Gadget Product" : "Create New Gadget"}
        </h1>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-[#222222] pb-3 uppercase tracking-wider">
            1. Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                Product Title <span className="text-[#D4AF37]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AuraPods Pro ANC Wireless Earbuds"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                SKU (Stock Keeping Unit) <span className="text-[#D4AF37]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. HGS-AUD-001"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#D4AF37] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                Category <span className="text-[#D4AF37]">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                URL Slug <span className="text-[#666666]">(Optional - auto-generated if left blank)</span>
              </label>
              <input
                type="text"
                placeholder="aurapods-pro-anc"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
              Product Description
            </label>
            <textarea
              rows={4}
              placeholder="Highlight features, sound signature, battery life, and package contents..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-[#222222] pb-3 uppercase tracking-wider">
            2. Pricing (PKR) & Inventory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                Regular Price (PKR) <span className="text-[#D4AF37]">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="50"
                placeholder="4999"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                Discount Price (PKR) <span className="text-[#666666]">(Optional)</span>
              </label>
              <input
                type="number"
                min="0"
                step="50"
                placeholder="3999"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                Stock Quantity <span className="text-[#D4AF37]">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="15"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="flex items-center gap-8 pt-3 border-t border-[#222222]">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-[#2A2A2A] text-[#D4AF37] focus:ring-[#D4AF37] h-4 w-4"
              />
              <span>Feature on Home Page Deals</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-[#2A2A2A] text-[#D4AF37] focus:ring-[#D4AF37] h-4 w-4"
              />
              <span>Active in Public Store</span>
            </label>
          </div>
        </div>

        {/* ImageKit Multi-Image Uploader */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
          <div className="flex items-center justify-between border-b border-[#222222] pb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                3. Product Images (ImageKit)
              </h2>
              <p className="text-xs text-[#888888] mt-0.5">
                Uploaded directly to ImageKit CDN with automatic cleanup upon removal.
              </p>
            </div>

            <label className="btn-gold py-2 px-3 text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
              {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{uploadingImage ? "Uploading..." : "Upload to ImageKit"}</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>

          {images.length === 0 ? (
            <div className="p-8 border-2 border-dashed border-[#2A2A2A] rounded-2xl text-center space-y-2">
              <Upload className="w-8 h-8 text-[#666666] mx-auto" />
              <p className="text-xs text-[#A1A1A1]">No product images attached yet.</p>
              <p className="text-[11px] text-[#666666]">Click &apos;Upload to ImageKit&apos; above to select images.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 pt-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative aspect-square rounded-xl bg-[#181818] border overflow-hidden p-1 group flex items-center justify-center ${
                    img.is_thumbnail
                      ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/30"
                      : "border-[#2A2A2A]"
                  }`}
                >
                  <Image
                    src={img.image_url}
                    alt="Upload thumbnail"
                    fill
                    className="object-contain p-1"
                    sizes="120px"
                  />

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-1">
                    <button
                      type="button"
                      onClick={() => handleSetThumbnail(idx)}
                      title={img.is_thumbnail ? "Primary thumbnail" : "Set as primary"}
                      className={`p-1.5 rounded-lg text-xs ${
                        img.is_thumbnail
                          ? "bg-[#D4AF37] text-black"
                          : "bg-[#222222] text-[#A1A1A1] hover:text-white"
                      }`}
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      title="Delete image"
                      className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {img.is_thumbnail && (
                    <span className="absolute bottom-1 left-1 bg-[#D4AF37] text-black text-[9px] font-bold px-1.5 py-0.2 rounded shadow">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Specifications Editor */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
          <div className="flex items-center justify-between border-b border-[#222222] pb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                4. Specifications Sheet
              </h2>
              <p className="text-xs text-[#888888] mt-0.5">
                Add technical parameters like Bluetooth, Battery, Wattage, or Warranty.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddSpec}
              className="btn-gold-outline py-1.5 px-3 text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Field</span>
            </button>
          </div>

          <div className="space-y-3">
            {specs.map((sp, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Feature name (e.g. Battery)"
                  value={sp.key}
                  onChange={(e) => handleSpecChange(idx, "key", e.target.value)}
                  className="w-1/3 bg-[#181818] border border-[#2A2A2A] rounded-xl py-2 px-3 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="text"
                  placeholder="Detail (e.g. 36h with charging case)"
                  value={sp.value}
                  onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                  className="flex-1 bg-[#181818] border border-[#2A2A2A] rounded-xl py-2 px-3 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(idx)}
                  className="p-2 text-[#666666] hover:text-red-400 transition"
                  title="Remove spec"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#222222]">
          <Link
            href="/admin/products"
            className="btn-gold-outline py-3 px-6 text-xs font-bold"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="btn-gold py-3 px-8 text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Gadget...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{isEdit ? "Update Gadget" : "Save & Publish Gadget"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
