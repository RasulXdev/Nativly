'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Users, GraduationCap, BookOpen, Clock,
  TrendingUp, AlertCircle
} from 'lucide-react'
import HeroBanner from '@/components/dashboard/HeroBanner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@/i18n/navigation'
import { getInitials } from '@/lib/utils'
import { GlassCard } from '@/components/ui/glass-card'
import { format } from 'date-fns'

interface AdminStats {
  totalUsers: number
  totalTutors: number
  lessonsToday: number
  activeLessons: number
  pendingApplications: number
  recentUsers: { id: string; full_name: string; email: string; role: string; created_at: string; avatar_url: string }[]
}

const STAT_COLORS = [
  { color: 'oklch(0.62 0.18 255)', bg: 'oklch(0.62 0.18 255 / 0.10)', border: 'oklch(0.62 0.18 255 / 0.18)', grad: 'from-[oklch(0.50_0.18_255)] to-[oklch(0.40_0.16_258)]' },
  { color: 'oklch(0.72 0.17 68)', bg: 'oklch(0.72 0.17 68 / 0.10)', border: 'oklch(0.72 0.17 68 / 0.18)', grad: 'from-[oklch(0.72_0.17_68)] to-[oklch(0.65_0.18_55)]' },
  { color: 'oklch(0.62 0.18 300)', bg: 'oklch(0.62 0.18 300 / 0.10)', border: 'oklch(0.62 0.18 300 / 0.18)', grad: 'from-[oklch(0.62_0.18_300)] to-[oklch(0.55_0.17_310)]' },
  { color: 'oklch(0.65 0.22 10)', bg: 'oklch(0.65 0.22 10 / 0.10)', border: 'oklch(0.65 0.22 10 / 0.18)', grad: 'from-[oklch(0.65_0.22_10)] to-[oklch(0.58_0.22_20)]' },
  { color: 'oklch(0.65 0.20 45)', bg: 'oklch(0.65 0.20 45 / 0.10)', border: 'oklch(0.65 0.20 45 / 0.18)', grad: 'from-[oklch(0.65_0.20_45)] to-[oklch(0.58_0.20_35)]' },
]

function StatCard({ icon: Icon, label, value, colorIdx = 0, href }: {
  icon: React.ElementType
  label: string
  value: number | string
  colorIdx?: number
  href?: string
}) {
  const c = STAT_COLORS[colorIdx % STAT_COLORS.length]
  const card = (
    <div
      className="group relative rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-default"
      style={{
        borderColor: 'oklch(1 0 0 / 0.07)',
        background: 'linear-gradient(145deg, oklch(0.165 0.024 260), oklch(0.135 0.020 260))',
      }}
    >
      <div className={`h-0.5 w-full bg-gradient-to-r ${c.grad}`} />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${c.bg} 0%, transparent 70%)` }}
      />
      <div className="relative p-5 space-y-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ background: c.bg, border: `1px solid ${c.border}` }}
        >
          <Icon className="h-4.5 w-4.5" style={{ color: c.color }} />
        </div>
        <div>
          <p className="text-2xl font-extrabold tabular-nums">{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">{label}</p>
        </div>
      </div>
    </div>
  )
  if (href) return <Link href={href as Parameters<typeof Link>[0]['href']}>{card}</Link>
  return card
}

export default function AdminDashboardPage() {
  const t = useTranslations('admin.dashboard')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const roleColors: Record<string, string> = {
    admin: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
    tutor: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    student: 'bg-teal-500/15 text-teal-400 border-teal-500/20',
  }

  return (
    <div className="space-y-6">
      <HeroBanner
        variant="violet"
        greeting={t('greeting')}
        title={t('title')}
        subtitle={t('subtitle')}
      >
        <div className="flex items-center gap-2.5 text-sm font-medium bg-white/8 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10 w-fit">
          <TrendingUp className="h-4 w-4 text-violet-300" />
          <span className="text-white/80">{t('liveStats')}</span>
        </div>
      </HeroBanner>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label={t('totalUsers')} value={stats?.totalUsers ?? 0} href="/admin/users" colorIdx={0} />
          <StatCard icon={GraduationCap} label={t('totalTutors')} value={stats?.totalTutors ?? 0} href="/admin/tutors" colorIdx={1} />
          <StatCard icon={BookOpen} label={t('lessonsToday')} value={stats?.lessonsToday ?? 0} colorIdx={2} />
          <StatCard icon={Clock} label={t('activeLessons')} value={stats?.activeLessons ?? 0} colorIdx={3} />
          {(stats?.pendingApplications ?? 0) > 0 && (
            <div className="col-span-2 lg:col-span-4">
              <Link href="/admin/tutors">
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50 transition-colors">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                  <p className="text-sm font-medium">
                    <span className="text-amber-500 font-bold">{stats?.pendingApplications}</span> {t('pendingApplications')} waiting for review
                  </p>
                </div>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Recent registrations */}
      <GlassCard title={t('recentRegistrations')} icon={Users} actionLabel="View all" actionHref="/admin/users">
        <div className="divide-y divide-border/50">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : stats?.recentUsers.map(u => (
            <div key={u.id} className="flex items-center gap-3 px-5 py-3">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage src={u.avatar_url} />
                <AvatarFallback className="gradient-bg text-white text-xs font-bold">{getInitials(u.full_name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{u.full_name}</p>
                <p className="text-xs text-muted-foreground truncate">{u.email}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge className={`text-xs ${roleColors[u.role] ?? ''}`}>{u.role}</Badge>
                <span className="text-xs text-muted-foreground">{format(new Date(u.created_at), 'd MMM')}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
