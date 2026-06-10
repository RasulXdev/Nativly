'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { subWeeks, startOfWeek, format } from 'date-fns'
import { az } from 'date-fns/locale'

export function useUpcomingLessons() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['lessons', 'upcoming'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('lessons')
        .select(`
          id, scheduled_at, status, duration_minutes, room_id, price, currency,
          student_id, tutor_id,
          student:profiles!lessons_student_id_fkey(id, full_name, avatar_url),
          tutor:tutor_profiles!lessons_tutor_id_fkey(id, user_id, hourly_rate,
            profiles!tutor_profiles_user_id_fkey(id, full_name, avatar_url)
          )
        `)
        .eq('student_id', user.id)
        .in('status', ['scheduled', 'in_progress'])
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(5)

      if (error) throw error
      return data ?? []
    },
  })
}

export function useLessonHistory() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['lessons', 'history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('lessons')
        .select(`
          id, scheduled_at, status, duration_minutes, price, currency, student_id, tutor_id,
          tutor:tutor_profiles!lessons_tutor_id_fkey(id,
            profiles!tutor_profiles_user_id_fkey(id, full_name, avatar_url)
          )
        `)
        .eq('student_id', user.id)
        .eq('status', 'completed')
        .order('scheduled_at', { ascending: false })
        .limit(20)

      if (error) throw error
      return data ?? []
    },
  })
}

export function useRecentActivity() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('lessons')
        .select(`
          id, scheduled_at, status, duration_minutes,
          tutor:tutor_profiles!lessons_tutor_id_fkey(id,
            profiles!tutor_profiles_user_id_fkey(full_name, avatar_url)
          )
        `)
        .eq('student_id', user.id)
        .in('status', ['completed', 'cancelled', 'no_show'])
        .order('scheduled_at', { ascending: false })
        .limit(5)

      if (error) throw error
      return data ?? []
    },
  })
}

export function useWeeklyProgress() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['weekly-progress'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const sixWeeksAgo = subWeeks(new Date(), 5)

      const { data, error } = await supabase
        .from('lessons')
        .select('scheduled_at')
        .eq('student_id', user.id)
        .eq('status', 'completed')
        .gte('scheduled_at', startOfWeek(sixWeeksAgo).toISOString())

      if (error) throw error

      const weeks: { label: string; count: number }[] = []
      for (let i = 5; i >= 0; i--) {
        const weekStart = startOfWeek(subWeeks(new Date(), i))
        weeks.push({ label: format(weekStart, 'd MMM', { locale: az }), count: 0 })
      }

      for (const lesson of (data ?? []) as { scheduled_at: string }[]) {
        const w = startOfWeek(new Date(lesson.scheduled_at))
        const label = format(w, 'd MMM', { locale: az })
        const entry = weeks.find((x) => x.label === label)
        if (entry) entry.count++
      }

      return weeks
    },
  })
}

export function useStudentStats() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['student-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const [lessonsResult, walletResult] = await Promise.all([
        supabase
          .from('lessons')
          .select('id, status, duration_minutes, scheduled_at')
          .eq('student_id', user.id),
        supabase
          .from('wallets')
          .select('balance')
          .eq('user_id', user.id)
          .single(),
      ])

      const lessons = lessonsResult.data ?? []
      const now = new Date().toISOString()
      const completed = lessons.filter((l: { status: string }) => l.status === 'completed')
      const upcoming = lessons.filter(
        (l: { status: string; scheduled_at: string }) =>
          l.status === 'scheduled' && l.scheduled_at > now
      )
      const totalHours =
        completed.reduce((sum: number, l: { duration_minutes: number }) => sum + (l.duration_minutes ?? 0), 0) / 60

      return {
        totalLessons: completed.length,
        totalHours: Math.round(totalHours * 10) / 10,
        upcomingLessons: upcoming.length,
        balance: (walletResult.data as { balance: number } | null)?.balance ?? 0,
      }
    },
  })
}
