'use client'

import { useLocale, useTranslations } from 'next-intl'

import { format } from 'date-fns'
import { az, enUS, ru, type Locale } from 'date-fns/locale'
import { BookOpen, Clock, CheckCircle2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { GlassCard } from '@/components/ui/glass-card'
import HeroBanner from '@/components/dashboard/HeroBanner'
import EmptyState from '@/components/shared/EmptyState'
import { useLessonHistory } from '@/hooks/useLessons'
import { getInitials } from '@/lib/utils'

interface PastLesson {
  id: string
  scheduled_at: string
  duration_minutes: number
  status: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tutor: any
}

const LOCALES: Record<string, Locale> = { az, en: enUS, ru }

export default function LessonsPage() {
  const t = useTranslations('lessons')
  const tStatus = useTranslations('lessons.status')
  const dfLocale = LOCALES[useLocale()] ?? enUS
  const { data: raw, isLoading } = useLessonHistory()
  const lessons = (raw ?? []) as PastLesson[]

  return (
    <div className="space-y-6">
      <HeroBanner
        variant="sapphire"
        greeting={t('myLessons')}
        title={lessons.length > 0 ? `${lessons.length} ${t('completedCount')}` : t('completedTitle')}
        subtitle=""
      />

      <GlassCard title={t('myLessons')} icon={BookOpen}>
        <div className="p-5">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : lessons.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title={t('noLessonsTitle')}
              description={t('noLessonsDesc')}
            />
          ) : (
            <div className="space-y-2.5">
              {lessons.map((lesson) => {
                const tutorProfile = lesson.tutor?.profiles
                return (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-white/5 transition-colors"
                  >
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
                        <span>
                          {format(new Date(lesson.scheduled_at), 'd MMM yyyy, HH:mm', {
                            locale: dfLocale,
                          })}
                        </span>
                        <span className="text-border">·</span>
                        <span>{lesson.duration_minutes} {t('min')}</span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs text-emerald-400 border-emerald-500/30 shrink-0"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {tStatus('completed')}
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  )
}
