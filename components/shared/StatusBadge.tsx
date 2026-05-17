import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  // Order statuses
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  AWAITING_PAYMENT: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  PROCESSING: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  OUT_FOR_DELIVERY: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  REFUNDED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  // Payment statuses
  FAILED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  // Delivery statuses
  ASSIGNED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  PICKED_UP: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  IN_TRANSIT: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  // Budget request statuses
  NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  REVIEWING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  SUPPLIER_FOUND: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  QUOTATION_SENT: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  // Trust statuses
  TRUSTED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  PENDING_REVIEW: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  SUSPENDED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  // Stock
  IN_STOCK: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  LOW_STOCK: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  OUT_OF_STOCK: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  // Active
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  INACTIVE: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Inasubiri",
  CONFIRMED: "Imethibitishwa",
  AWAITING_PAYMENT: "Inasubiri Malipo",
  PAID: "Imelipwa",
  PROCESSING: "Inashughulikiwa",
  OUT_FOR_DELIVERY: "Inawasilishwa",
  COMPLETED: "Imekamilika",
  CANCELLED: "Imefutwa",
  REFUNDED: "Imerudishwa",
  FAILED: "Imeshindwa",
  ASSIGNED: "Imepewa",
  PICKED_UP: "Imechukuliwa",
  IN_TRANSIT: "Njiani",
  DELIVERED: "Imewasilishwa",
  NEW: "Mpya",
  REVIEWING: "Inapitiwa",
  SUPPLIER_FOUND: "Msambazaji Amepatikana",
  QUOTATION_SENT: "Nukuu Imetumwa",
  TRUSTED: "Anaaminiwa",
  PENDING_REVIEW: "Inasubiri Mapitio",
  SUSPENDED: "Imesimamishwa",
  IN_STOCK: "Ipo Stokini",
  LOW_STOCK: "Inakwisha",
  OUT_OF_STOCK: "Hakuna Stoki",
  ACTIVE: "Inafanya Kazi",
  INACTIVE: "Haifanyi Kazi",
  MPESA: "M-Pesa",
  TIGO_PESA: "Tigo Pesa",
  AIRTEL_MONEY: "Airtel Money",
  HALOPESA: "Halopesa",
  CASH_ON_DELIVERY: "Cash on Delivery",
  BANK_TRANSFER: "Bank Transfer",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-800";
  const label = STATUS_LABELS[status] ?? status;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
