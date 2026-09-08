import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category, CategorySlug } from "../types";
import { categories as seedCategories } from "../data/categories";
import { isSupabaseConfigured } from "../lib/supabase";
import * as api from "../lib/api";

// -----------------------------------------------------------------------
// Live category list.
//
// When Supabase is configured, `categories` is loaded from (and every
// mutation is written straight to) the `categories` table via
// src/lib/api.ts. When it is NOT configured, this falls back to the
// original zero-setup behavior: seeded from src/data/categories.ts and
// kept in localStorage.
// -----------------------------------------------------------------------

interface CategoryState {
  categories: Category[];
  loading: boolean;
  loaded: boolean;
  loadCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, "id">) => Promise<Category>;
  updateCategory: (id: string, patch: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

function makeId() {
  return `cat-${Math.random().toString(36).slice(2, 10)}`;
}

function slugify(name: string): CategorySlug {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") as CategorySlug;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: seedCategories,
      loading: false,
      loaded: !isSupabaseConfigured,

      loadCategories: async () => {
        if (!isSupabaseConfigured) return;
        set({ loading: true });
        try {
          const categories = await api.fetchCategories();
          set({ categories, loading: false, loaded: true });
        } catch {
          set({ loading: false, loaded: true });
        }
      },

      addCategory: async (input) => {
        const withSlug = { ...input, slug: input.slug || slugify(input.name) };
        if (isSupabaseConfigured) {
          const category = await api.createCategory(withSlug);
          set((state) => ({ categories: [...state.categories, category] }));
          return category;
        }
        const category: Category = { ...withSlug, id: makeId() };
        set((state) => ({ categories: [...state.categories, category] }));
        return category;
      },

      updateCategory: async (id, patch) => {
        if (isSupabaseConfigured) {
          await api.updateCategory(id, patch);
        }
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        }));
      },

      deleteCategory: async (id) => {
        if (isSupabaseConfigured) {
          await api.deleteCategory(id);
        }
        set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }));
      },
    }),
    {
      name: "nexora-categories",
      // Same guard as productStore: never let a stray empty persisted
      // array permanently hide every category.
      merge: (persisted, current) => {
        const persistedState = persisted as Partial<CategoryState> | undefined;
        const persistedCategories = persistedState?.categories;
        const hasCategories = Array.isArray(persistedCategories) && persistedCategories.length > 0;
        return {
          ...current,
          ...persistedState,
          categories: hasCategories ? (persistedCategories as Category[]) : seedCategories,
        };
      },
      partialize: (state) => ({ categories: state.categories } as CategoryState),
    }
  )
);

if (isSupabaseConfigured) {
  void useCategoryStore.getState().loadCategories();
}

export const useCategories = () => useCategoryStore((s) => s.categories);
export { slugify };
