import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client using anon key (safe for server components).
// Returns null when env vars are not configured.
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}
