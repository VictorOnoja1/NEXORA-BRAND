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

// -----------------------------------------------------------------------
// Live product catalogue. Seeded once from src/data/products.ts, then kept
// in localStorage so admin dashboard add/edit/delete actions actually
// stick and reflect back on the storefront — without a live backend yet.
//
// This is the layer to replace with real Supabase queries/mutations once
// the backend is connected (see src/lib/supabase.ts).
// -----------------------------------------------------------------------

interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getById: (id: string) => Product | undefined;
}

function makeId() {
  return `p-${Math.random().toString(36).slice(2, 10)}`;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: seedProducts,
      addProduct: (input) => {
        const product: Product = {
          ...input,
          id: makeId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ products: [product, ...state.products] }));
        return product;
      },
      updateProduct: (id, patch) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      deleteProduct: (id) =>
        set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
      getById: (id) => get().products.find((p) => p.id === id),
    }),
    {
      name: "nexora-products",
      // Guard against a blank storefront: if localStorage ever ends up
      // holding an empty products array (e.g. a stray "delete all" in the
      // admin dashboard during testing, or a stale/corrupted browser
      // profile), fall back to the seed catalogue instead of persisting
      // "no products" forever. Real, non-empty persisted data (including
      // admin edits) is always respected.
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
    }
  )
);

// Convenience selector hooks mirroring the old static helpers, now backed
// by the live store so admin edits show up everywhere.
//
// IMPORTANT: each selector below reads only the raw `products` array from
// Zustand (a stable reference that only changes when the store actually
// changes) and does any filtering/sorting in a separate `useMemo`. Doing
// the filter/sort *inside* the Zustand selector would return a brand-new
// array on every call, which breaks React's useSyncExternalStore (used by
// Zustand v5) and causes an infinite render loop.
export const useProducts = () => useProductStore((s) => s.products);

export const useProductBySlug = (slug: string | undefined) => {
  const products = useProductStore((s) => s.products);
  return useMemo(() => (slug ? findBySlug(products, slug) : undefined), [products, slug]);
};

export const useRelatedProducts = (product: Product | undefined, limit = 4) => {
  const products = useProductStore((s) => s.products);
  return useMemo(
    () => (product ? findRelated(products, product, limit) : []),
    [products, product, limit]
  );
};

export const useFeaturedProducts = () => {
  const products = useProductStore((s) => s.products);
  return useMemo(() => filterFeatured(products), [products]);
};

export const useNewArrivals = (limit = 8) => {
  const products = useProductStore((s) => s.products);
  return useMemo(() => sortNewest(products, limit), [products, limit]);
};

export const useBestSellers = (limit = 8) => {
  const products = useProductStore((s) => s.products);
  return useMemo(() => filterBestSellers(products, limit), [products, limit]);
};

export function categoryProductCount(products: Product[], slug: CategorySlug) {
  return products.filter((p) => p.categorySlug === slug).length;
}
