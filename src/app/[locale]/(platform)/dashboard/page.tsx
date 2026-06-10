import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import StatsCards from '@/components/dashboard/StatsCards'
import UpcomingLessons from '@/components/dashboard/UpcomingLessons'
import RecommendedTutors from '@/components/dashboard/RecommendedTutors'
import { Sparkles, BookOpen, TrendingUp } from 'lucide-react'
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
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl gradient-bg p-7 text-white">
        {/* Mesh overlay */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(ellipse 70% 60% at 80% -20%, rgba(255,255,255,0.15) 0%, transparent 70%),
              radial-gradient(ellipse 50% 50% at 100% 100%, rgba(255,255,255,0.08) 0%, transparent 60%)`
          }}
        />
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Floating orbs */}
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/8 float-slow" />
        <div className="absolute -bottom-14 right-20 w-40 h-40 rounded-full bg-white/5 float-delay" />
        <div className="absolute top-6 right-40 w-16 h-16 rounded-full bg-white/10 float" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              {greeting}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Xoş gəldiniz, {firstName}! 👋
            </h1>
            <p className="text-sm text-white/75 mt-2 max-w-sm leading-relaxed">
              Bu gün yeni bir dərs başlayın və dil bacarıqlarınızı inkişaf etdirin.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <Link
              href="/tutors"
              className={cn(
                buttonVariants({ size: 'sm' }),
                'bg-white text-primary hover:bg-white/90 border-0 rounded-full font-semibold h-10 px-5 shadow-lg btn-glow'
              )}
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Müəllim tap
            </Link>
            <Link
              href="/schedule"
              className={cn(
                buttonVariants({ size: 'sm', variant: 'outline' }),
                'border-white/30 text-white hover:bg-white/10 rounded-full h-10 px-5'
              )}
            >
              <BookOpen className="h-3.5 w-3.5 mr-1.5" />
              Cədvəl
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Progress teaser */}
      <div className="rounded-2xl border border-border bg-card px-5 py-4 flex items-center gap-4">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <TrendingUp className="h-4.5 w-4.5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">İrəliləyişiniz</p>
          <p className="text-xs text-muted-foreground mt-0.5">Hər dərs sizi hədəfinizə bir addım yaxınlaşdırır</p>
        </div>
        <div className="flex-1 max-w-xs">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Bu həftə</span>
            <span className="font-medium text-primary">0 / 3 dərs</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-0 gradient-bg rounded-full transition-all duration-700" />
          </div>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <UpcomingLessons />
        <RecommendedTutors />
      </div>
    </div>
  )
}
