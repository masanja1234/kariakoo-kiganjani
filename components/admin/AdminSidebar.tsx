"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Tag, ShoppingBag, CreditCard,
  Boxes, Users, Truck, Bell, Settings, Menu, X,
  MessageSquare, UserCog, Store, ChevronRight
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";

const navItems = [
  { href: "/admin", label: "Muhtasari", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Bidhaa", icon: Package },
  { href: "/admin/categories", label: "Kategoria", icon: Tag },
  { href: "/admin/orders", label: "Maagizo", icon: ShoppingBag },
  { href: "/admin/payments", label: "Malipo", icon: CreditCard },
  { href: "/admin/inventory", label: "Stoki", icon: Boxes },
  { href: "/admin/suppliers", label: "Wasambazaji", icon: Store },
  { href: "/admin/customers", label: "Wateja", icon: Users },
  { href: "/admin/budget-requests", label: "Budget Requests", icon: MessageSquare },
  { href: "/admin/delivery", label: "Uwasilishaji", icon: Truck },
  { href: "/admin/notifications", label: "Arifa", icon: Bell },
  { href: "/admin/settings", label: "Mipangilio", icon: Settings },
  { href: "/admin/users", label: "Watumiaji", icon: UserCog },
];

function SidebarContent({
  pathname,
  onNavClick,
}: {
  pathname: string;
  onNavClick: () => void;
}) {
  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image src="/logo.png" alt="KK" fill className="object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display="none"; }} />
          </div>
          <div>
            <div className="text-primary-600 font-bold text-sm leading-tight">Kariakoo</div>
            <div className="text-primary-500 font-bold text-sm leading-tight">Kiganjani Admin</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                active
                  ? "bg-primary-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
              )}
            >
              <Icon size={18} className="shrink-0" />
              <span>{item.label}</span>
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserButton afterSignOutUrl="/" />
          <span className="text-xs text-gray-500 dark:text-gray-400">Admin</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeSwitcher />
          <Link href="/" className="text-xs text-gray-500 hover:text-primary-600 transition-colors px-2 py-1">
            ← Duka
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0">
        <SidebarContent pathname={pathname} onNavClick={() => {}} />
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-4 left-4 z-50 bg-primary-600 text-white p-3 rounded-full shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-white dark:bg-gray-950 h-full flex flex-col shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <X size={20} />
            </button>
            <SidebarContent pathname={pathname} onNavClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
