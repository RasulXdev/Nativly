import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import TutorStatsCards from '@/components/tutor/TutorStatsCards'
import TodayLessons from '@/components/tutor/TodayLessons'
import PendingBookings from '@/components/tutor/PendingBookings'
import EarningsChart from '@/components/tutor/EarningsChart'
import RecentReviews from '@/components/tutor/RecentReviews'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/i18n/navigation'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CalendarDays, Users } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('nav')
  return { title: `${t('dashboard')} — Nativly` }
}

export default async function TutorDashboardPage() {
  const supabase = await createClient()
  const t = await getTranslations('tutorDashboard')
  const td = await getTranslations('dashboard')
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profileData } = user
    ? await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()
    : { data: null }

  const { data: tutorData } = user
    ? await supabase
        .from('tutor_profiles')
        .select('application_status')
        .eq('user_id', user.id)
        .maybeSingle()
    : { data: null }

  const profile = profileData as { full_name: string } | null
  const firstName = profile?.full_name?.split(' ')[0] ?? ''
  const hour = new Date().getHours()
  const greeting = hour < 12 ? td('goodMorning') : hour < 18 ? td('goodAfternoon') : td('goodEvening')
  const appStatus = (tutorData as { application_status: string } | null)?.application_status

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl gradient-bg p-7 text-white">
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(ellipse 70% 60% at 80% -20%, rgba(255,255,255,0.15) 0%, transparent 70%),
              radial-gradient(ellipse 50% 50% at 100% 100%, rgba(255,255,255,0.08) 0%, transparent 60%)`
          }}
        />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/8 float-slow" />
        <div className="absolute -bottom-14 right-20 w-40 h-40 rounded-full bg-white/5 float-delay" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                {greeting}
              </div>
              {appStatus === 'approved' ? (
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs">
                  {t('approvedBadge')}
                </Badge>
              ) : appStatus === 'pending' ? (
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 text-xs">
                  {t('pendingBadge')}
                </Badge>
              ) : null}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {td('welcome')}{firstName ? `, ${firstName}` : ''}! 👋
            </h1>
            <p className="text-sm text-white/75 mt-2 max-w-sm leading-relaxed">
              {t('subtitle')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <Link
              href="/tutor-schedule"
              className={cn(
                buttonVariants({ size: 'sm' }),
                'bg-white text-primary hover:bg-white/90 border-0 rounded-full font-semibold h-10 px-5 shadow-lg btn-glow'
              )}
            >
              <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
              {t('schedule')}
            </Link>
            <Link
              href="/tutor-students"
              className={cn(
                buttonVariants({ size: 'sm', variant: 'outline' }),
                'border-white/30 text-white hover:bg-white/10 rounded-full h-10 px-5'
              )}
            >
              <Users className="h-3.5 w-3.5 mr-1.5" />
              {t('students')}
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <TutorStatsCards />

      {/* Today lessons + Pending bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TodayLessons />
        <PendingBookings />
      </div>

      {/* Earnings chart + Recent reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <EarningsChart />
        <RecentReviews />
      </div>
    </div>
  )
}
