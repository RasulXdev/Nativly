'use client'

import { useTranslations } from 'next-intl'
import { CalendarIcon, Clock, Globe, Loader2 } from 'lucide-react'
import { startOfDay } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, timezoneLabel } from '@/lib/utils'
import { useTutorAvailabilityDay } from '@/hooks/useAvailability'

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

  return (
    <div className="grid md:grid-cols-[1fr_1fr] gap-5">
      {/* Date picker */}
      <div className="space-y-3">
        <p className="text-sm font-semibold flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-primary" />
          {t('selectDate')}
        </p>
        <div className="rounded-xl ring-1 ring-white/[0.06] bg-white/[0.02] p-3 flex justify-center">
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

      {/* Time slots */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            {t('selectTime')}
          </p>
          {data?.timezone && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
              <Globe className="h-3 w-3" />
              {timezoneLabel(data.timezone)}
            </span>
          )}
        </div>

        <div className="rounded-xl ring-1 ring-white/[0.06] bg-white/[0.02] p-4 min-h-[280px] flex flex-col">
          {isLoading ? (
            <div className="grid grid-cols-3 gap-2 flex-1 content-start">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-lg" />
              ))}
            </div>
          ) : isError ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-2 text-xs text-destructive">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('noSlotsAvailable')}
              </div>
            </div>
          ) : !date ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-muted-foreground/60 text-center">
                {t('selectDate')}
              </p>
            </div>
          ) : !hasAvailable ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-muted-foreground/60 text-center max-w-[180px]">
                {t('noSlotsAvailable')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-[260px] overflow-y-auto pr-1 content-start">
              {slots.map((s) => (
                <button
                  key={s.time}
                  type="button"
                  disabled={!s.available}
                  onClick={() => onTimeChange(s.time)}
                  className={cn(
                    'h-10 rounded-lg text-sm font-medium ring-1 transition-all duration-150',
                    !s.available && 'opacity-25 cursor-not-allowed line-through ring-white/[0.04]',
                    time === s.time
                      ? 'ring-primary bg-primary/15 text-primary font-bold shadow-sm shadow-primary/10'
                      : s.available
                        ? 'ring-white/[0.06] hover:ring-primary/40 hover:bg-primary/6'
                        : ''
                  )}
                >
                  {s.time}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
