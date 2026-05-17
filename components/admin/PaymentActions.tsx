"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { adminUpdatePaymentStatus } from "@/actions/orders";

export function PaymentActions({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handle(status: string) {
    setLoading(status);
    try {
      await adminUpdatePaymentStatus(paymentId, status);
      router.refresh();
    } catch {
      alert("Kuna tatizo");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex gap-1">
      <button onClick={() => handle("CONFIRMED")} disabled={loading !== null} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg transition-colors" title="Thibitisha">
        {loading === "CONFIRMED" ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
      </button>
      <button onClick={() => handle("FAILED")} disabled={loading !== null} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors" title="Kataa">
        {loading === "FAILED" ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
      </button>
    </div>
  );
}
