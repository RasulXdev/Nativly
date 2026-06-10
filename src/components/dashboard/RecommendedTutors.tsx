'use client'

import { GraduationCap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useTutors } from '@/hooks/useTutors'
import { getInitials } from '@/lib/utils'
import Rating from '@/components/shared/Rating'
import OnlineStatus from '@/components/shared/OnlineStatus'
import { Link } from '@/i18n/navigation'

export default function RecommendedTutors() {
  const { data, isLoading } = useTutors({ sortBy: 'rating' })
  const tutors = data?.pages[0]?.slice(0, 4) ?? []

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-primary" />
          Tövsiyyə olunan müəllimlər
        </CardTitle>
        <Link href="/tutors">
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary h-7 text-xs">
            Hamısı
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {tutors.map((tutor) => {
              const profile = (tutor as any).profiles
              const isOnline = profile?.is_online ?? false
              return (
                <div key={tutor.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="relative shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatar_url ?? ''} />
                      <AvatarFallback className="gradient-bg text-white text-xs font-semibold">
                        {getInitials(profile?.full_name ?? '?')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5">
                      <OnlineStatus isOnline={isOnline} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{profile?.full_name}</p>
                    <Rating
                      value={tutor.average_rating ?? 0}
                      count={tutor.total_reviews ?? 0}
                      size="sm"
                    />
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary">${tutor.hourly_rate}/saat</p>
                    <Link href={`/tutors/${tutor.id}`}>
                      <Button variant="outline" size="sm" className="h-7 text-xs mt-1 rounded-full">
                        Profil
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
