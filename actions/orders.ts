"use server";

import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { requireAdmin } from "@/lib/auth";
import { publicOrderSelect, myOrdersSelect } from "@/lib/selectors";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import type { CartItemState } from "@/types";

interface CreateOrderData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  region: string;
  district: string;
  address: string;
  paymentMethod: string;
  transactionReference?: string;
  items: CartItemState[];
}

export async function createOrder(data: CreateOrderData) {
  const { userId } = await auth();

  // Rate limit: 5 orders per minute per user (or per anonymous key)
  const rateLimitKey = `order-create:${userId ?? "anon"}`;
  const rl = checkRateLimit(rateLimitKey, RATE_LIMITS.ORDER_CREATE.limit, RATE_LIMITS.ORDER_CREATE.windowMs);
  if (!rl.allowed) throw new Error("Umeweka maagizo mengi mno. Tafadhali subiri dakika moja.");

  // Prevent empty orders
  if (!data.items || data.items.length === 0) {
    throw new Error("Kikapu chako kiko tupu.");
  }

  // Cap items per order to prevent abuse
  if (data.items.length > 50) {
    throw new Error("Idadi ya bidhaa kwenye agizo ni kubwa sana.");
  }

  // Server-side: verify products, prices, and stock — never trust client totals
  const productIds = data.items.map((i) => i.productId);
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    select: {
      id: true,
      sellingPrice: true,
      discountPrice: true,
      stockQuantity: true,
      supplierCostPrice: true,
    },
  });

  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  // Validate each item against the database
  for (const item of data.items) {
    const product = productMap.get(item.productId);
    if (!product) throw new Error(`Bidhaa "${item.name}" haipatikani au imefutwa.`);
    if (item.quantity < 1) throw new Error("Idadi haiwezi kuwa chini ya 1.");
  }

  // Calculate totals server-side
  const subtotal = data.items.reduce((sum, item) => {
    const product = productMap.get(item.productId);
    if (!product) return sum;
    const unitPrice = product.discountPrice ?? product.sellingPrice;
    return sum + unitPrice * item.quantity;
  }, 0);

  // Delivery fee is always 0 at order creation — admin sets it after reviewing the order.
  // Never trust client-supplied delivery fee (prevents fee manipulation).
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;
  const orderNumber = generateOrderNumber();

  let customerProfileId: string | undefined;
  if (userId) {
    const profile = await prisma.customerProfile.findUnique({
      where: { clerkUserId: userId },
    });
    customerProfileId = profile?.id;
  }

  const order = await prisma.order.create({
    data: {
      orderNumber,
      clerkUserId: userId ?? undefined,
      customerProfileId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      subtotal,
      deliveryFee,
      total,
      status: "PENDING",
      paymentStatus: "PENDING",
      items: {
        create: data.items.map((item) => {
          const product = productMap.get(item.productId)!;
          const unitPrice = product.discountPrice ?? product.sellingPrice;
          const costPrice = product.supplierCostPrice;
          return {
            productId: item.productId,
            productName: item.name,
            quantity: item.quantity,
            unitPrice,
            totalPrice: unitPrice * item.quantity,
            supplierCostPriceSnapshot: costPrice,
            profitSnapshot: costPrice ? unitPrice - costPrice : undefined,
          };
        }),
      },
      payment: {
        create: {
          method: data.paymentMethod as never,
          status: "PENDING",
          amount: total,
          transactionReference: data.transactionReference,
        },
      },
      delivery: {
        create: {
          region: data.region,
          district: data.district,
          address: data.address,
          fee: deliveryFee,
          status: "PENDING",
        },
      },
    },
    include: { items: true, payment: true, delivery: true },
  });

  await prisma.notification.create({
    data: {
      title: "Agizo Jipya",
      message: `Agizo jipya #${orderNumber} kutoka ${data.customerName}`,
      type: "NEW_ORDER",
      relatedId: order.id,
    },
  });

  return order;
}

/**
 * Get the currently authenticated customer's orders.
 * IDOR protection: userId is always taken from the Clerk session,
 * never from client-provided parameters.
 */
export async function getMyOrders() {
  const { userId } = await auth();
  if (!userId) throw new Error("Tafadhali ingia kwanza.");

  return prisma.order.findMany({
    where: { clerkUserId: userId },
    select: myOrdersSelect,
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

/**
 * Public order tracking by order number.
 * Returns only customer-safe fields — no profit/cost data.
 */
export async function getOrderByNumber(orderNumber: string) {
  if (!orderNumber || orderNumber.length > 50) return null;

  return prisma.order.findUnique({
    where: { orderNumber },
    select: publicOrderSelect,
  });
}

// ─── Admin order actions ───────────────────────────────────────────────────────

export async function adminGetOrders(opts?: {
  status?: string;
  paymentStatus?: string;
  search?: string;
  limit?: number;
  skip?: number;
}) {
  await requireAdmin();

  const where: Record<string, unknown> = {};
  if (opts?.status) where.status = opts.status;
  if (opts?.paymentStatus) where.paymentStatus = opts.paymentStatus;
  if (opts?.search) {
    where.OR = [
      { orderNumber: { contains: opts.search, mode: "insensitive" } },
      { customerName: { contains: opts.search, mode: "insensitive" } },
      { customerPhone: { contains: opts.search, mode: "insensitive" } },
    ];
  }

  return prisma.order.findMany({
    where,
    include: {
      items: { include: { product: { include: { images: true } } } },
      payment: true,
      delivery: true,
      customer: true,
    },
    take: Math.min(opts?.limit ?? 50, 200),
    skip: opts?.skip ?? 0,
    orderBy: { createdAt: "desc" },
  });
}

export async function adminGetOrderById(id: string) {
  await requireAdmin();
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: { include: { images: true } } } },
      payment: true,
      delivery: true,
      customer: true,
    },
  });
}

export async function adminUpdateOrderStatus(id: string, status: string) {
  await requireAdmin();
  return prisma.order.update({
    where: { id },
    data: { status: status as never },
  });
}

export async function adminUpdatePaymentStatus(paymentId: string, status: string) {
  await requireAdmin();

  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: status as never,
      confirmedAt: status === "CONFIRMED" ? new Date() : undefined,
    },
    include: { order: true },
  });

  if (status === "CONFIRMED") {
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: "CONFIRMED", status: "CONFIRMED" },
    });
    await prisma.notification.create({
      data: {
        title: "Malipo Yamethibitishwa",
        message: `Malipo ya agizo #${payment.order.orderNumber} yamethibitishwa`,
        type: "PAYMENT_CONFIRMED",
        relatedId: payment.orderId,
      },
    });
  }

  return payment;
}
