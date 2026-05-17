"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { requireAdmin } from "@/lib/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

interface SubmitBudgetRequestData {
  fullName: string;
  whatsappPhone: string;
  productNeeded: string;
  categoryId?: string;
  budget: number;
  quantity: number;
  location: string;
  deliveryNeeded: boolean;
  extraDetails?: string;
  referenceImage?: string;
  referenceImagePath?: string;
}

export async function submitBudgetRequest(data: SubmitBudgetRequestData) {
  const { userId } = await auth();

  // Rate limit: 3 budget requests per minute per user
  const rateLimitKey = `budget-request:${userId ?? "anon"}`;
  const rl = checkRateLimit(rateLimitKey, RATE_LIMITS.BUDGET_REQUEST.limit, RATE_LIMITS.BUDGET_REQUEST.windowMs);
  if (!rl.allowed) throw new Error("Umepeleka maombi mengi mno. Tafadhali subiri dakika moja.");

  const request = await prisma.budgetRequest.create({
    data: {
      clerkUserId: userId ?? undefined,
      fullName: data.fullName,
      whatsappPhone: data.whatsappPhone,
      productNeeded: data.productNeeded,
      categoryId: data.categoryId || undefined,
      budget: data.budget,
      quantity: data.quantity,
      location: data.location,
      deliveryNeeded: data.deliveryNeeded,
      extraDetails: data.extraDetails,
      referenceImage: data.referenceImage,
      referenceImagePath: data.referenceImagePath,
      status: "NEW",
    },
  });

  await prisma.notification.create({
    data: {
      title: "Ombi Jipya la Budget",
      message: `Ombi jipya la budget kutoka ${data.fullName} — TZS ${data.budget.toLocaleString()}`,
      type: "NEW_BUDGET_REQUEST",
      relatedId: request.id,
    },
  });

  return request;
}

// Admin actions
export async function adminGetBudgetRequests(opts?: {
  status?: string;
  limit?: number;
  skip?: number;
}) {
  await requireAdmin();

  const where: Record<string, unknown> = {};
  if (opts?.status) where.status = opts.status;

  return prisma.budgetRequest.findMany({
    where,
    include: { category: true, assignedSupplier: true },
    take: Math.min(opts?.limit ?? 50, 200),
    skip: opts?.skip ?? 0,
    orderBy: { createdAt: "desc" },
  });
}

export async function adminGetBudgetRequestById(id: string) {
  await requireAdmin();
  return prisma.budgetRequest.findUnique({
    where: { id },
    include: { category: true, assignedSupplier: true },
  });
}

export async function adminUpdateBudgetRequest(
  id: string,
  data: {
    status?: string;
    adminNotes?: string;
    assignedSupplierId?: string;
    quotedPrice?: number;
  }
) {
  await requireAdmin();
  return prisma.budgetRequest.update({
    where: { id },
    data: {
      status: data.status as never,
      adminNotes: data.adminNotes,
      assignedSupplierId: data.assignedSupplierId,
      quotedPrice: data.quotedPrice,
    },
  });
}
