"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/components/shared/CartContext";
import type { ProductWithDetails } from "@/types";

export function AddToCartButton({ product }: { product: ProductWithDetails }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];
  const isOutOfStock = product.stockQuantity === 0;

  function handleAdd() {
    if (isOutOfStock) return;
    addItem({
      id: product.id,
      productId: product.id,
      name: product.nameSw,
      nameSw: product.nameSw,
      nameEn: product.nameEn,
      price: product.sellingPrice,
      discountPrice: product.discountPrice,
      image: mainImage?.url,
      slug: product.slug,
      stockQuantity: product.stockQuantity,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-3 flex-1">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Idadi:</label>
        <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Punguza idadi"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 w-6 text-center"
          >
            −
          </button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
            aria-label="Ongeza idadi"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 w-6 text-center"
            disabled={quantity >= product.stockQuantity}
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={handleAdd}
        disabled={isOutOfStock}
        className={`flex items-center justify-center gap-2 font-bold py-3 px-8 rounded-xl transition-all duration-200 ${
          added
            ? "bg-green-500 text-white"
            : isOutOfStock
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-primary-600 hover:bg-primary-700 text-white"
        }`}
      >
        {added ? (
          <>
            <Check size={18} />
            Imeongezwa!
          </>
        ) : (
          <>
            <ShoppingCart size={18} />
            {isOutOfStock ? "Hakuna Stoki" : "Ongeza Kwenye Kikapu"}
          </>
        )}
      </button>
    </div>
  );
}
