"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import {
  publicProductSelect,
  publicProductDetailSelect,
  publicCategorySelect,
} from "@/lib/selectors";
import type { ProductWithImages, ProductWithDetails } from "@/types";

export async function getProducts(opts?: {
  categorySlug?: string;
  featured?: boolean;
  newArrivals?: boolean;
  bestDeals?: boolean;
  search?: string;
  limit?: number;
  skip?: number;
}) {
  const where: Record<string, unknown> = { isActive: true };

  if (opts?.categorySlug) {
    where.category = { slug: opts.categorySlug };
  }
  if (opts?.featured) where.isFeatured = true;
  if (opts?.newArrivals) where.isNewArrival = true;
  if (opts?.bestDeals) where.isBestDeal = true;
  if (opts?.search) {
    where.OR = [
      { nameSw: { contains: opts.search, mode: "insensitive" } },
      { nameEn: { contains: opts.search, mode: "insensitive" } },
      { descriptionSw: { contains: opts.search, mode: "insensitive" } },
      { descriptionEn: { contains: opts.search, mode: "insensitive" } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    select: publicProductSelect,
    take: Math.min(opts?.limit ?? 50, 100),
    skip: opts?.skip ?? 0,
    orderBy: { createdAt: "desc" },
  });

  return products as unknown as ProductWithImages[];
}

export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    select: publicProductDetailSelect,
  });
  return product as unknown as ProductWithDetails | null;
}

export async function getRelatedProducts(categoryId: string, excludeId: string) {
  return prisma.product.findMany({
    where: { categoryId, id: { not: excludeId }, isActive: true },
    select: publicProductSelect,
    take: 4,
  }) as unknown as Promise<ProductWithImages[]>;
}

export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    select: publicCategorySelect,
    orderBy: { nameSw: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    select: publicCategorySelect,
  });
}

// ─── Admin-only product actions ───────────────────────────────────────────────

export async function adminGetProducts(opts?: {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  limit?: number;
  skip?: number;
}) {
  await requireAdmin();

  const where: Record<string, unknown> = {};
  if (opts?.search) {
    where.OR = [
      { nameSw: { contains: opts.search, mode: "insensitive" } },
      { nameEn: { contains: opts.search, mode: "insensitive" } },
      { sku: { contains: opts.search, mode: "insensitive" } },
    ];
  }
  if (opts?.categoryId) where.categoryId = opts.categoryId;
  if (opts?.isActive !== undefined) where.isActive = opts.isActive;

  return prisma.product.findMany({
    where,
    include: { images: true, category: true, supplier: true },
    take: Math.min(opts?.limit ?? 50, 200),
    skip: opts?.skip ?? 0,
    orderBy: { createdAt: "desc" },
  });
}

export async function adminGetProductById(id: string) {
  await requireAdmin();
  return prisma.product.findUnique({
    where: { id },
    include: { images: true, category: true, supplier: true, variants: true },
  });
}

export async function adminCreateProduct(data: {
  nameSw: string;
  nameEn: string;
  slug: string;
  descriptionSw?: string;
  descriptionEn?: string;
  categoryId: string;
  supplierId?: string;
  sellingPrice: number;
  supplierCostPrice?: number;
  discountPrice?: number;
  stockQuantity: number;
  sku?: string;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestDeal: boolean;
  adminNotes?: string;
}) {
  await requireAdmin();
  return prisma.product.create({ data });
}

export async function adminUpdateProduct(
  id: string,
  data: Partial<{
    nameSw: string;
    nameEn: string;
    slug: string;
    descriptionSw: string;
    descriptionEn: string;
    categoryId: string;
    supplierId: string;
    sellingPrice: number;
    supplierCostPrice: number;
    discountPrice: number;
    stockQuantity: number;
    sku: string;
    isActive: boolean;
    isFeatured: boolean;
    isNewArrival: boolean;
    isBestDeal: boolean;
    adminNotes: string;
  }>
) {
  await requireAdmin();
  return prisma.product.update({ where: { id }, data });
}

export async function adminDeleteProduct(id: string) {
  await requireAdmin();
  return prisma.product.delete({ where: { id } });
}

export async function adminAddProductImage(data: {
  productId: string;
  url: string;
  path?: string;
  altText?: string;
  isMain?: boolean;
}) {
  await requireAdmin();
  if (data.isMain) {
    await prisma.productImage.updateMany({
      where: { productId: data.productId },
      data: { isMain: false },
    });
  }
  return prisma.productImage.create({ data });
}

export async function adminDeleteProductImage(id: string) {
  await requireAdmin();
  return prisma.productImage.delete({ where: { id } });
}
