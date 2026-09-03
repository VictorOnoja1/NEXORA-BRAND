import { create } from "zustand";
import type { Subscriber } from "../types";
import {
  fetchSubscribers,
  dbUpsertSubscriber,
  dbDeleteSubscriber,
  dbToggleSubscriberStatus,
  type SubscribeResult,
} from "../lib/db";

interface SubscriberState {
  subscribers: Subscriber[];
  loading: boolean;
  error: string | null;
  fetchFromSupabase: () => Promise<void>;
  subscribe: (email: string) => Promise<SubscribeResult>;
  removeSubscriber: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
}

export const useSubscriberStore = create<SubscriberState>()((set, get) => ({
  subscribers: [],
  loading: false,
  error: null,

  fetchFromSupabase: async () => {
    set({ loading: true, error: null });
    try {
      const subscribers = await fetchSubscribers();
      set({ subscribers, loading: false });
    } catch (err) {
      set({ loading: false, error: (err as Error).message });
    }
  },

  subscribe: async (email: string) => {
    const result = await dbUpsertSubscriber(email);

    if (result.success) {
      // Refresh list from DB to get the real ID and created_at
      const updated = await fetchSubscribers();
      if (updated.length > 0) set({ subscribers: updated });
    }

    // Notify cross-tab (e.g. admin listening for new subs)
    try {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
      }
    } catch (_) {}

    return result;
  },

  removeSubscriber: async (id: string) => {
    const target = get().subscribers.find((s) => s.id === id);
    // Optimistic remove
    set((state) => ({ subscribers: state.subscribers.filter((s) => s.id !== id) }));
    if (target) await dbDeleteSubscriber(target.email);
  },

  toggleStatus: async (id: string) => {
    const target = get().subscribers.find((s) => s.id === id);
    if (!target) return;
    const newStatus: "active" | "unsubscribed" =
      target.status === "active" ? "unsubscribed" : "active";
    // Optimistic update
    set((state) => ({
      subscribers: state.subscribers.map((s) =>
        s.id === id ? { ...s, status: newStatus } : s
      ),
    }));
    await dbToggleSubscriberStatus(target.email, newStatus);
  },
}));
