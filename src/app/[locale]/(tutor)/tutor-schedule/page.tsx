'use client'

import { useState, useEffect, useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  CalendarCheck, Clock, Save, ChevronLeft, ChevronRight,
  CheckCircle2, XCircle, CalendarClock, ChevronDown,
  Paintbrush, X, Copy, Ban,
} from 'lucide-react'
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  addMonths, subMonths, isSameMonth, isToday, isBefore,
  startOfDay, getDay,
} from 'date-fns'
import { az, enUS, ru, type Locale } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  useTutorAvailability,
  useUpdateAvailability,
  useDateAvailability,
  useSaveDateAvailability,
  useTutorScheduleMode,
  useUpdateScheduleMode,
  type DayOfWeek,
  type AvailabilitySlot,
  type DateAvailabilitySlot,
} from '@/hooks/useTutorSchedule'
import { useTutorUpcomingLessons } from '@/hooks/useTutorLessons'
import { getInitials, cn } from '@/lib/utils'
import { toast } from 'sonner'

interface TutorUpcomingLesson {
  id: string
  scheduled_at: string
  duration_minutes: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  student: any
}

const DAY_KEYS: DayOfWeek[] = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
const WEEK_START_KEYS: DayOfWeek[] = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
const LOCALES: Record<string, Locale> = { az, en: enUS, ru }

function TimeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="time"
      value={value}
      step={600}
      onChange={(e) => e.target.value && onChange(e.target.value)}
      className="flex-1 min-w-0 h-8 px-2 rounded-lg border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 tabular-nums"
    />
  )
}

const DEFAULT_SLOT = (day: DayOfWeek): AvailabilitySlot => ({
  day_of_week: day,
  start_time: '09:00',
  end_time: '18:00',
  is_active: false,
})

type DateEdit = {
  date: string
  start_time: string
  end_time: string
  is_active: boolean
  mode: 'custom' | 'off'
}

export default function TutorSchedulePage() {
  const t = useTranslations('tutorSchedule')
  const locale = useLocale()
  const dfLocale = LOCALES[locale] ?? enUS

  // ── Data hooks ──
  const { data: scheduleMode } = useTutorScheduleMode()
  const updateScheduleMode = useUpdateScheduleMode()
  const activeMode = scheduleMode ?? 'weekly'
  const { data: savedSlots, isLoading } = useTutorAvailability()
  const { data: upcomingRaw, isLoading: loadingUpcoming } = useTutorUpcomingLessons()
  const upcomingLessons = (upcomingRaw ?? []) as TutorUpcomingLesson[]
  const updateAvailability = useUpdateAvailability()
  const saveDateAvail = useSaveDateAvailability()

  // ── Weekly defaults state ──
  const [slots, setSlots] = useState<AvailabilitySlot[]>(DAY_KEYS.map((d) => DEFAULT_SLOT(d)))
  const [weeklyOpen, setWeeklyOpen] = useState(true)

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

  const handleSaveWeekly = async () => {
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

  // ── Calendar state ──
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const monthKey = format(currentMonth, 'yyyy-MM')
  const { data: savedDateSlots } = useDateAvailability(monthKey)

  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [dateEdits, setDateEdits] = useState<Map<string, DateEdit>>(new Map())

  // Sync saved date overrides into edits when month data loads
  useEffect(() => {
    if (!savedDateSlots) return
    const map = new Map<string, DateEdit>()
    for (const s of savedDateSlots) {
      map.set(s.specific_date, {
        date: s.specific_date,
        start_time: s.start_time,
        end_time: s.end_time,
        is_active: s.is_active,
        mode: s.is_active ? 'custom' : 'off',
      })
    }
    setDateEdits(map)
    setSelectedDates([])
  }, [savedDateSlots])

  // ── Calendar grid ──
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Pad start to align with Monday (week starts Monday)
    const startPad = (getDay(monthStart) + 6) % 7
    const padBefore: (Date | null)[] = Array.from({ length: startPad }, () => null)

    // Pad end to fill last row
    const totalCells = padBefore.length + days.length
    const padAfter: (Date | null)[] = Array.from({ length: (7 - (totalCells % 7)) % 7 }, () => null)

    return [...padBefore, ...days, ...padAfter]
  }, [currentMonth])

  const activeWeekdays = useMemo(() => {
    const set = new Set<number>()
    for (const s of slots) {
      if (s.is_active) {
        const idx = DAY_KEYS.indexOf(s.day_of_week)
        set.add((idx + 1) % 7) // convert to JS getDay (0=Sun)
      }
    }
    return set
  }, [slots])

  const toggleDateSelection = (dateStr: string) => {
    setSelectedDates((prev) =>
      prev.includes(dateStr)
        ? prev.filter((d) => d !== dateStr)
        : [...prev, dateStr]
    )
  }

  const getDateEdit = (dateStr: string): DateEdit | undefined => dateEdits.get(dateStr)

  const setDateEdit = (dateStr: string, edit: Partial<DateEdit>) => {
    setDateEdits((prev) => {
      const next = new Map(prev)
      const existing = next.get(dateStr) ?? {
        date: dateStr,
        start_time: '09:00',
        end_time: '18:00',
        is_active: true,
        mode: 'custom' as const,
      }
      next.set(dateStr, { ...existing, ...edit })
      return next
    })
  }

  const removeOverride = (dateStr: string) => {
    setDateEdits((prev) => {
      const next = new Map(prev)
      next.delete(dateStr)
      return next
    })
    setSelectedDates((prev) => prev.filter((d) => d !== dateStr))
  }

  const applyTimeToSelected = () => {
    if (selectedDates.length === 0) return
    const first = dateEdits.get(selectedDates[0]) ?? {
      start_time: '09:00',
      end_time: '18:00',
      is_active: true,
      mode: 'custom' as const,
    }
    setDateEdits((prev) => {
      const next = new Map(prev)
      for (const d of selectedDates) {
        next.set(d, { ...first, date: d } as DateEdit)
      }
      return next
    })
  }

  const handleSaveDates = async () => {
    const toSave: DateAvailabilitySlot[] = []
    for (const [, edit] of dateEdits) {
      if (edit.mode === 'off') {
        toSave.push({
          specific_date: edit.date,
          start_time: '00:00',
          end_time: '00:00',
          is_active: false,
        })
      } else {
        if (edit.start_time >= edit.end_time) {
          return toast.error(t('invalidTimeRange'))
        }
        toSave.push({
          specific_date: edit.date,
          start_time: edit.start_time,
          end_time: edit.end_time,
          is_active: true,
        })
      }
    }
    try {
      await saveDateAvail.mutateAsync(toSave)
      toast.success(t('overrideSaved'))
    } catch {
      toast.error(t('errorOccurred'))
    }
  }

  const activeCount = slots.filter((s) => s.is_active).length
  const overrideCount = dateEdits.size
  const weekDayHeaders = DAY_KEYS.map((dk) => t(`daysShort.${dk}`))

  return (
    <div className="space-y-6">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-2xl gradient-bg p-6 text-white">
        <div
          className="absolute inset-0 opacity-20"
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
        </div>
      </div>

      {/* ── Schedule Mode Toggle ── */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
            <CalendarCheck className="h-4 w-4 text-primary" />
          </div>
          <p className="text-sm font-bold">{t('scheduleMode')}</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => updateScheduleMode.mutate('weekly')}
            className={cn(
              'rounded-xl border p-3 text-left transition-all',
              activeMode === 'weekly'
                ? 'border-primary/40 bg-primary/[0.08] ring-1 ring-primary/30'
                : 'border-border/40 bg-white/[0.02] hover:bg-white/[0.05]',
            )}
          >
            <p className={cn('text-sm font-bold', activeMode === 'weekly' ? 'text-primary' : 'text-foreground')}>
              {t('weeklyMode')}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{t('weeklyModeDesc')}</p>
          </button>
          <button
            type="button"
            onClick={() => updateScheduleMode.mutate('monthly')}
            className={cn(
              'rounded-xl border p-3 text-left transition-all',
              activeMode === 'monthly'
                ? 'border-primary/40 bg-primary/[0.08] ring-1 ring-primary/30'
                : 'border-border/40 bg-white/[0.02] hover:bg-white/[0.05]',
            )}
          >
            <p className={cn('text-sm font-bold', activeMode === 'monthly' ? 'text-primary' : 'text-foreground')}>
              {t('monthlyMode')}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{t('monthlyModeDesc')}</p>
          </button>
        </div>
      </div>

      {/* ── Monthly Calendar ── */}
      {activeMode === 'monthly' && <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Paintbrush className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-sm">{t('calendarTitle')}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{t('calendarDesc')}</p>
          </div>
          {overrideCount > 0 && (
            <span className="text-[11px] font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full shrink-0">
              {overrideCount} {t('dateOverrides').toLowerCase()}
            </span>
          )}
        </div>

        <div className="p-4 sm:p-5">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
              className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-center">
              <p className="text-sm font-bold capitalize">
                {format(currentMonth, 'LLLL yyyy', { locale: dfLocale })}
              </p>
            </div>
            <button
              onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
              className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Week day headers */}
          <div className="grid grid-cols-7 mb-1">
            {weekDayHeaders.map((dh) => (
              <div key={dh} className="text-center text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50 py-2">
                {dh}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-border/30 rounded-xl overflow-hidden ring-1 ring-border/40">
            {calendarDays.map((day, i) => {
              if (!day) {
                return <div key={`pad-${i}`} className="bg-card/50 min-h-[44px] sm:min-h-[52px]" />
              }

              const dateStr = format(day, 'yyyy-MM-dd')
              const inMonth = isSameMonth(day, currentMonth)
              const today = isToday(day)
              const past = isBefore(day, startOfDay(new Date()))
              const isSelected = selectedDates.includes(dateStr)
              const override = getDateEdit(dateStr)
              const isWeeklyActive = activeWeekdays.has(getDay(day))

              return (
                <button
                  key={dateStr}
                  type="button"
                  disabled={past}
                  onClick={() => {
                    if (past) return
                    toggleDateSelection(dateStr)
                    if (!dateEdits.has(dateStr)) {
                      const weekDayKey = WEEK_START_KEYS[getDay(day)]
                      const weekSlot = slots.find((s) => s.day_of_week === weekDayKey && s.is_active)
                      setDateEdit(dateStr, {
                        date: dateStr,
                        start_time: weekSlot?.start_time ?? '09:00',
                        end_time: weekSlot?.end_time ?? '18:00',
                        is_active: true,
                        mode: 'custom',
                      })
                    }
                  }}
                  className={cn(
                    'relative min-h-[44px] sm:min-h-[52px] flex flex-col items-center justify-center gap-0.5 transition-all duration-150',
                    past && 'opacity-30 cursor-not-allowed',
                    !past && !isSelected && 'hover:bg-white/[0.06] cursor-pointer',
                    isSelected
                      ? 'bg-primary/15 ring-1 ring-inset ring-primary/40'
                      : 'bg-card',
                    !inMonth && 'opacity-40',
                  )}
                >
                  <span className={cn(
                    'text-xs sm:text-sm font-semibold tabular-nums leading-none',
                    today && 'text-primary',
                    isSelected && 'text-primary',
                  )}>
                    {format(day, 'd')}
                  </span>

                  {/* Indicator dots */}
                  <div className="flex items-center gap-0.5 h-2">
                    {override ? (
                      <span className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        override.mode === 'off'
                          ? 'bg-rose-400'
                          : 'bg-emerald-400',
                      )} />
                    ) : isWeeklyActive && !past ? (
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                    ) : null}
                  </div>

                  {today && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[7px] font-bold text-primary/60 uppercase tracking-widest">
                      {t('today')}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground/50">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {t('customTime')}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              {t('dayOff')}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              {t('weeklyDefaults')}
            </span>
          </div>
        </div>

        {/* ── Selected dates panel ── */}
        {selectedDates.length > 0 && (
          <div className="border-t border-border/60 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-sm font-bold">
                {selectedDates.length} {t('selectedDates')}
              </p>
              <div className="flex items-center gap-2">
                {selectedDates.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={applyTimeToSelected}
                    className="h-7 text-[11px] rounded-lg border-border/60 gap-1.5"
                  >
                    <Copy className="h-3 w-3" />
                    {t('applied')}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDates([])}
                  className="h-7 text-[11px] rounded-lg text-muted-foreground gap-1.5"
                >
                  <X className="h-3 w-3" />
                  {t('clearSelection')}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
              {selectedDates.sort().map((dateStr) => {
                const edit = dateEdits.get(dateStr)
                if (!edit) return null
                return (
                  <div
                    key={dateStr}
                    className={cn(
                      'rounded-xl border p-3 transition-all',
                      edit.mode === 'off'
                        ? 'border-rose-500/30 bg-rose-500/[0.05]'
                        : 'border-primary/30 bg-primary/[0.05]',
                    )}
                  >
                    {/* Date header */}
                    <div className="flex items-center justify-between mb-2.5">
                      <p className="text-xs font-bold capitalize">
                        {format(new Date(dateStr + 'T12:00:00'), 'EEEE, d MMM', { locale: dfLocale })}
                      </p>
                      <button
                        onClick={() => removeOverride(dateStr)}
                        className="w-5 h-5 rounded-md hover:bg-white/10 flex items-center justify-center text-muted-foreground/50 hover:text-foreground transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Mode toggle */}
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <button
                        onClick={() => setDateEdit(dateStr, { mode: 'custom', is_active: true })}
                        className={cn(
                          'flex-1 h-7 rounded-lg text-[11px] font-semibold transition-all',
                          edit.mode === 'custom'
                            ? 'bg-primary/20 text-primary ring-1 ring-primary/30'
                            : 'bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08]',
                        )}
                      >
                        {t('customTime')}
                      </button>
                      <button
                        onClick={() => setDateEdit(dateStr, { mode: 'off', is_active: false })}
                        className={cn(
                          'flex-1 h-7 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1',
                          edit.mode === 'off'
                            ? 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30'
                            : 'bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08]',
                        )}
                      >
                        <Ban className="h-3 w-3" />
                        {t('dayOff')}
                      </button>
                    </div>

                    {/* Time range (only for custom) */}
                    {edit.mode === 'custom' && (
                      <div className="flex items-center gap-2">
                        <TimeSelect
                          value={edit.start_time}
                          onChange={(v) => setDateEdit(dateStr, { start_time: v })}
                        />
                        <span className="text-xs text-muted-foreground shrink-0">—</span>
                        <TimeSelect
                          value={edit.end_time}
                          onChange={(v) => setDateEdit(dateStr, { end_time: v })}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex justify-end pt-1">
              <Button
                onClick={handleSaveDates}
                disabled={saveDateAvail.isPending}
                className="gradient-bg border-0 text-white rounded-xl h-10 px-6 font-semibold shadow-lg shadow-primary/20"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveDateAvail.isPending ? t('saving') : t('save')}
              </Button>
            </div>
          </div>
        )}
      </div>

      }

      {/* ── Weekly defaults (collapsible) ── */}
      {activeMode === 'weekly' && <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <button
          type="button"
          onClick={() => setWeeklyOpen(!weeklyOpen)}
          className="w-full px-5 py-4 border-b border-border/60 flex items-center gap-2.5 hover:bg-white/[0.02] transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-sm">{t('weeklyDefaults')}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{t('weeklyDefaultsDesc')}</p>
          </div>
          {activeCount > 0 && (
            <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full shrink-0">
              {activeCount} {t('activeDays')}
            </span>
          )}
          <ChevronDown className={cn(
            'h-4 w-4 text-muted-foreground/50 transition-transform duration-200 shrink-0',
            weeklyOpen && 'rotate-180'
          )} />
        </button>

        {weeklyOpen && (
          <div className="p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5">
              {isLoading
                ? Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                  ))
                : slots.map((slot) => (
                    <div
                      key={slot.day_of_week}
                      className={cn(
                        'rounded-xl border p-3 transition-all duration-200',
                        slot.is_active
                          ? 'border-primary/30 bg-primary/[0.04]'
                          : 'border-border/40 bg-muted/10',
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {slot.is_active
                            ? <CheckCircle2 className="h-3.5 w-3.5 text-primary/70" />
                            : <XCircle className="h-3.5 w-3.5 text-muted-foreground/30" />
                          }
                          <p className={cn(
                            'text-xs font-bold',
                            slot.is_active ? 'text-foreground' : 'text-muted-foreground',
                          )}>
                            {t(`days.${slot.day_of_week}`)}
                          </p>
                        </div>
                        <Switch
                          checked={slot.is_active}
                          onCheckedChange={() => toggleDay(slot.day_of_week)}
                        />
                      </div>

                      {slot.is_active ? (
                        <div className="flex items-center gap-2">
                          <TimeSelect
                            value={slot.start_time}
                            onChange={(v) => updateTime(slot.day_of_week, 'start_time', v)}
                          />
                          <span className="text-xs text-muted-foreground shrink-0">—</span>
                          <TimeSelect
                            value={slot.end_time}
                            onChange={(v) => updateTime(slot.day_of_week, 'end_time', v)}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-8 rounded-lg border border-dashed border-border/40">
                          <span className="text-[11px] text-muted-foreground/50">{t('closed')}</span>
                        </div>
                      )}
                    </div>
                  ))
              }
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSaveWeekly}
                disabled={updateAvailability.isPending}
                className="gradient-bg border-0 text-white rounded-xl h-10 px-6 font-semibold shadow-lg shadow-primary/20"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateAvailability.isPending ? t('saving') : t('save')}
              </Button>
            </div>
          </div>
        )}
      </div>}

      {/* ── Upcoming lessons ── */}
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
    </div>
  )
}
