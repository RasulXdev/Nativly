'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { startOfDay, endOfDay } from 'date-fns'

export function useTutorTodayLessons() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tutor-today-lessons'],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data: tp } = await db
        .from('tutor_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!tp) return []

      const today = new Date()
      const { data, error } = await db
        .from('lessons')
        .select(`
          id, scheduled_at, status, duration_minutes, room_id, price,
          student:profiles!lessons_student_id_fkey(id, full_name, avatar_url)
        `)
        .eq('tutor_id', (tp as { id: string }).id)
        .in('status', ['scheduled', 'in_progress'])
        .gte('scheduled_at', startOfDay(today).toISOString())
        .lte('scheduled_at', endOfDay(today).toISOString())
        .order('scheduled_at', { ascending: true })

      if (error) throw error
      return data ?? []
    },
  })
}

export function useTutorUpcomingLessons() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tutor-upcoming-lessons'],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data: tp } = await db
        .from('tutor_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!tp) return []

      const { data, error } = await db
        .from('lessons')
        .select(`
          id, scheduled_at, status, duration_minutes, room_id,
          student:profiles!lessons_student_id_fkey(id, full_name, avatar_url)
        `)
        .eq('tutor_id', (tp as { id: string }).id)
        .in('status', ['scheduled', 'in_progress'])
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(10)

      if (error) throw error
      return data ?? []
    },
  })
}

export function usePendingBookings() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['pending-bookings'],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data: tp } = await db
        .from('tutor_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!tp) return []

      const { data, error } = await db
        .from('bookings')
        .select(`
          id, scheduled_at, duration_minutes, price, currency, student_note, is_trial,
          student:profiles!bookings_student_id_fkey(id, full_name, avatar_url)
        `)
        .eq('tutor_id', (tp as { id: string }).id)
        .eq('status', 'pending')
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })

      if (error) throw error
      return data ?? []
    },
  })
}

export function useConfirmBooking() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (bookingId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-bookings'] })
    },
  })
}

export function useRejectBooking() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ bookingId, reason }: { bookingId: string; reason?: string }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('bookings')
        .update({ status: 'cancelled', cancelled_reason: reason ?? null })
        .eq('id', bookingId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-bookings'] })
    },
  })
}

export function useTutorRecentReviews() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tutor-recent-reviews'],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data: tp } = await db
        .from('tutor_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!tp) return []

      const { data, error } = await db
        .from('reviews')
        .select(`*, profiles!student_id(id, full_name, avatar_url)`)
        .eq('tutor_id', (tp as { id: string }).id)
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(3)

      if (error) throw error
      return data ?? []
    },
  })
}
