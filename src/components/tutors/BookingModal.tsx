'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { format, addDays } from 'date-fns'
import { az, enUS, ru, type Locale } from 'date-fns/locale'
import {
  Clock, Loader2, Info, Ticket, ShieldCheck, BookOpen,
  CalendarDays, CheckCircle2, Sparkles,
} from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { getInitials, cn } from '@/lib/utils'
import type { TutorWithProfile } from '@/lib/types'
import Rating from '@/components/shared/Rating'
import TimeSlotPicker from '@/components/booking/TimeSlotPicker'
import { useActiveSubscription } from '@/hooks/useSubscription'

interface BookingModalProps {
  tutor: TutorWithProfile
  open: boolean
  onClose: () => void
}

const LOCALES: Record<string, Locale> = { az, en: enUS, ru }

const TOPICS = [
  'conversation', 'grammar', 'business', 'kids', 'examPrep',
  'pronunciation', 'writing', 'interview', 'beginner', 'intensive', 'other',
] as const

const TOPIC_ICONS: Record<string, string> = {
  conversation: '💬', grammar: '📝', business: '💼', kids: '👶',
  examPrep: '📚', pronunciation: '🗣️', writing: '✍️', interview: '🎯',
  beginner: '🌱', intensive: '⚡', other: '📌',
}

export default function BookingModal({ tutor, open, onClose }: BookingModalProps) {
  const t = useTranslations('booking')
  const tl = useTranslations('lessons')
  const locale = useLocale()
  const dfLocale = LOCALES[locale] ?? enUS
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile = (tutor as any).profiles
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: subscription, isLoading: subLoading } = useActiveSubscription()

  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1))
  const [time, setTime] = useState<string | null>(null)
  const [topic, setTopic] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const duration = 30
  const remaining = subscription?.lessons_remaining ?? 0
  const canBook = !subLoading && subscription !== null && remaining > 0

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
          topic: topic || null,
          is_trial: false,
          status: tutor.instant_booking ? 'confirmed' : 'pending',
        } as any)

      if (error) throw error

      if (tutor.instant_booking) {
        fetch('/api/internal/notify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            kind: 'booking_confirmed',
            to: user.email,
            recipientName: user.user_metadata?.full_name ?? t('student'),
            counterpartName: profile?.full_name ?? t('tutor'),
            scheduledAt: scheduledAt.toISOString(),
          }),
        }).catch(() => {})
      }

      queryClient.invalidateQueries({ queryKey: ['active-subscription'] })
      queryClient.invalidateQueries({ queryKey: ['lessons'] })

      toast.success(
        tutor.instant_booking ? t('bookingSuccess') : t('awaitingApproval')
      )
      onClose()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('errorOccurred'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="dark bg-background text-foreground max-w-3xl w-[95vw] max-h-[92vh] overflow-y-auto p-0 gap-0 rounded-2xl border-white/[0.06]">
        {/* Header */}
        <div className="relative px-6 sm:px-8 pt-7 pb-5">
          <div className="absolute inset-0 gradient-bg opacity-[0.06] rounded-t-2xl" />
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-xl font-extrabold tracking-tight flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center shadow-md shrink-0">
                <CalendarDays className="h-4 w-4 text-white" />
              </div>
              {t('title')}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground/70 mt-1">
              {t('selectDate')} · {t('selectTime')}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 sm:px-8 pb-7 space-y-5">
          {/* Tutor card */}
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06]">
            <Avatar className="h-12 w-12 rounded-xl">
              <AvatarImage src={profile?.avatar_url ?? ''} className="rounded-xl" />
              <AvatarFallback className="gradient-bg text-white text-sm font-bold rounded-xl">
                {getInitials(profile?.full_name ?? '?')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">{profile?.full_name}</p>
              <Rating value={tutor.average_rating ?? 0} count={tutor.total_reviews ?? 0} size="sm" />
            </div>
            {tutor.instant_booking && (
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25 gap-1 text-[11px] shrink-0">
                <Sparkles className="h-3 w-3" />
                {t('instantBook')}
              </Badge>
            )}
          </div>

          {/* Subscription status */}
          {subLoading ? (
            <Skeleton className="h-14 rounded-xl" />
          ) : canBook ? (
            <div className="flex items-center gap-3 rounded-xl ring-1 ring-emerald-500/20 bg-emerald-500/8 px-4 py-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Ticket className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-sm">
                <span className="font-bold text-emerald-400">{remaining}</span>{' '}
                <span className="text-emerald-300/80">{t('lessonsLeft')}</span>
                <span className="text-muted-foreground"> — {subscription?.plan?.name_az} {t('subscriptionOf')}</span>
              </span>
            </div>
          ) : (
            <div className="rounded-xl ring-1 ring-amber-500/20 bg-amber-500/8 p-5 space-y-3">
              <p className="text-sm text-amber-200/90">
                {subscription === null ? t('needSubscription') : t('noLessonsLeft')}
              </p>
              <Button
                className="gradient-bg border-0 text-white w-full rounded-xl h-11"
                onClick={() => { onClose(); router.push('/pricing') }}
              >
                {t('buySubscription')}
              </Button>
            </div>
          )}

          {canBook && (
            <>
              {/* Date & Time picker */}
              <TimeSlotPicker
                tutorId={tutor.id}
                date={date}
                onDateChange={setDate}
                time={time}
                onTimeChange={setTime}
              />

              {/* Topic selection */}
              <div className="space-y-3">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  {t('selectTopic')}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TOPICS.map((tp) => {
                    const topicKey = `topic${tp.charAt(0).toUpperCase() + tp.slice(1)}`
                    return (
                      <button
                        key={tp}
                        type="button"
                        onClick={() => setTopic(topic === tp ? null : tp)}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ring-1',
                          topic === tp
                            ? 'ring-primary bg-primary/12 text-primary'
                            : 'ring-white/[0.06] bg-white/[0.02] text-foreground/70 hover:bg-white/[0.05] hover:ring-white/[0.1]'
                        )}
                      >
                        <span className="text-sm">{TOPIC_ICONS[tp]}</span>
                        <span className="truncate">{t(topicKey)}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Duration info */}
              <div className="flex items-center gap-2.5 rounded-xl ring-1 ring-primary/15 bg-primary/6 px-4 py-3 text-sm">
                <Info className="h-4 w-4 text-primary shrink-0" />
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {t('durationIncluded')}
                </span>
              </div>

              {/* Note */}
              <div className="space-y-2">
                <p className="text-sm font-semibold">{t('noteOptional')}</p>
                <Textarea
                  placeholder={t('notePlaceholder')}
                  className="text-sm resize-none h-20 rounded-xl border-white/[0.06] bg-white/[0.02] focus:ring-primary/30"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              {/* Summary */}
              {date && time && (
                <div className="rounded-xl ring-1 ring-primary/20 bg-primary/6 p-5 space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t('date')}</span>
                    <span className="font-semibold">
                      {format(date, 'd MMMM yyyy', { locale: dfLocale })}, {time}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t('duration')}</span>
                    <span className="font-semibold">{duration} {t('minutes')}</span>
                  </div>
                  {topic && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t('selectTopic')}</span>
                      <span className="font-semibold flex items-center gap-1.5">
                        {TOPIC_ICONS[topic]}
                        {t(`topic${topic.charAt(0).toUpperCase() + topic.slice(1)}`)}
                      </span>
                    </div>
                  )}
                  <div className="h-px bg-white/[0.06]" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{t('total')}</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="font-bold text-primary">{t('totalOneLesson')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Policy */}
              <div className="flex items-start gap-2.5 text-[11px] text-muted-foreground/70">
                <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{t('cancelPolicyFull')}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl h-12 border-white/[0.08]"
                  onClick={onClose}
                >
                  {tl('cancel')}
                </Button>
                <Button
                  className="flex-1 rounded-xl h-12 gradient-bg border-0 text-white font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.01] transition-all"
                  disabled={!date || !time || submitting}
                  onClick={handleBook}
                >
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {t('bookButton')}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
