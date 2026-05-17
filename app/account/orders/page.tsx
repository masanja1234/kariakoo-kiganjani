import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getMyOrders } from "@/actions/orders";
import { formatPrice } from "@/lib/utils";

export default async function MyOrdersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/auth/login");

  const orders = await getMyOrders();

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/account" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 text-sm">
            Akaunti
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Maagizo Yangu</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={64} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              Huna maagizo yoyote bado
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Anza kununua leo na upate bidhaa bora kwa bei za Kariakoo!
            </p>
            <Link href="/products" className="btn-primary inline-block">
              Nunua Sasa
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/track-order?order=${order.orderNumber}`}
                className="card p-5 flex flex-wrap items-center justify-between gap-4 hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-bold text-gray-900 dark:text-gray-100">#{order.orderNumber}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("sw-TZ")} · {order.items.length} bidhaa
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-primary-600 dark:text-primary-400">{formatPrice(order.total)}</p>
                    <StatusBadge status={order.paymentStatus} className="mt-1" />
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
