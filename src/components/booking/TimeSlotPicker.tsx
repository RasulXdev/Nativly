'use client'

import { useTranslations } from 'next-intl'
import { CalendarIcon, Clock, Globe } from 'lucide-react'
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
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Calendar */}
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

      {/* Time slots */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm font-bold tracking-tight">{t('selectTime')}</p>
          </div>
          {data?.timezone && (
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50 bg-white/[0.03] px-2.5 py-1 rounded-full">
              <Globe className="h-3 w-3" />
              {timezoneLabel(data.timezone)}
            </span>
          )}
        </div>

        <div className="rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.08] p-5 min-h-[320px] flex flex-col">
          {isLoading ? (
            <div className="grid grid-cols-3 gap-2.5 flex-1 content-start">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-11 rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-muted-foreground/50">{t('noSlotsAvailable')}</p>
            </div>
          ) : !date ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-muted-foreground/30" />
              </div>
              <p className="text-sm text-muted-foreground/40">{t('selectDate')}</p>
            </div>
          ) : !hasAvailable ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center">
                <Clock className="h-5 w-5 text-muted-foreground/30" />
              </div>
              <p className="text-sm text-muted-foreground/40 text-center">{t('noSlotsAvailable')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5 content-start">
              {slots.map((s) => (
                <button
                  key={s.time}
                  type="button"
                  disabled={!s.available}
                  onClick={() => onTimeChange(s.time)}
                  className={cn(
                    'h-11 rounded-xl text-sm font-semibold ring-1 transition-all duration-200',
                    !s.available && 'opacity-20 cursor-not-allowed line-through ring-white/[0.04]',
                    time === s.time
                      ? 'ring-primary bg-primary/15 text-primary shadow-md shadow-primary/10 scale-[1.02]'
                      : s.available
                        ? 'ring-white/[0.08] hover:ring-primary/50 hover:bg-primary/8 hover:scale-[1.02]'
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
