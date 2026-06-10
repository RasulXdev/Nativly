'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useTutorStudents() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tutor-students'],
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
          id, scheduled_at, status, duration_minutes, tutor_notes,
          student:profiles!lessons_student_id_fkey(id, full_name, avatar_url, email)
        `)
        .eq('tutor_id', (tp as { id: string }).id)
        .in('status', ['completed', 'scheduled', 'in_progress'])
        .order('scheduled_at', { ascending: false })

      if (error) throw error

      const studentMap = new Map<string, {
        id: string
        full_name: string
        avatar_url: string | null
        email: string
        lessonCount: number
        lastLesson: string | null
        tutorNotes: string
        lastLessonId: string
      }>()

      for (const lesson of (data ?? []) as {
        id: string
        scheduled_at: string
        status: string
        duration_minutes: number
        tutor_notes: string | null
        student: { id: string; full_name: string; avatar_url: string | null; email: string } | null
      }[]) {
        const s = lesson.student
        if (!s) continue
        if (!studentMap.has(s.id)) {
          studentMap.set(s.id, {
            ...s,
            lessonCount: 0,
            lastLesson: null,
            tutorNotes: lesson.tutor_notes ?? '',
            lastLessonId: lesson.id,
          })
        }
        const entry = studentMap.get(s.id)!
        if (lesson.status === 'completed') {
          entry.lessonCount++
          if (!entry.lastLesson || lesson.scheduled_at > entry.lastLesson) {
            entry.lastLesson = lesson.scheduled_at
            entry.tutorNotes = lesson.tutor_notes ?? entry.tutorNotes
            entry.lastLessonId = lesson.id
          }
        }
      }

      return Array.from(studentMap.values()).sort((a, b) =>
        a.full_name.localeCompare(b.full_name)
      )
    },
  })
}

export function useUpdateTutorNotes() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ lessonId, notes }: { lessonId: string; notes: string }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('lessons')
        .update({ tutor_notes: notes })
        .eq('id', lessonId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor-students'] })
    },
  })
}
