"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Order, OrderListResponse, OrderStatus } from "@/types";
import { api } from "@/lib/api";
import { formatPKR, formatDate } from "@/lib/utils";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/admin/StatusBadge";
import {
  Search,
  Eye,
  ShoppingBag,
  Loader2,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const STATUS_TABS: { label: string; value: string }[] = [
  { label: "All Orders", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function AdminOrdersPage() {
  const [data, setData] = useState<OrderListResponse>({
    items: [],
    total: 0,
    page: 1,
    limit: 20,
    total_pages: 1,
  });
  const [activeTab, setActiveTab] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminOrders({
        page,
        limit: 20,
        status_filter: activeTab || undefined,
        search: search.trim() || undefined,
      });
      setData(res);
    } catch (e) {
      console.error("Failed to load admin orders", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, activeTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Order <span className="text-[#D4AF37]">Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1A1] mt-1">
            Track customer orders, confirm shipments, and inspect item snapshots.
          </p>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === tab.value
                ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                : "bg-[#141414] text-[#A1A1A1] hover:text-white border border-[#222222]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-[#111111] border border-[#222222]">
        <form onSubmit={handleSearchSubmit} className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by order ID, customer name, phone, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-[#666666] focus:outline-none focus:border-[#D4AF37]"
          />
          <Search className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Orders Table */}
      <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
        {loading ? (
          <div className="py-16 text-center text-[#A1A1A1] flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" />
            <span className="text-xs">Loading customer orders...</span>
          </div>
        ) : data.items.length === 0 ? (
          <div className="py-16 text-center text-[#A1A1A1] space-y-2">
            <ShoppingBag className="w-10 h-10 mx-auto text-[#666666]" />
            <p className="text-sm font-bold text-white">No orders found</p>
            <p className="text-xs">No orders match the selected filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161616] text-[#888888] uppercase tracking-wider border-b border-[#222222]">
                <tr>
                  <th className="py-3 px-4">Order Number</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Grand Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C1C]">
                {data.items.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#141414] transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {ord.order_number}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{ord.customer_name}</div>
                      <div className="text-[11px] text-[#A1A1A1]">{ord.customer_phone}</div>
                    </td>

                    <td className="py-3.5 px-4 text-[#A1A1A1]">{ord.city}</td>

                    <td className="py-3.5 px-4">
                      <span className="bg-[#1A1A1A] border border-[#333333] text-[#D4AF37] px-2 py-0.5 rounded text-[10px] font-bold">
                        {ord.items.length} Item{ord.items.length === 1 ? "" : "s"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#777777]">{formatDate(ord.created_at)}</td>

                    <td className="py-3.5 px-4 font-extrabold text-[#D4AF37]">
                      {formatPKR(ord.grand_total)}
                    </td>

                    <td className="py-3.5 px-4">
                      <OrderStatusBadge status={ord.status} />
                    </td>

                    <td className="py-3.5 px-4">
                      <PaymentStatusBadge status={ord.payment_status} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="btn-gold py-1.5 px-3 text-[11px] font-bold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data.total_pages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-[#222222] text-xs">
            <span className="text-[#888888]">
              Page {data.page} of {data.total_pages} ({data.total} total orders)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-[#141414] border border-[#222222] text-white disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= data.total_pages}
                onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                className="p-1.5 rounded-lg bg-[#141414] border border-[#222222] text-white disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
