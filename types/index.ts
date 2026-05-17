import type {
  Product,
  ProductImage,
  Category,
  Supplier,
  Order,
  OrderItem,
  Payment,
  Delivery,
  BudgetRequest,
  Notification,
  CustomerProfile,
  CartItem,
  Cart,
  ProductVariant,
  Review,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  DeliveryStatus,
  BudgetRequestStatus,
  TrustStatus,
  NotificationType,
} from "@prisma/client";

export type {
  Product,
  ProductImage,
  Category,
  Supplier,
  Order,
  OrderItem,
  Payment,
  Delivery,
  BudgetRequest,
  Notification,
  CustomerProfile,
  CartItem,
  Cart,
  ProductVariant,
  Review,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  DeliveryStatus,
  BudgetRequestStatus,
  TrustStatus,
  NotificationType,
};

// Extended types with relations
export type ProductWithDetails = Product & {
  images: ProductImage[];
  category: Category;
  supplier?: Supplier | null;
  variants?: ProductVariant[];
  reviews?: Review[];
};

export type ProductWithImages = Product & {
  images: ProductImage[];
  category: Category;
};

export type OrderWithDetails = Order & {
  items: (OrderItem & { product: Product & { images: ProductImage[] } })[];
  payment?: Payment | null;
  delivery?: Delivery | null;
  customer?: CustomerProfile | null;
};

export type CartWithItems = Cart & {
  items: (CartItem & {
    product: Product & { images: ProductImage[]; category: Category };
  })[];
};

export type BudgetRequestWithDetails = BudgetRequest & {
  category?: Category | null;
  assignedSupplier?: Supplier | null;
};

// Cart state for client-side
export interface CartItemState {
  id: string;
  productId: string;
  name: string;
  nameSw: string;
  nameEn: string;
  price: number;
  discountPrice?: number | null;
  image?: string;
  quantity: number;
  slug: string;
  stockQuantity: number;
}

export interface CartState {
  items: CartItemState[];
  totalItems: number;
  subtotal: number;
}

// Dashboard stats
export interface DashboardStats {
  totalSales: number;
  totalProfit: number;
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalCustomers: number;
  totalSuppliers: number;
  newBudgetRequests: number;
  unreadNotifications: number;
}

// Status badge config
export interface StatusConfig {
  label: string;
  color: string;
  bg: string;
}
