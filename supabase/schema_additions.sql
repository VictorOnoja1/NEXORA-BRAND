-- =============================================================================
-- NEXORA — schema additions (run AFTER supabase/schema.sql)
-- =============================================================================
-- Adds everything schema.sql didn't cover yet: admin roles + RLS, the
-- newsletter subscribers table, atomic/race-safe order creation, and
-- automatic stock restoration on cancellation. Written to be safe to run
-- even if you already ran schema.sql earlier (uses IF NOT EXISTS / OR
-- REPLACE / DROP POLICY IF EXISTS throughout, so re-running this file is
-- also safe if you need to reapply it).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- products.active — lets an admin mark a product inactive (hidden from the
-- storefront, kept in the DB) instead of deleting it outright. schema.sql
-- didn't include this column.
-- -----------------------------------------------------------------------------
alter table products add column if not exists active boolean not null default true;
create index if not exists idx_products_active on products(active) where active = true;

-- -----------------------------------------------------------------------------
-- profiles — links a Supabase Auth user to an app role. The admin dashboard
-- checks this (via is_admin() below) instead of trusting anything the
-- browser sends. There is no public sign-up flow for this table; you create
-- your admin account once via Supabase Auth and then run the one-line
-- UPDATE at the bottom of this file to mark it 'admin'.
-- -----------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile row (role='customer') whenever someone signs up via
-- Supabase Auth, so profiles never gets out of sync with auth.users.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- is_admin(): the single check every admin-only RLS policy below uses.
-- security definer so it can read `profiles` regardless of the caller's own
-- RLS visibility into that table.
create or replace function is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

alter table profiles enable row level security;
drop policy if exists "Users can read their own profile" on profiles;
create policy "Users can read their own profile" on profiles
  for select using (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- Admin write access on catalogue tables (schema.sql left these admin-only
-- with no policy at all, which under RLS means "nobody but service_role" --
-- these policies are what let a signed-in admin manage the catalogue
-- directly from the browser via the anon/authenticated client).
-- -----------------------------------------------------------------------------
drop policy if exists "Admins can insert products" on products;
create policy "Admins can insert products" on products for insert with check (is_admin());
drop policy if exists "Admins can update products" on products;
create policy "Admins can update products" on products for update using (is_admin()) with check (is_admin());
drop policy if exists "Admins can delete products" on products;
create policy "Admins can delete products" on products for delete using (is_admin());

drop policy if exists "Admins can insert product images" on product_images;
create policy "Admins can insert product images" on product_images for insert with check (is_admin());
drop policy if exists "Admins can update product images" on product_images;
create policy "Admins can update product images" on product_images for update using (is_admin()) with check (is_admin());
drop policy if exists "Admins can delete product images" on product_images;
create policy "Admins can delete product images" on product_images for delete using (is_admin());

drop policy if exists "Admins can insert categories" on categories;
create policy "Admins can insert categories" on categories for insert with check (is_admin());
drop policy if exists "Admins can update categories" on categories;
create policy "Admins can update categories" on categories for update using (is_admin()) with check (is_admin());
drop policy if exists "Admins can delete categories" on categories;
create policy "Admins can delete categories" on categories for delete using (is_admin());

-- Admin read access on order data (schema.sql's customer-scoped policies
-- only ever match a real customer auth session, which this app doesn't have
-- yet -- these are what let the ADMIN dashboard read everything).
drop policy if exists "Admins can read all orders" on orders;
create policy "Admins can read all orders" on orders for select using (is_admin());
drop policy if exists "Admins can update orders" on orders;
create policy "Admins can update orders" on orders for update using (is_admin()) with check (is_admin());
drop policy if exists "Admins can read all order items" on order_items;
create policy "Admins can read all order items" on order_items for select using (is_admin());
drop policy if exists "Admins can read all payments" on payments;
create policy "Admins can read all payments" on payments for select using (is_admin());
drop policy if exists "Admins can read all customers" on customers;
create policy "Admins can read all customers" on customers for select using (is_admin());

-- No public/anon INSERT policy exists on orders, order_items, or payments,
-- and none is added here on purpose: every order is written by
-- create_order_with_items() below (SECURITY DEFINER, callable only by the
-- service_role key from the checkout Edge Function) -- never directly by a
-- browser client. That is what stops a customer from ever writing
-- "status: paid" themselves.

-- Guest checkout doesn't authenticate, so a customer record isn't linked to
-- an auth user -- upsert by email instead. Needed for ON CONFLICT (email).
create unique index if not exists customers_email_key on customers (lower(email));

-- -----------------------------------------------------------------------------
-- subscribers — newsletter emails from the storefront.
-- -----------------------------------------------------------------------------
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  subscribed_at timestamptz not null default now()
);

alter table subscribers enable row level security;

drop policy if exists "Anyone can subscribe" on subscribers;
create policy "Anyone can subscribe" on subscribers for insert with check (true);
-- No public SELECT policy: only admins can list subscriber emails.
drop policy if exists "Admins can read subscribers" on subscribers;
create policy "Admins can read subscribers" on subscribers for select using (is_admin());
drop policy if exists "Admins can delete subscribers" on subscribers;
create policy "Admins can delete subscribers" on subscribers for delete using (is_admin());

-- -----------------------------------------------------------------------------
-- create_order_with_items() — the ONLY way an order gets written.
-- Atomic: stock is checked and decremented for every item in the same
-- transaction as the order/order_items/payment insert, so either the whole
-- order succeeds or none of it does (no half-decremented stock, no
-- orphaned order rows). The stock check-and-decrement is a single UPDATE
-- per item (`where stock >= qty`), which Postgres serializes at the row
-- level -- this is what prevents two simultaneous buyers from both
-- succeeding on the last unit of a product.
--
-- SECURITY DEFINER + restricted EXECUTE grant (bottom of this file) means
-- this can only be called with the service_role key, i.e. from the
-- checkout Edge Function -- never directly from a browser.
-- -----------------------------------------------------------------------------
create or replace function create_order_with_items(
  p_customer jsonb,       -- {full_name, phone, email, address, state, city, delivery_note}
  p_items jsonb,          -- [{product_id, name, image, price, quantity}, ...]
  p_subtotal numeric,
  p_delivery_fee numeric,
  p_status order_status,  -- 'paid' or 'pending'
  p_payment_reference text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_order_id uuid;
  v_order_number text;
  v_item jsonb;
  v_updated int;
  v_attempt int := 0;
begin
  -- Upsert the customer by email so repeat buyers map to one customer row.
  insert into customers (full_name, email, phone)
  values (p_customer->>'full_name', p_customer->>'email', p_customer->>'phone')
  on conflict (lower(email)) do update
    set full_name = excluded.full_name, phone = excluded.phone
  returning id into v_customer_id;

  -- Lock and decrement stock for every item BEFORE creating the order, so a
  -- failure here rolls back cleanly with nothing else written.
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    update products
      set stock = stock - (v_item->>'quantity')::int
      where id = (v_item->>'product_id')::uuid
        and stock >= (v_item->>'quantity')::int;
    get diagnostics v_updated = row_count;
    if v_updated = 0 then
      raise exception 'insufficient_stock:%', v_item->>'name' using errcode = 'P0001';
    end if;
  end loop;

  -- order_number collision is astronomically unlikely (10,000 combos per
  -- year) but retry a few times rather than fail outright.
  loop
    v_order_number := 'NX' || to_char(now(), 'YYYY') || lpad(floor(random() * 10000)::text, 4, '0');
    begin
      insert into orders (
        order_number, customer_id, customer_full_name, customer_phone, customer_email,
        customer_address, customer_state, customer_city, customer_delivery_note,
        subtotal, delivery_fee, total, status, payment_reference
      ) values (
        v_order_number, v_customer_id, p_customer->>'full_name', p_customer->>'phone', p_customer->>'email',
        p_customer->>'address', p_customer->>'state', p_customer->>'city', p_customer->>'delivery_note',
        p_subtotal, p_delivery_fee, p_subtotal + p_delivery_fee, p_status, p_payment_reference
      ) returning id into v_order_id;
      exit;
    exception when unique_violation then
      v_attempt := v_attempt + 1;
      if v_attempt >= 5 then raise; end if;
    end;
  end loop;

  insert into order_items (order_id, product_id, name, image, price, quantity)
  select v_order_id, (i->>'product_id')::uuid, i->>'name', i->>'image', (i->>'price')::numeric, (i->>'quantity')::int
  from jsonb_array_elements(p_items) as i;

  if p_payment_reference is not null then
    insert into payments (order_id, provider, reference, amount, status)
    values (v_order_id, 'paystack', p_payment_reference, p_subtotal + p_delivery_fee,
      case when p_status = 'paid' then 'success'::payment_status else 'initiated'::payment_status end);
  end if;

  -- Shape matches the OrderRow the frontend's mapOrder() expects (same
  -- snake_case columns fetchAllOrders()/orders-lookup select from the real
  -- table), so the checkout Edge Function can hand this straight back to
  -- the browser as the just-placed order without a second round trip.
  return jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'status', p_status,
    'subtotal', p_subtotal,
    'delivery_fee', p_delivery_fee,
    'total', p_subtotal + p_delivery_fee,
    'payment_reference', p_payment_reference,
    'created_at', now(),
    'customer_full_name', p_customer->>'full_name',
    'customer_phone', p_customer->>'phone',
    'customer_email', p_customer->>'email',
    'customer_address', p_customer->>'address',
    'customer_state', p_customer->>'state',
    'customer_city', p_customer->>'city',
    'customer_delivery_note', p_customer->>'delivery_note',
    'order_items', p_items
  );
end;
$$;

revoke all on function create_order_with_items(jsonb, jsonb, numeric, numeric, order_status, text) from public, anon, authenticated;
grant execute on function create_order_with_items(jsonb, jsonb, numeric, numeric, order_status, text) to service_role;

-- -----------------------------------------------------------------------------
-- Restore stock automatically whenever an order's status changes TO
-- 'cancelled' from anything else -- fires regardless of whether the update
-- comes from the admin dashboard (direct RLS-permitted UPDATE) or an Edge
-- Function, so this logic only has to live in one place.
-- -----------------------------------------------------------------------------
create or replace function restore_stock_on_cancel()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'cancelled' and old.status is distinct from 'cancelled' then
    update products p
      set stock = p.stock + oi.quantity
      from order_items oi
      where oi.order_id = new.id and oi.product_id = p.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_order_cancelled on orders;
create trigger on_order_cancelled
  after update of status on orders
  for each row execute function restore_stock_on_cancel();

-- =============================================================================
-- ONE-TIME MANUAL STEP: after you create your admin login via Supabase Auth
-- (Authentication -> Users -> Add user, in the dashboard), run this with
-- your admin's real email to grant them the admin role:
--
--   update profiles set role = 'admin' where email = 'you@example.com';
--
-- =============================================================================
