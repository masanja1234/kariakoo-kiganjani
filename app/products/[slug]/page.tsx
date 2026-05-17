import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Truck, ShieldCheck, Star } from "lucide-react";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { ProductCard } from "@/components/store/ProductCard";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { getProductBySlug, getRelatedProducts } from "@/actions/products";
import { getProductInquiryLink } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);
  const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];
  const hasDiscount = product.discountPrice && product.discountPrice < product.sellingPrice;
  const displayPrice = hasDiscount ? product.discountPrice! : product.sellingPrice;
  const discountPct = hasDiscount
    ? Math.round(((product.sellingPrice - product.discountPrice!) / product.sellingPrice) * 100)
    : 0;
  const whatsappLink = getProductInquiryLink(product.nameSw, displayPrice);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-primary-600">Nyumbani</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-primary-600">Bidhaa</Link>
          <span className="mx-2">/</span>
          <Link href={`/categories/${product.category.slug}`} className="hover:text-primary-600">
            {product.category.nameSw}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 dark:text-gray-200">{product.nameSw}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Images */}
          <div>
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden mb-3">
              {mainImage?.url ? (
                <Image
                  src={mainImage.url}
                  alt={mainImage.altText ?? product.nameSw}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <div className="text-6xl mb-2">📦</div>
                    <p>Hakuna picha</p>
                  </div>
                </div>
              )}
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm">
                  -{discountPct}%
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img) => (
                  <div key={img.id} className="relative w-20 h-20 shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-primary-500">
                    <Image src={img.url} alt={img.altText ?? ""} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-1">
              {product.category.nameSw}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {product.nameSw}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} className={star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-sm text-gray-500">(4.0 · {product.reviews?.length ?? 0} tathmini)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {formatPrice(displayPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-gray-400 line-through mb-1">
                    {formatPrice(product.sellingPrice)}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Unaokoa {formatPrice(product.sellingPrice - product.discountPrice!)}
                </p>
              )}
            </div>

            {/* Stock */}
            <div className="mb-6">
              {product.stockQuantity === 0 ? (
                <span className="inline-flex items-center gap-1.5 text-sm text-red-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Hakuna Stoki
                </span>
              ) : product.stockQuantity <= 5 ? (
                <span className="inline-flex items-center gap-1.5 text-sm text-yellow-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" /> Inakwisha — {product.stockQuantity} zilizobaki
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500" /> Ipo Stokini
                </span>
              )}
            </div>

            {/* Description */}
            {product.descriptionSw && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Maelezo</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {product.descriptionSw}
                </p>
              </div>
            )}

            {/* SKU */}
            {product.sku && (
              <p className="text-xs text-gray-400 mb-4">SKU: {product.sku}</p>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <AddToCartButton product={product} />
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                <MessageCircle size={18} />
                Uliza WhatsApp
              </a>
            </div>

            {/* Trust badges */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Truck size={18} className="text-primary-600 shrink-0" />
                <span>Uwasilishaji Tanzania Nzima</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <ShieldCheck size={18} className="text-primary-600 shrink-0" />
                <span>Bidhaa za Kweli kutoka Kariakoo</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <MessageCircle size={18} className="text-green-500 shrink-0" />
                <span>Msaada wa WhatsApp 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Bidhaa Zinazofanana
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
