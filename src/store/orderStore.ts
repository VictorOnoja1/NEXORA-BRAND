import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderStatus, CustomerInfo, OrderItem } from "../types";
import { isSupabaseConfigured } from "../lib/supabase";
import * as api from "../lib/api";

// -----------------------------------------------------------------------
// Orders.
//
// When Supabase is configured, an order is created ONLY by calling the
// `checkout` Edge Function (via api.submitCheckout) — never by a direct
// browser insert — because that function is the trust boundary that
// verifies payment server-side and decrements stock atomically. This store
// then just caches whatever the server returns (for Checkout ->
// OrderConfirmation) and, for the admin dashboard, loads the real order
// list from the DB via loadOrders()/updateStatus().
//
// When Supabase is NOT configured, this falls back to the original
// zero-setup behavior: orders are created and stored locally, in full,
// with no server round-trip.
// -----------------------------------------------------------------------

interface OrderState {
  orders: Order[];
  loading: boolean;
  loaded: boolean;
  /** Admin-only: refetch every order from Supabase. No-op if unconfigured. */
  loadOrders: () => Promise<void>;
  /**
   * Places an order. When Supabase is configured this goes through the
   * checkout Edge Function (server verifies payment + decrements stock);
   * otherwise it's recorded straight into local state, matching the app's
   * original no-backend behavior.
   */
  submitOrder: (input: {
    customer: CustomerInfo;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    paymentReference?: string;
    status?: OrderStatus;
  }) => Promise<{ ok: true; order: Order } | { ok: false; message: string }>;
  updateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getByOrderNumber: (orderNumber: string) => Order | undefined;
}

function makeOrderNumber() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `NX${new Date().getFullYear()}${rand}`;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      loading: false,
      loaded: !isSupabaseConfigured,

      loadOrders: async () => {
        if (!isSupabaseConfigured) return;
        set({ loading: true });
        try {
          const orders = await api.fetchAllOrders();
          set({ orders, loading: false, loaded: true });
        } catch {
          set({ loading: false, loaded: true });
        }
      },

      submitOrder: async ({ customer, items, subtotal, deliveryFee, paymentReference, status = "pending" }) => {
        if (isSupabaseConfigured) {
          const result = await api.submitCheckout({
            customer: {
              full_name: customer.fullName,
              phone: customer.phone,
              email: customer.email,
              address: customer.address,
              state: customer.state,
              city: customer.city,
              delivery_note: customer.deliveryNote,
            },
            items: items.map((i) => ({
              product_id: i.productId,
              name: i.name,
              image: i.image,
              price: i.price,
              quantity: i.quantity,
            })),
            subtotal,
            deliveryFee,
            paymentReference,
          });
          if (result.ok) {
            set((state) => ({ orders: [result.order, ...state.orders] }));
          }
          return result;
        }

        const order: Order = {
          id: `ord-${Math.random().toString(36).slice(2, 10)}`,
          orderNumber: makeOrderNumber(),
          customer,
          items,
          subtotal,
          deliveryFee,
          total: subtotal + deliveryFee,
          status,
          paymentReference,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ orders: [order, ...state.orders] }));
        return { ok: true, order };
      },

      updateStatus: async (orderId, status) => {
        if (isSupabaseConfigured) {
          await api.updateOrderStatus(orderId, status);
        }
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        }));
      },

      getByOrderNumber: (orderNumber) => get().orders.find((o) => o.orderNumber === orderNumber),
    }),
    {
      name: "nexora-orders",
      // Same reasoning as productStore/categoryStore: Supabase (when
      // configured) is refetched via loadOrders() on mount, so this cache
      // only needs to survive page refreshes for the no-backend demo mode
      // and for the "just placed this order" handoff to OrderConfirmation.
      partialize: (state) => ({ orders: state.orders } as OrderState),
    }
  )
);

if (isSupabaseConfigured) {
  void useOrderStore.getState().loadOrders();
}
