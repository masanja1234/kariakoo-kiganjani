import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Jina lazima liwe na herufi 2 au zaidi"),
  customerPhone: z.string().min(9, "Namba ya simu si sahihi"),
  customerEmail: z.string().email("Barua pepe si sahihi").optional().or(z.literal("")),
  region: z.string().min(1, "Chagua mkoa"),
  district: z.string().min(1, "Andika wilaya/eneo"),
  address: z.string().min(5, "Andika anwani kamili"),
  paymentMethod: z.enum(["MPESA", "TIGO_PESA", "AIRTEL_MONEY", "HALOPESA", "CASH_ON_DELIVERY", "BANK_TRANSFER"]),
  transactionReference: z.string().optional(),
});

export const budgetRequestSchema = z.object({
  fullName: z.string().min(2, "Jina lazima liwe na herufi 2 au zaidi"),
  whatsappPhone: z.string().min(9, "Namba ya WhatsApp si sahihi"),
  productNeeded: z.string().min(3, "Elezea bidhaa unayohitaji"),
  categoryId: z.string().optional(),
  budget: z.number().min(1000, "Budget lazima iwe TZS 1,000 au zaidi"),
  quantity: z.number().min(1, "Idadi lazima iwe 1 au zaidi"),
  location: z.string().min(2, "Andika eneo lako"),
  deliveryNeeded: z.boolean(),
  extraDetails: z.string().optional(),
});

export const productSchema = z.object({
  nameSw: z.string().min(2, "Jina la Kiswahili linahitajika"),
  nameEn: z.string().min(2, "English name is required"),
  slug: z.string().min(2, "Slug inahitajika"),
  descriptionSw: z.string().optional(),
  descriptionEn: z.string().optional(),
  categoryId: z.string().min(1, "Chagua kategoria"),
  supplierId: z.string().optional(),
  sellingPrice: z.number().min(1, "Bei ya kuuza inahitajika"),
  supplierCostPrice: z.number().optional(),
  discountPrice: z.number().optional(),
  stockQuantity: z.number().min(0, "Idadi ya stoki haiwezi kuwa chini ya 0"),
  sku: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestDeal: z.boolean().default(false),
  adminNotes: z.string().optional(),
});

export const categorySchema = z.object({
  nameSw: z.string().min(2, "Jina la Kiswahili linahitajika"),
  nameEn: z.string().min(2, "English name is required"),
  slug: z.string().min(2, "Slug inahitajika"),
  descriptionSw: z.string().optional(),
  descriptionEn: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const supplierSchema = z.object({
  name: z.string().min(2, "Jina la msambazaji linahitajika"),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  shopLocation: z.string().optional(),
  notes: z.string().optional(),
  trustStatus: z.enum(["TRUSTED", "PENDING_REVIEW", "SUSPENDED"]).default("PENDING_REVIEW"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Jina linahitajika"),
  email: z.string().email("Barua pepe si sahihi"),
  message: z.string().min(10, "Ujumbe lazima uwe na maneno 10 au zaidi"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type BudgetRequestInput = z.infer<typeof budgetRequestSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type SupplierInput = z.infer<typeof supplierSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
