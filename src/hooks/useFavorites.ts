'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function useFavorites() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return [] as string[]

      const { data, error } = await supabase
        .from('favorites')
        .select('tutor_id')
        .eq('student_id', user.id)

      if (error) throw error
      return ((data ?? []) as { tutor_id: string }[]).map((f) => f.tutor_id)
    },
  })
}

export function useToggleFavorite() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ tutorId, isFav }: { tutorId: string; isFav: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Daxil olun')

      if (isFav) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('student_id', user.id)
          .eq('tutor_id', tutorId)
        if (error) throw error
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from('favorites') as any)
          .insert({ student_id: user.id, tutor_id: tutorId })
        if (error) throw error
      }
    },
    onSuccess: (_, { isFav }) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      toast.success(isFav ? 'Seçilmişlərdən silindi' : 'Seçilmişlərə əlavə edildi')
    },
    onError: () => {
      toast.error('Xəta baş verdi')
    },
  })
}
