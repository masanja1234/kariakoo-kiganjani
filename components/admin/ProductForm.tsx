"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, Star } from "lucide-react";
import Image from "next/image";
import { productSchema, type ProductInput } from "@/lib/validations";
import { adminCreateProduct, adminUpdateProduct, adminAddProductImage } from "@/actions/products";
import { uploadProductImage } from "@/actions/uploads";
import { generateSlug, calculateProfitMargin, formatPrice } from "@/lib/utils";
import type { Category } from "@/types";

interface ProductFormProps {
  product?: {
    id: string;
    nameSw: string;
    nameEn: string;
    slug: string;
    descriptionSw?: string | null;
    descriptionEn?: string | null;
    categoryId: string;
    supplierId?: string | null;
    sellingPrice: number;
    supplierCostPrice?: number | null;
    discountPrice?: number | null;
    stockQuantity: number;
    sku?: string | null;
    isActive: boolean;
    isFeatured: boolean;
    isNewArrival: boolean;
    isBestDeal: boolean;
    adminNotes?: string | null;
    images: { id: string; url: string; isMain: boolean; altText?: string | null }[];
  };
  categories: Category[];
  suppliers?: { id: string; name: string }[];
}

export function ProductForm({ product, categories, suppliers }: ProductFormProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [profitInfo, setProfitInfo] = useState<{ profit: number; marginPercent: number } | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nameSw: product?.nameSw ?? "",
      nameEn: product?.nameEn ?? "",
      slug: product?.slug ?? "",
      descriptionSw: product?.descriptionSw ?? "",
      descriptionEn: product?.descriptionEn ?? "",
      categoryId: product?.categoryId ?? "",
      supplierId: product?.supplierId ?? "",
      sellingPrice: product?.sellingPrice ?? 0,
      supplierCostPrice: product?.supplierCostPrice ?? undefined,
      discountPrice: product?.discountPrice ?? undefined,
      stockQuantity: product?.stockQuantity ?? 0,
      sku: product?.sku ?? "",
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
      isNewArrival: product?.isNewArrival ?? false,
      isBestDeal: product?.isBestDeal ?? false,
      adminNotes: product?.adminNotes ?? "",
    },
  });

  const sellingPrice = watch("sellingPrice");
  const supplierCostPrice = watch("supplierCostPrice");

  function updateProfit() {
    if (sellingPrice && supplierCostPrice) {
      setProfitInfo(calculateProfitMargin(sellingPrice, supplierCostPrice));
    }
  }

  function handleNameSwChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue("nameSw", e.target.value);
    if (!product) {
      setValue("slug", generateSlug(e.target.value));
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !product) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { url, path } = await uploadProductImage(formData);
      await adminAddProductImage({
        productId: product.id,
        url,
        path,
        isMain: product.images.length === 0,
      });
      router.refresh();
    } catch {
      alert("Hitilafu wakati wa kupakia picha");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(data: ProductInput) {
    try {
      if (product) {
        await adminUpdateProduct(product.id, {
          ...data,
          supplierId: data.supplierId || undefined,
          sku: data.sku || undefined,
        });
      } else {
        await adminCreateProduct({
          ...data,
          supplierId: data.supplierId || undefined,
          sku: data.sku || undefined,
        });
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      alert("Kuna tatizo. Jaribu tena.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Taarifa za Msingi</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Jina (Kiswahili) *</label>
                  <input {...register("nameSw")} onChange={handleNameSwChange} className="input" placeholder="Jina la bidhaa kwa Kiswahili" />
                  {errors.nameSw && <p className="text-red-500 text-xs mt-1">{errors.nameSw.message}</p>}
                </div>
                <div>
                  <label className="label">Jina (English) *</label>
                  <input {...register("nameEn")} className="input" placeholder="Product name in English" />
                  {errors.nameEn && <p className="text-red-500 text-xs mt-1">{errors.nameEn.message}</p>}
                </div>
              </div>
              <div>
                <label className="label">Slug *</label>
                <input {...register("slug")} className="input font-mono text-sm" placeholder="product-slug" />
                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Maelezo (Kiswahili)</label>
                  <textarea {...register("descriptionSw")} className="input resize-none" rows={3} placeholder="Maelezo kwa Kiswahili" />
                </div>
                <div>
                  <label className="label">Description (English)</label>
                  <textarea {...register("descriptionEn")} className="input resize-none" rows={3} placeholder="Product description in English" />
                </div>
              </div>
              <div>
                <label className="label">SKU</label>
                <input {...register("sku")} className="input" placeholder="KK-001" />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Bei na Faida (Admin Only)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Bei ya Kununua (Supplier) *</label>
                <input {...register("supplierCostPrice", { valueAsNumber: true })} onChange={updateProfit} type="number" className="input" placeholder="0" min={0} />
              </div>
              <div>
                <label className="label">Bei ya Kuuza *</label>
                <input {...register("sellingPrice", { valueAsNumber: true })} onChange={updateProfit} type="number" className="input" placeholder="0" min={0} />
                {errors.sellingPrice && <p className="text-red-500 text-xs mt-1">{errors.sellingPrice.message}</p>}
              </div>
              <div>
                <label className="label">Bei ya Punguzo</label>
                <input {...register("discountPrice", { valueAsNumber: true })} type="number" className="input" placeholder="0" min={0} />
              </div>
            </div>
            {profitInfo && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg text-sm">
                <span className="text-green-700 dark:text-green-400 font-medium">
                  Faida: {formatPrice(profitInfo.profit)} ({profitInfo.marginPercent.toFixed(1)}%)
                </span>
              </div>
            )}
          </div>

          {/* Stock */}
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Stoki</h2>
            <div>
              <label className="label">Idadi ya Stoki *</label>
              <input {...register("stockQuantity", { valueAsNumber: true })} type="number" className="input max-w-40" placeholder="0" min={0} />
              {errors.stockQuantity && <p className="text-red-500 text-xs mt-1">{errors.stockQuantity.message}</p>}
            </div>
          </div>

          {/* Admin Notes */}
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Maelezo ya Ndani (Admin Only)</h2>
            <textarea {...register("adminNotes")} className="input resize-none" rows={3} placeholder="Maelezo ya ndani ambayo wateja hawataona..." />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Hali ya Bidhaa</h3>
            <div className="space-y-3">
              {[
                { field: "isActive" as const, label: "Inafanya Kazi" },
                { field: "isFeatured" as const, label: "Maarufu" },
                { field: "isNewArrival" as const, label: "Bidhaa Mpya" },
                { field: "isBestDeal" as const, label: "Ofa Bora" },
              ].map((item) => (
                <label key={item.field} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register(item.field)} className="rounded text-primary-600 w-4 h-4" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category & Supplier */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Kategoria & Msambazaji</h3>
            <div className="space-y-3">
              <div>
                <label className="label">Kategoria *</label>
                <select {...register("categoryId")} className="input text-sm">
                  <option value="">Chagua Kategoria</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.nameSw}</option>)}
                </select>
                {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
              </div>
              <div>
                <label className="label">Msambazaji (Admin Only)</label>
                <select {...register("supplierId")} className="input text-sm">
                  <option value="">Chagua Msambazaji</option>
                  {suppliers?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          {product && (
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Picha za Bidhaa</h3>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {product.images.map((img) => (
                  <div key={img.id} className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <Image src={img.url} alt={img.altText ?? ""} fill className="object-cover" />
                    {img.isMain && <Star size={12} className="absolute top-1 left-1 text-yellow-400 fill-yellow-400" />}
                  </div>
                ))}
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-primary-600 dark:text-primary-400 hover:underline">
                <Upload size={14} />
                {uploading ? "Inapakia..." : "Pakia Picha"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 btn-primary"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Inahifadhi...
              </>
            ) : (
              product ? "Hifadhi Mabadiliko" : "Ongeza Bidhaa"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
