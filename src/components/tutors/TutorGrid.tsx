'use client'

import { useRef, useCallback } from 'react'
import { Loader2, GraduationCap } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import TutorCard from './TutorCard'
import EmptyState from '@/components/shared/EmptyState'
import type { TutorWithProfile } from '@/lib/types'

interface TutorGridProps {
  tutors: TutorWithProfile[]
  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  onLoadMore: () => void
}

export default function TutorGrid({
  tutors,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
}: TutorGridProps) {
  const observer = useRef<IntersectionObserver | null>(null)

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect()
      if (!node) return
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore()
        }
      })
      observer.current.observe(node)
    },
    [hasNextPage, isFetchingNextPage, onLoadMore]
  )

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border p-5 space-y-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-14 w-14 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-8 w-full rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <Skeleton className="h-6 w-16" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!tutors.length) {
    return (
      <EmptyState
        icon={GraduationCap}
        title="Müəllim tapılmadı"
        description="Filtrləri dəyişib yenidən cəhd edin"
      />
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {tutors.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-4" />

      {isFetchingNextPage && (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
