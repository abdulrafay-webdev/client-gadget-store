"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Order, OrderStatus, PaymentStatus } from "@/types";
import { api } from "@/lib/api";
import { formatPKR, formatDate } from "@/lib/utils";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/admin/StatusBadge";
import { PrintableInvoice } from "@/components/admin/PrintableInvoice";
import {
  ArrowLeft,
  Truck,
  CheckCircle2,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Status Form States
  const [newStatus, setNewStatus] = useState<OrderStatus>("pending");
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>("unpaid");

  const loadOrder = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminOrder(id);
      setOrder(data);
      setNewStatus(data.status);
      setNewPaymentStatus(data.payment_status);
    } catch (e) {
      console.error("Failed to load order detail", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadOrder();
  }, [id]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setUpdating(true);
    setError(null);
    try {
      const updated = await api.updateOrderStatus(order.id, {
        status: newStatus,
        payment_status: newPaymentStatus,
      });
      setOrder(updated);
      alert("Order status updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update order status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
        <span className="text-xs text-[#A1A1A1]">Loading order details & snapshots...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 text-white space-y-3">
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <Link href="/admin/orders" className="btn-gold inline-flex text-xs py-2 px-4">
          Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div className="no-print">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs text-[#A1A1A1] hover:text-[#D4AF37] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders List
        </Link>
      </div>

      {/* Header Info Banner */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#222222] gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono">
              {order.order_number}
            </h1>
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.payment_status} />
          </div>
          <div className="flex items-center gap-2 text-xs text-[#888888] mt-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Order placed on {formatDate(order.created_at)}</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-[#888888] block">Grand Total (COD)</span>
          <span className="text-2xl sm:text-3xl font-black text-[#D4AF37]">
            {formatPKR(order.grand_total)}
          </span>
        </div>
      </div>

      {error && (
        <div className="no-print p-4 rounded-xl bg-red-950 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Status Transition Control Card */}
      <div className="no-print p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
        <h2 className="text-sm font-bold text-white border-b border-[#222222] pb-3 uppercase tracking-wider">
          Update Order Status & Payment
        </h2>

        <form onSubmit={handleUpdateStatus} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
              Order Fulfillment Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
              className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="pending">Pending (Awaiting Confirmation)</option>
              <option value="confirmed">Confirmed (Verified with Customer)</option>
              <option value="shipped">Shipped (Handed to Courier)</option>
              <option value="delivered">Delivered (Completed)</option>
              <option value="cancelled">Cancelled (Restore Stock)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
              Payment Status
            </label>
            <select
              value={newPaymentStatus}
              onChange={(e) => setNewPaymentStatus(e.target.value as PaymentStatus)}
              className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="unpaid">Unpaid (Cash on Delivery Pending)</option>
              <option value="paid">Paid (Cash Collected)</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={updating}
              className="w-full btn-gold py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>Save Status Updates</span>
            </button>
          </div>
        </form>
      </div>

      {/* Customer & Shipping Information Grid */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-3">
          <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider border-b border-[#222222] pb-2">
            Customer Information
          </h3>
          <div className="space-y-2 text-xs">
            <div className="text-base font-bold text-white">{order.customer_name}</div>
            <div className="flex items-center gap-2 text-[#A1A1A1]">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <a href={`tel:${order.customer_phone}`} className="hover:text-white transition">
                {order.customer_phone}
              </a>
              <a
                href={`https://wa.me/${order.customer_phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-[10px] text-emerald-400 font-bold hover:underline"
              >
                (WhatsApp Chat)
              </a>
            </div>
            {order.customer_email && (
              <div className="flex items-center gap-2 text-[#A1A1A1]">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{order.customer_email}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-3">
          <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider border-b border-[#222222] pb-2">
            Destination & Delivery Address
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-sm font-bold text-white">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>City: {order.city}</span>
            </div>
            <div className="text-[#A1A1A1] pl-5 leading-relaxed">{order.address}</div>
            {order.notes && (
              <div className="mt-2 pl-5 pt-2 border-t border-[#222222] text-[#888888] italic">
                <strong>Customer Note:</strong> &quot;{order.notes}&quot;
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ordered Items Snapshot Table */}
      <div className="no-print p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#222222] pb-3">
          Purchased Item Snapshots (Preserved from Checkout)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161616] text-[#888888] uppercase tracking-wider border-b border-[#222222]">
              <tr>
                <th className="py-3 px-4">Item & Snapshot</th>
                <th className="py-3 px-4 text-center">Quantity</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C1C]">
              {order.items.map((item) => (
                <tr key={item.id} className="hover:bg-[#141414] transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg bg-[#181818] border border-[#2A2A2A] overflow-hidden shrink-0 flex items-center justify-center p-1">
                        <Image
                          src={item.product_image_url || "/placeholder-gadget.png"}
                          alt={item.product_name}
                          fill
                          className="object-contain p-1"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-white block">{item.product_name}</span>
                        <span className="text-[10px] text-[#777777]">Item ID: {item.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-white">
                    {item.quantity}
                  </td>

                  <td className="py-3.5 px-4 text-right text-[#A1A1A1]">
                    {formatPKR(item.product_price)}
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold text-[#D4AF37]">
                    {formatPKR(item.line_total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Totals */}
        <div className="flex justify-end pt-4 border-t border-[#222222]">
          <div className="w-72 space-y-2 text-xs">
            <div className="flex justify-between text-[#A1A1A1]">
              <span>Subtotal:</span>
              <span className="text-white font-medium">{formatPKR(order.total_amount)}</span>
            </div>
            <div className="flex justify-between text-[#A1A1A1]">
              <span>Delivery Fee (Nationwide):</span>
              <span className="text-white font-medium">
                {order.shipping_fee === 0 ? <strong className="text-[#D4AF37]">FREE</strong> : formatPKR(order.shipping_fee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-white pt-2 border-t border-[#222222]">
              <span className="text-[#D4AF37]">Grand Total (PKR):</span>
              <span className="text-[#D4AF37]">{formatPKR(order.grand_total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Invoice / Packing Slip Section */}
      <div className="pt-6 border-t border-[#222222]">
        <PrintableInvoice order={order} />
      </div>
    </div>
  );
}
