import { notFound } from "next/navigation";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { ProductCard } from "@/components/store/ProductCard";
import { getProducts, getCategoryBySlug } from "@/actions/products";
import Link from "next/link";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    getProducts({ categorySlug: slug }),
  ]);

  if (!category) notFound();

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-primary-600">Nyumbani</Link>
          <span className="mx-2">/</span>
          <Link href="/categories" className="hover:text-primary-600">Kategoria</Link>
          <span className="mx-2">/</span>
          <span>{category.nameSw}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {category.nameSw}
          </h1>
          {category.descriptionSw && (
            <p className="text-gray-500 dark:text-gray-400 mt-2">{category.descriptionSw}</p>
          )}
          <p className="text-sm text-gray-400 mt-1">{products.length} bidhaa</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🛍️</div>
            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              Hakuna bidhaa katika kategoria hii
            </h2>
            <Link href="/products" className="btn-primary inline-block mt-4">
              Tazama Bidhaa Zote
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
