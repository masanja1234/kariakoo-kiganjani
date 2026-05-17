import { adminGetBudgetRequests } from "@/actions/budgetRequests";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { MessageCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import { BudgetRequestStatusUpdater } from "@/components/admin/BudgetRequestStatusUpdater";

interface SearchParams { status?: string; }

export default async function AdminBudgetRequestsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const requests = await adminGetBudgetRequests({ status: params.status });

  const STATUSES = ["NEW", "REVIEWING", "SUPPLIER_FOUND", "QUOTATION_SENT", "COMPLETED", "CANCELLED"];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Maombi ya Budget</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <Link href="/admin/budget-requests" className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${!params.status ? "bg-primary-600 text-white border-primary-600" : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400"}`}>
          Yote
        </Link>
        {STATUSES.map((s) => (
          <Link key={s} href={`/admin/budget-requests?status=${s}`} className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${params.status === s ? "bg-primary-600 text-white border-primary-600" : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400"}`}>
            {s}
          </Link>
        ))}
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="card text-center py-16">
            <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Hakuna maombi</p>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">{req.fullName}</h3>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    <strong>Bidhaa:</strong> {req.productNeeded}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Budget: <strong className="text-primary-600">{formatPrice(req.budget)}</strong>
                    {" · "} Idadi: {req.quantity}
                    {" · "} {req.location}
                    {req.deliveryNeeded && " · Uwasilishaji"}
                  </p>
                  {req.extraDetails && <p className="text-xs text-gray-500 mt-1">{req.extraDetails}</p>}
                  {req.adminNotes && <p className="text-xs bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 p-2 rounded mt-2">{req.adminNotes}</p>}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <a
                    href={`https://wa.me/${req.whatsappPhone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <MessageCircle size={14} />
                    {req.whatsappPhone}
                  </a>
                  <BudgetRequestStatusUpdater requestId={req.id} currentStatus={req.status} />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">{new Date(req.createdAt).toLocaleString("sw-TZ")}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
