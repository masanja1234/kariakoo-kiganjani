"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight, MessageCircle } from "lucide-react";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { CartItemRow } from "@/components/store/CartItemRow";
import { useCart } from "@/components/shared/CartContext";
import { formatPrice } from "@/lib/utils";
import { getCheckoutSupportLink } from "@/lib/whatsapp";

export default function CartPage() {
  const { items, subtotal, clearCart } = useCart();

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Kikapu Changu
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={64} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              Kikapu chako ni tupu
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Bado hujaongeza bidhaa yoyote kwenye kikapu
            </p>
            <Link href="/products" className="btn-primary inline-block">
              Endelea Kununua
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 card p-4">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {items.length} bidhaa
                </span>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:text-red-600 transition-colors"
                >
                  Ondoa Zote
                </button>
              </div>
              {items.map((item) => (
                <CartItemRow key={item.productId} item={item} />
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-20">
                <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg">
                  Muhtasari wa Agizo
                </h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Jumla Ndogo</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Ada ya Uwasilishaji</span>
                    <span className="text-green-600 font-medium">Itahesabiwa</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900 dark:text-gray-100">Jumla</span>
                    <span className="font-bold text-primary-600 dark:text-primary-400 text-xl">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl transition-colors mb-3"
                >
                  Endelea na Malipo
                  <ArrowRight size={18} />
                </Link>

                <a
                  href={getCheckoutSupportLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full border-2 border-green-500 text-green-600 font-medium py-3 px-6 rounded-xl hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors"
                >
                  <MessageCircle size={16} />
                  Msaada wa WhatsApp
                </a>

                <Link
                  href="/products"
                  className="block text-center text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mt-3 transition-colors"
                >
                  ← Endelea Kununua
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
