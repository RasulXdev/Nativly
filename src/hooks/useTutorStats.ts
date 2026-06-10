'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { startOfMonth } from 'date-fns'

export function useTutorStats() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tutor-stats'],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data: tutorProfile } = await db
        .from('tutor_profiles')
        .select('id, average_rating, total_reviews')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!tutorProfile) return null

      const tp = tutorProfile as { id: string; average_rating: number | null; total_reviews: number | null }
      const monthStart = startOfMonth(new Date()).toISOString()

      const [lessonsResult, studentsResult, earningsResult] = await Promise.all([
        db
          .from('lessons')
          .select('id, status, scheduled_at')
          .eq('tutor_id', tp.id)
          .gte('scheduled_at', monthStart),
        db
          .from('lessons')
          .select('student_id')
          .eq('tutor_id', tp.id)
          .eq('status', 'completed'),
        db
          .from('transactions')
          .select('amount')
          .eq('user_id', user.id)
          .eq('type', 'lesson_earning')
          .gte('created_at', monthStart),
      ])

      const lessons = lessonsResult.data ?? []
      const completedThisMonth = lessons.filter((l: { status: string }) => l.status === 'completed').length
      const uniqueStudents = new Set(
        (studentsResult.data ?? []).map((l: { student_id: string }) => l.student_id)
      ).size
      const monthlyEarnings = (earningsResult.data ?? []).reduce(
        (sum: number, t: { amount: number }) => sum + (t.amount ?? 0), 0
      )

      return {
        lessonsThisMonth: completedThisMonth,
        activeStudents: uniqueStudents,
        averageRating: tp.average_rating ?? 0,
        totalReviews: tp.total_reviews ?? 0,
        monthlyEarnings,
      }
    },
  })
}
