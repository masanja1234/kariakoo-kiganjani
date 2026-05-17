import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ShieldCheck, Truck, Wallet, Headphones, Search, ArrowRight, Star } from "lucide-react";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { ProductCard } from "@/components/store/ProductCard";
import { CategoryCard } from "@/components/store/CategoryCard";
import { getProducts, getCategories } from "@/actions/products";
import { getWhatsAppLink, getBudgetRequestLink } from "@/lib/whatsapp";

export const revalidate = 60;

export default async function HomePage() {
  const [featuredProducts, newArrivals, bestDeals, categories] = await Promise.all([
    getProducts({ featured: true, limit: 8 }),
    getProducts({ newArrivals: true, limit: 8 }),
    getProducts({ bestDeals: true, limit: 8 }),
    getCategories(),
  ]);

  const whatsappLink = getWhatsAppLink("Habari! Ninataka kununua bidhaa kutoka Kariakoo Kiganjani.");
  const budgetLink = getBudgetRequestLink("Bidhaa mbalimbali", 50000);

  const whyItems = [
    { icon: Wallet, title: "Bei za Kariakoo", desc: "Unapata bidhaa kwa bei halisi za Kariakoo bila usumbufu wa kwenda Kariakoo." },
    { icon: ShieldCheck, title: "Wasambazaji wa Kuaminika", desc: "Tunafanya kazi na wasambazaji wa kuaminika kutoka Kariakoo, Dar es Salaam." },
    { icon: Truck, title: "Uwasilishaji Rahisi", desc: "Tunawasilisha bidhaa hadi mlangoni mwako popote Tanzania." },
    { icon: Wallet, title: "Malipo Rahisi", desc: "Lipa kwa M-Pesa, Tigo Pesa, Airtel Money, Halopesa, au cash." },
    { icon: Headphones, title: "Msaada wa WhatsApp", desc: "Timu yetu iko tayari kukusaidia kupitia WhatsApp wakati wowote." },
    { icon: Search, title: "Tafuta kwa Budget Yako", desc: "Tujulishe budget yako na tutakutafutia bidhaa bora kwa bei za Kariakoo." },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 dark:from-primary-950 dark:via-primary-900 dark:to-primary-800 text-white overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-6 left-6 w-40 h-40 rounded-full overflow-hidden opacity-20">
              <Image src="/logo.png" alt="" fill className="object-contain" />
            </div>
            <div className="absolute -bottom-10 -right-10 w-80 h-80 rounded-full overflow-hidden opacity-20">
              <Image src="/logo.png" alt="" fill className="object-contain" />
            </div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-sm px-4 py-1.5 rounded-full mb-6">
                <Star size={14} className="text-yellow-300 fill-yellow-300" />
                <span>Soko Lako Lililo Mkononi</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                Kariakoo
                <span className="block text-yellow-300">Kiganjani</span>
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 font-medium mb-3">
                Pata Bidhaa Zote kwa Bei za Kariakoo
              </p>
              <p className="text-primary-200 text-base md:text-lg mb-8 leading-relaxed">
                Nunua bidhaa mbalimbali kwa bei za Kariakoo kupitia simu yako, bila kulazimika kuzunguka Kariakoo.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg"
                >
                  Nunua Sasa
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/budget-request"
                  className="inline-flex items-center gap-2 bg-yellow-400 text-primary-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-colors"
                >
                  <Search size={18} />
                  Tafuta kwa Budget
                </Link>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        {categories.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Kategoria</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Tazama bidhaa kwa kategoria</p>
              </div>
              <Link href="/categories" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium flex items-center gap-1 text-sm">
                Zote <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.slice(0, 12).map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </section>
        )}

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="bg-gray-50 dark:bg-gray-900/50 py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Bidhaa Maarufu</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Bidhaa zinazopendwa na wateja</p>
                </div>
                <Link href="/products?filter=featured" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium flex items-center gap-1 text-sm">
                  Zote <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Bidhaa Mpya</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Bidhaa mpya zilizowasili</p>
              </div>
              <Link href="/products?filter=new" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium flex items-center gap-1 text-sm">
                Zote <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Best Deals */}
        {bestDeals.length > 0 && (
          <section className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">🔥 Ofa Bora</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Bidhaa kwa bei za punguzo</p>
                </div>
                <Link href="/products?filter=deals" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium flex items-center gap-1 text-sm">
                  Zote <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {bestDeals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Why Buy From Us */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Kwa Nini Kariakoo Kiganjani?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Tunajua unataka bidhaa bora kwa bei nafuu — na hilo ndilo tunalotoa.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="card p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Budget Request CTA */}
        <section className="bg-gradient-to-r from-primary-700 to-primary-600 dark:from-primary-950 dark:to-primary-900 text-white py-16">
          <div className="max-w-3xl mx-auto text-center px-4">
            <div className="text-5xl mb-4">💰</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Tafuta Bidhaa kwa Budget Yako
            </h2>
            <p className="text-primary-100 text-lg mb-6">
              Una budget lakini hujui bidhaa gani kununua? Tujulishe na tutakusaidia kupata bidhaa bora kwa bei za Kariakoo.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/budget-request"
                className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors"
              >
                <Search size={18} />
                Tuma Ombi la Budget
              </Link>
              <a
                href={budgetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl transition-colors"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* Delivery Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="card p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="text-6xl">🚚</div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Uwasilishaji Tanzania Nzima
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Tunawasilisha bidhaa hadi mlangoni mwako katika mikoa yote ya Tanzania. Fuatilia agizo lako kwa wakati halisi.
              </p>
              <Link
                href="/track-order"
                className="inline-flex items-center gap-2 btn-primary"
              >
                <Truck size={16} />
                Fuatilia Agizo Lako
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
