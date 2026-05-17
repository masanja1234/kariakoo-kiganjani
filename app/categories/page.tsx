import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { CategoryCard } from "@/components/store/CategoryCard";
import { getCategories } from "@/actions/products";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-primary-600">Nyumbani</Link>
          <span className="mx-2">/</span>
          <span>Kategoria</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Kategoria Zote
        </h1>
        {categories.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Hakuna kategoria kwa sasa</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
