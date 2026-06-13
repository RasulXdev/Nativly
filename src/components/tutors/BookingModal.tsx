'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { format, addDays } from 'date-fns'
import { az, enUS, ru, type Locale } from 'date-fns/locale'
import {
  Clock, Loader2, Ticket, ShieldCheck,
  CalendarDays, CheckCircle2, Sparkles,
  MessageCircle, FileText, Briefcase, Heart,
  GraduationCap, Mic, PenTool, Target,
  Sprout, Zap, MoreHorizontal, type LucideIcon,
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

const TOPIC_META: Record<string, { icon: LucideIcon; color: string }> = {
  conversation: { icon: MessageCircle, color: 'text-sky-400' },
  grammar:      { icon: FileText,      color: 'text-amber-400' },
  business:     { icon: Briefcase,     color: 'text-indigo-400' },
  kids:         { icon: Heart,         color: 'text-pink-400' },
  examPrep:     { icon: GraduationCap, color: 'text-violet-400' },
  pronunciation:{ icon: Mic,           color: 'text-emerald-400' },
  writing:      { icon: PenTool,       color: 'text-orange-400' },
  interview:    { icon: Target,        color: 'text-red-400' },
  beginner:     { icon: Sprout,        color: 'text-lime-400' },
  intensive:    { icon: Zap,           color: 'text-yellow-400' },
  other:        { icon: MoreHorizontal,color: 'text-zinc-400' },
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
      <DialogContent className="dark bg-background text-foreground max-w-5xl w-[96vw] p-0 gap-0 rounded-3xl border-white/[0.08] overflow-hidden [&>button]:top-5 [&>button]:right-5 [&>button]:z-20">
        {/* Header */}
        <div className="relative px-8 sm:px-10 pt-8 pb-6">
          <div className="absolute inset-0 gradient-bg opacity-[0.07]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
          <DialogHeader className="relative z-10 flex flex-row items-center gap-5">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-11 h-11 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                <CalendarDays className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {t('title')}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground/60 mt-0.5">
                  {t('selectDate')} · {t('selectTime')}
                </DialogDescription>
              </div>
            </div>
            {/* Tutor mini card */}
            <div className="hidden sm:flex items-center gap-3 pl-5 border-l border-white/[0.08]">
              <Avatar className="h-10 w-10 rounded-xl ring-2 ring-white/[0.1]">
                <AvatarImage src={profile?.avatar_url ?? ''} className="rounded-xl" />
                <AvatarFallback className="gradient-bg text-white text-xs font-bold rounded-xl">
                  {getInitials(profile?.full_name ?? '?')}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">{profile?.full_name}</p>
                <Rating value={tutor.average_rating ?? 0} count={tutor.total_reviews ?? 0} size="sm" />
              </div>
              {tutor.instant_booking && (
                <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25 gap-1 text-[10px] ml-1 shrink-0">
                  <Sparkles className="h-3 w-3" />
                  {t('instantBook')}
                </Badge>
              )}
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-8 sm:px-10 pb-8 space-y-7">
          {/* Mobile tutor card */}
          <div className="sm:hidden flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.08]">
            <Avatar className="h-10 w-10 rounded-xl">
              <AvatarImage src={profile?.avatar_url ?? ''} className="rounded-xl" />
              <AvatarFallback className="gradient-bg text-white text-xs font-bold rounded-xl">
                {getInitials(profile?.full_name ?? '?')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">{profile?.full_name}</p>
              <Rating value={tutor.average_rating ?? 0} count={tutor.total_reviews ?? 0} size="sm" />
            </div>
          </div>

          {/* Subscription */}
          {subLoading ? (
            <Skeleton className="h-14 rounded-2xl" />
          ) : canBook ? (
            <div className="flex items-center gap-3.5 rounded-2xl ring-1 ring-emerald-500/20 bg-emerald-500/[0.06] px-5 py-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                <Ticket className="h-4.5 w-4.5 text-emerald-400" />
              </div>
              <span className="text-sm">
                <span className="font-bold text-emerald-400 text-base">{remaining}</span>{' '}
                <span className="text-emerald-300/70">{t('lessonsLeft')}</span>
                <span className="text-muted-foreground/60 hidden sm:inline"> — {subscription?.plan?.name_az} {t('subscriptionOf')}</span>
              </span>
            </div>
          ) : (
            <div className="rounded-2xl ring-1 ring-amber-500/20 bg-amber-500/[0.06] p-6 space-y-4">
              <p className="text-sm text-amber-200/90">
                {subscription === null ? t('needSubscription') : t('noLessonsLeft')}
              </p>
              <Button
                className="gradient-bg border-0 text-white w-full sm:w-auto rounded-xl h-11 px-8"
                onClick={() => { onClose(); router.push('/pricing') }}
              >
                {t('buySubscription')}
              </Button>
            </div>
          )}

          {canBook && (
            <>
              {/* Date & Time */}
              <TimeSlotPicker
                tutorId={tutor.id}
                date={date}
                onDateChange={setDate}
                time={time}
                onTimeChange={setTime}
              />

              {/* Topics */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm font-bold tracking-tight">{t('selectTopic')}</p>
                  <span className="text-[11px] text-muted-foreground/40 ml-1">({t('noteOptional').toLowerCase()})</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {TOPICS.map((tp) => {
                    const meta = TOPIC_META[tp]
                    const Icon = meta.icon
                    const topicKey = `topic${tp.charAt(0).toUpperCase() + tp.slice(1)}`
                    const selected = topic === tp
                    return (
                      <button
                        key={tp}
                        type="button"
                        onClick={() => setTopic(selected ? null : tp)}
                        className={cn(
                          'group flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 ring-1',
                          selected
                            ? 'ring-primary/60 bg-primary/10 text-primary shadow-md shadow-primary/5'
                            : 'ring-white/[0.08] bg-white/[0.02] text-foreground/80 hover:bg-white/[0.05] hover:ring-white/[0.15] hover:scale-[1.01]'
                        )}
                      >
                        <div className={cn(
                          'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                          selected ? 'bg-primary/20' : 'bg-white/[0.06] group-hover:bg-white/[0.1]'
                        )}>
                          <Icon className={cn('h-4 w-4', selected ? 'text-primary' : meta.color)} />
                        </div>
                        <span className="truncate">{t(topicKey)}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Note + Summary row */}
              <div className="grid lg:grid-cols-2 gap-5">
                {/* Note */}
                <div>
                  <p className="text-sm font-bold tracking-tight mb-3">{t('noteOptional')}</p>
                  <Textarea
                    placeholder={t('notePlaceholder')}
                    className="text-sm resize-none h-[120px] rounded-2xl border-white/[0.08] bg-white/[0.02] focus:ring-primary/30 placeholder:text-muted-foreground/30"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                {/* Summary */}
                <div className="rounded-2xl ring-1 ring-white/[0.08] bg-white/[0.03] p-5 flex flex-col justify-between">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground/60">{t('date')}</span>
                      <span className="font-semibold">
                        {date ? format(date, 'd MMMM yyyy', { locale: dfLocale }) : '—'}
                        {time && <span className="text-primary ml-1.5">{time}</span>}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground/60">{t('duration')}</span>
                      <span className="font-semibold flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground/40" />
                        {duration} {t('minutes')}
                      </span>
                    </div>
                    {topic && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground/60">{t('selectTopic')}</span>
                        <span className="font-semibold flex items-center gap-1.5">
                          {(() => { const Icon = TOPIC_META[topic].icon; return <Icon className={cn('h-3.5 w-3.5', TOPIC_META[topic].color)} /> })()}
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
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <div className="flex items-start gap-2 text-[11px] text-muted-foreground/50 flex-1 min-w-0">
                  <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{t('cancelPolicyFull')}</span>
                </div>
                <div className="flex gap-3 shrink-0">
                  <Button
                    variant="outline"
                    className="rounded-xl h-12 px-6 border-white/[0.08] hover:bg-white/[0.04]"
                    onClick={onClose}
                  >
                    {tl('cancel')}
                  </Button>
                  <Button
                    className="rounded-xl h-12 px-10 gradient-bg border-0 text-white font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.01] transition-all disabled:opacity-40"
                    disabled={!date || !time || submitting}
                    onClick={handleBook}
                  >
                    {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {t('bookButton')}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
