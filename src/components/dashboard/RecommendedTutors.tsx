'use client'

import { GraduationCap, ArrowRight, Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useTutors } from '@/hooks/useTutors'
import { getInitials } from '@/lib/utils'
import OnlineStatus from '@/components/shared/OnlineStatus'
import { Link } from '@/i18n/navigation'

export default function RecommendedTutors() {
  const { data, isLoading } = useTutors({ sortBy: 'rating' })
  const tutors = data?.pages[0]?.slice(0, 4) ?? []

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Card header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-semibold text-sm">Tövsiyyə olunan müəllimlər</h3>
        </div>
        <Link href="/tutors">
          <button className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
            Hamısı
            <ArrowRight className="h-3 w-3" />
          </button>
        </Link>
      </div>

      <div className="p-5">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {tutors.map((tutor, idx) => {
              const profile = (tutor as any).profiles
              const isOnline = profile?.is_online ?? false
              return (
                <Link key={tutor.id} href={`/tutors/${tutor.id}`}>
                  <div className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer border border-transparent hover:border-white/15">
                    <div className="relative shrink-0">
                      <Avatar className="h-10 w-10 ring-2 ring-background">
                        <AvatarImage src={profile?.avatar_url ?? ''} />
                        <AvatarFallback className="gradient-bg text-white text-xs font-bold">
                          {getInitials(profile?.full_name ?? '?')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5">
                        <OnlineStatus isOnline={isOnline} />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                        {profile?.full_name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium text-amber-600">
                          {(tutor.average_rating ?? 0).toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({tutor.total_reviews ?? 0})
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-primary">${tutor.hourly_rate}</p>
                      <p className="text-xs text-muted-foreground">/saat</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
