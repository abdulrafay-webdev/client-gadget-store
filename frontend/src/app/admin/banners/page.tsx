"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Banner } from "@/types";
import { api } from "@/lib/api";
import { Plus, Trash2, Upload, Loader2, Image as ImageIcon, X, Check } from "lucide-react";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [badge, setBadge] = useState("NEW DEALS");
  const [linkUrl, setLinkUrl] = useState("/shop");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFileId, setImageFileId] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminBanners();
      setBanners(data);
    } catch (e) {
      console.error("Failed to load banners", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

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
      setError(err.message || "Failed to upload banner to ImageKit");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl) {
      setError("Please provide a title and upload an image.");
      return;
    }

    setSubmitting(true);
    try {
      await api.createBanner({
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        badge: badge.trim() || undefined,
        link_url: linkUrl.trim() || "/shop",
        image_url: imageUrl,
        image_file_id: imageFileId || undefined,
        display_order: displayOrder,
        is_active: true,
      });
      setIsModalOpen(false);
      fetchBanners();
    } catch (err: any) {
      setError(err.message || "Failed to create banner");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (bannerId: string) => {
    if (!confirm("Are you sure you want to delete this hero banner?")) return;
    try {
      await api.deleteBanner(bannerId);
      fetchBanners();
    } catch (e: any) {
      alert(e.message || "Failed to delete banner");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Hero <span className="text-[#D4AF37]">Banners</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1A1] mt-1">
            Manage prominent promotional slides displayed on the store homepage.
          </p>
        </div>

        <button
          onClick={() => {
            setTitle("");
            setSubtitle("");
            setBadge("HOT DEAL");
            setImageUrl("");
            setImageFileId("");
            setDisplayOrder(banners.length + 1);
            setIsModalOpen(true);
          }}
          className="btn-gold py-2.5 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hero Banner</span>
        </button>
      </div>

      {/* Banners Grid */}
      <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
        {loading ? (
          <div className="py-16 text-center text-[#A1A1A1] flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" />
            <span className="text-xs">Loading banners...</span>
          </div>
        ) : banners.length === 0 ? (
          <div className="py-16 text-center text-[#A1A1A1] space-y-2">
            <ImageIcon className="w-10 h-10 mx-auto text-[#666666]" />
            <p className="text-sm font-bold text-white">No custom banners created</p>
            <p className="text-xs">Add hero banners to showcase promotions on the homepage.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((b) => (
              <div
                key={b.id}
                className="relative rounded-2xl bg-[#161616] border border-[#2A2A2A] overflow-hidden space-y-3 group"
              >
                <div className="relative aspect-16/9 w-full bg-[#1A1A1A]">
                  <Image src={b.image_url} alt={b.title} fill className="object-cover" />
                  <div className="absolute top-3 left-3">
                    {b.badge && (
                      <span className="bg-[#D4AF37] text-black text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                        {b.badge}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 transition"
                    title="Delete Banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-1">
                  <h3 className="text-sm font-bold text-white">{b.title}</h3>
                  {b.subtitle && <p className="text-xs text-[#A1A1A1] line-clamp-2">{b.subtitle}</p>}
                  <div className="flex items-center justify-between pt-2 text-[11px] text-[#777777]">
                    <span>Link: {b.link_url || "/shop"}</span>
                    <span>Order: {b.display_order}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
              <h3 className="text-base font-bold text-white">Create Hero Banner</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#A1A1A1] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-950 border border-red-800 text-red-200 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateBanner} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                  Headline Title <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next-Gen AMOLED Smartwatches"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Special Introductory 20% Discount"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">Badge Text</label>
                  <input
                    type="text"
                    placeholder="HOT DEAL"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">Link URL</label>
                  <input
                    type="text"
                    placeholder="/shop"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* ImageKit Upload */}
              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                  Banner Image (ImageKit) <span className="text-[#D4AF37]">*</span>
                </label>
                <div className="flex items-center gap-3">
                  {imageUrl ? (
                    <div className="relative w-16 h-10 rounded-lg bg-[#181818] border border-[#2A2A2A] overflow-hidden shrink-0">
                      <Image src={imageUrl} alt="Banner preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-10 rounded-lg bg-[#181818] border border-[#2A2A2A] flex items-center justify-center text-[#666666]">
                      <ImageIcon className="w-5 h-5" />
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
                  <span>Save Banner</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
