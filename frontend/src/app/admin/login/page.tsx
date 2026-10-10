"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Lock, Mail, Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email.trim(), password);
    } catch (err: any) {
      setError(err.message || "Invalid admin credentials or rate limit reached.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#111111] via-[#0A0A0A] to-[#050505]">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 mx-auto rounded-2xl overflow-hidden bg-black/50 border border-[#D4AF37]/30 shadow-[0_0_25px_rgba(212,175,55,0.3)] flex items-center justify-center p-1.5">
            <Image
              src="/logo.png"
              alt="Hamza Gadgets Logo"
              width={64}
              height={64}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            HAMZA GADGETS <span className="text-[#D4AF37]">PORTAL</span>
          </h1>
          <p className="text-xs text-[#888888] tracking-widest uppercase">
            Authorized Personnel Only
          </p>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-3xl bg-[#111111] border border-[#2A2A2A] shadow-2xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#A1A1A1] border-b border-[#222222] pb-3">
            <Lock className="w-4 h-4 text-[#D4AF37]" />
            <span>Secure JWT Admin Authentication</span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@hamzagadgets.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#D4AF37]"
                />
                <Mail className="w-4 h-4 text-[#777777] absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#D4AF37]"
                />
                <Lock className="w-4 h-4 text-[#777777] absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)] mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-[#777777] hover:text-[#D4AF37] transition underline"
            >
              ← Return to Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
