'use client'

import { useTranslations } from 'next-intl'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { TutorFilters } from '@/hooks/useTutors'
import { SPECIALIZATIONS, TEACHING_LANGUAGES } from '@/lib/constants/teaching'

const SORT_VALUES = ['rating', 'popular', 'newest'] as const

interface TutorFiltersProps {
  filters: TutorFilters
  onChange: (f: TutorFilters) => void
}

export default function TutorFilters({ filters, onChange }: TutorFiltersProps) {
  const t = useTranslations('tutors.filter')
  const tl = useTranslations('langNames')
  const ts = useTranslations('specs')
  const toggleLang = (code: string) => {
    const langs = filters.languages ?? []
    onChange({
      ...filters,
      languages: langs.includes(code) ? langs.filter((l) => l !== code) : [...langs, code],
    })
  }

  const toggleSpec = (spec: string) => {
    const specs = filters.specializations ?? []
    onChange({
      ...filters,
      specializations: specs.includes(spec) ? specs.filter((s) => s !== spec) : [...specs, spec],
    })
  }

  const hasFilters =
    (filters.languages?.length ?? 0) > 0 ||
    (filters.specializations?.length ?? 0) > 0 ||
    filters.onlineOnly ||
    filters.instantBooking ||
    filters.minRating != null

  const sortLabel = (v: string) =>
    v === 'rating' ? t('sortRating') : v === 'popular' ? t('sortPopular') : t('sortNewest')

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <SlidersHorizontal className="h-4 w-4" />
          {t('title')}
        </div>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground"
            onClick={() => onChange({})}
          >
            <X className="h-3 w-3 mr-1" />
            {t('reset')}
          </Button>
        )}
      </div>

      {/* Sort */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('sort')}</p>
        <div className="flex flex-wrap gap-1.5">
          {SORT_VALUES.map((value) => (
            <button
              key={value}
              onClick={() => onChange({ ...filters, sortBy: value })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filters.sortBy === value || (!filters.sortBy && value === 'rating')
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary/50 hover:text-primary'
              }`}
            >
              {sortLabel(value)}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Toggles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm cursor-pointer" htmlFor="online-only">{t('onlineNow')}</Label>
          <Switch
            id="online-only"
            checked={filters.onlineOnly ?? false}
            onCheckedChange={(v) => onChange({ ...filters, onlineOnly: v })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-sm cursor-pointer" htmlFor="instant">{t('instantBooking')}</Label>
          <Switch
            id="instant"
            checked={filters.instantBooking ?? false}
            onCheckedChange={(v) => onChange({ ...filters, instantBooking: v })}
          />
        </div>
      </div>

      <Separator />

      {/* Languages */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('language')}</p>
        <div className="flex flex-wrap gap-1.5">
          {TEACHING_LANGUAGES.filter((l) => l.available).map((lang) => {
            const active = filters.languages?.includes(lang.code)
            return (
              <button
                key={lang.code}
                onClick={() => toggleLang(lang.code)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span>{lang.flag}</span>
                {tl(lang.code)}
              </button>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Minimum rating */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('minRating')}</p>
        <div className="flex flex-wrap gap-1.5">
          {[null, 3, 4, 4.5].map((r) => (
            <button
              key={String(r)}
              onClick={() => onChange({ ...filters, minRating: r ?? undefined })}
              className={`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                (filters.minRating ?? null) === r
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {r == null ? t('all') : `${r}+★`}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Specializations */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('specialization')}</p>
        <div className="flex flex-wrap gap-1.5">
          {SPECIALIZATIONS.map((spec) => {
            const active = filters.specializations?.includes(spec)
            return (
              <button
                key={spec}
                onClick={() => toggleSpec(spec)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {ts(spec)}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
