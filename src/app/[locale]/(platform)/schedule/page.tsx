'use client'

import { useState } from 'react'
import { format, differenceInMinutes, isSameDay } from 'date-fns'
import { az } from 'date-fns/locale'
import {
  CalendarClock,
  Video,
  Clock,
  X,
  Star,
  History,
  CalendarDays,
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
import EmptyState from '@/components/shared/EmptyState'
import { Link } from '@/i18n/navigation'
import { useUpcomingLessons, useLessonHistory, useCancelLesson } from '@/hooks/useLessons'
import {
  getInitials,
  getCancellationTier,
  cancellationTierMessage,
} from '@/lib/utils'
import { toast } from 'sonner'

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
  const { data: upcomingRaw, isLoading: loadingUpcoming } = useUpcomingLessons()
  const { data: pastRaw, isLoading: loadingPast } = useLessonHistory()
  const cancelLesson = useCancelLesson()

  const upcoming = (upcomingRaw ?? []) as UpcomingLesson[]
  const past = (pastRaw ?? []) as PastLesson[]

  const [cancelTarget, setCancelTarget] = useState<UpcomingLesson | null>(null)

  const canJoin = (scheduledAt: string) => {
    const diff = differenceInMinutes(new Date(scheduledAt), new Date())
    return diff <= 5 && diff >= -90
  }

  const handleCancel = async () => {
    if (!cancelTarget?.booking_id) {
      toast.error('Bu dərs ləğv edilə bilməz')
      setCancelTarget(null)
      return
    }
    try {
      await cancelLesson.mutateAsync({ bookingId: cancelTarget.booking_id })
      const tier = getCancellationTier(cancelTarget.scheduled_at)
      toast.success(
        tier === 'free' ? 'Dərs ləğv edildi, kredit geri qaytarıldı' : 'Dərs ləğv edildi'
      )
    } catch {
      toast.error('Ləğv edilmədi')
    } finally {
      setCancelTarget(null)
    }
  }

  // Group upcoming by day for the weekly strip.
  const days = upcoming.reduce<Record<string, UpcomingLesson[]>>((acc, l) => {
    const key = format(new Date(l.scheduled_at), 'yyyy-MM-dd')
    ;(acc[key] ??= []).push(l)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-2xl gradient-bg p-6 text-white">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/8 float-slow" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
            <CalendarClock className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Cədvəlim</h1>
            <p className="text-sm text-white/70 mt-0.5">
              {upcoming.length > 0
                ? `${upcoming.length} gələn dərs`
                : 'Hələ planlaşdırılan dərs yoxdur'}
            </p>
          </div>
        </div>
      </div>

      {/* Weekly strip (grouped upcoming) */}
      {!loadingUpcoming && upcoming.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(days)
            .slice(0, 4)
            .map(([key, dayLessons]) => {
              const d = new Date(key + 'T12:00:00')
              const today = isSameDay(d, new Date())
              return (
                <div
                  key={key}
                  className={`rounded-2xl border p-4 ${
                    today ? 'border-primary/40 bg-primary/5' : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays
                      className={`h-4 w-4 ${today ? 'text-primary' : 'text-muted-foreground'}`}
                    />
                    <p className="text-xs font-semibold uppercase tracking-wide">
                      {today ? 'Bu gün' : format(d, 'EEEE', { locale: az })}
                    </p>
                  </div>
                  <p className="text-sm font-bold">{format(d, 'd MMMM', { locale: az })}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {dayLessons.length} dərs
                  </p>
                </div>
              )
            })}
        </div>
      )}

      {/* Upcoming lessons */}
      <section className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <CalendarClock className="h-4 w-4 text-white" />
          </div>
          <h2 className="font-semibold text-sm">Gələn dərslər</h2>
        </div>
        <div className="p-5">
          {loadingUpcoming ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : upcoming.length === 0 ? (
            <EmptyState
              icon={CalendarClock}
              title="Gələn dərs yoxdur"
              description="Müəllim seçib dərs rezerv edin"
            />
          ) : (
            <div className="space-y-2.5">
              {upcoming.map((lesson) => {
                const tutorProfile = lesson.tutor?.profiles
                const joinable = canJoin(lesson.scheduled_at)
                return (
                  <div
                    key={lesson.id}
                    className="group flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-white/5 transition-all"
                  >
                    <div
                      className={`w-1 self-stretch rounded-full shrink-0 ${
                        joinable ? 'bg-emerald-400' : 'gradient-bg'
                      }`}
                    />
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
                        <span>
                          {format(new Date(lesson.scheduled_at), 'd MMM, HH:mm', {
                            locale: az,
                          })}
                        </span>
                        <span className="text-border">·</span>
                        <span>{lesson.duration_minutes} dəq</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {joinable ? (
                        <Link href={`/room/${lesson.room_id ?? lesson.id}`}>
                          <Button
                            size="sm"
                            className="h-8 text-xs rounded-full gradient-bg border-0 text-white shadow-md"
                          >
                            <Video className="h-3 w-3 mr-1" />
                            Qoşul
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-xs rounded-full text-muted-foreground hover:text-destructive"
                          onClick={() => setCancelTarget(lesson)}
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Ləğv et
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Past lessons */}
      <section className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center">
            <History className="h-4 w-4 text-muted-foreground" />
          </div>
          <h2 className="font-semibold text-sm">Keçmiş dərslər</h2>
        </div>
        <div className="p-5">
          {loadingPast ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : past.length === 0 ? (
            <EmptyState
              icon={History}
              title="Keçmiş dərs yoxdur"
              description="Tamamlanan dərsləriniz burada görünəcək"
            />
          ) : (
            <div className="space-y-2.5">
              {past.map((lesson) => {
                const tutorProfile = lesson.tutor?.profiles
                return (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/50"
                  >
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarImage src={tutorProfile?.avatar_url ?? ''} />
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
                        {getInitials(tutorProfile?.full_name ?? '?')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {tutorProfile?.full_name ?? 'Müəllim'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(lesson.scheduled_at), 'd MMM yyyy, HH:mm', {
                          locale: az,
                        })}
                      </p>
                    </div>
                    <Link href="/lessons">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs rounded-full"
                      >
                        <Star className="h-3.5 w-3.5 mr-1" />
                        Rəy yaz
                      </Button>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Cancel confirmation */}
      <Dialog open={!!cancelTarget} onOpenChange={(o) => !o && setCancelTarget(null)}>
        <DialogContent className="dark bg-background text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle>Dərsi ləğv et</DialogTitle>
            <DialogDescription>
              {cancelTarget &&
                cancellationTierMessage(getCancellationTier(cancelTarget.scheduled_at))}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setCancelTarget(null)}>
              İmtina
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelLesson.isPending}
            >
              {cancelLesson.isPending ? 'Ləğv edilir...' : 'Dərsi ləğv et'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
