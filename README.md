# NEXORA Monorepo

NEXORA is a high-end luxury e-commerce brand for premium hair products, luxury wigs, skincare, cosmetics, fragrances, and fashion accessories.

This repository is structured as an independently deployable monorepo containing two applications and a shared asset & code library.

---

## 📁 Monorepo Structure

```
NEXORA-BRAND/
├── frontend/             # Customer-facing storefront web application
│   ├── src/              # Pages, components, layout, state & assets
│   ├── public/           # Static icons and assets
│   ├── package.json      # Storefront dependencies & scripts
│   ├── vite.config.ts    # Storefront Vite configuration (@shared alias)
│   ├── tailwind.config.js
│   └── .env.example
│
├── admin/                # Internal administration dashboard
│   ├── src/              # Dashboard pages, forms, tables & components
│   ├── public/           # Admin static assets
│   ├── package.json      # Admin dependencies & scripts
│   ├── vite.config.ts    # Admin Vite configuration (@shared alias)
│   ├── tailwind.config.js
│   └── .env.example
│
├── shared/               # Shared code & design system
│   ├── types/            # TypeScript interfaces (Product, Category, Order, etc.)
│   ├── store/            # Shared Zustand stores (productStore, categoryStore, etc.)
│   ├── data/             # Seed data (products, categories)
│   ├── lib/              # Shared utilities (config, format, supabase, paystack)
│   ├── components/       # Shared UI primitives (Button, Badge, Modal)
│   └── assets/           # Brand logos and product placeholder images
│
├── .gitignore
├── README.md
└── package.json          # Root convenience scripts
```

---

## ⚡ Quick Start & Local Commands

### 1. Storefront (`frontend`)

```bash
cd frontend
npm install
npm run dev
```
* **Local URL**: `http://localhost:5173`
* **Build Command**: `npm run build`

### 2. Admin Dashboard (`admin`)

```bash
cd admin
npm install
npm run dev
```
* **Local URL**: `http://localhost:5174` (or next available port)
* **Build Command**: `npm run build`
* **Default Credentials**:
  * **Username**: `admin`
  * **Password**: `nexora2026`

---

## 🔑 Environment Variables

### Frontend (`frontend/.env.example`)
* `VITE_SUPABASE_URL` — Supabase project URL
* `VITE_SUPABASE_ANON_KEY` — Supabase anonymous key
* `VITE_PAYSTACK_PUBLIC_KEY` — Paystack public key for online payments
* `VITE_WHATSAPP_NUMBER` — WhatsApp contact number (default: `2348039784232`)

### Admin (`admin/.env.example`)
* `VITE_STOREFRONT_URL` — Storefront URL (default: `http://localhost:5173`)
* `VITE_SUPABASE_URL` — Supabase project URL
* `VITE_SUPABASE_ANON_KEY` — Supabase anonymous key
* `VITE_PAYSTACK_PUBLIC_KEY` — Paystack public key

---

## 📦 Dependencies

Both applications depend on:
* **React 19** & **React DOM 19**
* **Vite 8**
* **Tailwind CSS 3**
* **React Router DOM 7**
* **Zustand 5** (State management with localStorage persistence)
* **Framer Motion 13** (Animations)
* **Lucide React** (Icons)
