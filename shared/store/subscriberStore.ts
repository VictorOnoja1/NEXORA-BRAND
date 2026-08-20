import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Subscriber } from "../types";

const INITIAL_SUBSCRIBERS: Subscriber[] = [
  {
    id: "sub-101",
    email: "chioma.adebayo@gmail.com",
    status: "active",
    subscribedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "sub-102",
    email: "zainab.ibrahim@yahoo.com",
    status: "active",
    subscribedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "sub-103",
    email: "funke.okafor@outlook.com",
    status: "active",
    subscribedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

interface SubscribeResult {
  success: boolean;
  message: string;
}

interface SubscriberState {
  subscribers: Subscriber[];
  subscribe: (email: string) => SubscribeResult;
  removeSubscriber: (id: string) => void;
  toggleStatus: (id: string) => void;
}

export const useSubscriberStore = create<SubscriberState>()(
  persist(
    (set, get) => ({
      subscribers: INITIAL_SUBSCRIBERS,
      subscribe: (email: string) => {
        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail || !cleanEmail.includes("@")) {
          return { success: false, message: "Please enter a valid email address." };
        }

        const existing = get().subscribers.find(
          (s) => s.email.toLowerCase() === cleanEmail
        );

        if (existing) {
          if (existing.status === "unsubscribed") {
            set((state) => ({
              subscribers: state.subscribers.map((s) =>
                s.id === existing.id ? { ...s, status: "active", subscribedAt: new Date().toISOString() } : s
              ),
            }));
            return { success: true, message: "Welcome back! Your subscription has been reactivated." };
          }
          return { success: false, message: "This email is already subscribed to NEXORA." };
        }

        const newSub: Subscriber = {
          id: `sub-${Date.now()}`,
          email: cleanEmail,
          status: "active",
          subscribedAt: new Date().toISOString(),
        };

        set((state) => ({
          subscribers: [newSub, ...state.subscribers],
        }));

        return { success: true, message: "Thank you for subscribing to NEXORA updates!" };
      },
      removeSubscriber: (id: string) =>
        set((state) => ({
          subscribers: state.subscribers.filter((s) => s.id !== id),
        })),
      toggleStatus: (id: string) =>
        set((state) => ({
          subscribers: state.subscribers.map((s) =>
            s.id === id
              ? { ...s, status: s.status === "active" ? "unsubscribed" : "active" }
              : s
          ),
        })),
    }),
    { name: "nexora-subscribers" }
  )
);
