import { create } from "zustand";
import { persist } from "zustand/middleware";
import { siteConfig } from "@shared/lib/config";

interface AuthState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (username, password) => {
        const ok =
          username.trim().toLowerCase() === siteConfig.adminUsername.trim().toLowerCase() &&
          password === siteConfig.adminPassword;
        if (ok) set({ isAuthenticated: true });
        return ok;
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    { name: "nexora-admin-auth" }
  )
);
