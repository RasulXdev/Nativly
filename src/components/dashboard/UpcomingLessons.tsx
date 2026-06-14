'use client'

import { useLocale, useTranslations } from 'next-intl'
import { format, differenceInMinutes } from 'date-fns'
import { az, enUS, ru, type Locale } from 'date-fns/locale'
import { Calendar, Video, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useUpcomingLessons } from '@/hooks/useLessons'
import { getInitials } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
import EmptyState from '@/components/shared/EmptyState'

const LOCALES: Record<string, Locale> = { az, en: enUS, ru }

export default function UpcomingLessons() {
  const t = useTranslations('schedule')
  const td = useTranslations('dashboard')
  const locale = useLocale()
  const dfLocale = LOCALES[locale] ?? enUS
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
    <GlassCard title={t('upcoming')} icon={Calendar} actionLabel={td('schedule')} actionHref="/schedule">
      <div className="p-5">
        {isError ? (
          <p className="text-sm text-muted-foreground text-center py-4">{td('failedToLoad')}</p>
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
            title={t('noUpcoming')}
            description={t('browseToBook')}
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
                      {tutorProfile?.full_name ?? '—'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(lesson.scheduled_at), 'd MMM, HH:mm', { locale: dfLocale })}</span>
                      <span className="text-border">·</span>
                      <span>{lesson.duration_minutes} min</span>
                    </div>
                  </div>

                  {joinable ? (
                    <Link href={`/room/${lesson.room_id ?? lesson.id}`}>
                      <Button size="sm" className="h-8 text-xs rounded-full gradient-bg border-0 text-white shrink-0 shadow-md">
                        <Video className="h-3 w-3 mr-1" />
                        {t('joinLesson')}
                      </Button>
                    </Link>
                  ) : (
                    <div className="shrink-0 text-center">
                      <p className="text-xs font-bold text-foreground">
                        {format(new Date(lesson.scheduled_at), 'HH:mm')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(lesson.scheduled_at), 'd MMM', { locale: dfLocale })}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </GlassCard>
  )
}
