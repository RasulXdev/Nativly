'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
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
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">Müəllimlər</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {isLoading ? 'Yüklənir...' : `${tutors.length}+ müəllim tapıldı`}
        </p>
      </div>

      {/* Search + Mobile filter toggle */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Müəllim axtar..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Mobile filter sheet */}
        <Sheet>
          <SheetTrigger className="lg:hidden inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 h-10 text-sm font-medium hover:bg-accent transition-colors">
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

      <div className="flex gap-6">
        {/* Desktop Filters sidebar */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-4 rounded-2xl border border-border p-5">
            <TutorFilters filters={filters} onChange={setFilters} />
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
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
