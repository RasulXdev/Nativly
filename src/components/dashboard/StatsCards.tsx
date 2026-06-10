'use client'

import { BookOpen, Clock, Calendar, Wallet, TrendingUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useStudentStats } from '@/hooks/useLessons'

const stats = [
  {
    key: 'totalLessons' as const,
    label: 'Ümumi dərslər',
    icon: BookOpen,
    format: (v: number) => String(v),
    gradient: 'from-blue-500 to-indigo-600',
    glow: 'shadow-blue-500/30',
    accent: 'text-blue-400',
    unit: 'dərs',
  },
  {
    key: 'totalHours' as const,
    label: 'Öyrənmə saatları',
    icon: Clock,
    format: (v: number) => String(v),
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/30',
    accent: 'text-emerald-400',
    unit: 'saat',
  },
  {
    key: 'upcomingLessons' as const,
    label: 'Gələn dərslər',
    icon: Calendar,
    format: (v: number) => String(v),
    gradient: 'from-amber-500 to-orange-500',
    glow: 'shadow-amber-500/30',
    accent: 'text-amber-400',
    unit: 'planlanmış',
  },
  {
    key: 'balance' as const,
    label: 'Hesab balansı',
    icon: Wallet,
    format: (v: number) => `$${v.toFixed(2)}`,
    gradient: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/30',
    accent: 'text-violet-400',
    unit: 'USD',
  },
]

export default function StatsCards() {
  const { data, isLoading, isError } = useStudentStats()

  if (isError) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-destructive/20 bg-card p-5 flex items-center justify-center min-h-[110px]">
            <p className="text-xs text-muted-foreground text-center">Yüklənmədi</p>
          </div>
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5">
            <Skeleton className="h-11 w-11 rounded-xl mb-4" />
            <Skeleton className="h-8 w-20 mb-1.5" />
            <Skeleton className="h-4 w-28 mb-3" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const value = data?.[stat.key] ?? 0
        return (
          <div
            key={stat.key}
            className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
          >
            {/* Gradient top strip */}
            <div className={`h-1 w-full bg-gradient-to-r ${stat.gradient}`} />

            <div className="p-5">
              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-lg ${stat.glow} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>

              {/* Value */}
              <p className="text-2xl font-extrabold tracking-tight text-foreground">
                {stat.format(value)}
              </p>

              {/* Label */}
              <p className="text-sm text-muted-foreground mt-0.5 font-medium">{stat.label}</p>

              {/* Unit */}
              <div className="flex items-center gap-1.5 mt-3">
                <TrendingUp className={`h-3 w-3 ${stat.accent}`} />
                <span className={`text-xs font-semibold ${stat.accent}`}>{stat.unit}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
