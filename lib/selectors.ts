/**
 * Safe Prisma select objects.
 * Public selectors never expose: supplierCostPrice, adminNotes, supplier contacts,
 * profit margins, or any internal business data.
 */

/** Fields returned to the public on product listing pages */
export const publicProductSelect = {
  id: true,
  nameSw: true,
  nameEn: true,
  slug: true,
  descriptionSw: true,
  descriptionEn: true,
  categoryId: true,
  sellingPrice: true,
  discountPrice: true,
  stockQuantity: true,
  sku: true,
  isActive: true,
  isFeatured: true,
  isNewArrival: true,
  isBestDeal: true,
  createdAt: true,
  updatedAt: true,
  images: { select: { id: true, url: true, isMain: true, altText: true } },
  category: { select: { id: true, nameSw: true, nameEn: true, slug: true, image: true } },
} as const;

/** Extra fields included on the single product detail page */
export const publicProductDetailSelect = {
  ...publicProductSelect,
  variants: {
    select: { id: true, name: true, value: true, stockQuantity: true, priceAdjustment: true },
  },
  reviews: {
    where: { isApproved: true },
    select: {
      id: true,
      customerName: true,
      rating: true,
      comment: true,
      createdAt: true,
    },
  },
} as const;

/** Public category fields */
export const publicCategorySelect = {
  id: true,
  nameSw: true,
  nameEn: true,
  slug: true,
  descriptionSw: true,
  descriptionEn: true,
  image: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

/** Public-safe order fields for customer order tracking (no profit data) */
export const publicOrderSelect = {
  id: true,
  orderNumber: true,
  customerName: true,
  customerPhone: true,
  customerEmail: true,
  subtotal: true,
  deliveryFee: true,
  total: true,
  status: true,
  paymentStatus: true,
  createdAt: true,
  updatedAt: true,
  items: {
    select: {
      id: true,
      productId: true,
      productName: true,
      quantity: true,
      unitPrice: true,
      totalPrice: true,
      product: { select: { id: true, slug: true, images: { select: { url: true, isMain: true }, take: 1 } } },
    },
  },
  payment: {
    select: {
      id: true,
      method: true,
      status: true,
      amount: true,
      transactionReference: true,
      confirmedAt: true,
    },
  },
  delivery: {
    select: {
      id: true,
      region: true,
      district: true,
      address: true,
      fee: true,
      status: true,
      riderName: true,
      trackingNote: true,
    },
  },
} as const;

/** Order fields for the "My Orders" list (lighter than full detail) */
export const myOrdersSelect = {
  id: true,
  orderNumber: true,
  total: true,
  status: true,
  paymentStatus: true,
  createdAt: true,
  items: { select: { id: true, productName: true, quantity: true, unitPrice: true } },
} as const;
