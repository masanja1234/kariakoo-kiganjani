"use client";

import { useRouter } from "next/navigation";
import { CheckCheck } from "lucide-react";
import { adminMarkAllNotificationsRead } from "@/actions/admin";

export function MarkAllReadButton() {
  const router = useRouter();

  async function handleClick() {
    await adminMarkAllNotificationsRead();
    router.refresh();
  }

  return (
    <button onClick={handleClick} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
      <CheckCheck size={16} />
      Alama Zote Zimesomwa
    </button>
  );
}
