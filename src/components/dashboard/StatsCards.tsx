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
    glow: 'shadow-blue-500/20',
    bg: 'from-blue-50 to-indigo-50',
    accent: 'text-blue-600',
    unit: 'dərs',
  },
  {
    key: 'totalHours' as const,
    label: 'Öyrənmə saatları',
    icon: Clock,
    format: (v: number) => String(v),
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/20',
    bg: 'from-emerald-50 to-teal-50',
    accent: 'text-emerald-600',
    unit: 'saat',
  },
  {
    key: 'upcomingLessons' as const,
    label: 'Gələn dərslər',
    icon: Calendar,
    format: (v: number) => String(v),
    gradient: 'from-amber-500 to-orange-500',
    glow: 'shadow-amber-500/20',
    bg: 'from-amber-50 to-orange-50',
    accent: 'text-amber-600',
    unit: 'planlanmış',
  },
  {
    key: 'balance' as const,
    label: 'Hesab balansı',
    icon: Wallet,
    format: (v: number) => `$${v.toFixed(2)}`,
    gradient: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/20',
    bg: 'from-violet-50 to-purple-50',
    accent: 'text-violet-600',
    unit: 'USD',
  },
]

export default function StatsCards() {
  const { data, isLoading } = useStudentStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border p-5 bg-card">
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
      {stats.map((stat, idx) => {
        const value = data?.[stat.key] ?? 0
        return (
          <div
            key={stat.key}
            className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            {/* Subtle gradient top strip */}
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

              {/* Unit badge */}
              <div className="flex items-center gap-1.5 mt-3">
                <TrendingUp className={`h-3 w-3 ${stat.accent}`} />
                <span className={`text-xs font-semibold ${stat.accent}`}>{stat.unit}</span>
              </div>
            </div>

            {/* Hover glow bg */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none`} />
          </div>
        )
      })}
    </div>
  )
}
