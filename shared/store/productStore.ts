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
  persist<ProductState>(
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
