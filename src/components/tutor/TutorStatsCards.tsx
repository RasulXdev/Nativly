'use client'

import { useTranslations } from 'next-intl'
import { DollarSign, Users, Star, BookOpen } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useTutorStats } from '@/hooks/useTutorStats'
import { PremiumStatsCard } from '@/components/ui/premium-stats-card'

const STATS = [
  {
    key: 'monthlyEarnings' as const,
    labelKey: 'earningsMonth',
    unitKey: 'unitAzn',
    icon: DollarSign,
    format: (v: number) => `₼${v.toFixed(2)}`,
    color: 'oklch(0.62 0.18 255)',
    colorBg: 'oklch(0.62 0.18 255 / 0.10)',
    colorBorder: 'oklch(0.62 0.18 255 / 0.18)',
    gradient: 'from-[oklch(0.50_0.18_255)] to-[oklch(0.40_0.16_258)]',
  },
  {
    key: 'activeStudents' as const,
    labelKey: 'activeStudents',
    unitKey: 'unitStudents',
    icon: Users,
    format: (v: number) => String(v),
    color: 'oklch(0.72 0.17 68)',
    colorBg: 'oklch(0.72 0.17 68 / 0.10)',
    colorBorder: 'oklch(0.72 0.17 68 / 0.18)',
    gradient: 'from-[oklch(0.72_0.17_68)] to-[oklch(0.65_0.18_55)]',
  },
  {
    key: 'averageRating' as const,
    labelKey: 'avgRating',
    unitKey: 'unitStars',
    icon: Star,
    format: (v: number) => v.toFixed(1),
    color: 'oklch(0.65 0.20 45)',
    colorBg: 'oklch(0.65 0.20 45 / 0.10)',
    colorBorder: 'oklch(0.65 0.20 45 / 0.18)',
    gradient: 'from-[oklch(0.65_0.20_45)] to-[oklch(0.58_0.20_35)]',
  },
  {
    key: 'lessonsThisMonth' as const,
    labelKey: 'lessonsMonth',
    unitKey: 'unitLessons',
    icon: BookOpen,
    format: (v: number) => String(v),
    color: 'oklch(0.62 0.18 300)',
    colorBg: 'oklch(0.62 0.18 300 / 0.10)',
    colorBorder: 'oklch(0.62 0.18 300 / 0.18)',
    gradient: 'from-[oklch(0.62_0.18_300)] to-[oklch(0.55_0.17_310)]',
  },
]

function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-border p-5" style={{ background: 'linear-gradient(145deg, oklch(0.165 0.024 260), oklch(0.135 0.020 260))' }}>
      <div className="flex items-start justify-between mb-5">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      <Skeleton className="h-8 w-24 mb-1.5" />
      <Skeleton className="h-4 w-32" />
    </div>
  )
}

export default function TutorStatsCards() {
  const t = useTranslations('tutorDashboard')
  const { data, isLoading, isError } = useTutorStats()

  if (isError) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-destructive/15 bg-card p-5 flex items-center justify-center min-h-[120px]">
            <p className="text-xs text-muted-foreground text-center">{t('notLoaded')}</p>
          </div>
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((stat) => (
        <PremiumStatsCard
          key={stat.key}
          icon={stat.icon}
          label={t(stat.labelKey)}
          value={data?.[stat.key] ?? 0}
          unit={t(stat.unitKey)}
          format={stat.format}
          color={stat.color}
          colorBg={stat.colorBg}
          colorBorder={stat.colorBorder}
          gradient={stat.gradient}
        />
      ))}
    </div>
  )
}
