'use client'

import { format } from 'date-fns'
import { az } from 'date-fns/locale'
import { Activity, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useRecentActivity } from '@/hooks/useLessons'
import { getInitials } from '@/lib/utils'
import EmptyState from '@/components/shared/EmptyState'
import { Link } from '@/i18n/navigation'

const STATUS_CONFIG = {
  completed: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/12', label: 'Tamamlandı' },
  cancelled: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/12', label: 'Ləğv edildi' },
  no_show: { icon: XCircle, color: 'text-amber-400', bg: 'bg-amber-500/12', label: 'Gəlmədi' },
} as const

export default function RecentActivity() {
  const { data: lessons, isLoading, isError } = useRecentActivity()

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-semibold text-sm">Son fəaliyyət</h3>
        </div>
        <Link href="/lessons">
          <button className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
            Hamısı
            <ArrowRight className="h-3 w-3" />
          </button>
        </Link>
      </div>

      <div className="p-5">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-muted-foreground text-center py-4">Məlumat yüklənmədi</p>
        ) : !lessons?.length ? (
          <EmptyState
            icon={Activity}
            title="Hələ fəaliyyət yoxdur"
            description="Dərslər tamamlandıqca burada görünəcək"
          />
        ) : (
          <div className="space-y-2.5">
            {lessons.map((lesson: any) => {
              const tutorProfile = lesson.tutor?.profiles
              const cfg = STATUS_CONFIG[lesson.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.completed
              const Icon = cfg.icon
              return (
                <div key={lesson.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {tutorProfile?.full_name ?? 'Müəllim'} ilə dərs
                    </p>
                    <p className={`text-xs ${cfg.color}`}>{cfg.label} · {lesson.duration_minutes} dəq</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {format(new Date(lesson.scheduled_at), 'd MMM', { locale: az })}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
