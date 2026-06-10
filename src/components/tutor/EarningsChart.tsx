'use client'

import { useState } from 'react'
import { TrendingUp, ArrowRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useTutorEarningsChart } from '@/hooks/useTutorEarnings'
import { Link } from '@/i18n/navigation'

export default function EarningsChart() {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly')
  const { data: bars = [], isLoading, isError } = useTutorEarningsChart(period)
  const max = Math.max(...bars.map((b) => b.amount), 1)

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-semibold text-sm">Qazanc qrafiki</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-border overflow-hidden text-xs">
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-2.5 py-1 transition-colors ${period === 'weekly' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Həftəlik
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-2.5 py-1 transition-colors ${period === 'monthly' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Aylıq
            </button>
          </div>
          <Link href="/tutor-earnings">
            <button className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
              Hamısı
              <ArrowRight className="h-3 w-3" />
            </button>
          </Link>
        </div>
      </div>

      <div className="p-5">
        {isLoading ? (
          <div className="flex items-end gap-2 h-24">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <Skeleton className="w-full rounded-t-lg" style={{ height: `${30 + i * 6}px` }} />
                <Skeleton className="h-3 w-8" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-muted-foreground text-center py-8">Məlumat yüklənmədi</p>
        ) : (
          <>
            <div className="flex items-end gap-2 h-24">
              {bars.map((bar, i) => {
                const heightPct = max > 0 ? (bar.amount / max) * 100 : 0
                const isLast = i === bars.length - 1
                return (
                  <div key={bar.label} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <div className="relative w-full flex items-end" style={{ height: '80px' }}>
                      {bar.amount > 0 && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ₼{bar.amount.toFixed(0)}
                        </span>
                      )}
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          isLast
                            ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                            : bar.amount > 0
                            ? 'bg-emerald-500/40'
                            : 'bg-white/8'
                        }`}
                        style={{ height: `${Math.max(heightPct, bar.amount > 0 ? 12 : 6)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                      {bar.label}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
              <span>{period === 'weekly' ? 'Son 8 həftə' : 'Son 6 ay'}</span>
              <span className="font-semibold text-emerald-400">
                ₼{bars.reduce((s, b) => s + b.amount, 0).toFixed(2)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
