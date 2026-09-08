/**
 * shared/lib/db.ts
 *
 * All database queries in one place. Every function:
 *  - Returns real data when Supabase is configured (VITE_SUPABASE_URL + KEY set)
 *  - Falls back to mock/seed data when Supabase is not configured so the app
 *    still works out of the box with zero backend setup.
 */

import { supabase, isSupabaseConfigured } from "./supabase";
import type { Category, CategorySlug, Product, ProductImage, Order, OrderItem, CustomerInfo, OrderStatus, Subscriber } from "../types";
import { categories as seedCategories } from "../data/categories";
import { seedProducts } from "../data/products";

// Helper to access Supabase client safely with dynamic type resolution
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDb(): any {
  return supabase;
}

// ---------------------------------------------------------------------------
// Helpers — map DB rows to app types
// ---------------------------------------------------------------------------

type CatRow = {
  id: string;
  slug: string;
  name: string;
  descriptor: string;
  image: string;
  sort_order: number;
  created_at: string;
};

type ProdRow = {
  id: string;
  slug: string;
  name: string;
  category_slug: string;
  price: number;
  previous_price: number | null;
  description: string;
  short_description: string;
  stock: number;
  featured: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  rating: number | null;
  rating_count: number | null;
  sku: string;
  created_at: string;
  product_images: { id: string; url: string; alt: string; position: number }[];
};

type OrderRow = {
  id: string;
  order_number: string;
  customer_full_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  customer_state: string;
  customer_city: string;
  customer_delivery_note: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
  payment_reference: string | null;
  created_at: string;
  order_items: { product_id: string | null; name: string; image: string; price: number; quantity: number }[];
};

function rowToCategory(row: CatRow): Category {
  return {
    id: row.id,
    slug: row.slug as CategorySlug,
    name: row.name,
    descriptor: row.descriptor,
    image: row.image,
  };
}

function rowToProduct(row: ProdRow): Product {
  const images: ProductImage[] = (row.product_images ?? [])
    .sort((a, b) => a.position - b.position)
    .map((img) => ({ id: img.id, url: img.url, alt: img.alt }));

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    categorySlug: row.category_slug as CategorySlug,
    price: Number(row.price),
    previousPrice: row.previous_price != null ? Number(row.previous_price) : undefined,
    description: row.description,
    shortDescription: row.short_description,
    images,
    stock: row.stock,
    featured: row.featured,
    isNew: row.is_new,
    isBestSeller: row.is_best_seller,
    rating: row.rating ?? undefined,
    ratingCount: row.rating_count ?? undefined,
    sku: row.sku,
    createdAt: row.created_at,
  };
}

function rowToOrder(row: OrderRow): Order {
  const customer: CustomerInfo = {
    fullName: row.customer_full_name,
    phone: row.customer_phone,
    email: row.customer_email,
    address: row.customer_address,
    state: row.customer_state,
    city: row.customer_city,
    deliveryNote: row.customer_delivery_note ?? undefined,
  };

  const items: OrderItem[] = (row.order_items ?? []).map((i) => ({
    productId: i.product_id ?? "",
    name: i.name,
    image: i.image,
    price: Number(i.price),
    quantity: i.quantity,
  }));

  return {
    id: row.id,
    orderNumber: row.order_number,
    customer,
    items,
    subtotal: Number(row.subtotal),
    deliveryFee: Number(row.delivery_fee),
    total: Number(row.total),
    status: row.status as OrderStatus,
    paymentReference: row.payment_reference ?? undefined,
    createdAt: row.created_at,
  };
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function fetchCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured || !supabase) return seedCategories;

  const { data, error } = await getDb()
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return seedCategories;
  return (data as CatRow[]).map(rowToCategory);
}

export async function dbAddCategory(
  input: Omit<Category, "id">
): Promise<Category> {
  if (!isSupabaseConfigured || !supabase) {
    return { ...input, id: `cat-${Date.now()}` };
  }

  const { data, error } = await getDb()
    .from("categories")
    .insert({
      slug: input.slug,
      name: input.name,
      descriptor: input.descriptor,
      image: input.image,
      sort_order: 0,
    })
    .select()
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to create category");
  return rowToCategory(data as CatRow);
}

export async function dbUpdateCategory(
  id: string,
  patch: Partial<Omit<Category, "id">>
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  const update: Record<string, unknown> = {};
  if (patch.slug !== undefined) update.slug = patch.slug;
  if (patch.name !== undefined) update.name = patch.name;
  if (patch.descriptor !== undefined) update.descriptor = patch.descriptor;
  if (patch.image !== undefined) update.image = patch.image;

  await getDb().from("categories").update(update).eq("id", id);
}

export async function dbDeleteCategory(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await getDb().from("categories").delete().eq("id", id);
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function fetchProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) return seedProducts;

  const { data, error } = await getDb()
    .from("products")
    .select("*, product_images(*)")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) return seedProducts;
  return (data as unknown as ProdRow[]).map(rowToProduct);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured || !supabase) {
    return seedProducts.find((p) => p.slug === slug) ?? null;
  }

  const { data, error } = await getDb()
    .from("products")
    .select("*, product_images(*)")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return rowToProduct(data as unknown as ProdRow);
}

export async function dbAddProduct(
  input: Omit<Product, "id" | "createdAt">
): Promise<Product> {
  if (!isSupabaseConfigured || !supabase) {
    const mock: Product = { ...input, id: `p-${Date.now()}`, createdAt: new Date().toISOString() };
    return mock;
  }

  const { data: prodData, error: prodError } = await getDb()
    .from("products")
    .insert({
      slug: input.slug,
      name: input.name,
      category_slug: input.categorySlug,
      price: input.price,
      previous_price: input.previousPrice ?? null,
      description: input.description,
      short_description: input.shortDescription,
      stock: input.stock,
      featured: input.featured,
      is_new: input.isNew ?? false,
      is_best_seller: input.isBestSeller ?? false,
      rating: input.rating ?? null,
      rating_count: input.ratingCount ?? null,
      sku: input.sku,
    })
    .select()
    .single();

  if (prodError || !prodData) throw new Error(prodError?.message ?? "Failed to create product");

  // Insert images
  if (input.images.length > 0) {
    await getDb().from("product_images").insert(
      input.images.map((img, i) => ({
        product_id: prodData.id,
        url: img.url,
        alt: img.alt,
        position: i,
      }))
    );
  }

  return { ...input, id: prodData.id, createdAt: prodData.created_at };
}

export async function dbUpdateProduct(
  id: string,
  patch: Partial<Product>
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  const update: Record<string, unknown> = {};
  if (patch.slug !== undefined) update.slug = patch.slug;
  if (patch.name !== undefined) update.name = patch.name;
  if (patch.categorySlug !== undefined) update.category_slug = patch.categorySlug;
  if (patch.price !== undefined) update.price = patch.price;
  if ("previousPrice" in patch) update.previous_price = patch.previousPrice ?? null;
  if (patch.description !== undefined) update.description = patch.description;
  if (patch.shortDescription !== undefined) update.short_description = patch.shortDescription;
  if (patch.stock !== undefined) update.stock = patch.stock;
  if (patch.featured !== undefined) update.featured = patch.featured;
  if (patch.isNew !== undefined) update.is_new = patch.isNew;
  if (patch.isBestSeller !== undefined) update.is_best_seller = patch.isBestSeller;
  if ("rating" in patch) update.rating = patch.rating ?? null;
  if ("ratingCount" in patch) update.rating_count = patch.ratingCount ?? null;
  if (patch.sku !== undefined) update.sku = patch.sku;

  await getDb().from("products").update(update).eq("id", id);

  // Re-sync images if provided
  if (patch.images) {
    await getDb().from("product_images").delete().eq("product_id", id);
    if (patch.images.length > 0) {
      await getDb().from("product_images").insert(
        patch.images.map((img, i) => ({
          product_id: id,
          url: img.url,
          alt: img.alt,
          position: i,
        }))
      );
    }
  }
}

export async function dbDeleteProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  // product_images cascade deletes automatically
  await getDb().from("products").delete().eq("id", id);
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export async function fetchOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await getDb()
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as OrderRow[]).map(rowToOrder);
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await getDb()
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return rowToOrder(data as unknown as OrderRow);
}

export async function fetchOrderByNumber(orderNumber: string): Promise<Order | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await getDb()
    .from("orders")
    .select("*, order_items(*)")
    .eq("order_number", orderNumber)
    .single();

  if (error || !data) return null;
  return rowToOrder(data as unknown as OrderRow);
}

export async function dbCreateOrder(input: {
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  paymentReference?: string;
  status?: OrderStatus;
}): Promise<Order> {
  const status = input.status ?? "pending";

  // Generate order number locally (NX + year + 4-digit random)
  const orderNumber = `NX${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;
  const total = input.subtotal + input.deliveryFee;

  if (!isSupabaseConfigured || !supabase) {
    // Pure local fallback (no DB)
    return {
      id: `ord-${Date.now()}`,
      orderNumber,
      customer: input.customer,
      items: input.items,
      subtotal: input.subtotal,
      deliveryFee: input.deliveryFee,
      total,
      status,
      paymentReference: input.paymentReference,
      createdAt: new Date().toISOString(),
    };
  }

  // 1. Upsert guest customer
  let customerId: string | null = null;
  const { data: custData } = await getDb()
    .from("customers")
    .insert({
      full_name: input.customer.fullName,
      email: input.customer.email,
      phone: input.customer.phone,
    })
    .select("id")
    .single();
  if (custData) customerId = custData.id;

  // 2. Insert order
  const { data: orderData, error: orderError } = await getDb()
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_id: customerId,
      customer_full_name: input.customer.fullName,
      customer_phone: input.customer.phone,
      customer_email: input.customer.email,
      customer_address: input.customer.address,
      customer_state: input.customer.state,
      customer_city: input.customer.city,
      customer_delivery_note: input.customer.deliveryNote ?? null,
      subtotal: input.subtotal,
      delivery_fee: input.deliveryFee,
      total,
      status,
      payment_reference: input.paymentReference ?? null,
    })
    .select()
    .single();

  if (orderError || !orderData) throw new Error(orderError?.message ?? "Failed to create order");

  // 3. Insert order items
  if (input.items.length > 0) {
    await getDb().from("order_items").insert(
      input.items.map((item) => ({
        order_id: orderData.id,
        product_id: item.productId || null,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      }))
    );
  }

  return {
    id: orderData.id,
    orderNumber,
    customer: input.customer,
    items: input.items,
    subtotal: input.subtotal,
    deliveryFee: input.deliveryFee,
    total,
    status,
    paymentReference: input.paymentReference,
    createdAt: orderData.created_at,
  };
}

export async function dbUpdateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await getDb().from("orders").update({ status }).eq("id", id);
}

// ---------------------------------------------------------------------------
// Newsletter subscribers
// ---------------------------------------------------------------------------

export interface SubscribeResult {
  success: boolean;
  message: string;
}

export async function fetchSubscribers(): Promise<Subscriber[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await getDb()
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as { id: string; email: string; status: string; created_at: string }[]).map((row) => ({
    id: row.id,
    email: row.email,
    status: row.status as "active" | "unsubscribed",
    subscribedAt: row.created_at,
  }));
}

export async function dbUpsertSubscriber(email: string): Promise<SubscribeResult> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { success: false, message: "Please enter a valid email address." };
  }

  if (!isSupabaseConfigured || !supabase) {
    return { success: true, message: "Thank you for subscribing to NEXORA updates!" };
  }

  // Check existing
  const { data: existing } = await getDb()
    .from("newsletter_subscribers")
    .select("id, status")
    .eq("email", cleanEmail)
    .maybeSingle();

  if (existing) {
    if (existing.status === "unsubscribed") {
      await getDb()
        .from("newsletter_subscribers")
        .update({ status: "active" })
        .eq("email", cleanEmail);
      return { success: true, message: "Welcome back! Your subscription has been reactivated." };
    }
    return { success: false, message: "This email is already subscribed to NEXORA." };
  }

  const { error } = await getDb()
    .from("newsletter_subscribers")
    .insert({ email: cleanEmail, status: "active" });

  if (error) return { success: false, message: "Something went wrong. Please try again." };
  return { success: true, message: "Thank you for subscribing to NEXORA updates!" };
}

export async function dbDeleteSubscriber(email: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await getDb().from("newsletter_subscribers").delete().eq("email", email);
}

export async function dbToggleSubscriberStatus(
  email: string,
  newStatus: "active" | "unsubscribed"
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await getDb()
    .from("newsletter_subscribers")
    .update({ status: newStatus })
    .eq("email", email);
}
