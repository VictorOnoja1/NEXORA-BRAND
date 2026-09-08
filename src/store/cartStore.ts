import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "../types";
import { useProductStore, useProducts } from "./productStore";

interface CartState {
  lines: CartLine[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      addItem: (productId, quantity = 1) => {
        set((state) => {
          const existing = state.lines.find((l) => l.productId === productId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === productId
                  ? { ...l, quantity: l.quantity + quantity }
                  : l
              ),
            };
          }
          return { lines: [...state.lines, { productId, quantity }] };
        });
      },
      removeItem: (productId) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.productId !== productId),
        })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.productId !== productId)
              : state.lines.map((l) =>
                  l.productId === productId ? { ...l, quantity } : l
                ),
        })),
      clear: () => set({ lines: [] }),
      totalItems: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: () => {
        // Only count products still active/available — matches what Cart.tsx
        // actually renders (it filters cart lines to useProducts(), which is
        // active-only), so a deactivated product can't silently inflate the
        // charged total for a line the customer no longer sees.
        const products = useProductStore.getState().products.filter((p) => p.active);
        return get().lines.reduce((sum, l) => {
          const product = products.find((p) => p.id === l.productId);
          return product ? sum + product.price * l.quantity : sum;
        }, 0);
      },
    }),
    { name: "nexora-cart" }
  )
);

/**
 * Cart item count for the header badge. Sums only lines whose product is
 * still in the current catalogue (useProducts()), matching how Cart.tsx
 * itself filters lines before rendering/counting them — so a line left
 * over from a deactivated product can't inflate the badge past what the
 * Cart page actually shows.
 */
export const useCartCount = () => {
  const lines = useCartStore((s) => s.lines);
  const products = useProducts();
  return useMemo(() => {
    const validIds = new Set(products.map((p) => p.id));
    return lines.reduce((sum, l) => (validIds.has(l.productId) ? sum + l.quantity : sum), 0);
  }, [lines, products]);
};
