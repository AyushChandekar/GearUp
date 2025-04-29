import { supabaseConfig } from "@/lib/env-config"

export function createClient() {
  return createClient(supabaseConfig.url, supabaseConfig.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
