'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { subWeeks, subMonths, startOfWeek, startOfMonth, format } from 'date-fns'
import { az } from 'date-fns/locale'

export function useWalletBalance() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['wallet-balance-tutor'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('wallets')
        .select('balance, total_earned, total_withdrawn')
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      return data as { balance: number; total_earned: number; total_withdrawn: number }
    },
  })
}

export function useTutorTransactions(filter: 'all' | 'earnings' | 'withdrawals' = 'all') {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tutor-transactions', filter],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (filter === 'earnings') {
        query = query.eq('type', 'lesson_earning')
      } else if (filter === 'withdrawals') {
        query = query.eq('type', 'withdrawal')
      } else {
        query = query.in('type', ['lesson_earning', 'withdrawal'])
      }

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
  })
}

export function useTutorEarningsChart(period: 'weekly' | 'monthly' = 'weekly') {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tutor-earnings-chart', period],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const since = period === 'weekly'
        ? subWeeks(new Date(), 7).toISOString()
        : subMonths(new Date(), 6).toISOString()

      const { data, error } = await supabase
        .from('transactions')
        .select('amount, created_at')
        .eq('user_id', user.id)
        .eq('type', 'lesson_earning')
        .gte('created_at', since)

      if (error) throw error

      if (period === 'weekly') {
        const weeks: { label: string; amount: number }[] = []
        for (let i = 7; i >= 0; i--) {
          weeks.push({
            label: format(startOfWeek(subWeeks(new Date(), i)), 'd MMM', { locale: az }),
            amount: 0,
          })
        }
        for (const tx of (data ?? []) as { amount: number; created_at: string }[]) {
          const label = format(startOfWeek(new Date(tx.created_at)), 'd MMM', { locale: az })
          const entry = weeks.find((x) => x.label === label)
          if (entry) entry.amount += tx.amount ?? 0
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
      for (const tx of (data ?? []) as { amount: number; created_at: string }[]) {
        const label = format(startOfMonth(new Date(tx.created_at)), 'MMM', { locale: az })
        const entry = months.find((x) => x.label === label)
        if (entry) entry.amount += tx.amount ?? 0
      }
      return months
    },
  })
}

export function useWithdrawalRequest() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ amount, bankDetails }: { amount: number; bankDetails: string }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      if (amount < 50) throw new Error('Minimum çıxarış $50-dir')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: wallet } = await db
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single()

      if (!wallet || (wallet.balance as number) < amount) throw new Error('Balans kifayət deyil')

      const { error } = await db.from('transactions').insert({
        user_id: user.id,
        type: 'withdrawal',
        amount,
        currency: 'USD',
        status: 'pending',
        description: `Çıxarış: ${bankDetails}`,
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet-balance-tutor'] })
      queryClient.invalidateQueries({ queryKey: ['tutor-transactions'] })
    },
  })
}
