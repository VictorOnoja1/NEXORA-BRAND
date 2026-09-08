import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useProducts } from "../store/productStore";

interface WishlistState {
  ids: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  remove: (productId: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) =>
        set((state) => ({
          ids: state.ids.includes(productId)
            ? state.ids.filter((id) => id !== productId)
            : [...state.ids, productId],
        })),
      has: (productId) => get().ids.includes(productId),
      remove: (productId) =>
        set((state) => ({ ids: state.ids.filter((id) => id !== productId) })),
    }),
    { name: "nexora-wishlist" }
  )
);

/**
 * Wishlist count for the header badge. Filters saved ids against the
 * current product catalogue (useProducts()) so an id pointing at a
 * deleted/deactivated product doesn't inflate the badge past what the
 * Wishlist page actually shows — Wishlist.tsx counts the same way
 * (products.filter((p) => ids.includes(p.id))).
 */
export const useWishlistCount = () => {
  const ids = useWishlistStore((s) => s.ids);
  const products = useProducts();
  return useMemo(
    () => ids.filter((id) => products.some((p) => p.id === id)).length,
    [ids, products]
  );
};
