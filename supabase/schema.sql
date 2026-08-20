-- =============================================================================
-- NEXORA Beauty & Essentials — Supabase / PostgreSQL schema
-- =============================================================================
-- Run this against a fresh Supabase project (SQL Editor → New Query → paste
-- → Run) to provision every table the app expects once you wire up
-- src/lib/supabase.ts and swap the mock data calls in src/data/*,
-- src/store/*, and src/pages/admin/* for real `supabase.from(...)` calls.
--
-- This schema mirrors the TypeScript types in src/types/index.ts exactly,
-- so mapping rows <-> app objects is a straight field-for-field translation.
-- =============================================================================

-- Extension needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- categories
-- -----------------------------------------------------------------------------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  descriptor text not null default '',
  image text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- products
-- -----------------------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category_slug text not null references categories(slug) on update cascade,
  price numeric(12, 2) not null check (price >= 0),
  previous_price numeric(12, 2) check (previous_price is null or previous_price >= 0),
  description text not null default '',
  short_description text not null default '',
  stock int not null default 0 check (stock >= 0),
  featured boolean not null default false,
  is_new boolean not null default false,
  is_best_seller boolean not null default false,
  rating numeric(2, 1) check (rating is null or (rating >= 0 and rating <= 5)),
  rating_count int default 0,
  sku text unique not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_category on products(category_slug);
create index if not exists idx_products_featured on products(featured) where featured = true;

-- product_images: one product has many gallery images, ordered by position
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  alt text not null default '',
  position int not null default 0
);

create index if not exists idx_product_images_product on product_images(product_id);

-- -----------------------------------------------------------------------------
-- customers (linked to Supabase Auth users; nullable for guest checkout)
-- -----------------------------------------------------------------------------
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_customers_email on customers(email);

-- -----------------------------------------------------------------------------
-- cart_items (server-side cart, keyed by customer or session)
-- -----------------------------------------------------------------------------
create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  session_id text, -- for guest carts before login
  product_id uuid not null references products(id) on delete cascade,
  quantity int not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_cart_items_customer on cart_items(customer_id);
create index if not exists idx_cart_items_session on cart_items(session_id);

-- -----------------------------------------------------------------------------
-- orders
-- -----------------------------------------------------------------------------
create type order_status as enum (
  'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_id uuid references customers(id) on delete set null,

  -- Denormalized customer/delivery info captured at checkout time, so an
  -- order stays accurate even if the customer's profile changes later.
  customer_full_name text not null,
  customer_phone text not null,
  customer_email text not null,
  customer_address text not null,
  customer_state text not null,
  customer_city text not null,
  customer_delivery_note text,

  subtotal numeric(12, 2) not null,
  delivery_fee numeric(12, 2) not null default 0,
  total numeric(12, 2) not null,
  status order_status not null default 'pending',
  payment_reference text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_customer on orders(customer_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created_at on orders(created_at desc);

-- -----------------------------------------------------------------------------
-- order_items — snapshot of product name/image/price at time of purchase
-- -----------------------------------------------------------------------------
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  name text not null,
  image text not null default '',
  price numeric(12, 2) not null,
  quantity int not null check (quantity > 0)
);

create index if not exists idx_order_items_order on order_items(order_id);

-- -----------------------------------------------------------------------------
-- payments — one row per Paystack transaction attempt against an order
-- -----------------------------------------------------------------------------
create type payment_status as enum ('initiated', 'success', 'failed', 'abandoned');

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  provider text not null default 'paystack',
  reference text unique not null,
  amount numeric(12, 2) not null,
  status payment_status not null default 'initiated',
  raw_response jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_payments_order on payments(order_id);

-- -----------------------------------------------------------------------------
-- newsletter_subscribers
-- -----------------------------------------------------------------------------
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create index if not exists idx_subscribers_email on newsletter_subscribers(email);

-- =============================================================================
-- Row Level Security
-- =============================================================================
-- Storefront data (products/categories) is public read, admin-only write.
-- Orders/payments/cart are private to the owning customer; admin write access
-- should go through a service-role key (e.g. from a Supabase Edge Function),
-- never the anon key, once you build the real admin auth flow.

alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table customers enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table payments enable row level security;
alter table newsletter_subscribers enable row level security;

create policy "Public can read categories" on categories for select using (true);
create policy "Public can read products" on products for select using (true);
create policy "Public can read product images" on product_images for select using (true);
create policy "Anyone can subscribe to newsletter" on newsletter_subscribers for insert with check (true);


create policy "Customers can read their own record" on customers
  for select using (auth.uid() = auth_user_id);

create policy "Customers can manage their own cart" on cart_items
  for all using (
    auth.uid() = (select auth_user_id from customers where customers.id = cart_items.customer_id)
  );

create policy "Customers can read their own orders" on orders
  for select using (
    auth.uid() = (select auth_user_id from customers where customers.id = orders.customer_id)
  );

create policy "Customers can read their own order items" on order_items
  for select using (
    exists (
      select 1 from orders
      join customers on customers.id = orders.customer_id
      where orders.id = order_items.order_id and customers.auth_user_id = auth.uid()
    )
  );

-- Writes to products/categories/orders/payments are intentionally left to
-- service-role access (admin dashboard via an Edge Function or server route)
-- rather than opened up to the anon key here.

-- =============================================================================
-- Seed data note
-- =============================================================================
-- The 8 categories and demo product catalogue currently live in
-- src/data/categories.ts and src/data/products.ts as typed mock data so the
-- storefront works out of the box with zero backend setup. When you connect
-- Supabase, either write a one-time migration script that INSERTs those same
-- records into `categories` / `products` / `product_images`, or re-enter your
-- real catalogue directly through the Admin → Products screen once it's
-- wired to Supabase instead of local state.
