'use client'

import { useTranslations } from 'next-intl'
import { CalendarIcon, Clock, Globe, Check, Sun, Sunset, Moon } from 'lucide-react'
import { startOfDay } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, timezoneLabel } from '@/lib/utils'
import { useTutorAvailabilityDay } from '@/hooks/useAvailability'

function toBrowserTime(utcIso: string): { display: string; hour: number } {
  const d = new Date(utcIso)
  const display = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d).replace(/^24:/, '00:')
  const hour = parseInt(display.slice(0, 2)) % 24
  return { display, hour }
}

const PERIOD_META = {
  morning:   { icon: Sun,    accent: 'text-amber-400',  bg: 'bg-amber-400/10' },
  afternoon: { icon: Sunset, accent: 'text-orange-400', bg: 'bg-orange-400/10' },
  evening:   { icon: Moon,   accent: 'text-indigo-400', bg: 'bg-indigo-400/10' },
} as const

interface TimeSlotPickerProps {
  tutorId: string
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
  time: string | null
  onTimeChange: (time: string | null) => void
}

export default function TimeSlotPicker({
  tutorId,
  date,
  onDateChange,
  time,
  onTimeChange,
}: TimeSlotPickerProps) {
  const t = useTranslations('booking')
  const { data, isLoading, isError } = useTutorAvailabilityDay(tutorId, date)
  const slots = data?.slots ?? []
  const hasAvailable = slots.some((s) => s.available)
  const availableCount = slots.filter((s) => s.available).length

  const tutorTz = data?.timezone
  const browserTz = typeof window !== 'undefined'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : tutorTz
  const needsConversion = !!tutorTz && !!browserTz && tutorTz !== browserTz

  const getSlotDisplay = (s: { time: string; utc: string }) =>
    needsConversion ? toBrowserTime(s.utc) : { display: s.time, hour: Number(s.time.slice(0, 2)) }

  const periods = (
    [
      { key: 'morning'   as const, slots: slots.filter((s) => getSlotDisplay(s).hour < 12) },
      { key: 'afternoon' as const, slots: slots.filter((s) => { const h = getSlotDisplay(s).hour; return h >= 12 && h < 17 }) },
      { key: 'evening'   as const, slots: slots.filter((s) => getSlotDisplay(s).hour >= 17) },
    ]
  ).filter((p) => p.slots.length > 0)

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* ── Calendar ── */}
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <CalendarIcon className="h-4 w-4 text-white" />
          </div>
          <p className="text-sm font-bold tracking-tight">{t('selectDate')}</p>
        </div>
        <div className="rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.08] p-4 flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d: Date | undefined) => {
              onDateChange(d)
              onTimeChange(null)
            }}
            disabled={(d: Date) => d < startOfDay(new Date())}
            className="!bg-transparent"
          />
        </div>
      </div>

      {/* ── Time slots ── */}
      <div>
        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm font-bold tracking-tight">{t('selectTime')}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {hasAvailable && (
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                {availableCount} {t('slotsAvailable')}
              </span>
            )}
            {data?.timezone && (
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50 bg-white/[0.03] px-2.5 py-1 rounded-full">
                <Globe className="h-3 w-3" />
                {needsConversion && browserTz ? timezoneLabel(browserTz) : timezoneLabel(data.timezone)}
              </span>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.08] p-4 sm:p-5">
          {isLoading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
              {Array.from({ length: 15 }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <div className="py-12 flex items-center justify-center">
              <p className="text-sm text-muted-foreground/50">{t('noSlotsAvailable')}</p>
            </div>
          ) : !date ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-muted-foreground/30" />
              </div>
              <p className="text-sm text-muted-foreground/40">{t('selectDate')}</p>
            </div>
          ) : !hasAvailable ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center">
                <Clock className="h-5 w-5 text-muted-foreground/30" />
              </div>
              <p className="text-sm text-muted-foreground/40 text-center">{t('noSlotsAvailable')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {periods.map((period, idx) => {
                const meta = PERIOD_META[period.key]
                const PeriodIcon = meta.icon
                return (
                  <div key={period.key}>
                    {idx > 0 && <div className="h-px bg-white/[0.05] mb-4" />}

                    {/* Period tag */}
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className={cn('w-5 h-5 rounded-md flex items-center justify-center', meta.bg)}>
                        <PeriodIcon className={cn('h-3 w-3', meta.accent)} />
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                        {t(period.key)}
                      </span>
                      <span className="text-[10px] text-muted-foreground/25">
                        {period.slots.filter((s) => s.available).length}
                      </span>
                    </div>

                    {/* Slot grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-2">
                      {period.slots.map((s) => {
                        const { display } = getSlotDisplay(s)
                        const isSelected = time === s.time
                        return (
                          <button
                            key={s.time}
                            type="button"
                            disabled={!s.available}
                            onClick={() => onTimeChange(isSelected ? null : s.time)}
                            className={cn(
                              'relative h-10 rounded-xl text-[13px] font-semibold tabular-nums transition-all duration-200',
                              !s.available && 'opacity-[0.15] cursor-not-allowed',
                              isSelected
                                ? 'ring-2 ring-primary bg-primary/15 text-primary shadow-[0_0_12px_-2px] shadow-primary/25'
                                : s.available
                                  ? 'ring-1 ring-white/[0.08] hover:ring-primary/40 hover:bg-primary/[0.06] active:scale-[0.97]'
                                  : 'ring-1 ring-white/[0.04]'
                            )}
                          >
                            {display}
                            {isSelected && (
                              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full gradient-bg flex items-center justify-center shadow-sm shadow-primary/30">
                                <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                              </span>
                            )}
                          </button>
                        )
                      })}
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
