'use client'

import { format } from 'date-fns'
import { az } from 'date-fns/locale'
import { Star, MessageSquare, ArrowRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useTutorRecentReviews } from '@/hooks/useTutorLessons'
import { getInitials } from '@/lib/utils'
import EmptyState from '@/components/shared/EmptyState'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-border'}`}
        />
      ))}
    </div>
  )
}

export default function RecentReviews() {
  const { data: rawReviews, isLoading, isError } = useTutorRecentReviews()

  type Review = {
    id: string
    rating: number
    comment: string | null
    created_at: string
    profiles: { full_name: string; avatar_url: string | null } | null
  }

  const reviews = rawReviews as Review[] | undefined

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Star className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-semibold text-sm">Son rəylər</h3>
        </div>
        <button className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
          Hamısı
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="p-5">
        {isError ? (
          <p className="text-sm text-muted-foreground text-center py-4">Məlumat yüklənmədi</p>
        ) : isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : !reviews?.length ? (
          <EmptyState
            icon={MessageSquare}
            title="Hələ rəy yoxdur"
            description="Tələbələr dərsdən sonra rəy bildirdikdə burada görünəcək"
          />
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="space-y-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={review.profiles?.avatar_url ?? ''} />
                    <AvatarFallback className="gradient-bg text-white text-xs font-bold">
                      {getInitials(review.profiles?.full_name ?? '?')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {review.profiles?.full_name ?? 'Tələbə'}
                    </p>
                    <StarRating rating={review.rating} />
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {format(new Date(review.created_at), 'd MMM', { locale: az })}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-xs text-muted-foreground bg-white/5 rounded-lg p-3 leading-relaxed line-clamp-2">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
