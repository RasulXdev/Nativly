import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import StatsCards from '@/components/dashboard/StatsCards'
import UpcomingLessons from '@/components/dashboard/UpcomingLessons'
import RecommendedTutors from '@/components/dashboard/RecommendedTutors'
import { Sparkles } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'İdarə paneli — Nativly',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profileData } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user!.id)
    .single()

  const profile = profileData as { full_name: string } | null
  const firstName = profile?.full_name?.split(' ')[0] ?? 'İstifadəçi'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Sabahınız xeyir' : hour < 18 ? 'Günortanız xeyir' : 'Axşamınız xeyir'

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl gradient-bg p-6 text-white">
        <div className="relative z-10">
          <p className="text-sm font-medium opacity-80">{greeting},</p>
          <h1 className="text-2xl font-bold mt-1">{firstName}! 👋</h1>
          <p className="text-sm opacity-80 mt-2 max-w-md">
            Yeni dərs rezerv edib ingilis dilini daha sürətli öyrənin.
          </p>
          <Link
            href="/tutors"
            className={cn(
              buttonVariants({ size: 'sm' }),
              'mt-4 bg-white text-primary hover:bg-white/90 border-0 rounded-full font-semibold'
            )}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Müəllim tap
          </Link>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -right-4 w-52 h-52 rounded-full bg-white/5" />
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingLessons />
        <RecommendedTutors />
      </div>
    </div>
  )
}
