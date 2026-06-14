import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import TutorStatsCards from '@/components/tutor/TutorStatsCards'
import TodayLessons from '@/components/tutor/TodayLessons'
import PendingBookings from '@/components/tutor/PendingBookings'
import EarningsChart from '@/components/tutor/EarningsChart'
import RecentReviews from '@/components/tutor/RecentReviews'
import HeroBanner from '@/components/dashboard/HeroBanner'
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
    ? await supabase.from('profiles').select('full_name').eq('id', user.id).single()
    : { data: null }

  const { data: tutorData } = user
    ? await supabase.from('tutor_profiles').select('application_status').eq('user_id', user.id).maybeSingle()
    : { data: null }

  const profile = profileData as { full_name: string } | null
  const firstName = profile?.full_name?.split(' ')[0] ?? ''
  const hour = new Date().getHours()
  const greeting = hour < 12 ? td('goodMorning') : hour < 18 ? td('goodAfternoon') : td('goodEvening')
  const appStatus = (tutorData as { application_status: string } | null)?.application_status

  const badge = appStatus === 'approved'
    ? { label: t('approvedBadge'), color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' }
    : appStatus === 'pending'
      ? { label: t('pendingBadge'), color: 'bg-amber-500/20 text-amber-300 border-amber-400/30' }
      : undefined

  return (
    <div className="space-y-6">
      <HeroBanner
        variant="gold"
        greeting={greeting}
        title={`${td('welcome')}${firstName ? `, ${firstName}` : ''}!`}
        subtitle={t('subtitle')}
        badge={badge}
      >
        <Link
          href="/tutor-schedule"
          className={cn(buttonVariants({ size: 'sm' }), 'bg-white/95 text-[oklch(0.25_0.055_68)] hover:bg-white border-0 rounded-xl font-semibold h-10 px-5 shadow-lg btn-glow')}
        >
          <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
          {t('schedule')}
        </Link>
        <Link
          href="/tutor-students"
          className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'border-white/25 text-white hover:bg-white/10 rounded-xl h-10 px-5 backdrop-blur-sm')}
        >
          <Users className="h-3.5 w-3.5 mr-1.5" />
          {t('students')}
        </Link>
      </HeroBanner>

      <TutorStatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TodayLessons />
        <PendingBookings />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <EarningsChart />
        <RecentReviews />
      </div>
    </div>
  )
}
