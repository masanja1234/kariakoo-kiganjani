"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/shared/CartContext";
import type { CartItemState } from "@/types";

export function CartItemRow({ item }: { item: CartItemState }) {
  const { updateQuantity, removeItem } = useCart();
  const price = item.discountPrice ?? item.price;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
      {/* Image */}
      <Link href={`/products/${item.slug}`} className="shrink-0">
        <div className="relative w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          {item.image ? (
            <Image src={item.image} alt={item.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              Hakuna Picha
            </div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.slug}`}>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {item.name}
          </h3>
        </Link>
        <p className="text-primary-600 dark:text-primary-400 font-bold mt-1">
          {formatPrice(price)}
        </p>
        {item.discountPrice && (
          <p className="text-xs text-gray-400 line-through">{formatPrice(item.price)}</p>
        )}
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          className="p-1 rounded-md border border-gray-300 dark:border-gray-700 hover:border-primary-500 transition-colors"
        >
          <Minus size={14} />
        </button>
        <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          disabled={item.quantity >= item.stockQuantity}
          className="p-1 rounded-md border border-gray-300 dark:border-gray-700 hover:border-primary-500 disabled:opacity-40 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Total */}
      <div className="text-right shrink-0">
        <p className="font-bold text-gray-900 dark:text-gray-100">
          {formatPrice(price * item.quantity)}
        </p>
        <button
          onClick={() => removeItem(item.productId)}
          className="text-red-500 hover:text-red-600 mt-1 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
