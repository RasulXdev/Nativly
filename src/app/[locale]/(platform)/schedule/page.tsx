'use client'

import { useState, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { format, differenceInMinutes, isSameDay } from 'date-fns'
import { az, enUS, ru, type Locale } from 'date-fns/locale'
import {
  CalendarClock,
  Video,
  Clock,
  X,
  Star,
  History,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { GlassCard } from '@/components/ui/glass-card'
import HeroBanner from '@/components/dashboard/HeroBanner'
import EmptyState from '@/components/shared/EmptyState'
import { Link } from '@/i18n/navigation'
import { useUpcomingLessons, useLessonHistory, useCancelLesson } from '@/hooks/useLessons'
import {
  getInitials,
  getCancellationTier,
  cancellationTierMessage,
} from '@/lib/utils'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const LOCALES: Record<string, Locale> = { az, en: enUS, ru }

interface UpcomingLesson {
  id: string
  booking_id: string | null
  scheduled_at: string
  duration_minutes: number
  room_id: string | null
  status: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tutor: any
}

interface PastLesson {
  id: string
  scheduled_at: string
  duration_minutes: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tutor: any
}

export default function SchedulePage() {
  const t = useTranslations('schedule')
  const locale = useLocale()
  const dateFnsLocale = LOCALES[locale] ?? enUS

  const { data: upcomingRaw, isLoading: loadingUpcoming } = useUpcomingLessons()
  const { data: pastRaw, isLoading: loadingPast } = useLessonHistory()
  const cancelLesson = useCancelLesson()

  const upcoming = (upcomingRaw ?? []) as UpcomingLesson[]
  const past = (pastRaw ?? []) as PastLesson[]

  const [cancelTarget, setCancelTarget] = useState<UpcomingLesson | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const canJoin = (scheduledAt: string) => {
    const diff = differenceInMinutes(new Date(scheduledAt), new Date())
    return diff <= 5 && diff >= -90
  }

  const handleCancel = async () => {
    if (!cancelTarget?.booking_id) {
      toast.error(t('cancelError'))
      setCancelTarget(null)
      return
    }
    try {
      await cancelLesson.mutateAsync({ bookingId: cancelTarget.booking_id })
      toast.success(t('cancelSuccess'))
    } catch {
      toast.error(t('cancelError'))
    } finally {
      setCancelTarget(null)
    }
  }

  const days = upcoming.reduce<Record<string, UpcomingLesson[]>>((acc, l) => {
    const key = format(new Date(l.scheduled_at), 'yyyy-MM-dd')
    ;(acc[key] ??= []).push(l)
    return acc
  }, {})

  const scrollStrip = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' })
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <HeroBanner
        variant="sapphire"
        greeting={t('title')}
        title={upcoming.length > 0 ? `${upcoming.length} ${t('lessons')}` : t('noUpcoming')}
        subtitle=""
      />

      {/* ── Weekly strip (scrollable) ── */}
      {!loadingUpcoming && upcoming.length > 0 && Object.keys(days).length > 0 && (
        <div className="relative">
          {Object.keys(days).length > 2 && (
            <>
              <button
                onClick={() => scrollStrip('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 z-10 w-7 h-7 rounded-full bg-card border border-white/[0.08] shadow-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors hidden sm:flex"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => scrollStrip('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 z-10 w-7 h-7 rounded-full bg-card border border-white/[0.08] shadow-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors hidden sm:flex"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </>
          )}
          <div
            ref={scrollRef}
            className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1 snap-x snap-mandatory"
          >
            {Object.entries(days).map(([key, dayLessons]) => {
              const d = new Date(key + 'T12:00:00')
              const today = isSameDay(d, new Date())
              return (
                <div
                  key={key}
                  className={cn(
                    'rounded-xl border p-3 sm:p-4 min-w-[140px] sm:min-w-[160px] shrink-0 snap-start transition-all duration-200',
                    today
                      ? 'border-primary/30 bg-primary/[0.06] ring-1 ring-primary/15'
                      : 'border-white/[0.06] bg-card hover:border-white/[0.1]',
                  )}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <CalendarDays className={cn('h-3.5 w-3.5 shrink-0', today ? 'text-primary' : 'text-muted-foreground/50')} />
                    <p className="text-[11px] font-semibold uppercase tracking-wide truncate">
                      {today ? t('today') : format(d, 'EEEE', { locale: dateFnsLocale })}
                    </p>
                  </div>
                  <p className="text-sm font-bold truncate">{format(d, 'd MMMM', { locale: dateFnsLocale })}</p>
                  <p className="text-[11px] text-muted-foreground/50 mt-1 tabular-nums">
                    {dayLessons.length} {t('lessons')}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Upcoming lessons ── */}
      <GlassCard title={t('upcoming')} icon={CalendarClock}>
        <div className="p-3 sm:p-5">
          {loadingUpcoming ? (
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
            </div>
          ) : upcoming.length === 0 ? (
            <EmptyState
              icon={CalendarClock}
              title={t('noUpcoming')}
              description={t('browseToBook')}
            />
          ) : (
            <div className="space-y-1.5 sm:space-y-2">
              {upcoming.map((lesson) => {
                const tutorProfile = lesson.tutor?.profiles
                const joinable = canJoin(lesson.scheduled_at)
                return (
                  <div
                    key={lesson.id}
                    className="group flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.02] transition-all duration-200"
                  >
                    <div className={cn(
                      'w-0.5 sm:w-1 self-stretch rounded-full shrink-0',
                      joinable ? 'bg-emerald-400' : 'gradient-bg'
                    )} />
                    <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0">
                      <AvatarImage src={tutorProfile?.avatar_url ?? ''} />
                      <AvatarFallback className="gradient-bg text-white text-[10px] sm:text-xs font-bold">
                        {getInitials(tutorProfile?.full_name ?? '?')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{tutorProfile?.full_name ?? '—'}</p>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground/60 mt-0.5">
                        <Clock className="h-3 w-3 shrink-0" />
                        <span className="truncate tabular-nums">{format(new Date(lesson.scheduled_at), 'd MMM, HH:mm', { locale: dateFnsLocale })}</span>
                        <span className="text-white/[0.08]">·</span>
                        <span className="shrink-0">{lesson.duration_minutes} min</span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {joinable ? (
                        <Link href={`/room/${lesson.room_id ?? lesson.id}`}>
                          <Button size="sm" className="h-8 text-xs rounded-full gradient-bg border-0 text-white shadow-md px-3 sm:px-4">
                            <Video className="h-3 w-3 sm:mr-1.5" />
                            <span className="hidden sm:inline">{t('joinLesson')}</span>
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-xs rounded-full text-muted-foreground/60 hover:text-destructive px-2 sm:px-3"
                          onClick={() => setCancelTarget(lesson)}
                        >
                          <X className="h-3.5 w-3.5 sm:mr-1" />
                          <span className="hidden sm:inline">{t('cancelLesson')}</span>
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </GlassCard>

      {/* ── Past lessons ── */}
      <GlassCard title={t('past')} icon={History}>
        <div className="p-3 sm:p-5">
          {loadingPast ? (
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
            </div>
          ) : past.length === 0 ? (
            <EmptyState icon={History} title={t('noPast')} description="" />
          ) : (
            <div className="space-y-1.5 sm:space-y-2">
              {past.map((lesson) => {
                const tutorProfile = lesson.tutor?.profiles
                return (
                  <div key={lesson.id} className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl border border-white/[0.04] hover:border-white/[0.08] transition-all duration-200">
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9 shrink-0">
                      <AvatarImage src={tutorProfile?.avatar_url ?? ''} />
                      <AvatarFallback className="bg-white/[0.06] text-muted-foreground text-[10px] sm:text-xs font-bold">
                        {getInitials(tutorProfile?.full_name ?? '?')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tutorProfile?.full_name ?? '—'}</p>
                      <p className="text-xs text-muted-foreground/50 mt-0.5 tabular-nums truncate">
                        {format(new Date(lesson.scheduled_at), 'd MMM yyyy, HH:mm', { locale: dateFnsLocale })}
                      </p>
                    </div>
                    <Link href="/lessons" className="shrink-0">
                      <Button size="sm" variant="outline" className="h-8 text-xs rounded-full border-white/[0.08] hover:border-white/[0.15] px-2.5 sm:px-3">
                        <Star className="h-3.5 w-3.5 sm:mr-1" />
                        <span className="hidden sm:inline">{t('writeReview')}</span>
                      </Button>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </GlassCard>

      {/* ── Cancel dialog ── */}
      <Dialog open={!!cancelTarget} onOpenChange={(o) => !o && setCancelTarget(null)}>
        <DialogContent className="dark bg-card border-white/[0.08] text-foreground max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base">{t('cancelTitle')}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground/70">
              {cancelTarget && cancellationTierMessage(getCancellationTier(cancelTarget.scheduled_at))}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setCancelTarget(null)} className="rounded-xl border-white/[0.08]">
              {t('dismiss')}
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={cancelLesson.isPending} className="rounded-xl">
              {cancelLesson.isPending ? t('cancelling') : t('cancelButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
