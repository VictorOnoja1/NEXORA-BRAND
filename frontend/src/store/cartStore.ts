import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@shared/types";
import { useProductStore } from "@shared/store/productStore";

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
        const products = useProductStore.getState().products;
        return get().lines.reduce((sum, l) => {
          const product = products.find((p) => p.id === l.productId);
          return product ? sum + product.price * l.quantity : sum;
        }, 0);
      },
    }),
    { name: "nexora-cart" }
  )
);
