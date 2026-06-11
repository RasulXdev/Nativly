'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface ActiveSubscription {
  id: string
  lessons_remaining: number
  lessons_total: number
  current_period_end: string
  plan: {
    name_az: string
    lessons_per_month: number
  } | null
}

/** The current user's active subscription (or null if none). */
export function useActiveSubscription() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['active-subscription'],
    queryFn: async (): Promise<ActiveSubscription | null> => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return null

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('user_subscriptions')
        .select(
          `id, lessons_remaining, lessons_total, current_period_end,
           plan:subscription_plans(name_az, lessons_per_month)`
        )
        .eq('student_id', user.id)
        .eq('status', 'active')
        .order('current_period_end', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) throw error
      return (data as ActiveSubscription | null) ?? null
    },
  })
}
