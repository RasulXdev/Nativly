'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { az } from 'date-fns/locale'
import { Wallet, ArrowDownLeft, Clock, TrendingUp, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import EarningsChart from '@/components/tutor/EarningsChart'
import {
  usePayoutSummary,
  useTutorPayouts,
  type TutorPayoutRow,
} from '@/hooks/useTutorEarnings'

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  paid: { label: 'Ödənildi', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  pending: { label: 'Gözləyir', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  cancelled: { label: 'Ləğv edildi', cls: 'bg-red-500/15 text-red-400 border-red-500/20' },
}

type FilterTab = 'all' | 'pending' | 'paid'
const TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Hamısı' },
  { key: 'pending', label: 'Gözləyən' },
  { key: 'paid', label: 'Ödənilmiş' },
]

export default function TutorEarningsPage() {
  const { data: summary, isLoading: loadingSummary } = usePayoutSummary()
  const [tab, setTab] = useState<FilterTab>('all')
  const { data: payouts, isLoading: loadingPayouts } = useTutorPayouts(tab)

  const fmt = (n: number) => `₼${n.toFixed(2)}`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Qazanclar</h1>
        <p className="text-sm text-muted-foreground mt-1">Dərs ödənişləri platform tərəfindən hesablanır</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* This month */}
        <div className="relative overflow-hidden rounded-2xl gradient-bg p-6 text-white sm:col-span-1">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/8 float-slow" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-white/70" />
              <span className="text-sm text-white/70 font-medium">Bu ay</span>
            </div>
            {loadingSummary ? (
              <Skeleton className="h-9 w-28 bg-white/20" />
            ) : (
              <p className="text-3xl font-black tracking-tight">{fmt(summary?.thisMonth ?? 0)}</p>
            )}
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Gözləyən</span>
          </div>
          {loadingSummary ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-2xl font-extrabold text-amber-400">{fmt(summary?.pending ?? 0)}</p>
          )}
        </div>

        {/* Paid */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Ödənilib</span>
          </div>
          {loadingSummary ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-2xl font-extrabold text-emerald-400">{fmt(summary?.paid ?? 0)}</p>
          )}
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Hər tamamlanmış dərs üçün sabit ödəniş hesablanır. Ödənişlər admin tərəfindən bank
          hesabınıza köçürülür. Bank məlumatlarınızı yeniləmək üçün dəstək ilə əlaqə saxlayın.
        </p>
      </div>

      {/* Earnings chart */}
      <EarningsChart />

      {/* Payout history */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-semibold text-sm">Ödəniş tarixçəsi</h2>
          </div>

          {/* Filter tabs */}
          <div className="flex rounded-lg border border-border overflow-hidden text-xs">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 transition-colors ${tab === t.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          {loadingPayouts ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : !payouts?.length ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Hələ ödəniş yoxdur
            </p>
          ) : (
            <div className="space-y-3">
              {(payouts as TutorPayoutRow[]).map((p) => {
                const cfg = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.pending
                const date = p.paid_at ?? p.created_at
                return (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Dərs ödənişi</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {date && <span>{format(new Date(date), 'd MMM, HH:mm', { locale: az })}</span>}
                        <Badge className={`text-[10px] h-4 px-1.5 ${cfg.cls}`}>
                          {cfg.label}
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
      </div>
    </div>
  )
}
