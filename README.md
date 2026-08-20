# NEXORA Beauty & Essentials

A modern, mobile-first Nigerian beauty, fashion, and everyday-essentials
e-commerce storefront and admin dashboard — built with React, TypeScript,
Tailwind CSS, and Framer Motion.

> **Your Style. Your Confidence.**

This is a complete, functional store: browsing and search, cart and
checkout, order confirmation, and a full admin dashboard for managing
products, categories, orders, and customers — not just a landing page.

---

## Status: what's live vs. what needs your credentials

The app runs fully out of the box with **local mock data and local state**
(Zustand + `localStorage`), so every screen — storefront and admin — is
usable immediately after `npm install && npm run dev`, with no backend
setup required.

Two integrations are **wired up in code but intentionally not activated**
until you supply real credentials, because this project does not fake
payment success or invent data:

| Integration | Status | What happens without credentials |
|---|---|---|
| **Supabase** (database/auth/storage) | Client stub in `src/lib/supabase.ts` | App uses local mock data (`src/data/*`) and Zustand-persisted state instead of a live database. `isSupabaseConfigured` is `false`. |
| **Paystack** (payments) | Charge helper in `src/lib/paystack.ts` | Checkout clearly shows a "payment not configured" state rather than pretending a payment succeeded. `isPaystackConfigured` is `false`. |

See **Connecting a real backend** and **Connecting Paystack** below to go
live.

---

## Getting started

```bash
npm install
npm run dev       # starts Vite dev server, default http://localhost:5173
```

```bash
npm run build      # type-checks (tsc -b) and builds to dist/
npm run preview     # serves the production build locally
npm run lint         # oxlint
```

Requires Node 18+.

---

## Tech stack

- **React 19** + **TypeScript**, built with **Vite**
- **Tailwind CSS** with a custom NEXORA theme (brand colors, fonts, shadows — see `tailwind.config.js`)
- **Framer Motion** for scroll-triggered and page-transition animations
- **Zustand** for state management (cart, wishlist, orders, products, categories, UI), persisted to `localStorage`
- **React Router v7** for routing, with the admin dashboard code-split via `React.lazy`/`Suspense`
- **Supabase** (`@supabase/supabase-js`) — client stubbed, not yet connected
- **Paystack** inline checkout — helper stubbed, not yet connected
- **lucide-react** for icons (with two hand-drawn SVG fallbacks for Instagram/TikTok, which this icon set doesn't ship)

---

## Brand identity

| Token | Value |
|---|---|
| Primary | Deep Plum `#4A2634` |
| Text | Dark Chocolate `#24191A` |
| Accent | Rose Pink `#D9A8B1` |
| Secondary background | Soft Blush `#FADADD` |
| Highlight | Champagne `#E7C6A8` |
| Background | Ivory `#FFF7F3` |
| Headings | Playfair Display / Cormorant Garamond (serif) |
| Body | Inter (sans) |

All tokens live in `tailwind.config.js` (`colors.plum/chocolate/rose/blush/champagne/ivory`, `fontFamily.serif/display/sans`) — change the brand there, not by hardcoding hex values in components.

---

## Project structure

```
src/
  assets/               Logo + generated placeholder imagery
  components/
    layout/              Header, Footer, mobile nav/menu, search overlay, WhatsApp button
    product/             ProductCard, CategoryCard, CartItemRow, FilterDrawer, QuantitySelector
    ui/                    Button, Modal, Drawer, Badge, Rating, Skeleton, EmptyState, Toast, SocialIcons
    admin/                StatCard
  data/                  Seed categories + products (mock data source)
  lib/                   config.ts, format.ts (Naira formatting), supabase.ts, paystack.ts
  store/                  Zustand stores: cart, wishlist, orders, products, categories, UI
  pages/                  Home, Shop, ProductDetail, Cart, Checkout, OrderConfirmation, About,
                           Contact, Wishlist, Account, Categories, NotFound
  pages/admin/            AdminLayout, Dashboard, Products, ProductForm, Categories, Orders,
                           OrderDetail, Customers, Sales, Settings
  types/                  Shared TypeScript types (Product, Category, Order, ...)
supabase/
  schema.sql              Full PostgreSQL schema matching src/types/index.ts, with RLS policies
.env.example              All environment variables the app reads
```

### Storefront pages

Home, Shop (search/filter/sort/grid-list), Product Detail (gallery, related
products, sticky mobile CTA), Cart, Checkout, Order Confirmation, About,
Contact, Wishlist, Account, plus a mobile hamburger menu, bottom tab bar,
search overlay, and floating WhatsApp support button (`wa.me` deep link).

### Admin dashboard (`/admin`)

Dashboard (stats, recent orders, low-stock alerts), Products (CRUD with
image picker), Categories (CRUD), Orders (status filtering + per-order
status updates), Customers (derived from order history), Sales (revenue
chart + top products), Settings (shows live Supabase/Paystack connection
status). All admin routes are code-split and lazy-loaded.

**Sign-in:** `/admin` is gated behind a login screen (`/admin/login`).
Default credentials are `admin` / `nexora2026` (set in `src/lib/config.ts`,
overridable via `VITE_ADMIN_USERNAME` / `VITE_ADMIN_PASSWORD` — see
`.env.example`). Change these before sharing your store's URL with anyone.

**Important:** this login is a client-side-only gate, not real
authentication — the password lives in the JS bundle that ships to every
visitor's browser, so anyone who inspects it can read it. It stops casual
visitors from wandering into the admin dashboard, but it is not a security
boundary. Before this dashboard holds anything sensitive, replace it with
real server-side auth via Supabase Auth (see "Connecting a real backend"
below).

---

## Connecting a real backend (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL Editor and run **`supabase/schema.sql`** — it creates
   `categories`, `products`, `product_images`, `customers`, `cart_items`,
   `orders`, `order_items`, and `payments`, plus Row Level Security
   policies (public read on catalogue data, customer-scoped read on their
   own orders/cart).
3. Copy `.env.example` to `.env` and set:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxx
   ```
4. Replace the mock-data reads in `src/data/products.ts` /
   `src/data/categories.ts` and the local-state writes in `src/store/*`
   (and the admin pages under `src/pages/admin/`) with real
   `supabase.from(...)` calls. `src/lib/supabase.ts` already exports a
   ready-to-use `supabase` client and an `isSupabaseConfigured` flag you
   can gate on during the migration.
5. Either migrate the existing seed data (`src/data/categories.ts`,
   `src/data/products.ts`) into the new tables with a one-off script, or
   re-enter your real catalogue through Admin → Products once it's wired
   to Supabase.

## Connecting Paystack

1. Get your public key from the Paystack dashboard (Settings → API Keys &
   Webhooks). Use the **test** key while developing.
2. Set `VITE_PAYSTACK_PUBLIC_KEY` in `.env`.
3. The Paystack inline script is already loaded in `index.html`
   (`https://js.paystack.co/v2/inline.js`), and `src/lib/paystack.ts`
   exports `chargeWithPaystack()`, ready to call from `Checkout.tsx`.
4. **Important:** verify every transaction reference **server-side**
   (e.g. a Supabase Edge Function calling Paystack's Verify Transaction
   API) before marking an order "paid." Never trust the client-side
   callback alone — that's how fake-payment fraud happens. Your Paystack
   **secret** key must never be set as a `VITE_` variable, since anything
   with that prefix is bundled into the public client JS.

---

## Other configuration

`src/lib/config.ts` holds store-wide settings you'll want to change before
launch: WhatsApp Business number (`VITE_WHATSAPP_NUMBER`), support email
(`VITE_SUPPORT_EMAIL`), flat delivery fee, free-delivery threshold, and
social links. In production, consider moving these into an admin
"Settings" table so they're editable without a redeploy.

---

## Deployment

Built for static hosting on **Vercel**:

```bash
npm run build
```

Deploy the `dist/` folder, or connect the repo to Vercel directly and set
the same environment variables from `.env.example` in the Vercel project
settings.

---

## Design notes

- Fully responsive, tested at 360/375/390/412/430 (mobile), 768 (tablet),
  and 1024/1440 (desktop) viewport widths across every storefront and
  admin page, with zero horizontal-overflow issues.
- Loading, empty, and error/404 states are implemented throughout (empty
  cart, empty wishlist, no search results, out-of-stock/low-stock badges,
  404 page).
- No fabricated reviews, statistics, or payment confirmations anywhere in
  the app — ratings/review counts only render for products that have
  them, and checkout never simulates a successful charge.
