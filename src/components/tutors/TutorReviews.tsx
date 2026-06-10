'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { az } from 'date-fns/locale'
import { MessageSquare, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Rating from '@/components/shared/Rating'
import EmptyState from '@/components/shared/EmptyState'
import { useTutorReviews } from '@/hooks/useTutors'
import { getInitials } from '@/lib/utils'

interface TutorReviewsProps {
  tutorId: string
  averageRating: number
  totalReviews: number
}

export default function TutorReviews({ tutorId, averageRating, totalReviews }: TutorReviewsProps) {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useTutorReviews(tutorId, page)

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Rəylər
        </h2>
        {totalReviews > 0 && (
          <div className="flex items-center gap-3">
            <Rating value={averageRating} count={totalReviews} size="md" />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : !data?.reviews.length ? (
        <EmptyState
          icon={MessageSquare}
          title="Hələ rəy yoxdur"
          description="Bu müəllim üçün ilk rəyi siz yaza bilərsiniz"
        />
      ) : (
        <div className="space-y-5">
          {data.reviews.map((review: any) => {
            const student = review.profiles
            return (
              <div key={review.id} className="flex gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={student?.avatar_url ?? ''} />
                  <AvatarFallback className="bg-muted text-xs font-semibold">
                    {getInitials(student?.full_name ?? '?')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{student?.full_name}</span>
                    <Rating value={review.rating} size="sm" showCount={false} />
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(review.created_at), 'd MMM yyyy', { locale: az })}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                  {review.tutor_response && (
                    <div className="mt-2 pl-3 border-l-2 border-primary/30">
                      <p className="text-xs font-semibold text-primary mb-0.5">Müəllimin cavabı</p>
                      <p className="text-xs text-muted-foreground">{review.tutor_response}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {data.total > (page + 1) * 5 && (
            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronDown className="h-4 w-4 mr-2" />
              Daha çox rəy
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
