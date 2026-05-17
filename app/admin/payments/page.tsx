import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { PaymentActions } from "@/components/admin/PaymentActions";

export default async function AdminPaymentsPage() {
  await requireAdmin();

  const payments = await prisma.payment.findMany({
    include: { order: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Malipo</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <tr>
                {["Agizo", "Njia", "Kiasi", "Ref", "Hali", "Tarehe", "Vitendo"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="py-3 px-4">
                    <Link href={`/admin/orders/${payment.orderId}`} className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                      #{payment.order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3 px-4"><StatusBadge status={payment.method} /></td>
                  <td className="py-3 px-4 font-medium">{formatPrice(payment.amount)}</td>
                  <td className="py-3 px-4 font-mono text-xs text-gray-500">{payment.transactionReference ?? "—"}</td>
                  <td className="py-3 px-4"><StatusBadge status={payment.status} /></td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                    {new Date(payment.createdAt).toLocaleDateString("sw-TZ")}
                  </td>
                  <td className="py-3 px-4">
                    {payment.status === "PENDING" && (
                      <PaymentActions paymentId={payment.id} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
