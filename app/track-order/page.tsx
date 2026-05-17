"use client";

import { useState } from "react";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { getOrderByNumber } from "@/actions/orders";
import { Search, Package, Truck, CheckCircle, MessageCircle } from "lucide-react";
import { getOrderSupportLink } from "@/lib/whatsapp";
import type { OrderWithDetails } from "@/types";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setNotFound(false);
    try {
      const result = await getOrderByNumber(orderNumber.trim().toUpperCase());
      if (result) {
        setOrder(result as OrderWithDetails);
      } else {
        setNotFound(true);
        setOrder(null);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">📦</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Fuatilia Agizo Lako
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Ingiza namba ya agizo lako kujua hali yake
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Mfano: KK-ABC123-XYZ"
            className="input flex-1 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2 shrink-0"
          >
            <Search size={16} />
            {loading ? "Inatafuta..." : "Tafuta"}
          </button>
        </form>

        {notFound && (
          <div className="card p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Agizo lenye namba <strong>{orderNumber}</strong> halijapatikana.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Hakikisha namba ni sahihi. Kama tatizo linaendelea, wasiliana nasi WhatsApp.
            </p>
          </div>
        )}

        {order && (
          <div className="space-y-4">
            <div className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Namba ya Agizo</p>
                  <p className="font-bold text-lg text-gray-900 dark:text-gray-100">#{order.orderNumber}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-gray-100 dark:border-gray-800">
                <div>
                  <p className="text-xs text-gray-500">Mteja</p>
                  <p className="text-sm font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Malipo</p>
                  <StatusBadge status={order.paymentStatus} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Jumla</p>
                  <p className="text-sm font-bold text-primary-600 dark:text-primary-400">{formatPrice(order.total)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tarehe</p>
                  <p className="text-sm">{new Date(order.createdAt).toLocaleDateString("sw-TZ")}</p>
                </div>
              </div>

              {/* Status Steps */}
              <div className="mt-6">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {["PENDING", "CONFIRMED", "PAID", "PROCESSING", "OUT_FOR_DELIVERY", "COMPLETED"].map((status, i) => {
                    const statuses = ["PENDING", "CONFIRMED", "PAID", "PROCESSING", "OUT_FOR_DELIVERY", "COMPLETED"];
                    const currentIdx = statuses.indexOf(order.status);
                    const isActive = i <= currentIdx;
                    const icons = [Package, CheckCircle, CheckCircle, Package, Truck, CheckCircle];
                    const Icon = icons[i];
                    return (
                      <div key={status} className="flex items-center gap-1 shrink-0">
                        <div className={`flex flex-col items-center gap-1 ${isActive ? "text-primary-600" : "text-gray-300 dark:text-gray-700"}`}>
                          <Icon size={20} />
                          <span className="text-xs hidden sm:block whitespace-nowrap">
                            {["Imepokelewa", "Imethibitishwa", "Imelipwa", "Inashughulikiwa", "Inawasilishwa", "Imekamilika"][i]}
                          </span>
                        </div>
                        {i < 5 && <div className={`h-0.5 w-8 ${isActive ? "bg-primary-500" : "bg-gray-200 dark:bg-gray-800"}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery info */}
              {order.delivery && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Uwasilishaji</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {order.delivery.district}, {order.delivery.region} — {order.delivery.address}
                  </p>
                  {order.delivery.trackingNote && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 bg-gray-50 dark:bg-gray-900 p-2 rounded-lg">
                      📝 {order.delivery.trackingNote}
                    </p>
                  )}
                </div>
              )}
            </div>

            <a
              href={getOrderSupportLink(order.orderNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              <MessageCircle size={18} />
              Msaada wa WhatsApp kwa Agizo Hili
            </a>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
