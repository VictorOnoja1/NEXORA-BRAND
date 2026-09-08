// -----------------------------------------------------------------------
// Supabase client — NOT YET CONNECTED.
//
// NEXORA's blueprint specifies Supabase (PostgreSQL + Auth + Storage) as the
// backend. This project ships with a fully working UI backed by local mock
// data (see src/data/*) so every screen is usable today, but no live
// database is configured.
//
// To connect a real backend:
//   1. Create a Supabase project.
//   2. Run the SQL in supabase/schema.sql against it.
//   3. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in a `.env` file
//      (see .env.example).
//   4. Replace the mock data calls in src/data/products.ts / categories.ts
//      (and the admin pages) with calls to `supabase.from(...)`.
//
// Until those env vars are set, `isSupabaseConfigured` is false and the app
// deliberately keeps using local mock data instead of silently failing.
// -----------------------------------------------------------------------
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;
