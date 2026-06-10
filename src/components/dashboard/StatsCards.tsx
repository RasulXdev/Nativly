'use client'

import { BookOpen, Clock, Calendar, Wallet } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useStudentStats } from '@/hooks/useLessons'

const stats = [
  {
    key: 'totalLessons' as const,
    label: 'Ümumi dərslər',
    icon: BookOpen,
    format: (v: number) => String(v),
    color: 'text-primary',
    bg: 'bg-primary/8',
  },
  {
    key: 'totalHours' as const,
    label: 'Ümumi saatlar',
    icon: Clock,
    format: (v: number) => `${v} saat`,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    key: 'upcomingLessons' as const,
    label: 'Gələn dərslər',
    icon: Calendar,
    format: (v: number) => String(v),
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    key: 'balance' as const,
    label: 'Balans',
    icon: Wallet,
    format: (v: number) => `$${v.toFixed(2)}`,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
]

export default function StatsCards() {
  const { data, isLoading } = useStudentStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <Skeleton className="h-10 w-10 rounded-xl mb-3" />
              <Skeleton className="h-7 w-20 mb-1" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const value = data?.[stat.key] ?? 0
        return (
          <Card key={stat.key} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold tracking-tight">{stat.format(value)}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
