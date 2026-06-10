'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { subWeeks, subMonths, startOfWeek, startOfMonth, format } from 'date-fns'
import { az } from 'date-fns/locale'

export interface TutorPayoutRow {
  id: string
  amount_azn: number
  status: string
  paid_at: string | null
  admin_note: string | null
  lesson_id: string | null
  created_at: string | null
}

/**
 * Payout summary in AZN. Tutors are paid a fixed amount per completed lesson,
 * settled by an admin (see tutor_payouts). `pending` = awaiting payout,
 * `paid` = already transferred, `thisMonth` = earned in the current month.
 */
export function usePayoutSummary() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tutor-payout-summary'],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { pending: 0, paid: 0, thisMonth: 0 }

      const { data, error } = await db
        .from('tutor_payouts')
        .select('amount_azn, status, created_at')
        .eq('tutor_id', user.id)

      if (error) throw error

      const rows = (data ?? []) as { amount_azn: number; status: string; created_at: string | null }[]
      const monthStart = startOfMonth(new Date())
      let pending = 0, paid = 0, thisMonth = 0
      for (const r of rows) {
        const amt = Number(r.amount_azn ?? 0)
        if (r.status === 'paid') paid += amt
        else pending += amt
        if (r.created_at && new Date(r.created_at) >= monthStart) thisMonth += amt
      }
      return { pending, paid, thisMonth }
    },
  })
}

export function useTutorPayouts(filter: 'all' | 'pending' | 'paid' = 'all') {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tutor-payouts', filter],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      let query = db
        .from('tutor_payouts')
        .select('*')
        .eq('tutor_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (filter === 'pending') query = query.eq('status', 'pending')
      else if (filter === 'paid') query = query.eq('status', 'paid')

      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as TutorPayoutRow[]
    },
  })
}

export function useTutorEarningsChart(period: 'weekly' | 'monthly' = 'weekly') {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tutor-earnings-chart', period],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const since = period === 'weekly'
        ? subWeeks(new Date(), 7).toISOString()
        : subMonths(new Date(), 6).toISOString()

      const { data, error } = await db
        .from('tutor_payouts')
        .select('amount_azn, created_at')
        .eq('tutor_id', user.id)
        .gte('created_at', since)

      if (error) throw error

      const rows = (data ?? []) as { amount_azn: number; created_at: string }[]

      if (period === 'weekly') {
        const weeks: { label: string; amount: number }[] = []
        for (let i = 7; i >= 0; i--) {
          weeks.push({
            label: format(startOfWeek(subWeeks(new Date(), i)), 'd MMM', { locale: az }),
            amount: 0,
          })
        }
        for (const p of rows) {
          const label = format(startOfWeek(new Date(p.created_at)), 'd MMM', { locale: az })
          const entry = weeks.find((x) => x.label === label)
          if (entry) entry.amount += Number(p.amount_azn ?? 0)
        }
        return weeks
      }

      const months: { label: string; amount: number }[] = []
      for (let i = 5; i >= 0; i--) {
        months.push({
          label: format(startOfMonth(subMonths(new Date(), i)), 'MMM', { locale: az }),
          amount: 0,
        })
      }
      for (const p of rows) {
        const label = format(startOfMonth(new Date(p.created_at)), 'MMM', { locale: az })
        const entry = months.find((x) => x.label === label)
        if (entry) entry.amount += Number(p.amount_azn ?? 0)
      }
      return months
    },
  })
}
