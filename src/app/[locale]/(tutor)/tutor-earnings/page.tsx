'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { format } from 'date-fns'
import { az, enUS, ru, type Locale } from 'date-fns/locale'
import {
  Wallet, ArrowDownLeft, Clock, TrendingUp,
  CheckCircle2, AlertCircle, BarChart2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { GlassCard } from '@/components/ui/glass-card'
import HeroBanner from '@/components/dashboard/HeroBanner'
import EarningsChart from '@/components/tutor/EarningsChart'
import {
  usePayoutSummary,
  useTutorPayouts,
  type TutorPayoutRow,
} from '@/hooks/useTutorEarnings'

const LOCALES: Record<string, Locale> = { az, en: enUS, ru }
const STATUS_CONFIG: Record<string, { labelKey: string; cls: string; icon: typeof CheckCircle2 }> = {
  paid: { labelKey: 'statusPaid', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', icon: CheckCircle2 },
  pending: { labelKey: 'statusPending', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25', icon: Clock },
  cancelled: { labelKey: 'statusCancelled', cls: 'bg-red-500/15 text-red-400 border-red-500/25', icon: AlertCircle },
}

type FilterTab = 'all' | 'pending' | 'paid'
const TABS: { key: FilterTab; labelKey: string }[] = [
  { key: 'all', labelKey: 'tabAll' },
  { key: 'pending', labelKey: 'tabPending' },
  { key: 'paid', labelKey: 'tabPaid' },
]

export default function TutorEarningsPage() {
  const t = useTranslations('tutorEarnings')
  const dfLocale = LOCALES[useLocale()] ?? enUS
  const { data: summary, isLoading: loadingSummary } = usePayoutSummary()
  const [tab, setTab] = useState<FilterTab>('all')
  const { data: payouts, isLoading: loadingPayouts } = useTutorPayouts(tab)

  const fmt = (n: number) => `₼${n.toFixed(2)}`

  return (
    <div className="space-y-6">
      <HeroBanner
        variant="gold"
        greeting={t('thisMonth')}
        title={loadingSummary ? '...' : fmt(summary?.thisMonth ?? 0)}
        subtitle=""
      >
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/20 rounded-full px-3 py-1 text-xs font-medium text-white">
            <Clock className="h-3 w-3" />
            {loadingSummary ? '...' : fmt(summary?.pending ?? 0)} {t('pendingSuffix')}
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-400/20 border border-emerald-300/20 rounded-full px-3 py-1 text-xs font-medium text-white">
            <CheckCircle2 className="h-3 w-3" />
            {loadingSummary ? '...' : fmt(summary?.paid ?? 0)} {t('paidSuffix')}
          </div>
        </div>
      </HeroBanner>

      {/* ── Info card ─────────────────────────────────────── */}
      <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 border-l-4 border-l-primary">
        <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t('infoText')}
        </p>
      </div>

      {/* ── Earnings chart ────────────────────────────────── */}
      <EarningsChart />

      {/* ── Payout history ───────────────────────────────── */}
      <GlassCard title={t('payoutHistory')} icon={TrendingUp}>
        {/* Filter tabs */}
        <div className="flex justify-end px-5 pt-3 pb-2 border-b border-border/30">
          <div className="flex rounded-xl border border-border bg-muted/50 p-0.5 text-xs gap-0.5">
            {TABS.map((tb) => (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  tab === tb.key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t(tb.labelKey)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          {loadingPayouts ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : !payouts?.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <BarChart2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">{t('noPayouts')}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('noPayoutsDesc')}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {(payouts as TutorPayoutRow[]).map((p, i) => {
                const cfg = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.pending
                const StatusIcon = cfg.icon
                const date = p.paid_at ?? p.created_at
                return (
                  <div
                    key={p.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-muted/30 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{t('lessonPayout')}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {date && (
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(date), 'd MMM, HH:mm', { locale: dfLocale })}
                          </span>
                        )}
                        <Badge className={`text-[10px] h-4 px-1.5 flex items-center gap-0.5 ${cfg.cls}`}>
                          <StatusIcon className="h-2.5 w-2.5" />
                          {t(cfg.labelKey)}
                        </Badge>
                      </div>
                    </div>
                    <span className="text-sm font-bold shrink-0 text-emerald-400">
                      +₼{Number(p.amount_azn).toFixed(2)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  )
}
