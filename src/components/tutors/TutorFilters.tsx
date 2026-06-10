'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { TutorFilters } from '@/hooks/useTutors'

const LANGUAGES = [
  { code: 'en', label: 'İngilis', flag: '🇬🇧' },
  { code: 'ru', label: 'Rus', flag: '🇷🇺' },
  { code: 'tr', label: 'Türk', flag: '🇹🇷' },
  { code: 'de', label: 'Alman', flag: '🇩🇪' },
  { code: 'fr', label: 'Fransız', flag: '🇫🇷' },
  { code: 'ar', label: 'Ərəb', flag: '🇸🇦' },
  { code: 'es', label: 'İspan', flag: '🇪🇸' },
]

const SPECIALIZATIONS = ['IELTS', 'Business', 'Kids', 'Conversation', 'Grammar', 'TOEFL', 'Academic']

const SORT_OPTIONS = [
  { value: 'rating', label: 'Reytinq' },
  { value: 'popular', label: 'Populyar' },
  { value: 'newest', label: 'Yeni' },
] as const

interface TutorFiltersProps {
  filters: TutorFilters
  onChange: (f: TutorFilters) => void
}

export default function TutorFilters({ filters, onChange }: TutorFiltersProps) {
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

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <SlidersHorizontal className="h-4 w-4" />
          Filtrlər
        </div>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground"
            onClick={() => onChange({})}
          >
            <X className="h-3 w-3 mr-1" />
            Sıfırla
          </Button>
        )}
      </div>

      {/* Sort */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Sıralama</p>
        <div className="flex flex-wrap gap-1.5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filters, sortBy: opt.value })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filters.sortBy === opt.value || (!filters.sortBy && opt.value === 'rating')
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary/50 hover:text-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Toggles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm cursor-pointer" htmlFor="online-only">İndi onlayn</Label>
          <Switch
            id="online-only"
            checked={filters.onlineOnly ?? false}
            onCheckedChange={(v) => onChange({ ...filters, onlineOnly: v })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-sm cursor-pointer" htmlFor="instant">Ani rezerv</Label>
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
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Dil</p>
        <div className="flex flex-wrap gap-1.5">
          {LANGUAGES.map((lang) => {
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
                {lang.label}
              </button>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Minimum rating */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Minimum reytinq</p>
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
              {r == null ? 'Hamısı' : `${r}+★`}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Specializations */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">İxtisas</p>
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
                {spec}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
