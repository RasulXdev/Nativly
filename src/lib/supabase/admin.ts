import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'

// SUPABASE_SERVICE_ROLE_KEY — add manually in Vercel env vars
// (Settings → Environment Variables → SUPABASE_SERVICE_ROLE_KEY)
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
