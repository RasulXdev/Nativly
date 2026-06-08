import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/types/database'

// NEXT_PUBLIC_SUPABASE_URL    — add once manually in Vercel (not auto-provided with NEXT_PUBLIC_ prefix)
// NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — auto-provided by Vercel-Supabase integration
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
