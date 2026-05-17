import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, MapPin, Bell } from "lucide-react";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";

export default async function AccountPage() {
  const user = await currentUser();
  if (!user) redirect("/auth/login");

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Akaunti Yangu</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile */}
          <div className="card p-6 text-center">
            <div className="w-20 h-20 bg-primary-600 text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">
              {user.firstName?.[0] ?? user.emailAddresses[0]?.emailAddress[0].toUpperCase()}
            </div>
            <h2 className="font-bold text-gray-900 dark:text-gray-100">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>

          {/* Quick links */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { href: "/account/orders", icon: ShoppingBag, label: "Maagizo Yangu", desc: "Tazama historia ya maagizo" },
              { href: "/track-order", icon: MapPin, label: "Fuatilia Agizo", desc: "Angalia hali ya agizo lako" },
              { href: "/budget-request", icon: Bell, label: "Budget Request", desc: "Omba bidhaa kwa budget yako" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="card p-5 hover:shadow-md transition-shadow group">
                  <Icon size={24} className="text-primary-600 dark:text-primary-400 mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {item.label}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
