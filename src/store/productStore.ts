import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, CategorySlug } from "../types";
import {
  seedProducts,
  findBySlug,
  findRelated,
  filterFeatured,
  sortNewest,
  filterBestSellers,
} from "../data/products";
import { isSupabaseConfigured } from "../lib/supabase";
import * as api from "../lib/api";

// -----------------------------------------------------------------------
// Live product catalogue.
//
// When Supabase is configured, `products` is loaded from (and every
// mutation is written straight to) the `products`/`product_images` tables
// via src/lib/api.ts — this is the source of truth once the backend is
// connected, and admin CRUD is real (RLS-enforced) database writes.
//
// When Supabase is NOT configured, this falls back to the original
// zero-setup behavior: seeded from src/data/products.ts and kept in
// localStorage so the demo still works end to end with no backend.
//
// `products` always holds the FULL catalogue (active and inactive) — admin
// pages read it directly via useProductStore so they can manage inactive
// items. Every storefront-facing selector below (useProducts and
// everything built on it) filters to `active` products only, so marking a
// product inactive removes it from the shop without deleting it.
// -----------------------------------------------------------------------

interface ProductState {
  products: Product[];
  loading: boolean;
  loaded: boolean;
  loadProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<Product>;
  updateProduct: (id: string, patch: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getById: (id: string) => Product | undefined;
}

function makeId() {
  return `p-${Math.random().toString(36).slice(2, 10)}`;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: seedProducts,
      loading: false,
      loaded: !isSupabaseConfigured,

      loadProducts: async () => {
        if (!isSupabaseConfigured) return;
        set({ loading: true });
        try {
          const products = await api.fetchProducts();
          set({ products, loading: false, loaded: true });
        } catch {
          // Keep whatever was already in state (seed or last-known-good)
          // rather than blanking the storefront on a transient DB error.
          set({ loading: false, loaded: true });
        }
      },

      addProduct: async (input) => {
        if (isSupabaseConfigured) {
          const product = await api.createProduct(input);
          set((state) => ({ products: [product, ...state.products] }));
          return product;
        }
        const product: Product = {
          ...input,
          id: makeId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ products: [product, ...state.products] }));
        return product;
      },

      updateProduct: async (id, patch) => {
        if (isSupabaseConfigured) {
          await api.updateProduct(id, patch);
        }
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }));
      },

      deleteProduct: async (id) => {
        if (isSupabaseConfigured) {
          await api.deleteProduct(id);
        }
        set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
      },

      getById: (id) => get().products.find((p) => p.id === id),
    }),
    {
      name: "nexora-products",
      // Guard against a blank storefront: if localStorage ever ends up
      // holding an empty products array (e.g. a stray "delete all" in the
      // admin dashboard during testing, or a stale/corrupted browser
      // profile), fall back to the seed catalogue instead of persisting
      // "no products" forever. Real, non-empty persisted data (including
      // admin edits) is always respected. Once Supabase is configured,
      // loadProducts() overwrites this on mount anyway — this guard only
      // matters for the no-backend demo mode.
      merge: (persisted, current) => {
        const persistedState = persisted as Partial<ProductState> | undefined;
        const persistedProducts = persistedState?.products;
        const hasProducts = Array.isArray(persistedProducts) && persistedProducts.length > 0;
        return {
          ...current,
          ...persistedState,
          products: hasProducts ? (persistedProducts as Product[]) : seedProducts,
        };
      },
      // Never persist Supabase-backed data to localStorage as the primary
      // copy of truth — it's refetched on load. Skipping this would be fine
      // either way, but partialize keeps the persisted blob small and avoids
      // ever serving stale admin edits from a previous session before the
      // network fetch resolves.
      partialize: (state) => ({ products: state.products } as ProductState),
    }
  )
);

if (isSupabaseConfigured) {
  void useProductStore.getState().loadProducts();
}

// Convenience selector hooks mirroring the old static helpers, now backed
// by the live store so admin edits show up everywhere.
//
// IMPORTANT: each selector below reads only the raw `products` array from
// Zustand (a stable reference that only changes when the store actually
// changes) and does any filtering/sorting in a separate `useMemo`. Doing
// the filter/sort *inside* the Zustand selector would return a brand-new
// array on every call, which breaks React's useSyncExternalStore (used by
// Zustand v5) and causes an infinite render loop.
//
// `useProducts()` is the storefront-facing catalogue: active products only.
// Admin pages that must see inactive products too read the store directly,
// e.g. `useProductStore((s) => s.products)`.
export const useProducts = () => {
  const products = useProductStore((s) => s.products);
  return useMemo(() => products.filter((p) => p.active), [products]);
};

export const useProductBySlug = (slug: string | undefined) => {
  const products = useProducts();
  return useMemo(() => (slug ? findBySlug(products, slug) : undefined), [products, slug]);
};

export const useRelatedProducts = (product: Product | undefined, limit = 4) => {
  const products = useProducts();
  return useMemo(
    () => (product ? findRelated(products, product, limit) : []),
    [products, product, limit]
  );
};

export const useFeaturedProducts = () => {
  const products = useProducts();
  return useMemo(() => filterFeatured(products), [products]);
};

export const useNewArrivals = (limit = 8) => {
  const products = useProducts();
  return useMemo(() => sortNewest(products, limit), [products, limit]);
};

export const useBestSellers = (limit = 8) => {
  const products = useProducts();
  return useMemo(() => filterBestSellers(products, limit), [products, limit]);
};

export function categoryProductCount(products: Product[], slug: CategorySlug) {
  return products.filter((p) => p.categorySlug === slug).length;
}
