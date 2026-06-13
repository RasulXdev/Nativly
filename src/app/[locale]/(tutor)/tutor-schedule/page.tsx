'use client'

import { useLocale, useTranslations } from 'next-intl'

import { useState, useEffect } from 'react'
import { CalendarOff, Save, Plus, Trash2, CalendarCheck, Clock, CheckCircle2, XCircle, CalendarClock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  useTutorAvailability,
  useUpdateAvailability,
  useTutorUnavailability,
  useAddUnavailability,
  useDeleteUnavailability,
  type DayOfWeek,
  type AvailabilitySlot,
} from '@/hooks/useTutorSchedule'
import { useTutorUpcomingLessons } from '@/hooks/useTutorLessons'
import { getInitials } from '@/lib/utils'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { az, enUS, ru, type Locale } from 'date-fns/locale'

interface TutorUpcomingLesson {
  id: string
  scheduled_at: string
  duration_minutes: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  student: any
}

const DAY_KEYS: DayOfWeek[] = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']

const HOURS = Array.from({ length: 24 * 6 }, (_, i) => {
  const totalMin = i * 10
  const h = String(Math.floor(totalMin / 60)).padStart(2, '0')
  const m = String(totalMin % 60).padStart(2, '0')
  return `${h}:${m}`
})

const DEFAULT_SLOT = (day: DayOfWeek): AvailabilitySlot => ({
  day_of_week: day,
  start_time: '09:00',
  end_time: '18:00',
  is_active: false,
})

const LOCALES: Record<string, Locale> = { az, en: enUS, ru }

export default function TutorSchedulePage() {
  const t = useTranslations('tutorSchedule')
  const dfLocale = LOCALES[useLocale()] ?? enUS
  const { data: savedSlots, isLoading } = useTutorAvailability()
  const { data: upcomingRaw, isLoading: loadingUpcoming } = useTutorUpcomingLessons()
  const upcomingLessons = (upcomingRaw ?? []) as TutorUpcomingLesson[]
  const { data: unavailDates, isLoading: loadingUnavail } = useTutorUnavailability()
  const updateAvailability = useUpdateAvailability()
  const addUnavail = useAddUnavailability()
  const deleteUnavail = useDeleteUnavailability()

  const [slots, setSlots] = useState<AvailabilitySlot[]>(DAY_KEYS.map((d) => DEFAULT_SLOT(d)))
  const [newBlockDate, setNewBlockDate] = useState('')
  const [newBlockReason, setNewBlockReason] = useState('')

  useEffect(() => {
    if (!savedSlots) return
    setSlots(
      DAY_KEYS.map((dk) => {
        const saved = savedSlots.find((s) => s.day_of_week === dk)
        return saved ? { ...saved, is_active: true } : DEFAULT_SLOT(dk)
      })
    )
  }, [savedSlots])

  const toggleDay = (day: DayOfWeek) =>
    setSlots((prev) => prev.map((s) => (s.day_of_week === day ? { ...s, is_active: !s.is_active } : s)))

  const updateTime = (day: DayOfWeek, field: 'start_time' | 'end_time', value: string) =>
    setSlots((prev) => prev.map((s) => (s.day_of_week === day ? { ...s, [field]: value } : s)))

  const handleSave = async () => {
    // DB enforces start_time < end_time; validate up front for a clear message.
    if (slots.some((s) => s.is_active && s.start_time >= s.end_time)) {
      return toast.error(t('invalidTimeRange'))
    }
    try {
      await updateAvailability.mutateAsync(slots)
      toast.success(t('scheduleSaved'))
    } catch {
      toast.error(t('errorOccurred'))
    }
  }

  const handleAddBlock = async () => {
    if (!newBlockDate) return toast.error(t('selectDate'))
    try {
      await addUnavail.mutateAsync({ date: newBlockDate, reason: newBlockReason || undefined })
      setNewBlockDate('')
      setNewBlockReason('')
      toast.success(t('dayOffAdded'))
    } catch {
      toast.error(t('errorOccurred'))
    }
  }

  const activeCount = slots.filter((s) => s.is_active).length

  return (
    <div className="space-y-6">
      {/* ── Hero header ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl gradient-bg p-6 text-white">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        />
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/8 float-slow" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
              <CalendarCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">{t('title')}</h1>
              <p className="text-sm text-white/70 mt-0.5">
                {activeCount > 0
                  ? `${activeCount} ${t('activeDays')}`
                  : t('setHours')}
              </p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={updateAvailability.isPending}
            className="bg-white text-primary hover:bg-white/90 border-0 rounded-xl h-10 px-6 font-semibold shadow-lg shrink-0"
          >
            <Save className="h-4 w-4 mr-2" />
            {updateAvailability.isPending ? t('saving') : t('save')}
          </Button>
        </div>
      </div>

      {/* ── Upcoming lessons ─────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <CalendarClock className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">{t('upcomingTitle')}</h2>
            <p className="text-xs text-muted-foreground">{t('upcomingSubtitle')}</p>
          </div>
        </div>
        <div className="p-5">
          {loadingUpcoming ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : upcomingLessons.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              {t('noUpcoming')}
            </p>
          ) : (
            <div className="space-y-2.5">
              {upcomingLessons.map((lesson) => {
                const student = lesson.student
                return (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-white/5 transition-colors"
                  >
                    <div className="w-1 self-stretch rounded-full shrink-0 gradient-bg" />
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarImage src={student?.avatar_url ?? ''} />
                      <AvatarFallback className="gradient-bg text-white text-xs font-bold">
                        {getInitials(student?.full_name ?? '?')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {student?.full_name ?? t('student')}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <Clock className="h-3 w-3" />
                        <span>
                          {format(new Date(lesson.scheduled_at), 'd MMM, HH:mm', { locale: dfLocale })}
                        </span>
                        <span className="text-border">·</span>
                        <span>{lesson.duration_minutes} {t('min')}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Weekly availability grid ─────────────────────── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60">
          <h2 className="font-semibold text-sm">{t('weeklyHours')}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{t('weeklyHoursDesc')}</p>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
          {isLoading
            ? Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))
            : slots.map((slot) => {
                const dayKey = slot.day_of_week
                return (
                  <div
                    key={slot.day_of_week}
                    className={`relative rounded-2xl border p-4 transition-all duration-300 ${
                      slot.is_active
                        ? 'border-primary/40 bg-primary/5 shadow-sm shadow-primary/10'
                        : 'border-border/50 bg-muted/20'
                    }`}
                  >
                    {/* Day header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-widest mb-0.5 ${slot.is_active ? 'text-primary' : 'text-muted-foreground'}`}>
                          {t(`daysShort.${dayKey}`)}
                        </p>
                        <p className={`text-sm font-semibold ${slot.is_active ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {t(`days.${dayKey}`)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {slot.is_active
                          ? <CheckCircle2 className="h-4 w-4 text-primary opacity-70" />
                          : <XCircle className="h-4 w-4 text-muted-foreground/40" />
                        }
                        <Switch
                          checked={slot.is_active}
                          onCheckedChange={() => toggleDay(slot.day_of_week)}
                        />
                      </div>
                    </div>

                    {/* Time range */}
                    {slot.is_active ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                          <Clock className="h-3 w-3" />
                          <span>{t('workHours')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={slot.start_time}
                            onValueChange={(v) => v && updateTime(slot.day_of_week, 'start_time', v)}
                          >
                            <SelectTrigger className="flex-1 h-8 text-xs rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {HOURS.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <span className="text-xs text-muted-foreground shrink-0">—</span>
                          <Select
                            value={slot.end_time}
                            onValueChange={(v) => v && updateTime(slot.day_of_week, 'end_time', v)}
                          >
                            <SelectTrigger className="flex-1 h-8 text-xs rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {HOURS.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-11 rounded-xl border border-dashed border-border/50">
                        <span className="text-xs text-muted-foreground">{t('closed')}</span>
                      </div>
                    )}
                  </div>
                )
              })}
        </div>
      </div>

      {/* ── Blocked dates ────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center">
            <CalendarOff className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">{t('blockedTitle')}</h2>
            <p className="text-xs text-muted-foreground">{t('blockedSubtitle')}</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Add new blocked date */}
          <div className="p-4 rounded-2xl border border-dashed border-border/70 bg-muted/10 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('addDayOff')}</p>
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">{t('date')}</label>
                <input
                  type="date"
                  value={newBlockDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setNewBlockDate(e.target.value)}
                  className="h-9 px-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
                <label className="text-xs font-medium text-muted-foreground">{t('reasonOptional')}</label>
                <input
                  type="text"
                  value={newBlockReason}
                  onChange={(e) => setNewBlockReason(e.target.value)}
                  placeholder={t('reasonPlaceholder')}
                  className="h-9 px-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <Button
                onClick={handleAddBlock}
                disabled={!newBlockDate || addUnavail.isPending}
                size="sm"
                className="h-9 gradient-bg border-0 text-white rounded-xl px-4"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                {t('add')}
              </Button>
            </div>
          </div>

          {/* Existing blocked dates */}
          {loadingUnavail ? (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-28 rounded-full" />
              ))}
            </div>
          ) : !unavailDates?.length ? (
            <p className="text-sm text-muted-foreground text-center py-5">
              {t('noBlocked')}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(unavailDates as { id: string; date: string; reason: string | null }[]).map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/8 text-sm"
                >
                  <span className="text-rose-400 font-medium text-xs">
                    {format(new Date(d.date + 'T12:00:00'), 'd MMM', { locale: dfLocale })}
                  </span>
                  {d.reason && (
                    <span className="text-muted-foreground text-xs">· {d.reason}</span>
                  )}
                  <button
                    onClick={async () => {
                      try {
                        await deleteUnavail.mutateAsync(d.id)
                        toast.success(t('deleted'))
                      } catch {
                        toast.error(t('errorOccurred'))
                      }
                    }}
                    className="w-5 h-5 rounded-full hover:bg-rose-500/20 flex items-center justify-center text-rose-400/70 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
