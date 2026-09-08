# NEXORA 2.0 — Visual Redesign Report

Date: September 6, 2026

## Summary

This pass audited the existing NEXORA codebase before touching anything, then applied the new 70% warm white / 20% soft lilac / 7% deep lilac / 3% blush pink identity as **design tokens** (so it cascades through every existing component automatically), and hand-fixed the specific spots that didn't already match the brief — most notably the still-dark Admin sidebar, a couple of stale hardcoded hex colors, generic hero copy, and one dead form. No business logic, database schema, or auth flow was touched.

One important finding from the audit: **Admin is not a separate app on port 5174.** The root `nexora/src/` codebase is a single merged app whose router lazy-loads an `/admin/*` section — confirmed live by loading `localhost:5173/admin` and seeing the sign-in screen. Nothing is currently running on 5174. All work below targets that live root app first, then the same fixes were mirrored into the older `frontend/` and `admin/` split-app folders for consistency.

## 1. Files Changed

**Design tokens (all 3 codebases):**
- `tailwind.config.js` (root, `frontend/`, `admin/`)
- `src/index.css` (root, `frontend/`, `admin/`)

**Root `src/` (the live app):**
- `src/pages/admin/AdminLayout.tsx` — sidebar dark → light
- `src/pages/admin/Sales.tsx` — hardcoded chart hex updated
- `src/components/layout/Footer.tsx` — dead newsletter form replaced with the real one
- `src/pages/Home.tsx` — hero copy + trust-tile copy

**`admin/src/` (split app, currently not running):**
- `pages/AdminLayout.tsx` — same sidebar fix
- `pages/Sales.tsx` — same hex fix

**`frontend/src/` (split app, currently not running):**
- `pages/Home.tsx` — same copy fix
  (`Footer.tsx` here was already a real, working, Supabase-free `subscriberStore`-backed form — left untouched)

## 2. Storefront Components Redesigned

- **Home hero** — headline changed from "Your Style. Your Confidence." to "Find Something You'll Love.", subhead now explicitly mentions nationwide delivery.
- **"Why Shop NEXORA" trust strip** — "Easy Ordering" retitled "Nationwide Delivery" with Nigeria-specific copy.
- **Footer newsletter** (root only) — was a stub `<form onSubmit={(e) => e.preventDefault()}>` that stored nothing; now uses the same `NewsletterForm` component the homepage uses, which really inserts into the `subscribers` table.

Everything else in the storefront — Header, ProductCard, Shop (filters/sort/grid/list), Product Detail, Cart, Wishlist, Checkout, About, Contact — was audited and found to already be built with semantic color tokens (`bg-plum`, `text-chocolate`, `bg-champagne`, `bg-blush`, etc.) rather than hardcoded hex, generous whitespace, a 3:4 product image ratio, subtle hover states, and restrained shadows/animation already matching the brief closely. Repointing the tokens to the new palette (see below) repaints all of it without any component rewrites — verified live in-browser.

## 3. Admin Components Redesigned

- **Sidebar** — converted from a dark `bg-chocolate`/near-black panel to warm white (`bg-ivory`) with a soft-lilac active state (`bg-champagne` + deep-lilac text) and a subtle lilac hover, per the brief's explicit "no giant dark sidebar" instruction. Same fix applied in both the root app and the `admin/` split app.
- **Sales chart** — the revenue bar chart is inline SVG, so its fill/stroke/grid colors are plain hex constants that can't read Tailwind classes. These still had the *old* v1 brand hex (`#4A2634` plum, `#EADFE1` grid) from before this redesign even started; updated to the new deep-lilac (`#80639F`) and soft-lilac grid (`#E6DDF2`).

Dashboard, Products table, Product form, Orders, Customers, Categories, Subscribers, Settings, and Login were all already light-themed, token-driven, and free of hardcoded colors or fabricated data — they repaint automatically from the token change and needed no structural edits.

## 4. Design System Created

Token *names* were kept identical to the previous iteration on purpose, so every existing `bg-plum` / `text-chocolate` / `bg-champagne` / `bg-blush` class across ~100 files repaints without touching component code:

| Token | Role | Old value | New value |
|---|---|---|---|
| `ivory` | Background — must dominate (70%) | `#FFF8F2` | `#FAF8F5` |
| `champagne` | Section bg / soft highlight (20%) | `#E4D3F0` | `#E6DDF2` |
| `plum` | Primary/CTA — deep lilac (7%) | `#5B3A73` | `#80639F` (with a full 50–900 ramp) |
| `blush` | Sparing accent (3%) | `#F8CFE0` | `#E8C5D0` |
| `chocolate` | Ink — primary + new `muted` for secondary text | `#241A24` | `#2B252A` / muted `#6F646C` |
| `rose` | Secondary warm accent (ratings, sale tags) | `#D98BB8` | `#C98CA0` |

Shadows were softened (`shadow-soft`/`shadow-card` now use lower-opacity, warmer-toned rgba values) and border radius / letter-spacing / animation tokens were carried over unchanged.

## 5. Colour Palette Used

Warm White `#FAF8F5` (dominant), Soft Lilac `#E6DDF2`, Deep Lilac `#80639F`, Blush Pink `#E8C5D0`, Primary Text `#2B252A`, Secondary Text `#6F646C` — matching the brief's supplied values, with a full tint/shade ramp built around Deep Lilac for hover/active states.

## 6. Typography Chosen

Unchanged from the existing system, since it already matches the "editorial luxury" brief: **Playfair Display** (serif, headings) + **Cormorant Garamond** (display/italic accents) + **Inter** (sans, body/UI).

## 7. Existing Functionality Preserved

No CRUD logic, routing, cart/wishlist/order logic, or admin permissions were changed. The only *behavioral* change is the Footer newsletter form on the root app now actually submits (previously a no-op stub) — everything else is class-name/copy edits.

## 8–11. Backend / Supabase / Auth / Payment Changes

**None.** No schema, RLS policy, Supabase client config, auth flow, or Paystack integration was touched.

## 12. Responsive Improvements

No layout/breakpoint changes were made — the existing responsive grid (`grid-cols-2 md:grid-cols-4`), mobile nav, and mobile-visible quick-add button were already in place and were not altered by this pass.

## 13–15. Build / Type-check / Lint Result

Verified for the **root app** (the one actually live at localhost:5173) in a clean sandbox install:

- **Type-check** (`tsc -b`): ✅ clean, 0 errors
- **Build** (`vite build`): ✅ succeeded, 2,326 modules transformed
- **Lint** (`oxlint src/`): ✅ 0 warnings, 0 errors

The `frontend/` and `admin/` split apps (currently not running anywhere) received the identical, already-verified edit pattern but were not independently rebuilt in a sandbox this session — time did not allow staging their full dependency tree (including the `shared/` path alias) as well. Their two changed files were reviewed line-by-line against the verified root version.

## 16. Remaining Issues / Notes

- The Admin sidebar's new light theme was verified by code review and a clean build, but **not visually screenshotted** — confirming it requires logging in, and per a standing rule I don't type the admin password into the login form myself. Please log in and take a look; happy to iterate on it live once you're in.
- The browser screenshot tool became unresponsive partway through this session; later verification relied on extracting page text/structure instead of pixel screenshots. The one screenshot that did succeed confirmed the new hero colors/copy and the real 32-product catalogue rendering correctly.
- `frontend/` and `admin/` are currently dormant (nothing is running on 5174, and `frontend/`'s dev server status is unknown) — they received the same fixes for consistency, but the live experience you're actually looking at day to day is the root app.
- This pass focused on fixing real defects against the brief (dark admin sidebar, stale hex, generic copy, dead form) rather than rewriting already-well-built, already-token-driven storefront pages — a full line-by-line rewrite of ~100 already-compliant files wasn't necessary or safe to do in one pass without materially more testing time.
