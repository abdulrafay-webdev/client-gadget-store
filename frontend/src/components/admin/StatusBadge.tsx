import React from "react";
import { OrderStatus, PaymentStatus } from "@/types";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  switch (status) {
    case "pending":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-800 uppercase tracking-wider">
          Pending
        </span>
      );
    case "confirmed":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-950/80 text-blue-300 border border-blue-800 uppercase tracking-wider">
          Confirmed
        </span>
      );
    case "shipped":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-950/80 text-purple-300 border border-purple-800 uppercase tracking-wider">
          Shipped
        </span>
      );
    case "delivered":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800 uppercase tracking-wider">
          Delivered
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-800 uppercase tracking-wider">
          Cancelled
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-900 text-neutral-400 uppercase tracking-wider">
          {status}
        </span>
      );
  }
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  if (status === "paid") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
        Paid
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800 uppercase">
      Unpaid (COD)
    </span>
  );
}
