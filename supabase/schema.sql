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
-- Seed data
-- =============================================================================
-- Run this block once after creating the tables to populate the demo catalogue.
-- All INSERTs use ON CONFLICT DO NOTHING so re-running is safe.

-- Categories
INSERT INTO categories (id, slug, name, descriptor, image, sort_order) VALUES
  ('cat-00000001-0000-0000-0000-000000000001', 'wigs-hair',           'Wigs & Hair',           'Elevate your everyday look.',        '', 1),
  ('cat-00000001-0000-0000-0000-000000000002', 'hair-care',           'Hair Care',              'Nourish, strengthen, shine.',        '', 2),
  ('cat-00000001-0000-0000-0000-000000000003', 'skincare-cosmetics',  'Skincare & Cosmetics',  'Glow that feels like you.',          '', 3),
  ('cat-00000001-0000-0000-0000-000000000004', 'perfumes',            'Perfumes',               'A signature scent, always.',         '', 4),
  ('cat-00000001-0000-0000-0000-000000000005', 'jewellery',           'Jewellery',              'Finishing touches that shine.',      '', 5),
  ('cat-00000001-0000-0000-0000-000000000006', 'attachments',         'Attachments',            'Effortless length and volume.',      '', 6),
  ('cat-00000001-0000-0000-0000-000000000007', 'fashion',             'Fashion',                'Style that speaks for you.',         '', 7),
  ('cat-00000001-0000-0000-0000-000000000008', 'accessories',         'Accessories',            'Small details, big confidence.',     '', 8)
ON CONFLICT (slug) DO NOTHING;

-- Products (images stored as URLs; update the `image` column with real Supabase Storage URLs)
INSERT INTO products (id, slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, rating, rating_count, sku, created_at) VALUES
  ('prod-0000001-0000-0000-0000-000000000001', 'silky-bone-straight-wig',    'Silky Bone Straight Lace Wig',       'wigs-hair',           45000, 58000, 'A luxuriously soft bone-straight lace front wig with a natural hairline. Pre-plucked and ready to wear, this piece gives an effortless, salon-fresh finish for everyday elegance or special occasions.', 'Pre-plucked lace front, natural hairline, 20-inch length.', 12, true,  true,  true,  4.8, 24, 'NX-WIG-001', '2026-08-01 00:00:00+00'),
  ('prod-0000001-0000-0000-0000-000000000002', 'curly-bob-wig',               'Deep Curly Bob Wig',                  'wigs-hair',           38500, null,  'A voluminous curly bob that holds its bounce wash after wash. Lightweight cap construction keeps it breathable for all-day wear.', 'Voluminous curls, lightweight breathable cap.', 8,  true,  false, false, 4.6, 15, 'NX-WIG-002', '2026-07-20 00:00:00+00'),
  ('prod-0000001-0000-0000-0000-000000000003', 'argan-oil-hair-serum',        'Argan Oil Repair Hair Serum',         'hair-care',           8500,  null,  'A lightweight, fast-absorbing serum enriched with argan oil to tame frizz, add shine and repair split ends without weighing hair down.', 'Frizz control and shine, 100ml.', 30, false, false, true,  4.7, 41, 'NX-HC-001',  '2026-06-10 00:00:00+00'),
  ('prod-0000001-0000-0000-0000-000000000004', 'shea-moisture-repair-mask',   'Shea Butter Deep Repair Hair Mask',   'hair-care',           9200,  11000, 'An intensive weekly treatment mask formulated with shea butter to restore moisture, elasticity and softness to dry, damaged hair.', 'Weekly deep-conditioning treatment, 250g.', 4,  false, false, false, 4.5, 19, 'NX-HC-002',  '2026-05-28 00:00:00+00'),
  ('prod-0000001-0000-0000-0000-000000000005', 'matte-liquid-lipstick-set',   'Matte Liquid Lipstick Set (3-in-1)', 'skincare-cosmetics',  12500, null,  'Three long-wearing, transfer-resistant matte lipstick shades curated for everyday elegance. Lightweight formula that never feels drying.', '3 long-wear matte shades, travel-friendly case.', 18, true,  true,  false, 4.9, 33, 'NX-SC-001',  '2026-08-05 00:00:00+00'),
  ('prod-0000001-0000-0000-0000-000000000006', 'vitamin-c-glow-serum',        'Vitamin C Brightening Glow Serum',    'skincare-cosmetics',  15800, null,  'A daily brightening serum with stabilised Vitamin C to even skin tone, fade dark spots and reveal a natural, healthy glow.', 'Brightening daily serum, 30ml dropper bottle.', 22, true,  false, true,  4.8, 52, 'NX-SC-002',  '2026-07-15 00:00:00+00'),
  ('prod-0000001-0000-0000-0000-000000000007', 'rose-gold-perfume',           'Rose Nectar Eau de Parfum',            'perfumes',            22000, null,  'A warm, feminine fragrance blending rose petals, soft musk and a hint of vanilla. Long-lasting and unforgettable from morning to night.', 'Floral musk fragrance, 50ml, long-lasting.', 14, true,  false, false, 4.7, 28, 'NX-PF-001',  '2026-06-22 00:00:00+00'),
  ('prod-0000001-0000-0000-0000-000000000008', 'amber-oud-perfume',           'Amber Oud Intense',                    'perfumes',            26500, 31000, 'A rich, intense oud fragrance layered with amber and warm spice. Bold and confident — designed to be remembered.', 'Rich oud & amber, 50ml, evening wear.', 6,  false, false, false, 4.6, 11, 'NX-PF-002',  '2026-05-02 00:00:00+00'),
  ('prod-0000001-0000-0000-0000-000000000009', 'gold-plated-hoop-earrings',   'Gold-Plated Statement Hoop Earrings', 'jewellery',           7800,  null,  'Lightweight gold-plated hoops that elevate any outfit from day to night. Hypoallergenic posts for comfortable all-day wear.', 'Gold-plated, hypoallergenic, lightweight.', 25, false, true,  false, 4.8, 17, 'NX-JW-001',  '2026-08-10 00:00:00+00'),
  ('prod-0000001-0000-0000-0000-000000000010', 'layered-pendant-necklace',    'Layered Pendant Necklace Set',         'jewellery',           9600,  null,  'A delicately layered necklace set featuring a dainty pendant, designed to be worn alone or stacked for a personalised look.', '3-piece layered set, adjustable chain.', 10, true,  false, false, 4.7, 9,  'NX-JW-002',  '2026-07-01 00:00:00+00'),
  ('prod-0000001-0000-0000-0000-000000000011', 'kanekalon-braiding-hair',     'Premium Kanekalon Braiding Hair',      'attachments',         3200,  null,  'Soft, tangle-resistant kanekalon braiding hair that holds style beautifully and feels natural to the touch.', 'Tangle-resistant, natural feel, per pack.', 60, false, false, false, 4.4, 22, 'NX-AT-001',  '2026-04-18 00:00:00+00'),
  ('prod-0000001-0000-0000-0000-000000000012', 'clip-in-ponytail',            'Drawstring Clip-In Ponytail',          'attachments',         11500, null,  'An easy-to-attach drawstring ponytail for instant length and volume — perfect for a quick style upgrade with no heat required.', 'Drawstring attach, 18-inch length.', 3,  false, false, false, 4.5, 6,  'NX-AT-002',  '2026-03-30 00:00:00+00'),
  ('prod-0000001-0000-0000-0000-000000000013', 'satin-wrap-dress',            'Satin Wrap Midi Dress',                'fashion',             24500, null,  'A flattering satin wrap dress designed to skim the body elegantly. Versatile enough for the office, dinner or a special occasion.', 'Satin finish, adjustable wrap tie, midi length.', 9,  true,  true,  false, 4.9, 14, 'NX-FA-001',  '2026-08-12 00:00:00+00'),
  ('prod-0000001-0000-0000-0000-000000000014', 'tailored-blazer',             'Tailored Structured Blazer',           'fashion',             32000, null,  'A sharply tailored blazer that instantly polishes any outfit. Structured shoulders, a nipped waist and a timeless silhouette.', 'Structured fit, lined interior, true to size.', 7,  false, false, false, 4.6, 8,  'NX-FA-002',  '2026-06-05 00:00:00+00'),
  ('prod-0000001-0000-0000-0000-000000000015', 'structured-tote-bag',         'Structured Leather-Look Tote',         'accessories',         18500, null,  'A spacious, structured tote crafted from premium vegan leather. Roomy enough for everyday essentials without compromising on style.', 'Vegan leather, spacious interior, dual handles.', 11, true,  false, true,  4.8, 21, 'NX-AC-001',  '2026-07-08 00:00:00+00'),
  ('prod-0000001-0000-0000-0000-000000000016', 'silk-hair-scarf',             'Pure Silk Hair Scarf',                 'accessories',         6200,  null,  'A pure silk scarf that protects hair while adding a chic finishing touch to any look — equally at home on your hair or around your neck.', '100% silk, protects hair, multi-way styling.', 0,  false, false, false, 4.3, 5,  'NX-AC-002',  '2026-02-14 00:00:00+00')
ON CONFLICT (slug) DO NOTHING;

-- Note: product_images are NOT seeded here because the seed products above have empty image URLs.
-- Upload your product images to Supabase Storage, then INSERT rows into product_images with the
-- public URLs, e.g.:
--   INSERT INTO product_images (product_id, url, alt, position) VALUES
--     ('prod-0000001-0000-0000-0000-000000000001', 'https://<project>.supabase.co/storage/v1/object/public/products/p1.jpg', 'Silky bone straight lace wig', 0);

