import { adminGetCustomers } from "@/actions/admin";
import { Users } from "lucide-react";

export default async function AdminCustomersPage() {
  const customers = await adminGetCustomers();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Wateja</h1>
      <div className="card overflow-hidden">
        {customers.length === 0 ? (
          <div className="text-center py-16">
            <Users size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-gray-500">Hakuna wateja bado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  {["Jina", "Barua Pepe", "Simu", "Mahali", "Tarehe"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{customer.name ?? "—"}</td>
                    <td className="py-3 px-4 text-gray-500">{customer.email ?? "—"}</td>
                    <td className="py-3 px-4 text-gray-500">{customer.phone ?? "—"}</td>
                    <td className="py-3 px-4 text-gray-500">{customer.location ?? "—"}</td>
                    <td className="py-3 px-4 text-gray-400">{new Date(customer.createdAt).toLocaleDateString("sw-TZ")}</td>
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
