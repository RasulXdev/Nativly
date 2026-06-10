'use client'

import { useState, useEffect } from 'react'
import { CalendarOff, Save, Plus, Trash2, CalendarCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useTutorAvailability,
  useUpdateAvailability,
  useTutorUnavailability,
  useAddUnavailability,
  useDeleteUnavailability,
  type DayOfWeek,
  type AvailabilitySlot,
} from '@/hooks/useTutorSchedule'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { az } from 'date-fns/locale'

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'monday', label: 'Bazar ertəsi' },
  { key: 'tuesday', label: 'Çərşənbə axşamı' },
  { key: 'wednesday', label: 'Çərşənbə' },
  { key: 'thursday', label: 'Cümə axşamı' },
  { key: 'friday', label: 'Cümə' },
  { key: 'saturday', label: 'Şənbə' },
  { key: 'sunday', label: 'Bazar' },
]

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = String(i).padStart(2, '0')
  return `${h}:00`
})

const DEFAULT_SLOT = (day: DayOfWeek): AvailabilitySlot => ({
  day_of_week: day,
  start_time: '09:00',
  end_time: '18:00',
  is_active: false,
})

export default function TutorSchedulePage() {
  const { data: savedSlots, isLoading } = useTutorAvailability()
  const { data: unavailDates, isLoading: loadingUnavail } = useTutorUnavailability()
  const updateAvailability = useUpdateAvailability()
  const addUnavail = useAddUnavailability()
  const deleteUnavail = useDeleteUnavailability()

  const [slots, setSlots] = useState<AvailabilitySlot[]>(
    DAYS.map((d) => DEFAULT_SLOT(d.key))
  )
  const [newBlockDate, setNewBlockDate] = useState('')
  const [newBlockReason, setNewBlockReason] = useState('')

  useEffect(() => {
    if (!savedSlots) return
    setSlots(
      DAYS.map((d) => {
        const saved = savedSlots.find((s) => s.day_of_week === d.key)
        return saved ? { ...saved, is_active: true } : DEFAULT_SLOT(d.key)
      })
    )
  }, [savedSlots])

  const toggleDay = (day: DayOfWeek) => {
    setSlots((prev) =>
      prev.map((s) => (s.day_of_week === day ? { ...s, is_active: !s.is_active } : s))
    )
  }

  const updateTime = (day: DayOfWeek, field: 'start_time' | 'end_time', value: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.day_of_week === day ? { ...s, [field]: value } : s))
    )
  }

  const handleSave = async () => {
    try {
      await updateAvailability.mutateAsync(slots)
      toast.success('Cədvəl saxlanıldı')
    } catch {
      toast.error('Xəta baş verdi')
    }
  }

  const handleAddBlock = async () => {
    if (!newBlockDate) return toast.error('Tarix seçin')
    try {
      await addUnavail.mutateAsync({ date: newBlockDate, reason: newBlockReason || undefined })
      setNewBlockDate('')
      setNewBlockReason('')
      toast.success('Qeyri-iş günü əlavə edildi')
    } catch {
      toast.error('Xəta baş verdi')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Cədvəl idarəsi</h1>
          <p className="text-sm text-muted-foreground mt-1">İş saatlarınızı və qeyri-iş günlərini təyin edin</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={updateAvailability.isPending}
          className="gradient-bg border-0 text-white rounded-xl h-10 px-5 shadow-md btn-glow"
        >
          <Save className="h-4 w-4 mr-2" />
          {updateAvailability.isPending ? 'Saxlanılır...' : 'Saxla'}
        </Button>
      </div>

      {/* Weekly availability */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <CalendarCheck className="h-4 w-4 text-white" />
          </div>
          <h2 className="font-semibold text-sm">Həftəlik iş saatları</h2>
        </div>

        <div className="p-5 space-y-3">
          {isLoading ? (
            Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-border/50">
                <Skeleton className="h-5 w-9 rounded-full" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-9 w-28 rounded-lg ml-auto" />
              </div>
            ))
          ) : (
            slots.map((slot) => {
              const day = DAYS.find((d) => d.key === slot.day_of_week)!
              return (
                <div
                  key={slot.day_of_week}
                  className={`flex flex-wrap items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                    slot.is_active
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-border/50 opacity-60'
                  }`}
                >
                  <Switch
                    checked={slot.is_active}
                    onCheckedChange={() => toggleDay(slot.day_of_week)}
                  />
                  <span className="text-sm font-medium w-36 shrink-0">{day.label}</span>

                  {slot.is_active ? (
                    <>
                      <Select
                        value={slot.start_time}
                        onValueChange={(v) => v && updateTime(slot.day_of_week, 'start_time', v)}
                      >
                        <SelectTrigger className="w-28 h-9 text-sm rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {HOURS.map((h) => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-xs text-muted-foreground">—</span>
                      <Select
                        value={slot.end_time}
                        onValueChange={(v) => v && updateTime(slot.day_of_week, 'end_time', v)}
                      >
                        <SelectTrigger className="w-28 h-9 text-sm rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {HOURS.map((h) => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground ml-auto">Bağlı</span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Blocked dates */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
            <CalendarOff className="h-4 w-4 text-white" />
          </div>
          <h2 className="font-semibold text-sm">Qeyri-iş günləri</h2>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex flex-wrap gap-3 items-end p-4 rounded-xl border border-dashed border-border bg-white/3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Tarix</label>
              <input
                type="date"
                value={newBlockDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setNewBlockDate(e.target.value)}
                className="h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-muted-foreground">Səbəb (ixtiyari)</label>
              <input
                type="text"
                value={newBlockReason}
                onChange={(e) => setNewBlockReason(e.target.value)}
                placeholder="Məzuniyyət, xəstəlik..."
                className="h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <Button
              onClick={handleAddBlock}
              disabled={!newBlockDate || addUnavail.isPending}
              size="sm"
              className="h-9 gradient-bg border-0 text-white rounded-lg"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Əlavə et
            </Button>
          </div>

          {loadingUnavail ? (
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          ) : !unavailDates?.length ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Hələ qeyri-iş günü əlavə edilməyib
            </p>
          ) : (
            <div className="space-y-2">
              {(unavailDates as { id: string; date: string; reason: string | null }[]).map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-red-500/20 bg-red-500/5"
                >
                  <div className="flex items-center gap-3">
                    <Badge className="bg-red-500/15 text-red-400 border-red-500/30 text-xs">
                      {format(new Date(d.date + 'T12:00:00'), 'd MMMM', { locale: az })}
                    </Badge>
                    {d.reason && (
                      <span className="text-xs text-muted-foreground">{d.reason}</span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={async () => {
                      try {
                        await deleteUnavail.mutateAsync(d.id)
                        toast.success('Silindi')
                      } catch {
                        toast.error('Xəta baş verdi')
                      }
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
