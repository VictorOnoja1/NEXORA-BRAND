import { create } from "zustand";
import type { Order, OrderStatus, CustomerInfo, OrderItem } from "../types";
import {
  fetchOrders,
  fetchOrderById,
  fetchOrderByNumber,
  dbCreateOrder,
  dbUpdateOrderStatus,
} from "../lib/db";

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  loadOrders: () => Promise<void>;
  createOrder: (input: {
    customer: CustomerInfo;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    paymentReference?: string;
    status?: OrderStatus;
  }) => Promise<Order>;
  updateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getByOrderNumber: (orderNumber: string) => Order | undefined;
  fetchOrderById: (id: string) => Promise<Order | null>;
  fetchOrderByNumber: (orderNumber: string) => Promise<Order | null>;
}

export const useOrderStore = create<OrderState>()((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  loadOrders: async () => {
    set({ loading: true, error: null });
    try {
      const orders = await fetchOrders();
      set({ orders, loading: false });
    } catch (err) {
      set({ loading: false, error: (err as Error).message });
    }
  },

  createOrder: async (input) => {
    const order = await dbCreateOrder(input);
    set((state) => ({ orders: [order, ...state.orders] }));
    return order;
  },

  updateStatus: async (orderId, status) => {
    // Optimistic update
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    }));
    await dbUpdateOrderStatus(orderId, status);
  },

  getByOrderNumber: (orderNumber) =>
    get().orders.find((o) => o.orderNumber === orderNumber),

  fetchOrderById: (id) => fetchOrderById(id),

  fetchOrderByNumber: (orderNumber) => fetchOrderByNumber(orderNumber),
}));
