"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { adminUpdateOrderStatus, adminUpdatePaymentStatus } from "@/actions/orders";

interface Props {
  orderId: string;
  paymentId: string;
  currentStatus: string;
  currentPaymentStatus: string;
}

export function OrderStatusUpdater({ orderId, paymentId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleConfirmPayment() {
    setLoading("confirm");
    try {
      await adminUpdatePaymentStatus(paymentId, "CONFIRMED");
      router.refresh();
    } catch {
      alert("Kuna tatizo");
    } finally {
      setLoading(null);
    }
  }

  async function handleRejectPayment() {
    setLoading("reject");
    try {
      await adminUpdatePaymentStatus(paymentId, "FAILED");
      await adminUpdateOrderStatus(orderId, "CANCELLED");
      router.refresh();
    } catch {
      alert("Kuna tatizo");
    } finally {
      setLoading(null);
    }
  }

  async function handleUpdateStatus(status: string) {
    setLoading(status);
    try {
      await adminUpdateOrderStatus(orderId, status);
      router.refresh();
    } catch {
      alert("Kuna tatizo");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Hatua za Malipo:</p>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleConfirmPayment}
          disabled={loading !== null}
          className="flex items-center gap-1.5 text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {loading === "confirm" ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
          Thibitisha Malipo
        </button>
        <button
          onClick={handleRejectPayment}
          disabled={loading !== null}
          className="flex items-center gap-1.5 text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {loading === "reject" ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
          Kataa Malipo
        </button>
      </div>

      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 mt-4">Hali ya Agizo:</p>
      <div className="flex gap-2 flex-wrap">
        {["CONFIRMED", "PROCESSING", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"].map((status) => (
          <button
            key={status}
            onClick={() => handleUpdateStatus(status)}
            disabled={loading !== null || currentStatus === status}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              currentStatus === status
                ? "bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-default"
                : "border-gray-300 dark:border-gray-700 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            }`}
          >
            {loading === status ? <Loader2 size={12} className="animate-spin inline" /> : null}
            {{"CONFIRMED": "Thibitisha", "PROCESSING": "Inashughulikiwa", "OUT_FOR_DELIVERY": "Inawasilishwa", "COMPLETED": "Imekamilika", "CANCELLED": "Futa"}[status]}
          </button>
        ))}
      </div>
    </div>
  );
}
