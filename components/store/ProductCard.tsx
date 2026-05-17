"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, MessageCircle, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getProductInquiryLink } from "@/lib/whatsapp";
import { useCart } from "@/components/shared/CartContext";
import { useLanguage } from "@/components/shared/LanguageContext";
import type { ProductWithImages } from "@/types";

interface ProductCardProps {
  product: ProductWithImages;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { language, t } = useLanguage();

  const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];
  const name = language === "sw" ? product.nameSw : product.nameEn;
  const isOutOfStock = product.stockQuantity === 0;
  const hasDiscount = product.discountPrice && product.discountPrice < product.sellingPrice;
  const displayPrice = hasDiscount ? product.discountPrice! : product.sellingPrice;
  const whatsappLink = getProductInquiryLink(name, displayPrice);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem({
      id: product.id,
      productId: product.id,
      name,
      nameSw: product.nameSw,
      nameEn: product.nameEn,
      price: product.sellingPrice,
      discountPrice: product.discountPrice,
      image: mainImage?.url,
      slug: product.slug,
      stockQuantity: product.stockQuantity,
    });
  }

  return (
    <div className="card group hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
          {mainImage?.url ? (
            <Image
              src={mainImage.url}
              alt={mainImage.altText ?? name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <ShoppingCart size={32} className="mx-auto mb-2 opacity-40" />
                <span className="text-xs">Hakuna Picha</span>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNewArrival && (
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                Mpya
              </span>
            )}
            {product.isBestDeal && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                Ofa
              </span>
            )}
            {hasDiscount && (
              <span className="bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                -{Math.round(((product.sellingPrice - product.discountPrice!) / product.sellingPrice) * 100)}%
              </span>
            )}
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                {t("outOfStock")}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 flex-1">
          <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">
            {language === "sw" ? product.category.nameSw : product.category.nameEn}
          </p>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {name}
          </h3>

          {/* Rating placeholder */}
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={12} className={star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
            ))}
            <span className="text-xs text-gray-400 ml-1">(4.0)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary-600 dark:text-primary-400 text-base">
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.sellingPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="px-3 pb-3 flex gap-2">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-lg transition-colors"
        >
          <ShoppingCart size={14} />
          <span className="hidden sm:inline">{t("addToCart")}</span>
          <span className="sm:hidden">Ongeza</span>
        </button>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          title="Inquire on WhatsApp"
        >
          <MessageCircle size={16} />
        </a>
      </div>
    </div>
  );
}
