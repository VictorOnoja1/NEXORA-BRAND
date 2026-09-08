export type CategorySlug =
  | "wigs-hair"
  | "hair-care"
  | "skincare-cosmetics"
  | "perfumes"
  | "jewellery"
  | "attachments"
  | "fashion"
  | "accessories";

export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  descriptor: string;
  image: string;
  productCount?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: CategorySlug;
  price: number;
  previousPrice?: number;
  description: string;
  shortDescription: string;
  images: ProductImage[];
  stock: number;
  active: boolean;
  featured: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  rating?: number;
  ratingCount?: number;
  sku: string;
  createdAt: string;
}

export type Availability = "in-stock" | "low-stock" | "out-of-stock";

export function getAvailability(stock: number): Availability {
  if (stock <= 0) return "out-of-stock";
  if (stock <= 5) return "low-stock";
  return "in-stock";
}

export interface CartLine {
  productId: string;
  quantity: number;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  state: string;
  city: string;
  deliveryNote?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentReference?: string;
  createdAt: string;
}
