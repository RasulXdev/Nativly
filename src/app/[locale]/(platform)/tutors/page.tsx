'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import TutorGrid from '@/components/tutors/TutorGrid'
import TutorFilters from '@/components/tutors/TutorFilters'
import { useTutors, type TutorFilters as TFilters } from '@/hooks/useTutors'
import { useDebounce } from '@/hooks/useDebounce'

export default function TutorsPage() {
  const [filters, setFilters] = useState<TFilters>({ sortBy: 'rating' })
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)

  const activeFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch || undefined }),
    [filters, debouncedSearch]
  )

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useTutors(activeFilters)
  const tutors = useMemo(() => data?.pages.flat() ?? [], [data])

  return (
    <div className="space-y-6">
      {/* Page hero header */}
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-6">
        {/* Subtle gradient mesh */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 80% at 0% 50%, oklch(0.395 0.195 262 / 0.08) 0%, transparent 70%),
              radial-gradient(ellipse 40% 60% at 100% 20%, oklch(0.55 0.21 270 / 0.06) 0%, transparent 70%)`
          }}
        />
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, oklch(0.395 0.195 262 / 0.15) 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-md">
                <GraduationCap className="h-4.5 w-4.5 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight gradient-text">
                Müəllimlər
              </h1>
            </div>
            <p className="text-sm text-muted-foreground pl-0.5">
              {isLoading
                ? 'Müəllimlər axtarılır...'
                : `${tutors.length}+ müəllim mövcuddur`}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Müəllim axtar..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

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
                Filtrlər
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader className="mb-4">
                  <SheetTitle>Filtrlər</SheetTitle>
                </SheetHeader>
                <TutorFilters filters={filters} onChange={setFilters} />
              </SheetContent>
            </Sheet>
          </div>

          {/* Grid */}
          <TutorGrid
            tutors={tutors}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={!!hasNextPage}
            onLoadMore={fetchNextPage}
          />
        </div>
      </div>
    </div>
  )
}
