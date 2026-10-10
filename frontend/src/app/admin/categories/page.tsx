"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Category } from "@/types";
import { api } from "@/lib/api";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Check,
  X,
  Layers,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFileId, setImageFileId] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const cats = await api.getAdminCategories();
      setCategories(cats);
    } catch (e) {
      console.error("Failed to load categories", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("");
    setImageFileId("");
    setDisplayOrder(categories.length + 1);
    setIsActive(true);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setImageUrl(cat.image_url || "");
    setImageFileId(cat.image_file_id || "");
    setDisplayOrder(cat.display_order);
    setIsActive(cat.is_active);
    setError(null);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);
    try {
      const res = await api.uploadImage(file);
      setImageUrl(res.url);
      setImageFileId(res.file_id);
    } catch (err: any) {
      setError(err.message || "Failed to upload category image to ImageKit");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim() || undefined,
        image_url: imageUrl || undefined,
        image_file_id: imageFileId || undefined,
        display_order: displayOrder,
        is_active: isActive,
      };

      if (editingCategory) {
        await api.updateCategory(editingCategory.id, payload);
      } else {
        await api.createCategory(payload);
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setError(err.message || "Failed to save category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;

    try {
      await api.deleteCategory(cat.id);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Category <span className="text-[#D4AF37]">Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1A1] mt-1">
            Organize products into customer-facing departments with ImageKit icons.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-gold py-2.5 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
        {loading ? (
          <div className="py-16 text-center text-[#A1A1A1] flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" />
            <span className="text-xs">Loading categories...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-[#A1A1A1] space-y-2">
            <Layers className="w-10 h-10 mx-auto text-[#666666]" />
            <p className="text-sm font-bold text-white">No categories found</p>
            <p className="text-xs">Create your first category to group your products.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161616] text-[#888888] uppercase tracking-wider border-b border-[#222222]">
                <tr>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Products</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C1C]">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#141414] transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-[#181818] border border-[#2A2A2A] overflow-hidden shrink-0 flex items-center justify-center">
                          {cat.image_url ? (
                            <Image
                              src={cat.image_url}
                              alt={cat.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <Layers className="w-5 h-5 text-[#666666]" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{cat.name}</span>
                          {cat.description && (
                            <span className="text-[10px] text-[#777777] line-clamp-1">
                              {cat.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#A1A1A1]">{cat.slug}</td>

                    <td className="py-3.5 px-4">
                      <span className="bg-[#1A1A1A] border border-[#333333] text-[#D4AF37] px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                        {cat.product_count || 0} Products
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-white font-medium">{cat.display_order}</td>

                    <td className="py-3.5 px-4">
                      {cat.is_active ? (
                        <span className="text-emerald-400 font-semibold">Active</span>
                      ) : (
                        <span className="text-[#666666]">Inactive</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#D4AF37] text-white hover:text-black border border-[#2A2A2A] transition"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-300 border border-red-900/60 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
              <h3 className="text-base font-bold text-white">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#A1A1A1] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-950 border border-red-800 text-red-200 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                  Category Name <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smartwatches"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                  URL Slug <span className="text-[#666666]">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="smartwatches"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short summary for category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                  Category Cover Image
                </label>
                <div className="flex items-center gap-3">
                  {imageUrl ? (
                    <div className="relative w-12 h-12 rounded-lg bg-[#181818] border border-[#2A2A2A] overflow-hidden shrink-0">
                      <Image src={imageUrl} alt="Category preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-[#181818] border border-[#2A2A2A] flex items-center justify-center text-[#666666]">
                      <Layers className="w-5 h-5" />
                    </div>
                  )}

                  <label className="btn-gold-outline py-1.5 px-3 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5">
                    {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{uploadingImage ? "Uploading..." : "Upload Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded border-[#2A2A2A] text-[#D4AF37] focus:ring-[#D4AF37] h-4 w-4"
                    />
                    <span>Active</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 btn-gold-outline text-xs py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-gold text-xs py-2.5 font-bold flex items-center justify-center gap-1.5"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{editingCategory ? "Update" : "Create"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
