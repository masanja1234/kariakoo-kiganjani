import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { StatusBadge } from "@/components/shared/StatusBadge";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default async function AdminInventoryPage() {
  await requireAdmin();

  const [lowStock, outOfStock, allProducts] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, stockQuantity: { gt: 0, lte: 5 } },
      include: { category: true },
      orderBy: { stockQuantity: "asc" },
    }),
    prisma.product.findMany({
      where: { isActive: true, stockQuantity: 0 },
      include: { category: true },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { stockQuantity: "asc" },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Stoki / Inventory</h1>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-4 border-l-4 border-red-500">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{outOfStock.length}</p>
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">Hakuna Stoki</p>
        </div>
        <div className="card p-4 border-l-4 border-yellow-500">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{lowStock.length}</p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Stoki Ndogo (≤5)</p>
        </div>
        <div className="card p-4 border-l-4 border-green-500">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{allProducts.length - outOfStock.length - lowStock.length}</p>
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">Stoki Nzuri</p>
        </div>
      </div>

      {/* Out of Stock */}
      {outOfStock.length > 0 && (
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-red-500" />
            <h2 className="font-bold text-gray-900 dark:text-gray-100">Hakuna Stoki ({outOfStock.length})</h2>
          </div>
          <div className="space-y-2">
            {outOfStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{p.nameSw}</p>
                  <p className="text-xs text-gray-500">{p.category.nameSw}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status="OUT_OF_STOCK" />
                  <Link href={`/admin/products/${p.id}/edit`} className="text-xs text-blue-600 hover:underline">Hariri</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Stock */}
      {lowStock.length > 0 && (
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-yellow-500" />
            <h2 className="font-bold text-gray-900 dark:text-gray-100">Stoki Ndogo ({lowStock.length})</h2>
          </div>
          <div className="space-y-2">
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{p.nameSw}</p>
                  <p className="text-xs text-gray-500">{p.category.nameSw}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status="LOW_STOCK" />
                  <span className="text-sm font-bold text-yellow-600">{p.stockQuantity} zilizobaki</span>
                  <Link href={`/admin/products/${p.id}/edit`} className="text-xs text-blue-600 hover:underline">Hariri</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Products Table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-gray-100">Bidhaa Zote kwa Stoki</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {["Bidhaa", "Kategoria", "Stoki", "Hali"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allProducts.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <td className="py-2 px-4">
                    <Link href={`/admin/products/${p.id}/edit`} className="font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                      {p.nameSw}
                    </Link>
                  </td>
                  <td className="py-2 px-4 text-gray-500 text-sm">{p.category.nameSw}</td>
                  <td className="py-2 px-4 font-bold text-sm">{p.stockQuantity}</td>
                  <td className="py-2 px-4">
                    <StatusBadge status={p.stockQuantity === 0 ? "OUT_OF_STOCK" : p.stockQuantity <= 5 ? "LOW_STOCK" : "IN_STOCK"} />
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
