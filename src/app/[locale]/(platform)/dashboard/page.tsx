import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import StatsCards from '@/components/dashboard/StatsCards'
import UpcomingLessons from '@/components/dashboard/UpcomingLessons'
import RecommendedTutors from '@/components/dashboard/RecommendedTutors'
import RecentActivity from '@/components/dashboard/RecentActivity'
import ProgressChart from '@/components/dashboard/ProgressChart'
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
      {/* Welcome hero */}
      <div className="relative overflow-hidden rounded-3xl gradient-bg p-7 sm:p-8 text-white">
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(ellipse 70% 60% at 80% -20%, rgba(255,255,255,0.15) 0%, transparent 70%),
              radial-gradient(ellipse 50% 50% at 100% 100%, rgba(255,255,255,0.08) 0%, transparent 60%)`
          }}
        />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/8 float-slow" />
        <div className="absolute -bottom-14 right-20 w-40 h-40 rounded-full bg-white/5 float-delay" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              {greeting}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight truncate">
              {t('welcome')}{firstName ? `, ${firstName}` : ''}! 👋
            </h1>
            <p className="text-sm text-white/75 mt-2 max-w-sm leading-relaxed">
              {t('subtitle')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <Link
              href="/tutors"
              className={cn(buttonVariants({ size: 'sm' }), 'bg-white text-primary hover:bg-white/90 border-0 rounded-full font-semibold h-10 px-5 shadow-lg btn-glow')}
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              {t('findTutor')}
            </Link>
            <Link
              href="/schedule"
              className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'border-white/30 text-white hover:bg-white/10 rounded-full h-10 px-5')}
            >
              <BookOpen className="h-3.5 w-3.5 mr-1.5" />
              {t('schedule')}
            </Link>
          </div>
        </div>
      </div>

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
