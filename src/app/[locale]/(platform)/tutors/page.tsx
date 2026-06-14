'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Search, SlidersHorizontal, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import HeroBanner from '@/components/dashboard/HeroBanner'
import TutorGrid from '@/components/tutors/TutorGrid'
import TutorFilters from '@/components/tutors/TutorFilters'
import { useTutors, type TutorFilters as TFilters } from '@/hooks/useTutors'
import { useDebounce } from '@/hooks/useDebounce'

export default function TutorsPage() {
  const t = useTranslations('tutors')
  const tf = useTranslations('tutors.filter')
  const [filters, setFilters] = useState<TFilters>({ sortBy: 'rating' })
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)

  const activeFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch || undefined }),
    [filters, debouncedSearch]
  )

  const { data, isLoading, isError, isFetchingNextPage, hasNextPage, fetchNextPage } = useTutors(activeFilters)
  const tutors = useMemo(() => data?.pages.flat() ?? [], [data])

  return (
    <div className="space-y-6">
      <HeroBanner
        variant="sapphire"
        greeting={t('browseTitle')}
        title={isLoading ? t('searching') : `${tutors.length}+ ${t('available')}`}
        subtitle=""
      >
        <div className="relative sm:w-72 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-white/70 pointer-events-none transition-colors" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-white/30 hover:border-white/20 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </HeroBanner>

      <div className="flex gap-5">
        {/* Desktop Filters sidebar */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-4 rounded-2xl border border-border bg-card p-5">
            <TutorFilters filters={filters} onChange={setFilters} />
          </div>
        </aside>

        <div className="flex-1 min-w-0 space-y-4">
          {/* Mobile filter button */}
          <div className="flex lg:hidden">
            <Sheet>
              <SheetTrigger className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 h-10 text-sm font-medium hover:bg-accent transition-colors">
                <SlidersHorizontal className="h-4 w-4" />
                {tf('title')}
              </SheetTrigger>
              <SheetContent side="left" className="dark bg-background text-foreground w-80 overflow-y-auto p-5">
                <SheetHeader className="mb-4">
                  <SheetTitle>{tf('title')}</SheetTitle>
                </SheetHeader>
                <TutorFilters filters={filters} onChange={setFilters} />
              </SheetContent>
            </Sheet>
          </div>

          {/* Grid */}
          <TutorGrid
            tutors={tutors}
            isLoading={isLoading}
            isError={isError}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={!!hasNextPage}
            onLoadMore={fetchNextPage}
            hasActiveFilters={
              !!(filters.search || debouncedSearch ||
                (filters.languages?.length ?? 0) > 0 ||
                (filters.specializations?.length ?? 0) > 0 ||
                filters.onlineOnly || filters.instantBooking || filters.minRating != null)
            }
          />
        </div>
      </div>
    </div>
  )
}
