import { createClient } from "@supabase/supabase-js";

// Admin Supabase client — ONLY use on server-side (server actions, API routes).
// NEVER import this in client components.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env"
    );
  }
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const STORAGE_BUCKETS = {
  PRODUCT_IMAGES: "product-images",
  CATEGORY_IMAGES: "category-images",
  BUDGET_REQUEST_IMAGES: "budget-request-images",
  LOGOS: "logos",
} as const;
