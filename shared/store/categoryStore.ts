import { create } from "zustand";
import type { Category, CategorySlug } from "../types";
import { categories as seedCategories, getCategoryBySlug } from "../data/categories";
import {
  fetchCategories,
  dbAddCategory,
  dbUpdateCategory,
  dbDeleteCategory,
} from "../lib/db";

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  loadCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, "id">) => Promise<Category>;
  updateCategory: (id: string, patch: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

function slugify(name: string): CategorySlug {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") as CategorySlug;
}

export const useCategoryStore = create<CategoryState>()((set) => ({
  categories: seedCategories, // seed data shown immediately, replaced after load
  loading: false,
  error: null,

  loadCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await fetchCategories();
      set({ categories, loading: false });
    } catch (err) {
      set({ loading: false, error: (err as Error).message });
    }
  },

  addCategory: async (input) => {
    const withSlug = { ...input, slug: input.slug || slugify(input.name) };
    const category = await dbAddCategory(withSlug);
    set((state) => ({ categories: [...state.categories, category] }));
    return category;
  },

  updateCategory: async (id, patch) => {
    // Optimistic update
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
    await dbUpdateCategory(id, patch);
  },

  deleteCategory: async (id) => {
    set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }));
    await dbDeleteCategory(id);
  },
}));

export const useCategories = () => useCategoryStore((s) => s.categories);
export { slugify, getCategoryBySlug };
