import { create } from "zustand";
import { persist } from "zustand/middleware";
import { siteConfig } from "../lib/config";

// -----------------------------------------------------------------------
// Admin session gate — client-side only. See the comment on
// siteConfig.adminUsername/adminPassword in src/lib/config.ts: this keeps
// casual visitors out of /admin, but the credentials live in the shipped
// JS bundle, so it is NOT real security. Swap for real server-side auth
// (Supabase Auth) before this dashboard holds anything sensitive.
// -----------------------------------------------------------------------

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
