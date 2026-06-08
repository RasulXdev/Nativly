import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'

// SUPABASE_URL + SUPABASE_SECRET_KEY — auto-provided by Vercel-Supabase integration (server-side only)
export function createAdminClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
