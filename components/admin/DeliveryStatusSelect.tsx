"use client";

import { useState, useTransition } from "react";
import { adminUpdateDeliveryStatus } from "@/actions/admin";

const DELIVERY_STATUSES = [
  { value: "PENDING", label: "Inasubiri" },
  { value: "PICKED_UP", label: "Imechukuliwa" },
  { value: "IN_TRANSIT", label: "Inasafirishwa" },
  { value: "DELIVERED", label: "Imewasilishwa" },
  { value: "FAILED", label: "Imeshindwa" },
];

export function DeliveryStatusSelect({
  deliveryId,
  currentStatus,
}: {
  deliveryId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setStatus(newStatus);
    startTransition(async () => {
      await adminUpdateDeliveryStatus(deliveryId, newStatus);
    });
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className="text-xs border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 disabled:opacity-50 cursor-pointer"
    >
      {DELIVERY_STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
