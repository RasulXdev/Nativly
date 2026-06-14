import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import StatsCards from '@/components/dashboard/StatsCards'
import UpcomingLessons from '@/components/dashboard/UpcomingLessons'
import RecommendedTutors from '@/components/dashboard/RecommendedTutors'
import RecentActivity from '@/components/dashboard/RecentActivity'
import ProgressChart from '@/components/dashboard/ProgressChart'
import HeroBanner from '@/components/dashboard/HeroBanner'
import { Sparkles, BookOpen } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('dashboard')
  return { title: `${t('welcome')} — Nativly` }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const t = await getTranslations('dashboard')
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profileData } = user
    ? await supabase.from('profiles').select('full_name').eq('id', user.id).single()
    : { data: null }

  const profile = profileData as { full_name: string } | null
  const firstName = profile?.full_name?.split(' ')[0] ?? ''
  const hour = new Date().getHours()
  const greeting = hour < 12 ? t('goodMorning') : hour < 18 ? t('goodAfternoon') : t('goodEvening')

  return (
    <div className="space-y-6">
      <HeroBanner
        variant="sapphire"
        greeting={greeting}
        title={`${t('welcome')}${firstName ? `, ${firstName}` : ''}!`}
        subtitle={t('subtitle')}
      >
        <Link
          href="/tutors"
          className={cn(buttonVariants({ size: 'sm' }), 'bg-white text-[oklch(0.40_0.16_258)] hover:bg-white/92 border-0 rounded-xl font-semibold h-10 px-5 shadow-lg btn-glow')}
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          {t('findTutor')}
        </Link>
        <Link
          href="/schedule"
          className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'border-white/25 text-white hover:bg-white/10 rounded-xl h-10 px-5 backdrop-blur-sm')}
        >
          <BookOpen className="h-3.5 w-3.5 mr-1.5" />
          {t('schedule')}
        </Link>
      </HeroBanner>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <UpcomingLessons />
        <RecommendedTutors />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ProgressChart />
        <RecentActivity />
      </div>
    </div>
  )
}
