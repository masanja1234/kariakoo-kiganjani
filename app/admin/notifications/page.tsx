import { adminGetNotifications } from "@/actions/admin";
import { Bell } from "lucide-react";
import { MarkAllReadButton } from "@/components/admin/MarkAllReadButton";

export default async function AdminNotificationsPage() {
  const notifications = await adminGetNotifications();

  const typeLabels: Record<string, string> = {
    NEW_ORDER: "Agizo Jipya",
    NEW_PAYMENT: "Malipo Mapya",
    PAYMENT_CONFIRMED: "Malipo Yamethibitishwa",
    NEW_BUDGET_REQUEST: "Ombi Jipya la Budget",
    LOW_STOCK: "Stoki Ndogo",
    DELIVERY_UPDATE: "Habari za Uwasilishaji",
    CUSTOMER_MESSAGE: "Ujumbe wa Mteja",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Arifa</h1>
        <MarkAllReadButton />
      </div>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="card text-center py-16">
            <Bell size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-gray-500">Hakuna arifa</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`card p-4 flex items-start gap-3 ${!notification.isRead ? "border-l-4 border-primary-500" : ""}`}
            >
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${notification.isRead ? "bg-gray-300" : "bg-primary-500"}`} />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{notification.title}</p>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(notification.createdAt).toLocaleString("sw-TZ")}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{notification.message}</p>
                <span className="text-xs text-gray-400 mt-1 inline-block">{typeLabels[notification.type] ?? notification.type}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
