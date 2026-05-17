import Link from "next/link";
import { adminGetOrders } from "@/actions/orders";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

interface SearchParams { status?: string; paymentStatus?: string; search?: string; }

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const orders = await adminGetOrders({
    status: params.status,
    paymentStatus: params.paymentStatus,
    search: params.search,
  });

  const ORDER_STATUSES = [
    "PENDING", "CONFIRMED", "AWAITING_PAYMENT", "PAID",
    "PROCESSING", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED",
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Maagizo</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto">
        <Link
          href="/admin/orders"
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${!params.status ? "bg-primary-600 text-white border-primary-600" : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-500"}`}
        >
          Yote
        </Link>
        {ORDER_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${params.status === s ? "bg-primary-600 text-white border-primary-600" : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-500"}`}
          >
            <StatusBadge status={s} />
          </Link>
        ))}
      </div>

      <div className="card overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Hakuna maagizo</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  {["Agizo", "Mteja", "Simu", "Jumla", "Malipo", "Hali", "Tarehe", ""].map((h) => (
                    <th key={h} className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="py-3 px-4">
                      <Link href={`/admin/orders/${order.id}`} className="font-medium text-primary-600 dark:text-primary-400 hover:underline">
                        #{order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{order.customerName}</td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{order.customerPhone}</td>
                    <td className="py-3 px-4 font-medium">{formatPrice(order.total)}</td>
                    <td className="py-3 px-4"><StatusBadge status={order.paymentStatus} /></td>
                    <td className="py-3 px-4"><StatusBadge status={order.status} /></td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("sw-TZ")}
                    </td>
                    <td className="py-3 px-4">
                      <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline text-xs">
                        Tazama →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
