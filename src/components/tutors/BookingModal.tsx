'use client'

import { useState } from 'react'
import { format, addDays, startOfDay, parseISO } from 'date-fns'
import { az } from 'date-fns/locale'
import { Calendar as CalendarIcon, Clock, Loader2, Info } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { getInitials, cn } from '@/lib/utils'
import type { TutorWithProfile } from '@/lib/types'
import Rating from '@/components/shared/Rating'

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00',
]

interface BookingModalProps {
  tutor: TutorWithProfile
  open: boolean
  onClose: () => void
}

export default function BookingModal({ tutor, open, onClose }: BookingModalProps) {
  const profile = (tutor as any).profiles
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1))
  const [time, setTime] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Lessons are 30 minutes and covered by the student's monthly subscription —
  // tutors no longer set per-lesson prices.
  const duration = 30

  const handleBook = async () => {
    if (!date || !time) return
    setSubmitting(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Daxil olun')

      const [h, m] = time.split(':').map(Number)
      const scheduledAt = new Date(date)
      scheduledAt.setHours(h, m, 0, 0)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('bookings') as any).insert({
        student_id: user.id,
        tutor_id: tutor.id,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: duration,
        price: 0,
        currency: 'AZN',
        student_note: note || null,
        is_trial: false,
        status: tutor.instant_booking ? 'confirmed' : 'pending',
      })

      if (error) throw error

      toast.success(
        tutor.instant_booking
          ? 'Dərs uğurla rezerv edildi!'
          : 'Müəllimin təsdiqi gözlənilir'
      )
      onClose()
    } catch (e: any) {
      toast.error(e.message ?? 'Xəta baş verdi')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="dark bg-background text-foreground max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dərs rezerv et</DialogTitle>
          <DialogDescription>Tarix, vaxt və müddət seçin</DialogDescription>
        </DialogHeader>

        {/* Tutor info */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="gradient-bg text-white text-xs font-semibold">
              {getInitials(profile?.full_name ?? '?')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{profile?.full_name}</p>
            <Rating value={tutor.average_rating ?? 0} count={tutor.total_reviews ?? 0} size="sm" />
          </div>
          <div className="text-right">
            {tutor.instant_booking && (
              <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30">
                Ani rezerv
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <p className="text-sm font-semibold mb-3 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              Tarix seçin
            </p>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(d: Date) => d < startOfDay(new Date())}
              className="rounded-xl border"
            />
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Duration (fixed — covered by subscription) */}
            <div>
              <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Müddət
              </p>
              <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2.5 text-sm">
                <Info className="h-4 w-4 text-primary shrink-0" />
                <span>30 dəqiqəlik dərs — abonəliyinizə daxildir</span>
              </div>
            </div>

            {/* Time slots */}
            <div>
              <p className="text-sm font-semibold mb-3">Vaxt seçin</p>
              <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={cn(
                      'py-1.5 rounded-lg text-xs font-medium border transition-all',
                      time === t
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div>
              <p className="text-sm font-semibold mb-2">Qeyd (ixtiyari)</p>
              <Textarea
                placeholder="Müəllimə mesajınız..."
                className="text-sm resize-none h-20"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Summary */}
        {date && time && (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tarix</span>
              <span className="font-medium">
                {format(date, 'd MMMM yyyy', { locale: az })}, {time}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Müddət</span>
              <span className="font-medium">{duration} dəqiqə</span>
            </div>
            <Separator className="my-1" />
            <div className="flex justify-between font-bold">
              <span>Cəmi</span>
              <span className="text-primary">1 dərs (abonəlik)</span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Ləğv et
          </Button>
          <Button
            className="flex-1 gradient-bg border-0 text-white"
            disabled={!date || !time || submitting}
            onClick={handleBook}
          >
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Rezerv et
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
