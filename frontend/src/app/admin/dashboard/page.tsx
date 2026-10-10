"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardStats } from "@/types";
import { api } from "@/lib/api";
import { formatPKR, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/admin/StatusBadge";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Package,
  Eye,
  RefreshCw
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminDashboard();
      setStats(data);
    } catch (e) {
      console.error("Failed to load dashboard stats", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 w-64 bg-[#1C1C1C] rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-[#141414]" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-[#141414]" />
      </div>
    );
  }

  // Calculate chart max for percentage heights
  const maxRev = Math.max(...stats.sales_chart.map((s) => s.revenue), 1000);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Store <span className="text-[#D4AF37]">Overview</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1A1] mt-1">
            Real-time metrics, cash flow, and fulfillment statuses across Pakistan.
          </p>
        </div>

        <button
          onClick={loadStats}
          className="btn-gold-outline text-xs py-2 px-3.5 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#D4AF37]/50 transition space-y-2">
          <div className="flex items-center justify-between text-xs text-[#888888]">
            <span className="font-semibold uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-[#181818] border border-[#2A2A2A] flex items-center justify-center text-[#D4AF37]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#D4AF37]">
            {formatPKR(stats.total_revenue)}
          </div>
          <div className="text-[11px] text-[#777777]">Net of active & delivered orders</div>
        </div>

        {/* Total Orders */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#D4AF37]/50 transition space-y-2">
          <div className="flex items-center justify-between text-xs text-[#888888]">
            <span className="font-semibold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-[#181818] border border-[#2A2A2A] flex items-center justify-center text-[#D4AF37]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats.total_orders}
          </div>
          <div className="text-[11px] text-[#777777]">
            {stats.delivered_orders} delivered • {stats.shipped_orders} in transit
          </div>
        </div>

        {/* Pending Orders */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#D4AF37]/50 transition space-y-2">
          <div className="flex items-center justify-between text-xs text-[#888888]">
            <span className="font-semibold uppercase tracking-wider">Pending Orders</span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/40 border border-amber-800/60 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            {stats.pending_orders}
          </div>
          <div className="text-[11px] text-[#777777]">Awaiting customer confirmation call</div>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#D4AF37]/50 transition space-y-2">
          <div className="flex items-center justify-between text-xs text-[#888888]">
            <span className="font-semibold uppercase tracking-wider">Low Stock (&le; 5)</span>
            <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-800/60 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-400">
            {stats.low_stock_count}
          </div>
          <div className="text-[11px] text-[#777777]">Items requiring inventory restock</div>
        </div>
      </div>

      {/* Chart & Low Stock Dual Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 7-Day Revenue Trend Bar Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#D4AF37]" /> 7-Day Sales Trend
              </h3>
              <p className="text-xs text-[#777777] mt-0.5">Daily gross revenue breakdown in PKR</p>
            </div>
            <span className="text-xs text-[#D4AF37] font-bold">Past 7 Days</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-[#222222] pb-4 px-2">
            {stats.sales_chart.map((day) => {
              const heightPct = Math.max(10, Math.round((day.revenue / maxRev) * 100));

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] text-[#D4AF37] opacity-0 group-hover:opacity-100 transition font-mono">
                    {formatPKR(day.revenue)}
                  </div>
                  <div className="w-full bg-[#181818] rounded-t-lg h-36 flex items-end p-1">
                    <div
                      className="w-full bg-gradient-to-t from-[#B8941F] to-[#E6C65C] rounded-t transition-all duration-500 group-hover:brightness-125 shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-[#888888] font-medium mt-1">
                    {day.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Alerts Preview */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-red-400" /> Low Stock Alerts
            </h3>
            <Link href="/admin/products" className="text-xs text-[#D4AF37] hover:underline">
              View All
            </Link>
          </div>

          {stats.low_stock_products.length === 0 ? (
            <p className="text-xs text-[#777777] py-6 text-center">All inventory levels are healthy.</p>
          ) : (
            <div className="space-y-3">
              {stats.low_stock_products.slice(0, 5).map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 rounded-xl bg-[#141414] border border-[#222222] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <h4 className="font-semibold text-white truncate">{prod.name}</h4>
                    <span className="text-[10px] text-[#777777] font-mono">SKU: {prod.sku}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="bg-red-950 text-red-300 border border-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {prod.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
          <h3 className="text-base font-bold text-white">Recent Customer Orders</h3>
          <Link
            href="/admin/orders"
            className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>View All Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.recent_orders.length === 0 ? (
          <p className="text-xs text-[#777777] py-8 text-center">No recent orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161616] text-[#888888] uppercase tracking-wider border-b border-[#222222]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C1C]">
                {stats.recent_orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#141414] transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {o.order_number}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">
                      {o.customer_name}
                      <span className="block text-[10px] text-[#777777]">{o.customer_phone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#A1A1A1]">{o.city}</td>
                    <td className="py-3.5 px-4 text-[#777777]">{formatDate(o.created_at)}</td>
                    <td className="py-3.5 px-4 font-bold text-[#D4AF37]">
                      {formatPKR(o.grand_total)}
                    </td>
                    <td className="py-3.5 px-4">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="p-1.5 rounded-lg bg-[#181818] hover:bg-[#D4AF37] text-white hover:text-black border border-[#2A2A2A] hover:border-[#D4AF37] inline-flex items-center gap-1 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold">Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
