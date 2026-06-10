'use client'

import { format, differenceInMinutes } from 'date-fns'
import { az } from 'date-fns/locale'
import { Calendar, Video, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useUpcomingLessons } from '@/hooks/useLessons'
import { getInitials } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
import EmptyState from '@/components/shared/EmptyState'

export default function UpcomingLessons() {
  const { data: rawLessons, isLoading, isError } = useUpcomingLessons()
  const lessons = rawLessons as Array<{
    id: string
    scheduled_at: string
    duration_minutes: number
    room_id: string | null
    tutor: { profiles: { full_name: string; avatar_url: string | null } } | null
  }> | undefined

  const canJoin = (scheduledAt: string) => {
    const diff = differenceInMinutes(new Date(scheduledAt), new Date())
    return diff <= 5 && diff >= -90
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Card header with gradient accent */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Calendar className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-semibold text-sm">Gələn dərslər</h3>
        </div>
        <Link href="/schedule">
          <button className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
            Hamısı
            <ArrowRight className="h-3 w-3" />
          </button>
        </Link>
      </div>

      <div className="p-5">
        {isError ? (
          <p className="text-sm text-muted-foreground text-center py-4">Məlumat yüklənmədi</p>
        ) : isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : !lessons?.length ? (
          <EmptyState
            icon={Calendar}
            title="Gələn dərs yoxdur"
            description="Müəllim seçib dərs rezerv edin"
          />
        ) : (
          <div className="space-y-2.5">
            {lessons.slice(0, 3).map((lesson, idx) => {
              const tutorProfile = (lesson.tutor as any)?.profiles
              const joinable = canJoin(lesson.scheduled_at)
              return (
                <div
                  key={lesson.id}
                  className="group flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-white/5 transition-all duration-200"
                >
                  {/* Left accent bar */}
                  <div className={`w-1 self-stretch rounded-full shrink-0 ${joinable ? 'bg-emerald-400' : 'gradient-bg'}`} />

                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={tutorProfile?.avatar_url ?? ''} />
                    <AvatarFallback className="gradient-bg text-white text-xs font-bold">
                      {getInitials(tutorProfile?.full_name ?? '?')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {tutorProfile?.full_name ?? 'Müəllim'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(lesson.scheduled_at), 'd MMM, HH:mm', { locale: az })}</span>
                      <span className="text-border">·</span>
                      <span>{lesson.duration_minutes} dəq</span>
                    </div>
                  </div>

                  {joinable ? (
                    <Link href={`/room/${lesson.room_id ?? lesson.id}`}>
                      <Button size="sm" className="h-8 text-xs rounded-full gradient-bg border-0 text-white shrink-0 shadow-md">
                        <Video className="h-3 w-3 mr-1" />
                        Qoşul
                      </Button>
                    </Link>
                  ) : (
                    <div className="shrink-0 text-center">
                      <p className="text-xs font-bold text-foreground">
                        {format(new Date(lesson.scheduled_at), 'HH:mm')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(lesson.scheduled_at), 'd MMM', { locale: az })}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
