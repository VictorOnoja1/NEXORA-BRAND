import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderStatus, CustomerInfo, OrderItem } from "../types";

interface OrderState {
  orders: Order[];
  createOrder: (input: {
    customer: CustomerInfo;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    paymentReference?: string;
    status?: OrderStatus;
  }) => Order;
  updateStatus: (orderId: string, status: OrderStatus) => void;
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
      createOrder: ({ customer, items, subtotal, deliveryFee, paymentReference, status = "pending" }) => {
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
        return order;
      },
      updateStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        })),
      getByOrderNumber: (orderNumber) => get().orders.find((o) => o.orderNumber === orderNumber),
    }),
    { name: "nexora-orders" }
  )
);
