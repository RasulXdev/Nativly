'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { format, addDays } from 'date-fns'
import { az } from 'date-fns/locale'
import { Clock, Loader2, Info, Ticket, ShieldCheck } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { getInitials } from '@/lib/utils'
import type { TutorWithProfile } from '@/lib/types'
import Rating from '@/components/shared/Rating'
import TimeSlotPicker from '@/components/booking/TimeSlotPicker'
import { useActiveSubscription } from '@/hooks/useSubscription'

interface BookingModalProps {
  tutor: TutorWithProfile
  open: boolean
  onClose: () => void
}

export default function BookingModal({ tutor, open, onClose }: BookingModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile = (tutor as any).profiles
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: subscription, isLoading: subLoading } = useActiveSubscription()

  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1))
  const [time, setTime] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const duration = 30 // 30-min lessons, covered by subscription
  const remaining = subscription?.lessons_remaining ?? 0
  const canBook = !subLoading && subscription !== null && remaining > 0

  const handleBook = async () => {
    if (!date || !time) return
    setSubmitting(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Daxil olun')

      const [h, m] = time.split(':').map(Number)
      const scheduledAt = new Date(date)
      scheduledAt.setHours(h, m, 0, 0)

      const { error } = await supabase
        .from('bookings')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert({
          student_id: user.id,
          tutor_id: tutor.id,
          scheduled_at: scheduledAt.toISOString(),
          duration_minutes: duration,
          price: 0,
          currency: 'AZN',
          student_note: note || null,
          is_trial: false,
          status: tutor.instant_booking ? 'confirmed' : 'pending',
        } as any)

      if (error) throw error

      // Best-effort confirmation email (no-ops until RESEND_API_KEY is set).
      if (tutor.instant_booking) {
        fetch('/api/internal/notify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            kind: 'booking_confirmed',
            to: user.email,
            recipientName: user.user_metadata?.full_name ?? 'Tələbə',
            counterpartName: profile?.full_name ?? 'Müəllim',
            scheduledAt: scheduledAt.toISOString(),
          }),
        }).catch(() => {})
      }

      queryClient.invalidateQueries({ queryKey: ['active-subscription'] })
      queryClient.invalidateQueries({ queryKey: ['lessons'] })

      toast.success(
        tutor.instant_booking
          ? 'Dərs uğurla rezerv edildi!'
          : 'Müəllimin təsdiqi gözlənilir'
      )
      onClose()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Xəta baş verdi')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="dark bg-background text-foreground max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dərs rezerv et</DialogTitle>
          <DialogDescription>Tarix və vaxt seçin</DialogDescription>
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
          {tutor.instant_booking && (
            <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30">
              Ani rezerv
            </Badge>
          )}
        </div>

        {/* Subscription status */}
        {subLoading ? (
          <Skeleton className="h-12 rounded-xl" />
        ) : canBook ? (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm">
            <Ticket className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              <span className="font-semibold">{remaining}</span> dərs qalıb —{' '}
              {subscription?.plan?.name_az} abonəliyi
            </span>
          </div>
        ) : (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 space-y-3">
            <p className="text-sm">
              {subscription === null
                ? 'Dərs rezerv etmək üçün abonəlik lazımdır.'
                : 'Abonəliyinizdə qalan dərs yoxdur.'}
            </p>
            <Button
              className="gradient-bg border-0 text-white w-full"
              onClick={() => {
                onClose()
                router.push('/pricing')
              }}
            >
              Abonəlik al
            </Button>
          </div>
        )}

        {canBook && (
          <>
            <Separator />

            <TimeSlotPicker
              tutorId={tutor.id}
              date={date}
              onDateChange={setDate}
              time={time}
              onTimeChange={setTime}
            />

            {/* Duration note */}
            <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2.5 text-sm">
              <Info className="h-4 w-4 text-primary shrink-0" />
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                30 dəqiqəlik dərs — abonəliyinizə daxildir
              </span>
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

            {/* Cancellation policy */}
            <div className="flex items-start gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>
                Ləğvetmə siyasəti: 24 saatdan əvvəl pulsuz (kredit geri qaytarılır),
                12–24 saat 50%, 12 saatdan az tam tutulur.
              </span>
            </div>

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
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
