// -----------------------------------------------------------------------
// Live Supabase data access. Every function here is only ever called when
// isSupabaseConfigured is true (see supabase.ts and each store's fallback
// logic) — this file has no "local mock" branch of its own, that stays in
// src/data/* and the Zustand stores.
//
// Naming: DB rows are snake_case (Postgres convention); everything this
// file returns to the rest of the app is the camelCase app shape from
// src/types, so components never need to know the DB column names.
// -----------------------------------------------------------------------
import { supabase } from "./supabase";
import type { Category, Product, ProductImage, Order, OrderStatus } from "../types";

function requireClient() {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}

// ---------------------------------------------------------------- Categories

interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  descriptor: string;
  image: string;
  sort_order: number;
}

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug as Category["slug"],
    name: row.name,
    descriptor: row.descriptor,
    image: row.image,
  };
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await requireClient()
    .from("categories")
    .select("id, slug, name, descriptor, image, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapCategory);
}

export async function createCategory(input: Omit<Category, "id">): Promise<Category> {
  const { data, error } = await requireClient()
    .from("categories")
    .insert({ slug: input.slug, name: input.name, descriptor: input.descriptor, image: input.image })
    .select("id, slug, name, descriptor, image, sort_order")
    .single();
  if (error) throw error;
  return mapCategory(data);
}

export async function updateCategory(id: string, patch: Partial<Category>): Promise<void> {
  const { error } = await requireClient()
    .from("categories")
    .update({
      ...(patch.slug !== undefined && { slug: patch.slug }),
      ...(patch.name !== undefined && { name: patch.name }),
      ...(patch.descriptor !== undefined && { descriptor: patch.descriptor }),
      ...(patch.image !== undefined && { image: patch.image }),
    })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await requireClient().from("categories").delete().eq("id", id);
  if (error) throw error;
}

// ----------------------------------------------------------------- Products

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category_slug: string;
  price: number;
  previous_price: number | null;
  description: string;
  short_description: string;
  stock: number;
  active: boolean;
  featured: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  rating: number | null;
  rating_count: number | null;
  sku: string;
  created_at: string;
  product_images: { id: string; url: string; alt: string; position: number }[];
}

function mapProduct(row: ProductRow): Product {
  const images: ProductImage[] = [...(row.product_images ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((img) => ({ id: img.id, url: img.url, alt: img.alt }));
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    categorySlug: row.category_slug as Product["categorySlug"],
    price: Number(row.price),
    previousPrice: row.previous_price !== null ? Number(row.previous_price) : undefined,
    description: row.description,
    shortDescription: row.short_description,
    images,
    stock: row.stock,
    active: row.active,
    featured: row.featured,
    isNew: row.is_new,
    isBestSeller: row.is_best_seller,
    rating: row.rating !== null ? Number(row.rating) : undefined,
    ratingCount: row.rating_count ?? undefined,
    sku: row.sku,
    createdAt: row.created_at,
  };
}

const PRODUCT_SELECT =
  "id, slug, name, category_slug, price, previous_price, description, short_description, stock, active, featured, is_new, is_best_seller, rating, rating_count, sku, created_at, product_images(id, url, alt, position)";

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await requireClient()
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapProduct);
}

export async function createProduct(input: Omit<Product, "id" | "createdAt">): Promise<Product> {
  const client = requireClient();
  const { data: inserted, error } = await client
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
      active: input.active,
      featured: input.featured,
      is_new: input.isNew ?? false,
      is_best_seller: input.isBestSeller ?? false,
      rating: input.rating ?? null,
      rating_count: input.ratingCount ?? null,
      sku: input.sku,
    })
    .select("id")
    .single();
  if (error) throw error;

  if (input.images.length > 0) {
    const { error: imgError } = await client.from("product_images").insert(
      input.images.map((img, i) => ({ product_id: inserted.id, url: img.url, alt: img.alt, position: i }))
    );
    if (imgError) throw imgError;
  }

  const { data, error: refetchError } = await client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", inserted.id)
    .single();
  if (refetchError) throw refetchError;
  return mapProduct(data);
}

export async function updateProduct(id: string, patch: Partial<Product>): Promise<void> {
  const client = requireClient();
  const columns: Record<string, unknown> = {};
  if (patch.slug !== undefined) columns.slug = patch.slug;
  if (patch.name !== undefined) columns.name = patch.name;
  if (patch.categorySlug !== undefined) columns.category_slug = patch.categorySlug;
  if (patch.price !== undefined) columns.price = patch.price;
  if (patch.previousPrice !== undefined) columns.previous_price = patch.previousPrice ?? null;
  if (patch.description !== undefined) columns.description = patch.description;
  if (patch.shortDescription !== undefined) columns.short_description = patch.shortDescription;
  if (patch.stock !== undefined) columns.stock = patch.stock;
  if (patch.active !== undefined) columns.active = patch.active;
  if (patch.featured !== undefined) columns.featured = patch.featured;
  if (patch.isNew !== undefined) columns.is_new = patch.isNew;
  if (patch.isBestSeller !== undefined) columns.is_best_seller = patch.isBestSeller;
  if (patch.sku !== undefined) columns.sku = patch.sku;

  if (Object.keys(columns).length > 0) {
    const { error } = await client.from("products").update(columns).eq("id", id);
    if (error) throw error;
  }

  if (patch.images !== undefined) {
    const { error: delError } = await client.from("product_images").delete().eq("product_id", id);
    if (delError) throw delError;
    if (patch.images.length > 0) {
      const { error: insError } = await client.from("product_images").insert(
        patch.images.map((img, i) => ({ product_id: id, url: img.url, alt: img.alt, position: i }))
      );
      if (insError) throw insError;
    }
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await requireClient().from("products").delete().eq("id", id);
  if (error) throw error;
}

// -------------------------------------------------------------- Subscribers

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

/** Public — anyone can call this (RLS allows insert-only, see schema_additions.sql). */
export async function subscribeEmail(email: string): Promise<{ ok: true } | { ok: false; reason: "duplicate" | "error" }> {
  const client = requireClient();
  const { error } = await client.from("subscribers").insert({ email: email.trim().toLowerCase() });
  if (error) {
    // Postgres unique_violation
    if (error.code === "23505") return { ok: false, reason: "duplicate" };
    return { ok: false, reason: "error" };
  }
  return { ok: true };
}

/** Admin-only (RLS). */
export async function fetchSubscribers(): Promise<Subscriber[]> {
  const { data, error } = await requireClient()
    .from("subscribers")
    .select("id, email, subscribed_at")
    .order("subscribed_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({ id: r.id, email: r.email, subscribedAt: r.subscribed_at }));
}

export async function deleteSubscriber(id: string): Promise<void> {
  const { error } = await requireClient().from("subscribers").delete().eq("id", id);
  if (error) throw error;
}

// ------------------------------------------------------------------- Orders

interface OrderRow {
  id: string;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_reference: string | null;
  created_at: string;
  customer_full_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  customer_state: string;
  customer_city: string;
  customer_delivery_note: string | null;
  order_items: { product_id: string; name: string; image: string; price: number; quantity: number }[];
}

function mapOrder(row: OrderRow): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customer: {
      fullName: row.customer_full_name,
      phone: row.customer_phone,
      email: row.customer_email,
      address: row.customer_address,
      state: row.customer_state,
      city: row.customer_city,
      deliveryNote: row.customer_delivery_note ?? undefined,
    },
    items: (row.order_items ?? []).map((i) => ({
      productId: i.product_id,
      name: i.name,
      image: i.image,
      price: Number(i.price),
      quantity: i.quantity,
    })),
    subtotal: Number(row.subtotal),
    deliveryFee: Number(row.delivery_fee),
    total: Number(row.total),
    status: row.status,
    paymentReference: row.payment_reference ?? undefined,
    createdAt: row.created_at,
  };
}

const ORDER_SELECT =
  "id, order_number, status, subtotal, delivery_fee, total, payment_reference, created_at, customer_full_name, customer_phone, customer_email, customer_address, customer_state, customer_city, customer_delivery_note, order_items(product_id, name, image, price, quantity)";

/** Admin-only (RLS) — every order, for the admin Orders page. */
export async function fetchAllOrders(): Promise<Order[]> {
  const { data, error } = await requireClient()
    .from("orders")
    .select(ORDER_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapOrder);
}

/** Admin-only (RLS). Cancelling automatically restores stock (DB trigger). */
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const { error } = await requireClient().from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}

export interface CheckoutInput {
  customer: {
    full_name: string;
    phone: string;
    email: string;
    address: string;
    state: string;
    city: string;
    delivery_note?: string;
  };
  items: { product_id: string; name: string; image: string; price: number; quantity: number }[];
  subtotal: number;
  deliveryFee: number;
  paymentReference?: string;
}

/**
 * Calls the `checkout` Edge Function — the only path that ever creates an
 * order. Public (no admin check): this is what a customer's own checkout
 * hits. Server-side, it verifies Paystack (if a reference is given) and
 * writes the order atomically with a race-safe stock decrement.
 */
export async function submitCheckout(
  input: CheckoutInput
): Promise<{ ok: true; order: Order } | { ok: false; message: string }> {
  const { data, error } = await requireClient().functions.invoke("checkout", { body: input });
  if (error) {
    // FunctionsHttpError carries the response body with our own {error} message.
    const context = (error as { context?: Response }).context;
    if (context) {
      try {
        const body = await context.clone().json();
        if (body?.error) return { ok: false, message: body.error };
      } catch {
        /* fall through to generic message */
      }
    }
    return { ok: false, message: "Could not reach the server to place your order. Please try again." };
  }
  if (data?.error) return { ok: false, message: data.error };
  return { ok: true, order: mapOrder(data.order) };
}

/** Public — a customer looking up their own orders by the email they checked out with. */
export async function lookupOrdersByEmail(email: string): Promise<Order[]> {
  const client = requireClient();
  const { data, error } = await client.functions.invoke(
    `orders-lookup?email=${encodeURIComponent(email)}`,
    { method: "GET" }
  );
  if (error || data?.error) return [];
  return (data.orders ?? []).map(mapOrder);
}

/** Public — order number + email must both match (see orders-lookup Edge Function). */
export async function lookupOrderByNumber(orderNumber: string, email: string): Promise<Order | undefined> {
  const client = requireClient();
  const { data, error } = await client.functions.invoke(
    `orders-lookup?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`,
    { method: "GET" }
  );
  if (error || data?.error) return undefined;
  return mapOrder(data.order);
}

// ---------------------------------------------------------------- Customers
//
// Reads the `customers` table directly — the real customer entity that
// create_order_with_items() upserts on every checkout (see
// schema_additions.sql) — rather than deriving "who our customers are" by
// grouping order history in the browser every time. Order stats (count,
// total spent, last order date) are still computed from `orders`, since
// that's genuinely aggregate data, but the customer list itself now comes
// from its own table so a customer record is a real row, not a side effect
// of how the admin UI happens to group things.

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  customerSince: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: string | null;
}

interface CustomerRow {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
}

/** Admin-only (RLS) — the real customer directory, with order stats merged in. */
export async function fetchAdminCustomers(): Promise<AdminCustomer[]> {
  const client = requireClient();

  const [{ data: customerRows, error: customersError }, { data: orderRows, error: ordersError }] =
    await Promise.all([
      client.from("customers").select("id, full_name, email, phone, created_at"),
      client.from("orders").select("customer_id, total, created_at"),
    ]);
  if (customersError) throw customersError;
  if (ordersError) throw ordersError;

  const stats = new Map<string, { orderCount: number; totalSpent: number; lastOrder: string }>();
  for (const o of (orderRows ?? []) as { customer_id: string | null; total: number; created_at: string }[]) {
    if (!o.customer_id) continue;
    const existing = stats.get(o.customer_id);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += Number(o.total);
      if (new Date(o.created_at) > new Date(existing.lastOrder)) existing.lastOrder = o.created_at;
    } else {
      stats.set(o.customer_id, { orderCount: 1, totalSpent: Number(o.total), lastOrder: o.created_at });
    }
  }

  return ((customerRows ?? []) as CustomerRow[])
    .map((c) => {
      const s = stats.get(c.id);
      return {
        id: c.id,
        name: c.full_name,
        email: c.email,
        phone: c.phone,
        customerSince: c.created_at,
        orderCount: s?.orderCount ?? 0,
        totalSpent: s?.totalSpent ?? 0,
        lastOrder: s?.lastOrder ?? null,
      };
    })
    .sort((a, b) => b.totalSpent - a.totalSpent);
}
