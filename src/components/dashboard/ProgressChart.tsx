'use client'

import { useTranslations } from 'next-intl'
import { BarChart3 } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useWeeklyProgress } from '@/hooks/useLessons'
import { Link } from '@/i18n/navigation'

export default function ProgressChart() {
  const t = useTranslations('dashboard')
  const { data: weeks = [], isLoading, isError } = useWeeklyProgress()
  const max = Math.max(...weeks.map((w) => w.count), 1)

  return (
    <GlassCard title={t('weeklyProgress')} icon={BarChart3} actionLabel={t('lessonsLink')} actionHref="/lessons">
      <div className="p-5">
        {isLoading ? (
          <div className="flex items-end gap-2 h-24">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <Skeleton className="w-full rounded-t-lg" style={{ height: `${40 + i * 8}px` }} />
                <Skeleton className="h-3 w-8" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-muted-foreground text-center py-8">{t('failedToLoad')}</p>
        ) : (
          <>
            <div className="flex items-end gap-2 h-24">
              {weeks.map((week, i) => {
                const heightPct = max > 0 ? (week.count / max) * 100 : 0
                const isLast = i === weeks.length - 1
                return (
                  <div key={week.label} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <div className="relative w-full flex items-end" style={{ height: '80px' }}>
                      {week.count > 0 && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          {week.count}
                        </span>
                      )}
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          isLast ? 'gradient-bg' : week.count > 0 ? 'bg-primary/40' : 'bg-white/8'
                        }`}
                        style={{ height: `${Math.max(heightPct, week.count > 0 ? 12 : 6)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                      {week.label}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('last6weeks')}</span>
              <span className="font-semibold text-foreground">
                {weeks.reduce((sum, w) => sum + w.count, 0)} {t('lessonsTotal')}
              </span>
            </div>
          </>
        )}
      </div>
    </GlassCard>
  )
}
