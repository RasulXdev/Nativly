'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { BookOpen, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getInitials } from '@/lib/utils'
import { format } from 'date-fns'

interface Lesson {
  id: string
  scheduled_at: string
  duration_minutes: number
  status: string
  price: number
  student: { full_name: string; avatar_url: string }
  tutor: { profiles: { full_name: string; avatar_url: string } }
}

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; key: string }> = {
  scheduled: { icon: Clock, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', key: 'scheduled' },
  in_progress: { icon: Loader2, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', key: 'inProgress' },
  completed: { icon: CheckCircle2, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', key: 'completed' },
  cancelled: { icon: XCircle, color: 'bg-destructive/10 text-destructive border-destructive/20', key: 'cancelled' },
}

export default function AdminLessonsPage() {
  const t = useTranslations('admin.lessons')
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '20' })
    if (statusFilter) params.set('status', statusFilter)
    const res = await fetch(`/api/admin/lessons?${params}`)
    const data = await res.json()
    setLessons(data.lessons ?? [])
    setTotal(data.total ?? 0)
    setLoading(false)
  }, [statusFilter])

  useEffect(() => { load() }, [load])

  const filters = ['', 'scheduled', 'in_progress', 'completed', 'cancelled']

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">{t('title')}</h1>
          <p className="text-xs text-muted-foreground">{t('totalLessons', { count: total })}</p>
        </div>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map(s => (
          <Button
            key={s}
            size="sm"
            variant={statusFilter === s ? 'default' : 'outline'}
            onClick={() => setStatusFilter(s)}
            className="capitalize text-xs"
          >
            {s ? t(STATUS_CONFIG[s]?.key) : t('all')}
          </Button>
        ))}
      </div>

      {/* Lessons list */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="divide-y divide-border/50">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
            </div>
          ) : lessons.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">{t('noLessons')}</div>
          ) : lessons.map(lesson => {
            const cfg = STATUS_CONFIG[lesson.status] ?? STATUS_CONFIG.scheduled
            const StatusIcon = cfg.icon
            const tutorName = lesson.tutor?.profiles?.full_name ?? 'N/A'
            return (
              <div key={lesson.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors">
                {/* Student */}
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="gradient-bg text-white text-xs font-bold">{getInitials(lesson.student?.full_name ?? 'S')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {lesson.student?.full_name} → {tutorName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(lesson.scheduled_at), 'd MMM yyyy, HH:mm')} · {lesson.duration_minutes} min
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold">{lesson.price}₼</span>
                  <Badge className={`text-xs border ${cfg.color} gap-1`}>
                    <StatusIcon className="h-3 w-3" />
                    <span className="hidden sm:inline">{t(cfg.key)}</span>
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
