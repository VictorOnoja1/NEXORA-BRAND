import { useMemo } from "react";
import { create } from "zustand";
import type { Product, CategorySlug } from "../types";
import {
  fetchProducts,
  dbAddProduct,
  dbUpdateProduct,
  dbDeleteProduct,
} from "../lib/db";
import {
  findBySlug,
  findRelated,
  filterFeatured,
  sortNewest,
  filterBestSellers,
  seedProducts,
} from "../data/products";

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  loadProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<Product>;
  updateProduct: (id: string, patch: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getById: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductState>()((set, get) => ({
  products: seedProducts, // start with seed so UI isn't blank before load
  loading: false,
  error: null,

  loadProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await fetchProducts();
      set({ products, loading: false });
    } catch (err) {
      set({ loading: false, error: (err as Error).message });
    }
  },

  addProduct: async (input) => {
    const product = await dbAddProduct(input);
    set((state) => ({ products: [product, ...state.products] }));
    return product;
  },

  updateProduct: async (id, patch) => {
    // Optimistic update
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
    await dbUpdateProduct(id, patch);
  },

  deleteProduct: async (id) => {
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
    await dbDeleteProduct(id);
  },

  getById: (id) => get().products.find((p) => p.id === id),
}));

// ---------------------------------------------------------------------------
// Selector hooks
// ---------------------------------------------------------------------------

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
