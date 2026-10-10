"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Settings, Save, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    store_name: "Hamza Gadget Store",
    store_phone: "03152720915",
    store_whatsapp: "03152720915",
    store_email: "hamzagadgethouse@gmail.com",
    store_address: "Shop #4, Gadget Plaza, Hall Road, Lahore, Pakistan",
    shipping_fee: "250",
    free_shipping_threshold: "3500",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const records = await api.getAdminSettings();
        const map: Record<string, string> = {};
        records.forEach((r: any) => {
          map[r.key] = r.value;
        });
        setSettings((prev) => ({ ...prev, ...map }));
      } catch (e) {
        console.error("Failed to load settings", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      await api.updateAdminSettings(settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update store settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
        <span className="text-xs text-[#A1A1A1]">Loading store settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Store <span className="text-[#D4AF37]">Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1A1] mt-1">
            Configure contact lines, shipping tariffs, and free delivery thresholds.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Settings successfully saved and synchronized across the storefront!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Contact */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-[#222222] pb-3 uppercase tracking-wider">
            1. Brand & Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                Official Store Name
              </label>
              <input
                type="text"
                required
                value={settings.store_name || ""}
                onChange={(e) => handleChange("store_name", e.target.value)}
                className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                Primary Phone Number
              </label>
              <input
                type="text"
                required
                value={settings.store_phone || ""}
                onChange={(e) => handleChange("store_phone", e.target.value)}
                className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                WhatsApp Support Line
              </label>
              <input
                type="text"
                required
                value={settings.store_whatsapp || ""}
                onChange={(e) => handleChange("store_whatsapp", e.target.value)}
                className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                Official Support Email
              </label>
              <input
                type="email"
                required
                value={settings.store_email || ""}
                onChange={(e) => handleChange("store_email", e.target.value)}
                className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
              Physical Store Address
            </label>
            <input
              type="text"
              required
              value={settings.store_address || ""}
              onChange={(e) => handleChange("store_address", e.target.value)}
              className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Shipping Tariffs */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-[#222222] pb-3 uppercase tracking-wider">
            2. Nationwide Shipping Rules (PKR)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                Standard Shipping Fee (PKR)
              </label>
              <input
                type="number"
                required
                min="0"
                value={settings.shipping_fee || "250"}
                onChange={(e) => handleChange("shipping_fee", e.target.value)}
                className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <span className="text-[10px] text-[#666666] mt-1 block">
                Applied to standard Cash on Delivery parcels.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                Free Shipping Threshold (PKR)
              </label>
              <input
                type="number"
                required
                min="0"
                value={settings.free_shipping_threshold || "3500"}
                onChange={(e) => handleChange("free_shipping_threshold", e.target.value)}
                className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <span className="text-[10px] text-[#666666] mt-1 block">
                Carts reaching this PKR amount automatically receive free nationwide delivery.
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-gold py-3 px-8 text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Store Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
