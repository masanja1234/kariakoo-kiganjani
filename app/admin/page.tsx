import { getDashboardStats } from "@/actions/admin";
import { formatPrice } from "@/lib/utils";
import {
  TrendingUp, ShoppingBag, Package, Users, Store, MessageSquare,
  Bell, AlertTriangle, Clock, DollarSign
} from "lucide-react";
import Link from "next/link";
import { adminGetOrders } from "@/actions/orders";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default async function AdminDashboard() {
  const [stats, recentOrders] = await Promise.all([
    getDashboardStats(),
    adminGetOrders({ limit: 5 }),
  ]);

  const statCards = [
    {
      label: "Jumla ya Mauzo",
      value: formatPrice(stats.totalSales),
      icon: DollarSign,
      iconClass: "bg-green-100 dark:bg-green-950/30 text-green-600",
      href: "/admin/payments",
    },
    {
      label: "Faida Yote",
      value: formatPrice(stats.totalProfit),
      icon: TrendingUp,
      iconClass: "bg-primary-100 dark:bg-primary-950/30 text-primary-600",
      href: "/admin/payments",
    },
    {
      label: "Maagizo Yote",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      iconClass: "bg-blue-100 dark:bg-blue-950/30 text-blue-600",
      href: "/admin/orders",
    },
    {
      label: "Maagizo Yanayosubiri",
      value: stats.pendingOrders.toString(),
      icon: Clock,
      iconClass: "bg-orange-100 dark:bg-orange-950/30 text-orange-600",
      href: "/admin/orders?status=PENDING",
    },
    {
      label: "Bidhaa Zote",
      value: stats.totalProducts.toString(),
      icon: Package,
      iconClass: "bg-purple-100 dark:bg-purple-950/30 text-purple-600",
      href: "/admin/products",
    },
    {
      label: "Stoki Ndogo",
      value: stats.lowStockProducts.toString(),
      icon: AlertTriangle,
      iconClass: "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-600",
      href: "/admin/inventory",
    },
    {
      label: "Wateja Wote",
      value: stats.totalCustomers.toString(),
      icon: Users,
      iconClass: "bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600",
      href: "/admin/customers",
    },
    {
      label: "Wasambazaji",
      value: stats.totalSuppliers.toString(),
      icon: Store,
      iconClass: "bg-teal-100 dark:bg-teal-950/30 text-teal-600",
      href: "/admin/suppliers",
    },
    {
      label: "Maombi Mapya ya Budget",
      value: stats.newBudgetRequests.toString(),
      icon: MessageSquare,
      iconClass: "bg-pink-100 dark:bg-pink-950/30 text-pink-600",
      href: "/admin/budget-requests",
    },
    {
      label: "Arifa Mpya",
      value: stats.unreadNotifications.toString(),
      icon: Bell,
      iconClass: "bg-red-100 dark:bg-red-950/30 text-red-600",
      href: "/admin/notifications",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashibodi</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Karibu kwenye Kariakoo Kiganjani Admin Panel
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 text-sm">
          <Package size={16} />
          Ongeza Bidhaa
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="card p-4 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 ${card.iconClass} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={20} />
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{card.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{card.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-gray-100">Maagizo ya Hivi Karibuni</h2>
          <Link href="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Tazama Yote →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Hakuna maagizo bado</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-2 text-gray-500 dark:text-gray-400 font-medium">Agizo</th>
                  <th className="text-left py-2 text-gray-500 dark:text-gray-400 font-medium">Mteja</th>
                  <th className="text-left py-2 text-gray-500 dark:text-gray-400 font-medium">Jumla</th>
                  <th className="text-left py-2 text-gray-500 dark:text-gray-400 font-medium">Malipo</th>
                  <th className="text-left py-2 text-gray-500 dark:text-gray-400 font-medium">Hali</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <td className="py-3">
                      <Link href={`/admin/orders/${order.id}`} className="font-medium text-primary-600 dark:text-primary-400 hover:underline">
                        #{order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 text-gray-700 dark:text-gray-300">{order.customerName}</td>
                    <td className="py-3 font-medium">{formatPrice(order.total)}</td>
                    <td className="py-3"><StatusBadge status={order.paymentStatus} /></td>
                    <td className="py-3"><StatusBadge status={order.status} /></td>
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
