import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "TZS"): string {
  return new Intl.NumberFormat("sw-TZ", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateProfitMargin(
  sellingPrice: number,
  costPrice: number
): { profit: number; marginPercent: number } {
  const profit = sellingPrice - costPrice;
  const marginPercent = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
  return { profit, marginPercent };
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KK-${timestamp}-${random}`;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

export function getStockStatus(quantity: number): {
  label: string;
  color: string;
} {
  if (quantity === 0) return { label: "Hakuna Stoki", color: "red" };
  if (quantity <= 5) return { label: "Inakwisha", color: "yellow" };
  return { label: "Ipo Stokini", color: "green" };
}
