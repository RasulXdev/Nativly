'use client'

import { useLocale, useTranslations } from 'next-intl'

import { format } from 'date-fns'
import { az, enUS, ru, type Locale } from 'date-fns/locale'
import { ClipboardList, Check, X, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { usePendingBookings, useConfirmBooking, useRejectBooking } from '@/hooks/useTutorLessons'
import { getInitials } from '@/lib/utils'
import EmptyState from '@/components/shared/EmptyState'
import { toast } from 'sonner'

const LOCALES: Record<string, Locale> = { az, en: enUS, ru }

export default function PendingBookings() {
  const t = useTranslations('tutorDashboard')
  const locale = useLocale()
  const dfLocale = LOCALES[locale] ?? enUS
  const { data: rawBookings, isLoading, isError } = usePendingBookings()
  const confirm = useConfirmBooking()
  const reject = useRejectBooking()

  type Booking = {
    id: string
    scheduled_at: string
    duration_minutes: number
    price: number
    currency: string
    student_note: string | null
    is_trial: boolean
    student: { id: string; full_name: string; avatar_url: string | null } | null
  }

  const bookings = rawBookings as Booking[] | undefined

  const handleConfirm = async (id: string) => {
    try {
      await confirm.mutateAsync(id)
      toast.success(t('bookingApproved'))
    } catch {
      toast.error(t('errorOccurred'))
    }
  }

  const handleReject = async (id: string) => {
    try {
      await reject.mutateAsync({ bookingId: id })
      toast.success(t('bookingRejected'))
    } catch {
      toast.error(t('errorOccurred'))
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <ClipboardList className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-semibold text-sm">{t('pendingTitle')}</h3>
          {bookings && bookings.length > 0 && (
            <Badge className="h-5 text-xs bg-amber-500/20 text-amber-400 border-amber-500/30">
              {bookings.length}
            </Badge>
          )}
        </div>
        <button className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
          {t('all')}
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="p-5">
        {isError ? (
          <p className="text-sm text-muted-foreground text-center py-4">{t('failedToLoad')}</p>
        ) : isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="p-3 rounded-xl border border-border/50 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1 rounded-lg" />
                  <Skeleton className="h-8 flex-1 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : !bookings?.length ? (
          <EmptyState
            icon={ClipboardList}
            title={t('noPendingTitle')}
            description={t('noPendingDesc')}
          />
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 4).map((booking) => (
              <div
                key={booking.id}
                className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={booking.student?.avatar_url ?? ''} />
                    <AvatarFallback className="gradient-bg text-white text-xs font-bold">
                      {getInitials(booking.student?.full_name ?? '?')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate">
                        {booking.student?.full_name ?? t('student')}
                      </p>
                      {booking.is_trial && (
                        <Badge className="text-[10px] h-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shrink-0">
                          Sınaq
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(booking.scheduled_at), 'd MMM, HH:mm', { locale: dfLocale })}</span>
                      <span className="text-border">·</span>
                      <span>{booking.duration_minutes} {t('min')}</span>
                      <span className="text-border">·</span>
                      <span className="font-semibold text-foreground">${booking.price}</span>
                    </div>
                    {booking.student_note && (
                      <p className="text-xs text-muted-foreground mt-1 truncate italic">
                        &ldquo;{booking.student_note}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 h-8 text-xs bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30"
                    variant="outline"
                    onClick={() => handleConfirm(booking.id)}
                    disabled={confirm.isPending}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    {t('approve')}
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 h-8 text-xs bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30"
                    variant="outline"
                    onClick={() => handleReject(booking.id)}
                    disabled={reject.isPending}
                  >
                    <X className="h-3 w-3 mr-1" />
                    {t('reject')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
