import { create } from "zustand";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { siteConfig } from "../lib/config";

// -----------------------------------------------------------------------
// Admin session.
//
// When Supabase is configured, this is real server-side auth: sign-in goes
// through Supabase Auth, and the signed-in user must have role='admin' in
// the `profiles` table (checked here AND enforced independently by every
// admin RLS policy — so even if this check were somehow bypassed client
// side, the database itself still refuses writes/reads to a non-admin
// session). Session persistence/refresh is handled by supabase-js itself.
//
// When Supabase is NOT configured, this falls back to the original
// client-side-only credential check (see siteConfig.adminUsername/
// adminPassword) so the app keeps working out of the box with zero setup —
// this fallback is NOT secure and was never meant to be; see the comments
// on those config values.
// -----------------------------------------------------------------------

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  // Starts true only when Supabase is configured, since restoring a
  // session is async — AdminLayout waits for this before deciding whether
  // to bounce to /login, so a real logged-in admin isn't flashed to the
  // login page on refresh while the session check is still in flight.
  loading: isSupabaseConfigured,

  login: async (emailOrUsername, password) => {
    if (!isSupabaseConfigured || !supabase) {
      const ok =
        emailOrUsername.trim().toLowerCase() === siteConfig.adminUsername.trim().toLowerCase() &&
        password === siteConfig.adminPassword;
      if (ok) set({ isAuthenticated: true });
      return ok;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailOrUsername.trim(),
      password,
    });
    if (error || !data.session) return false;

    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      await supabase.auth.signOut();
      return false;
    }
    set({ isAuthenticated: true });
    return true;
  },

  logout: () => {
    if (isSupabaseConfigured && supabase) {
      void supabase.auth.signOut();
    }
    set({ isAuthenticated: false });
  },
}));

async function checkIsAdmin(): Promise<boolean> {
  if (!supabase) return false;
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return false;
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (error || !data) return false;
  return data.role === "admin";
}

// Restore/track the session once, at module load, so isAuthenticated stays
// correct across refreshes and tab-to-tab sign-outs without every page
// having to trigger its own check.
if (isSupabaseConfigured && supabase) {
  void (async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      const isAdmin = await checkIsAdmin();
      useAuthStore.setState({ isAuthenticated: isAdmin, loading: false });
    } else {
      useAuthStore.setState({ isAuthenticated: false, loading: false });
    }
  })();

  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") {
      useAuthStore.setState({ isAuthenticated: false });
    }
  });
}
