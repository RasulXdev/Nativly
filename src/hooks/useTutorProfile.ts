'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { TutorWithProfile } from '@/lib/types'

export function useTutorProfile() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tutor-profile-own'],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await db
        .from('tutor_profiles')
        .select(`*, profiles!inner(*, user_languages(*, languages(*)))`)
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      if (!data) return null
      // Lift user_languages from the nested profiles join to the top level.
      return {
        ...data,
        user_languages: data.profiles?.user_languages ?? [],
      } as (TutorWithProfile & { tutor_availability: unknown[] })
    },
  })
}

export function useUpdateTutorProfile() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Record<string, unknown>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: existing } = await db
        .from('tutor_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (existing) {
        const { error } = await db
          .from('tutor_profiles')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('user_id', user.id)
        if (error) throw error
      } else {
        const { error } = await db
          .from('tutor_profiles')
          .insert({ user_id: user.id, ...updates })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor-profile-own'] })
      queryClient.invalidateQueries({ queryKey: ['tutor-stats'] })
    },
  })
}

export function useUpdateProfile() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Record<string, unknown>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await db
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor-profile-own'] })
    },
  })
}
