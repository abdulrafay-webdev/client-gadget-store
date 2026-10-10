"use client";

import React from "react";
import { Order } from "@/types";
import { formatPKR, formatDate } from "@/lib/utils";
import { Printer } from "lucide-react";

interface PrintableInvoiceProps {
  order: Order;
  storeName?: string;
  storePhone?: string;
  storeAddress?: string;
}

export function PrintableInvoice({
  order,
  storeName = "Hamza Gadget Store",
  storePhone = "0315-2720915",
  storeAddress = "Shop #4, Gadget Plaza, Hall Road, Lahore, Pakistan",
}: PrintableInvoiceProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="no-print mb-4 flex justify-end">
        <button
          onClick={handlePrint}
          className="btn-gold text-xs py-2 px-4 font-bold flex items-center gap-1.5 shadow"
        >
          <Printer className="w-4 h-4" />
          <span>Print Customer Packing Slip / Invoice</span>
        </button>
      </div>

      {/* Actual Printable Invoice Container */}
      <div className="printable-invoice p-8 bg-[#141414] border border-[#2A2A2A] rounded-2xl text-white space-y-8 font-sans">
        {/* Invoice Top Header */}
        <div className="flex justify-between items-start border-b border-[#333333] pb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#333333] bg-black shrink-0 flex items-center justify-center p-1">
              <img
                src="/logo.png"
                alt={storeName}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-[#D4AF37]">
                {storeName.toUpperCase()}
              </div>
              <p className="text-xs text-[#A1A1A1] mt-0.5 max-w-xs">{storeAddress}</p>
              <p className="text-xs text-[#A1A1A1]">Phone: {storePhone}</p>
            </div>
          </div>

          <div className="text-right space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block">
              Commercial Invoice
            </span>
            <div className="text-lg font-mono font-bold">{order.order_number}</div>
            <div className="text-xs text-[#888888]">Date: {formatDate(order.created_at)}</div>
            <div className="text-xs font-semibold text-[#D4AF37]">
              Payment: {order.payment_method} ({order.payment_status.toUpperCase()})
            </div>
          </div>
        </div>

        {/* Customer & Shipping Details */}
        <div className="grid grid-cols-2 gap-8 text-xs">
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-[#D4AF37] block">
              Ship To Customer:
            </span>
            <div className="text-sm font-bold text-white">{order.customer_name}</div>
            <div className="text-[#A1A1A1]">Phone: {order.customer_phone}</div>
            {order.customer_email && <div className="text-[#A1A1A1]">Email: {order.customer_email}</div>}
            <div className="text-white mt-1">
              <strong>City:</strong> {order.city}
            </div>
            <div className="text-[#A1A1A1]">{order.address}</div>
          </div>

          <div className="space-y-1 text-right">
            <span className="font-bold uppercase tracking-wider text-[#D4AF37] block">
              Order Details:
            </span>
            <div><strong>Status:</strong> <span className="uppercase">{order.status}</span></div>
            <div><strong>Shipping Method:</strong> Nationwide Courier COD</div>
            {order.notes && (
              <div className="mt-2 text-xs text-[#A1A1A1] italic">
                <strong>Delivery Note:</strong> &quot;{order.notes}&quot;
              </div>
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-[#333333]">
            <thead className="bg-[#1A1A1A] border-b border-[#333333] text-[#A1A1A1] uppercase font-bold">
              <tr>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td className="py-2.5 px-3 font-medium text-white">{item.product_name}</td>
                  <td className="py-2.5 px-3 text-center text-[#A1A1A1]">{item.quantity}</td>
                  <td className="py-2.5 px-3 text-right text-[#A1A1A1]">
                    {formatPKR(item.product_price)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-white">
                    {formatPKR(item.line_total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end pt-2">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-[#A1A1A1]">
              <span>Items Subtotal:</span>
              <span className="text-white font-medium">{formatPKR(order.total_amount)}</span>
            </div>
            <div className="flex justify-between text-[#A1A1A1]">
              <span>Delivery Fee:</span>
              <span className="text-white font-medium">
                {order.shipping_fee === 0 ? "FREE" : formatPKR(order.shipping_fee)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-[#333333]">
              <span className="text-[#D4AF37]">Grand Total (COD):</span>
              <span className="text-[#D4AF37]">{formatPKR(order.grand_total)}</span>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="pt-6 border-t border-[#333333] text-[10px] text-[#777777] text-center space-y-1">
          <p>Thank you for choosing Hamza Gadget Store! All items carry our 7-Day Checking Warranty.</p>
          <p>For inquiries, exchanges or warranty support, contact WhatsApp: {storePhone}</p>
        </div>
      </div>
    </div>
  );
}
