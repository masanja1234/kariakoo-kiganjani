import { notFound } from "next/navigation";
import { adminGetProductById } from "@/actions/products";
import { getCategories } from "@/actions/products";
import { adminGetSuppliers } from "@/actions/admin";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, suppliers] = await Promise.all([
    adminGetProductById(id),
    getCategories(),
    adminGetSuppliers(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Hariri Bidhaa: {product.nameSw}
      </h1>
      <ProductForm product={product} categories={categories} suppliers={suppliers} />
    </div>
  );
}
