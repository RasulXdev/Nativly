'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import {
  CreditCard, CheckCircle, AlertCircle, Clock,
  Zap, Star, Shield, ArrowRight, ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useActiveSubscription } from '@/hooks/useSubscription'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function BillingPage() {
  const t = useTranslations('settings.billing')
  const tc = useTranslations('common')
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)

  const { data: sub, isLoading } = useActiveSubscription()

  const handleManagePayment = async () => {
    setRedirecting(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      if (res.ok) {
        const { url } = await res.json()
        window.location.href = url
      } else {
        toast.error(tc('error'))
      }
    } finally {
      setRedirecting(false)
    }
  }

  const statusColor = (status: string) => {
    if (status === 'active') return 'bg-emerald-500/10 text-emerald-500'
    if (status === 'past_due') return 'bg-amber-500/10 text-amber-500'
    return 'bg-destructive/10 text-destructive'
  }

  const statusIcon = (status: string) => {
    if (status === 'active') return <CheckCircle className="h-4 w-4" />
    if (status === 'past_due') return <AlertCircle className="h-4 w-4" />
    return <Clock className="h-4 w-4" />
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t('currentPlan')}</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      ) : !sub ? (
        /* No subscription */
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto">
            <CreditCard className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">{t('noPlan')}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t('noPlanDesc')}</p>
          </div>
          <Button onClick={() => router.push('/pricing')} className="gradient-bg border-0 text-white">
            {t('viewPlans')} <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      ) : (
        <>
          {/* Current plan card */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="gradient-bg p-5 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-5 w-5" />
                    <span className="font-bold text-lg">{sub?.plan?.name_az ?? 'Plan'}</span>
                  </div>
                  <p className="text-white/70 text-sm">
                    {sub?.lessons_total} lessons/month
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/20 text-white">
                  <CheckCircle className="h-4 w-4" />
                  <span>Active</span>
                </div>
              </div>
            </div>

            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">{t('lessonsRemaining')}</p>
                <p className="font-bold text-2xl mt-0.5">{sub?.lessons_remaining ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('nextRenewal')}</p>
                <p className="font-semibold mt-0.5">
                  {sub?.current_period_end
                    ? format(new Date(sub.current_period_end), 'd MMM yyyy')
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{tc('lessons')}</p>
                <p className="font-semibold mt-0.5">
                  {sub?.lessons_remaining} / {sub?.lessons_total}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-5 pb-5">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="gradient-bg rounded-full h-2 transition-all"
                  style={{
                    width: `${Math.min(100, ((sub?.lessons_remaining ?? 0) / (sub?.lessons_total ?? 1)) * 100)}%`
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {sub?.lessons_remaining} {tc('lessons')} remaining
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/pricing')}
              className="h-12 justify-start gap-3"
            >
              <Star className="h-4 w-4 text-primary" />
              {t('upgrade')}
            </Button>
            <Button
              variant="outline"
              onClick={handleManagePayment}
              disabled={redirecting}
              className="h-12 justify-start gap-3"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              {redirecting ? tc('loading') : t('managePayment')}
            </Button>
          </div>

          {/* Features */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">What&apos;s included</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['1-on-1 video lessons', 'Choose your tutor', 'Lesson notes & homework', 'Cancel anytime'].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Cancel */}
          <div className="text-center">
            <button
              onClick={handleManagePayment}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              {t('cancelSubscription')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
