import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { ProductCard } from "@/components/store/ProductCard";
import { getProducts, getCategories } from "@/actions/products";
import Link from "next/link";

interface SearchParams {
  search?: string;
  category?: string;
  filter?: string;
  page?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const limit = 24;
  const skip = (page - 1) * limit;

  const [products, categories] = await Promise.all([
    getProducts({
      search: params.search,
      categorySlug: params.category,
      featured: params.filter === "featured" ? true : undefined,
      newArrivals: params.filter === "new" ? true : undefined,
      bestDeals: params.filter === "deals" ? true : undefined,
      limit,
      skip,
    }),
    getCategories(),
  ]);

  const filterLabel =
    params.filter === "featured"
      ? "Bidhaa Maarufu"
      : params.filter === "new"
      ? "Bidhaa Mpya"
      : params.filter === "deals"
      ? "Ofa Bora"
      : params.search
      ? `Matokeo: "${params.search}"`
      : "Bidhaa Zote";

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-primary-600">Nyumbani</Link>
          <span className="mx-2">/</span>
          <span>Bidhaa</span>
        </nav>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className="hidden md:block w-56 shrink-0">
            <div className="card p-4 sticky top-20">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Kategoria</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/products"
                    className={`block py-1.5 px-3 rounded-lg text-sm transition-colors ${
                      !params.category
                        ? "bg-primary-600 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                    }`}
                  >
                    Zote
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/products?category=${cat.slug}`}
                      className={`block py-1.5 px-3 rounded-lg text-sm transition-colors ${
                        params.category === cat.slug
                          ? "bg-primary-600 text-white"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                      }`}
                    >
                      {cat.nameSw}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{filterLabel}</h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">{products.length} bidhaa</span>
            </div>

            {/* Mobile Category Filter */}
            <div className="md:hidden flex gap-2 overflow-x-auto pb-2 mb-4">
              <Link
                href="/products"
                className={`shrink-0 text-sm px-3 py-1.5 rounded-full border ${
                  !params.category ? "bg-primary-600 text-white border-primary-600" : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                Zote
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`shrink-0 text-sm px-3 py-1.5 rounded-full border ${
                    params.category === cat.slug ? "bg-primary-600 text-white border-primary-600" : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {cat.nameSw}
                </Link>
              ))}
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🛍️</div>
                <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Hakuna bidhaa</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {params.search
                    ? `Hakuna bidhaa zinazolingana na "${params.search}"`
                    : "Hakuna bidhaa kwa sasa"}
                </p>
                <Link href="/products" className="btn-primary inline-block">
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
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
