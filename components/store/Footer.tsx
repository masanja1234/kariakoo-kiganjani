"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Mail, MapPin, Phone, Facebook, Instagram, Twitter } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function Footer() {
  const year = new Date().getFullYear();
  const whatsappLink = getWhatsAppLink("Habari! Ninataka msaada na Kariakoo Kiganjani.");

  return (
    <footer className="bg-gray-950 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 bg-white rounded-lg p-1">
                <Image
                  src="/logo.png"
                  alt="Kariakoo Kiganjani"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div>
                <div className="text-primary-400 font-bold text-lg leading-tight">Kariakoo</div>
                <div className="text-primary-500 font-bold text-lg leading-tight -mt-1">Kiganjani</div>
              </div>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Pata Bidhaa Zote kwa Bei za Kariakoo. Soko Lako Lililo Mkononi.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Viungo vya Haraka</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Nyumbani" },
                { href: "/products", label: "Bidhaa" },
                { href: "/categories", label: "Kategoria" },
                { href: "/budget-request", label: "Budget Request" },
                { href: "/track-order", label: "Fuatilia Agizo" },
                { href: "/about", label: "Kuhusu Sisi" },
                { href: "/contact", label: "Wasiliana" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kategoria</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Fashion / Mitindo",
                "Simu & Accessories",
                "Electronics",
                "Urembo & Vipodozi",
                "Nyumba & Jikoni",
                "Watoto & Vijana",
                "Chakula & Nyumbani",
              ].map((cat) => (
                <li key={cat}>
                  <Link href="/categories" className="hover:text-primary-400 transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Mawasiliano</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-green-400 transition-colors"
                >
                  <MessageCircle size={16} className="text-green-400 shrink-0" />
                  +255 762 474 101
                </a>
              </li>
              <li>
                <a
                  href="tel:+255762474101"
                  className="flex items-center gap-2 hover:text-primary-400 transition-colors"
                >
                  <Phone size={16} className="text-primary-400 shrink-0" />
                  +255 762 474 101
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@kariakookiganjani.co.tz"
                  className="flex items-center gap-2 hover:text-primary-400 transition-colors"
                >
                  <Mail size={16} className="text-primary-400 shrink-0" />
                  info@kariakookiganjani.co.tz
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-primary-400 shrink-0 mt-0.5" />
                <span>Kariakoo, Dar es Salaam, Tanzania</span>
              </li>
            </ul>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              <MessageCircle size={16} />
              Zungumza Nasi WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>
            © {year} Kariakoo Kiganjani. Haki Zote Zimehifadhiwa.{" "}
            <span className="text-gray-600">|</span>{" "}
            <a href="http://kariakookiganjani.co.tz" className="hover:text-primary-400 transition-colors">
              kariakookiganjani.co.tz
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
