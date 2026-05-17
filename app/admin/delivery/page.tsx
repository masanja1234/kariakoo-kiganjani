import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DeliveryStatusSelect } from "@/components/admin/DeliveryStatusSelect";
import Link from "next/link";
import { Truck } from "lucide-react";

export default async function AdminDeliveryPage() {
  await requireAdmin();

  const deliveries = await prisma.delivery.findMany({
    include: { order: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Uwasilishaji</h1>
      <div className="card overflow-hidden">
        {deliveries.length === 0 ? (
          <div className="text-center py-16">
            <Truck size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-gray-500">Hakuna uwasilishaji</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  {["Agizo", "Mteja", "Mkoa", "Wilaya", "Hali", "Rider", "Tarehe", "Badilisha Hali"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deliveries.map((delivery) => (
                  <tr key={delivery.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="py-3 px-4">
                      <Link href={`/admin/orders/${delivery.orderId}`} className="text-primary-600 hover:underline font-medium">
                        #{delivery.order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{delivery.order.customerName}</td>
                    <td className="py-3 px-4 text-gray-500">{delivery.region}</td>
                    <td className="py-3 px-4 text-gray-500">{delivery.district}</td>
                    <td className="py-3 px-4"><StatusBadge status={delivery.status} /></td>
                    <td className="py-3 px-4 text-gray-500">{delivery.riderName ?? "—"}</td>
                    <td className="py-3 px-4 text-gray-400 whitespace-nowrap">
                      {new Date(delivery.createdAt).toLocaleDateString("sw-TZ")}
                    </td>
                    <td className="py-3 px-4">
                      <DeliveryStatusSelect
                        deliveryId={delivery.id}
                        currentStatus={delivery.status}
                      />
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
