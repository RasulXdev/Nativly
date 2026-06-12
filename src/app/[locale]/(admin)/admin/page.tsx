'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Users, GraduationCap, BookOpen, Clock,
  TrendingUp, AlertCircle
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@/i18n/navigation'
import { getInitials } from '@/lib/utils'
import { format } from 'date-fns'

interface AdminStats {
  totalUsers: number
  totalTutors: number
  lessonsToday: number
  activeLessons: number
  pendingApplications: number
  recentUsers: { id: string; full_name: string; email: string; role: string; created_at: string; avatar_url: string }[]
}

function StatCard({ icon: Icon, label, value, accent = false, href }: {
  icon: React.ElementType
  label: string
  value: number | string
  accent?: boolean
  href?: string
}) {
  const card = (
    <div className={`rounded-2xl border p-5 space-y-3 transition-all ${accent ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'} ${href ? 'hover:border-primary/40 cursor-pointer' : ''}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent ? 'gradient-bg' : 'bg-muted/50'}`}>
        <Icon className={`h-5 w-5 ${accent ? 'text-white' : 'text-muted-foreground'}`} />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  )
  if (href) return <Link href={href}>{card}</Link>
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
    admin: 'bg-purple-500/10 text-purple-500',
    tutor: 'bg-blue-500/10 text-blue-500',
    student: 'bg-emerald-500/10 text-emerald-500',
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl gradient-bg p-6 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <TrendingUp className="h-6 w-6" />
            <h1 className="text-2xl font-extrabold">{t('title')}</h1>
          </div>
          <p className="text-white/70 text-sm">Nativly platform overview</p>
        </div>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label={t('totalUsers')} value={stats?.totalUsers ?? 0} href="/admin/users" />
          <StatCard icon={GraduationCap} label={t('totalTutors')} value={stats?.totalTutors ?? 0} href="/admin/tutors" />
          <StatCard icon={BookOpen} label={t('lessonsToday')} value={stats?.lessonsToday ?? 0} />
          <StatCard icon={Clock} label={t('activeLessons')} value={stats?.activeLessons ?? 0} accent />
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
      <section className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-semibold text-sm">{t('recentRegistrations')}</h2>
          </div>
          <Link href="/admin/users" className="text-xs text-primary hover:underline">View all</Link>
        </div>
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
      </section>
    </div>
  )
}
