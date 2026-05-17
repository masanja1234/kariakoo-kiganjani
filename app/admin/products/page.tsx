import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Package, Eye } from "lucide-react";
import { adminGetProducts, getCategories } from "@/actions/products";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatPrice } from "@/lib/utils";

interface SearchParams { search?: string; categoryId?: string; status?: string; }

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    adminGetProducts({
      search: params.search,
      categoryId: params.categoryId,
      isActive: params.status === "active" ? true : params.status === "inactive" ? false : undefined,
    }),
    getCategories(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Bidhaa</h1>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />
          Ongeza Bidhaa
        </Link>
      </div>

      {/* Filters */}
      <form className="card p-4 mb-6 flex flex-wrap gap-3" method="GET">
        <div className="flex-1 min-w-48">
          <input
            name="search"
            defaultValue={params.search}
            placeholder="Tafuta bidhaa..."
            className="input text-sm"
          />
        </div>
        <select name="categoryId" defaultValue={params.categoryId} className="input text-sm w-auto">
          <option value="">Kategoria Zote</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.nameSw}</option>)}
        </select>
        <select name="status" defaultValue={params.status} className="input text-sm w-auto">
          <option value="">Hali Zote</option>
          <option value="active">Inafanya Kazi</option>
          <option value="inactive">Haifanyi Kazi</option>
        </select>
        <button type="submit" className="btn-primary text-sm">Tafuta</button>
      </form>

      {/* Table */}
      <div className="card overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Hakuna bidhaa</p>
            <Link href="/admin/products/new" className="btn-primary inline-block mt-4 text-sm">
              Ongeza Bidhaa ya Kwanza
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Bidhaa</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Kategoria</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Bei</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Stoki</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Hali</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Vitendo</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];
                  return (
                    <tr key={product.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shrink-0">
                            {mainImage?.url ? (
                              <Image src={mainImage.url} alt={product.nameSw} fill className="object-cover" />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400">
                                <Package size={16} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{product.nameSw}</p>
                            {product.sku && <p className="text-xs text-gray-400">SKU: {product.sku}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{product.category.nameSw}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium">{formatPrice(product.sellingPrice)}</p>
                        {product.discountPrice && (
                          <p className="text-xs text-red-500">{formatPrice(product.discountPrice)}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          status={product.stockQuantity === 0 ? "OUT_OF_STOCK" : product.stockQuantity <= 5 ? "LOW_STOCK" : "IN_STOCK"}
                        />
                        <p className="text-xs text-gray-400 mt-0.5">{product.stockQuantity} zilizobaki</p>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={product.isActive ? "ACTIVE" : "INACTIVE"} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/products/${product.id}/edit`} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors" title="Hariri">
                            <Edit size={16} />
                          </Link>
                          <Link href={`/products/${product.slug}`} target="_blank" className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" title="Tazama">
                            <Eye size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
