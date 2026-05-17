"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import type { DashboardStats } from "@/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  await requireAdmin();

  const [
    totalOrders,
    pendingOrders,
    paidOrders,
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    totalCustomers,
    totalSuppliers,
    newBudgetRequests,
    unreadNotifications,
    salesAgg,
    profitAgg,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { paymentStatus: "CONFIRMED" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { stockQuantity: { gt: 0, lte: 5 } } }),
    prisma.product.count({ where: { stockQuantity: 0 } }),
    prisma.customerProfile.count(),
    prisma.supplier.count(),
    prisma.budgetRequest.count({ where: { status: "NEW" } }),
    prisma.notification.count({ where: { isRead: false } }),
    prisma.order.aggregate({
      where: { paymentStatus: "CONFIRMED" },
      _sum: { total: true },
    }),
    prisma.orderItem.aggregate({
      _sum: { profitSnapshot: true },
    }),
  ]);

  return {
    totalSales: salesAgg._sum.total ?? 0,
    totalProfit: profitAgg._sum.profitSnapshot ?? 0,
    totalOrders,
    pendingOrders,
    paidOrders,
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    totalCustomers,
    totalSuppliers,
    newBudgetRequests,
    unreadNotifications,
  };
}

/** Lightweight query for the dashboard "recent orders" table — avoids heavy product/image joins. */
export async function adminGetRecentOrdersSummary(limit = 5) {
  await requireAdmin();
  return prisma.order.findMany({
    select: {
      id: true,
      orderNumber: true,
      customerName: true,
      total: true,
      status: true,
      paymentStatus: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function adminGetCustomers(opts?: { limit?: number; skip?: number }) {
  await requireAdmin();
  return prisma.customerProfile.findMany({
    take: opts?.limit ?? 50,
    skip: opts?.skip ?? 0,
    orderBy: { createdAt: "desc" },
  });
}

export async function adminGetSuppliers() {
  await requireAdmin();
  return prisma.supplier.findMany({ orderBy: { name: "asc" } });
}

export async function adminCreateSupplier(data: {
  name: string;
  phone?: string;
  whatsapp?: string;
  shopLocation?: string;
  notes?: string;
  trustStatus?: string;
}) {
  await requireAdmin();
  return prisma.supplier.create({
    data: { ...data, trustStatus: (data.trustStatus as never) ?? "PENDING_REVIEW" },
  });
}

export async function adminUpdateSupplier(
  id: string,
  data: Partial<{
    name: string;
    phone: string;
    whatsapp: string;
    shopLocation: string;
    notes: string;
    trustStatus: string;
  }>
) {
  await requireAdmin();
  return prisma.supplier.update({
    where: { id },
    data: { ...data, trustStatus: data.trustStatus as never },
  });
}

export async function adminDeleteSupplier(id: string) {
  await requireAdmin();
  return prisma.supplier.delete({ where: { id } });
}

export async function adminGetNotifications(onlyUnread?: boolean) {
  await requireAdmin();
  return prisma.notification.findMany({
    where: onlyUnread ? { isRead: false } : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function adminMarkNotificationRead(id: string) {
  await requireAdmin();
  return prisma.notification.update({ where: { id }, data: { isRead: true } });
}

export async function adminMarkAllNotificationsRead() {
  await requireAdmin();
  return prisma.notification.updateMany({ data: { isRead: true } });
}

export async function adminGetSettings() {
  await requireAdmin();
  const settings = await prisma.setting.findMany();
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}

export async function adminUpdateSetting(key: string, value: string) {
  await requireAdmin();
  return prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function adminCreateCategory(data: {
  nameSw: string;
  nameEn: string;
  slug: string;
  descriptionSw?: string;
  descriptionEn?: string;
  image?: string;
  isActive?: boolean;
}) {
  await requireAdmin();
  return prisma.category.create({ data });
}

export async function adminUpdateCategory(
  id: string,
  data: Partial<{
    nameSw: string;
    nameEn: string;
    slug: string;
    descriptionSw: string;
    descriptionEn: string;
    image: string;
    isActive: boolean;
  }>
) {
  await requireAdmin();
  return prisma.category.update({ where: { id }, data });
}

export async function adminDeleteCategory(id: string) {
  await requireAdmin();
  return prisma.category.delete({ where: { id } });
}

export async function adminUpdateDeliveryStatus(
  deliveryId: string,
  status: string,
  data?: { riderName?: string; riderPhone?: string; trackingNote?: string }
) {
  await requireAdmin();
  return prisma.delivery.update({
    where: { id: deliveryId },
    data: { status: status as never, ...data },
  });
}
