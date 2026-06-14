'use client'

import { useLocale, useTranslations } from 'next-intl'

import { format, differenceInMinutes } from 'date-fns'
import { az, enUS, ru, type Locale } from 'date-fns/locale'
import { CalendarClock, Video, Clock } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useTutorTodayLessons } from '@/hooks/useTutorLessons'
import { getInitials } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
import EmptyState from '@/components/shared/EmptyState'

const LOCALES: Record<string, Locale> = { az, en: enUS, ru }

export default function TodayLessons() {
  const t = useTranslations('tutorDashboard')
  const locale = useLocale()
  const dfLocale = LOCALES[locale] ?? enUS
  const { data: rawLessons, isLoading, isError } = useTutorTodayLessons()

  type TodayLesson = {
    id: string
    scheduled_at: string
    duration_minutes: number
    room_id: string | null
    status: string
    student: { id: string; full_name: string; avatar_url: string | null } | null
  }

  const lessons = rawLessons as TodayLesson[] | undefined

  const canJoin = (scheduledAt: string) => {
    const diff = differenceInMinutes(new Date(scheduledAt), new Date())
    return diff <= 15 && diff >= -90
  }

  return (
    <GlassCard title={t('todayLessons')} icon={CalendarClock} actionLabel={t('schedule')} actionHref="/tutor-schedule">
      <div className="p-5">
        {isError ? (
          <p className="text-sm text-muted-foreground text-center py-4">{t('failedToLoad')}</p>
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
            icon={CalendarClock}
            title={t('noTodayTitle')}
            description={t('noTodayDesc')}
          />
        ) : (
          <div className="space-y-2.5">
            {lessons.map((lesson) => {
              const joinable = canJoin(lesson.scheduled_at)
              return (
                <div
                  key={lesson.id}
                  className="group flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-white/5 transition-all duration-200"
                >
                  <div className={`w-1 self-stretch rounded-full shrink-0 ${joinable ? 'bg-emerald-400 animate-pulse' : 'gradient-bg'}`} />

                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={lesson.student?.avatar_url ?? ''} />
                    <AvatarFallback className="gradient-bg text-white text-xs font-bold">
                      {getInitials(lesson.student?.full_name ?? '?')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {lesson.student?.full_name ?? t('student')}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(lesson.scheduled_at), 'HH:mm', { locale: dfLocale })}</span>
                      <span className="text-border">·</span>
                      <span>{lesson.duration_minutes} {t('min')}</span>
                    </div>
                  </div>

                  {joinable ? (
                    <Link href={`/room/${lesson.room_id ?? lesson.id}`}>
                      <Button size="sm" className="h-8 text-xs rounded-full gradient-bg border-0 text-white shrink-0 shadow-md">
                        <Video className="h-3 w-3 mr-1" />
                        {t('join')}
                      </Button>
                    </Link>
                  ) : (
                    <div className="shrink-0 text-center">
                      <p className="text-xs font-bold text-foreground">
                        {format(new Date(lesson.scheduled_at), 'HH:mm')}
                      </p>
                      <p className="text-xs text-muted-foreground">{t('today')}</p>
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
