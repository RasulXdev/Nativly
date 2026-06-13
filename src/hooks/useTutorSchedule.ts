'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getOrCreateTutorProfileId(db: any, userId: string): Promise<string> {
  const { data: tp } = await db
    .from('tutor_profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (tp) return (tp as { id: string }).id

  const { data: created, error } = await db
    .from('tutor_profiles')
    .insert({ user_id: userId, application_status: 'pending' })
    .select('id')
    .single()

  if (error) throw error
  return (created as { id: string }).id
}

export interface AvailabilitySlot {
  id?: string
  day_of_week: DayOfWeek
  start_time: string
  end_time: string
  is_active: boolean
}

export interface DateAvailabilitySlot {
  id?: string
  specific_date: string
  start_time: string
  end_time: string
  is_active: boolean
}

/* ── Schedule mode ── */

export function useTutorScheduleMode() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tutor-schedule-mode'],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return 'weekly'

      const { data: tp } = await db
        .from('tutor_profiles')
        .select('schedule_mode')
        .eq('user_id', user.id)
        .maybeSingle()

      return (tp as { schedule_mode?: string } | null)?.schedule_mode ?? 'weekly'
    },
  })
}

export function useUpdateScheduleMode() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (mode: 'weekly' | 'monthly') => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const tutorId = await getOrCreateTutorProfileId(db, user.id)
      const { error } = await db
        .from('tutor_profiles')
        .update({ schedule_mode: mode })
        .eq('id', tutorId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor-schedule-mode'] })
    },
  })
}

/* ── Weekly defaults ── */

export function useTutorAvailability() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tutor-availability'],
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
        .from('tutor_availability')
        .select('*')
        .eq('tutor_id', (tp as { id: string }).id)
        .is('specific_date', null)

      if (error) throw error
      return (data ?? []) as AvailabilitySlot[]
    },
  })
}

export function useUpdateAvailability() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (slots: AvailabilitySlot[]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const tutorId = await getOrCreateTutorProfileId(db, user.id)

      // Only delete weekly (non-date-specific) rows
      await db
        .from('tutor_availability')
        .delete()
        .eq('tutor_id', tutorId)
        .is('specific_date', null)

      const active = slots.filter((s) => s.is_active)
      if (active.length > 0) {
        const { error } = await db.from('tutor_availability').insert(
          active.map((s) => ({
            tutor_id: tutorId,
            day_of_week: s.day_of_week,
            start_time: s.start_time,
            end_time: s.end_time,
            is_active: true,
          }))
        )
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor-availability'] })
    },
  })
}

/* ── Date-specific overrides ── */

export function useDateAvailability(month?: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tutor-date-availability', month],
    enabled: !!month,
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

      const startDate = `${month}-01`
      const [y, m] = month!.split('-').map(Number)
      const endDate = `${y}-${String(m).padStart(2, '0')}-${new Date(y, m, 0).getDate()}`

      const { data, error } = await db
        .from('tutor_availability')
        .select('id, specific_date, start_time, end_time, is_active')
        .eq('tutor_id', (tp as { id: string }).id)
        .not('specific_date', 'is', null)
        .gte('specific_date', startDate)
        .lte('specific_date', endDate)

      if (error) throw error
      return (data ?? []) as DateAvailabilitySlot[]
    },
  })
}

export function useSaveDateAvailability() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (slots: DateAvailabilitySlot[]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const tutorId = await getOrCreateTutorProfileId(db, user.id)

      const dates = [...new Set(slots.map((s) => s.specific_date))]
      if (dates.length > 0) {
        await db
          .from('tutor_availability')
          .delete()
          .eq('tutor_id', tutorId)
          .in('specific_date', dates)
      }

      const toInsert = slots.filter((s) => s.is_active)
      if (toInsert.length > 0) {
        const { error } = await db.from('tutor_availability').insert(
          toInsert.map((s) => ({
            tutor_id: tutorId,
            specific_date: s.specific_date,
            start_time: s.start_time,
            end_time: s.end_time,
            is_active: true,
          }))
        )
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor-date-availability'] })
    },
  })
}

/* ── Unavailability (blocked dates) ── */

export function useTutorUnavailability() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tutor-unavailability'],
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
        .from('tutor_unavailability')
        .select('*')
        .eq('tutor_id', (tp as { id: string }).id)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date')

      if (error) throw error
      return data ?? []
    },
  })
}

export function useAddUnavailability() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ date, reason }: { date: string; reason?: string }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const tutorId = await getOrCreateTutorProfileId(db, user.id)
      const { error } = await db.from('tutor_unavailability').insert({
        tutor_id: tutorId,
        date,
        reason,
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor-unavailability'] })
    },
  })
}

export function useDeleteUnavailability() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from('tutor_unavailability').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor-unavailability'] })
    },
  })
}
