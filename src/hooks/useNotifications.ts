'use client'

import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/types/database'

export type NotificationRow = Database['public']['Tables']['notifications']['Row']

/** Notifications list + realtime subscription for the current user. */
export function useNotifications() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async (): Promise<NotificationRow[]> => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30)

      if (error) throw error
      return (data as NotificationRow[]) ?? []
    },
  })

  // Realtime: refresh on any new notification for this user.
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null
    let active = true

    ;(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user || !active) return

      channel = supabase
        .channel(`notifications:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
          }
        )
        .subscribe()
    })()

    return () => {
      active = false
      if (channel) supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const unreadCount = (query.data ?? []).filter((n) => !n.is_read).length

  return { ...query, unreadCount }
}

export function useMarkNotificationRead() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .update({ is_read: true } as any)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('notifications')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .update({ is_read: true } as any)
        .eq('user_id', user.id)
        .eq('is_read', false)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
