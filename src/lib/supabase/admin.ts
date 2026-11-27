import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function createSupabaseAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (
    !url ||
    !serviceKey ||
    url.includes("YOUR_PROJECT_REF") ||
    serviceKey.includes("YOUR_SUPABASE_SERVICE_ROLE_KEY")
  ) {
    return null;
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
