import { getCategories } from "@/actions/products";
import { adminGetSuppliers } from "@/actions/admin";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const [categories, suppliers] = await Promise.all([
    getCategories(),
    adminGetSuppliers(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Ongeza Bidhaa Mpya</h1>
      <ProductForm categories={categories} suppliers={suppliers} />
    </div>
  );
}
