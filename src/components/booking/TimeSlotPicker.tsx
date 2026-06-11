'use client'

import { Calendar as CalendarIcon, Clock, Globe, Loader2 } from 'lucide-react'
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
  const { data, isLoading, isError } = useTutorAvailabilityDay(tutorId, date)
  const slots = data?.slots ?? []
  const hasAvailable = slots.some((s) => s.available)

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Date picker */}
      <div>
        <p className="text-sm font-semibold mb-3 flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-primary" />
          Tarix seçin
        </p>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d: Date | undefined) => {
            onDateChange(d)
            onTimeChange(null)
          }}
          disabled={(d: Date) => d < startOfDay(new Date())}
          className="rounded-xl border"
        />
      </div>

      {/* Time slots */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Vaxt seçin
          </p>
          {data?.timezone && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Globe className="h-3 w-3" />
              {timezoneLabel(data.timezone)}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-8 rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex items-center gap-2 text-xs text-destructive py-8 justify-center">
            <Loader2 className="h-4 w-4" />
            Vaxtlar yüklənmədi
          </div>
        ) : !date ? (
          <p className="text-xs text-muted-foreground text-center py-10">
            Əvvəlcə tarix seçin
          </p>
        ) : !hasAvailable ? (
          <p className="text-xs text-muted-foreground text-center py-10">
            Bu gün üçün boş vaxt yoxdur. Başqa tarix seçin.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-1.5 max-h-56 overflow-y-auto pr-1">
            {slots.map((s) => (
              <button
                key={s.time}
                type="button"
                disabled={!s.available}
                onClick={() => onTimeChange(s.time)}
                className={cn(
                  'py-1.5 rounded-lg text-xs font-medium border transition-all',
                  !s.available && 'opacity-35 cursor-not-allowed line-through',
                  time === s.time
                    ? 'border-primary bg-primary text-primary-foreground'
                    : s.available
                      ? 'border-border hover:border-primary/50'
                      : 'border-border'
                )}
              >
                {s.time}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
