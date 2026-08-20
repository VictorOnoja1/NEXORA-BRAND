import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Subscriber } from "../types";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

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
  fetchFromSupabase: () => Promise<void>;
}

export const useSubscriberStore = create<SubscriberState>()(
  persist<SubscriberState>(
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

            // Sync with Supabase if configured
            if (isSupabaseConfigured && supabase) {
              supabase
                .from("newsletter_subscribers")
                .update({ status: "active" })
                .eq("email", cleanEmail)
                .then();
            }

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

        // Sync with Supabase if configured
        if (isSupabaseConfigured && supabase) {
          supabase
            .from("newsletter_subscribers")
            .insert({ email: cleanEmail, status: "active" })
            .then();
        }

        // Notify iframe/cross-origin sync bridge if embedded
        try {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("storage"));
          }
        } catch (_) {}

        return { success: true, message: "Thank you for subscribing to NEXORA updates!" };
      },
      removeSubscriber: (id: string) => {
        const target = get().subscribers.find((s) => s.id === id);
        set((state) => ({
          subscribers: state.subscribers.filter((s) => s.id !== id),
        }));
        if (target && isSupabaseConfigured && supabase) {
          supabase.from("newsletter_subscribers").delete().eq("email", target.email).then();
        }
      },
      toggleStatus: (id: string) => {
        const target = get().subscribers.find((s) => s.id === id);
        const newStatus: "active" | "unsubscribed" = target?.status === "active" ? "unsubscribed" : "active";
        set((state) => ({
          subscribers: state.subscribers.map((s) =>
            s.id === id ? { ...s, status: newStatus } : s
          ),
        }));
        if (target && isSupabaseConfigured && supabase) {
          supabase.from("newsletter_subscribers").update({ status: newStatus }).eq("email", target.email).then();
        }
      },
      fetchFromSupabase: async () => {
        if (!isSupabaseConfigured || !supabase) return;
        try {
          const { data, error } = await supabase.from("newsletter_subscribers").select("*");
          if (!error && data && data.length > 0) {
            const mapped: Subscriber[] = data.map((row: { id: string; email: string; status: string; created_at: string }) => ({
              id: row.id,
              email: row.email,
              status: row.status as "active" | "unsubscribed",
              subscribedAt: row.created_at || new Date().toISOString(),
            }));
            set({ subscribers: mapped });
          }
        } catch (_) {}
      },
    }),
    { name: "nexora-subscribers" }
  )
);
