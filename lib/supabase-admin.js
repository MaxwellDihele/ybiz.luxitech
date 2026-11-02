import { createClient } from "@supabase/supabase-js";

// Service-role client: bypasses RLS. Import ONLY from server route handlers, never from client components.
export function supabaseService() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
}
