"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminUpdateBudgetRequest } from "@/actions/budgetRequests";

const STATUSES = [
  { value: "REVIEWING", label: "Inapitiwa" },
  { value: "SUPPLIER_FOUND", label: "Msambazaji Amepatikana" },
  { value: "QUOTATION_SENT", label: "Nukuu Imetumwa" },
  { value: "COMPLETED", label: "Imekamilika" },
  { value: "CANCELLED", label: "Futa" },
];

export function BudgetRequestStatusUpdater({ requestId, currentStatus }: { requestId: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleUpdate(status: string) {
    setLoading(true);
    try {
      await adminUpdateBudgetRequest(requestId, { status });
      router.refresh();
    } catch {
      alert("Kuna tatizo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      onChange={(e) => e.target.value && handleUpdate(e.target.value)}
      value=""
      disabled={loading}
      className="input text-xs py-1 cursor-pointer"
    >
      <option value="">Badilisha Hali...</option>
      {STATUSES.filter((s) => s.value !== currentStatus).map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}
