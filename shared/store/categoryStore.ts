import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category, CategorySlug } from "../types";
import { categories as seedCategories } from "../data/categories";

interface CategoryState {
  categories: Category[];
  addCategory: (category: Omit<Category, "id">) => Category;
  updateCategory: (id: string, patch: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
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
      addCategory: (input) => {
        const category: Category = { ...input, id: makeId(), slug: input.slug || slugify(input.name) };
        set((state) => ({ categories: [...state.categories, category] }));
        return category;
      },
      updateCategory: (id, patch) =>
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      deleteCategory: (id) =>
        set((state) => ({ categories: state.categories.filter((c) => c.id !== id) })),
    }),
    {
      name: "nexora-categories",
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
    }
  )
);

export const useCategories = () => useCategoryStore((s) => s.categories);
export { slugify };
