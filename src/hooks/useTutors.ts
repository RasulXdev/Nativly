'use client'

import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { TutorWithProfile } from '@/lib/types'

export interface TutorFilters {
  languages?: string[]
  minRating?: number
  specializations?: string[]
  onlineOnly?: boolean
  instantBooking?: boolean
  search?: string
  sortBy?: 'rating' | 'newest' | 'popular'
}

const PAGE_SIZE = 12

export function useTutors(filters: TutorFilters = {}) {
  const supabase = createClient()

  return useInfiniteQuery({
    queryKey: ['tutors', filters],
    queryFn: async ({ pageParam = 0 }) => {
      // user_languages relates to profiles (not tutor_profiles), so it must be
      // embedded through the profiles join. Use !inner when filtering by language
      // so tutors without a matching language are excluded.
      const langJoin = filters.languages?.length
        ? 'user_languages!inner(*, languages!inner(*))'
        : 'user_languages(*, languages(*))'

      let query = supabase
        .from('tutor_profiles')
        .select(`*, profiles!inner(*, ${langJoin})`)
        .eq('application_status', 'approved')
        .eq('is_accepting_students', true)
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1)

      if (filters.onlineOnly) {
        query = query.eq('profiles.is_online', true)
      }
      if (filters.instantBooking) {
        query = query.eq('instant_booking', true)
      }
      if (filters.minRating != null) {
        query = query.gte('average_rating', filters.minRating)
      }
      if (filters.search) {
        query = query.ilike('profiles.full_name', `%${filters.search}%`)
      }
      if (filters.languages?.length) {
        query = query.in('profiles.user_languages.languages.code', filters.languages)
      }
      if (filters.specializations?.length) {
        query = query.overlaps('specializations', filters.specializations)
      }

      switch (filters.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false })
          break
        case 'popular':
          query = query.order('total_lessons', { ascending: false })
          break
        default:
          query = query.order('average_rating', { ascending: false })
      }

      const { data, error } = await query
      if (error) throw error
      // Lift user_languages from the nested profiles join back to the top level
      // so consumers can read tutor.user_languages directly.
      const rows = (data ?? []).map((t: Record<string, unknown>) => ({
        ...t,
        user_languages: (t.profiles as { user_languages?: unknown[] } | null)?.user_languages ?? [],
      }))
      return rows as unknown as TutorWithProfile[]
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length : undefined,
    initialPageParam: 0,
  })
}

export function useTutor(id: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tutor', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tutor_profiles')
        .select(`
          *,
          profiles!inner(*, user_languages(*, languages(*))),
          tutor_availability(*)
        `)
        .eq('id', id)
        .eq('application_status', 'approved')
        .single()

      if (error) throw error
      // Lift user_languages from the nested profiles join to the top level.
      const tutor = data as Record<string, unknown>
      return {
        ...tutor,
        user_languages: (tutor.profiles as { user_languages?: unknown[] } | null)?.user_languages ?? [],
      } as unknown as TutorWithProfile & { tutor_availability: any[] }
    },
    enabled: !!id,
  })
}

export function useTutorReviews(tutorId: string, page = 0) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tutor-reviews', tutorId, page],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from('reviews')
        .select('*, profiles!student_id(*)', { count: 'exact' })
        .eq('tutor_id', tutorId)
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .range(page * 5, (page + 1) * 5 - 1)

      if (error) throw error
      return { reviews: data ?? [], total: count ?? 0 }
    },
    enabled: !!tutorId,
  })
}
