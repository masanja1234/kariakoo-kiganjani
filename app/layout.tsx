import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { LanguageProvider } from "@/components/shared/LanguageContext";
import { CartProvider } from "@/components/shared/CartContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Kariakoo Kiganjani — Pata Bidhaa Zote kwa Bei za Kariakoo",
  description:
    "Nunua bidhaa mbalimbali kwa bei za Kariakoo kupitia simu yako, bila kulazimika kuzunguka Kariakoo.",
  keywords: ["Kariakoo", "Tanzania", "ecommerce", "Dar es Salaam", "bidhaa", "online shopping"],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Kariakoo Kiganjani",
    description: "Pata Bidhaa Zote kwa Bei za Kariakoo",
    siteName: "Kariakoo Kiganjani",
    images: [{ url: "/logo.png", width: 1024, height: 1024, alt: "Kariakoo Kiganjani" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="sw" suppressHydrationWarning>
        <body className={inter.variable}>
          <ThemeProvider>
            <LanguageProvider>
              <CartProvider>{children}</CartProvider>
            </LanguageProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
