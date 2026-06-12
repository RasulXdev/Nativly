'use client'

import { useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2, GraduationCap, SearchX } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import TutorCard from './TutorCard'
import type { TutorWithProfile } from '@/lib/types'

interface TutorGridProps {
  tutors: TutorWithProfile[]
  isLoading: boolean
  isError?: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  onLoadMore: () => void
  hasActiveFilters?: boolean
}

export default function TutorGrid({
  tutors,
  isLoading,
  isError,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  hasActiveFilters,
}: TutorGridProps) {
  const t = useTranslations('tutors')
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

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">{t('loadError')}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 space-y-4">
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

  // Clean empty state — no mock data
  if (!tutors.length) {
    const Icon = hasActiveFilters ? SearchX : GraduationCap
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 px-6 text-center">
        <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="font-semibold text-base">
          {hasActiveFilters ? t('noResults') : t('comingTitle')}
        </h3>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">
          {hasActiveFilters ? t('noResultsDesc') : t('comingDesc')}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {tutors.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>
      <div ref={sentinelRef} className="h-4" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
