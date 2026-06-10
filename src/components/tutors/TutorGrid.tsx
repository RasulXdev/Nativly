'use client'

import { useRef, useCallback } from 'react'
import { Loader2, Star, MapPin, Video, Zap, Lock } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import TutorCard from './TutorCard'
import type { TutorWithProfile } from '@/lib/types'

// Demo tutors shown when no real data is available
const DEMO_TUTORS: TutorWithProfile[] = ([
  {
    id: 'demo-1', average_rating: 4.9, total_reviews: 342, total_lessons: 1250,
    instant_booking: true, headline: 'Native İngilis dili müəllimi, CELTA sertifikatlı. İş ingilis dili üzrə 8+ il təcrübə.',
    specializations: ['IELTS', 'Business', 'Conversation'],
    profiles: { full_name: 'Sarah Mitchell', country: 'United Kingdom', city: 'London', is_online: true, avatar_url: null },
    user_languages: [{ is_teaching: true, languages: { flag_emoji: '🇬🇧', name_az: 'İngilis' } }],
  },
  {
    id: 'demo-2', average_rating: 4.8, total_reviews: 218, total_lessons: 890,
    instant_booking: false, headline: 'Peşəkar fransız dili müəllimi. Universitetdə dil psixologiyası üzrə təhsil almışam.',
    specializations: ['Grammar', 'Academic', 'Conversation'],
    profiles: { full_name: 'Antoine Dupont', country: 'France', city: 'Paris', is_online: false, avatar_url: null },
    user_languages: [{ is_teaching: true, languages: { flag_emoji: '🇫🇷', name_az: 'Fransız' } }],
  },
  {
    id: 'demo-3', average_rating: 5.0, total_reviews: 501, total_lessons: 2100,
    instant_booking: true, headline: 'Alman dili üzrə ekspert. Goethe sertifikatı hazırlığı mütəxəssisi.',
    specializations: ['IELTS', 'Kids', 'Grammar'],
    profiles: { full_name: 'Lena Müller', country: 'Germany', city: 'Berlin', is_online: true, avatar_url: null },
    user_languages: [{ is_teaching: true, languages: { flag_emoji: '🇩🇪', name_az: 'Alman' } }],
  },
  {
    id: 'demo-4', average_rating: 4.7, total_reviews: 183, total_lessons: 650,
    instant_booking: true, headline: 'İspan dili həvəskarı — Latın Amerikası aksentini sevənlər üçün.',
    specializations: ['Conversation', 'Business', 'Kids'],
    profiles: { full_name: 'María González', country: 'Spain', city: 'Madrid', is_online: true, avatar_url: null },
    user_languages: [{ is_teaching: true, languages: { flag_emoji: '🇪🇸', name_az: 'İspan' } }],
  },
  {
    id: 'demo-5', average_rating: 4.9, total_reviews: 427, total_lessons: 1680,
    instant_booking: false, headline: 'Rus dili müəllimi, 10 il pedaqoji staj. Ədəbiyyat sevənlər üçün xüsusi proqramlar.',
    specializations: ['Academic', 'Grammar', 'Conversation'],
    profiles: { full_name: 'Aleksei Volkov', country: 'Russia', city: 'Moscow', is_online: false, avatar_url: null },
    user_languages: [{ is_teaching: true, languages: { flag_emoji: '🇷🇺', name_az: 'Rus' } }],
  },
  {
    id: 'demo-6', average_rating: 4.8, total_reviews: 264, total_lessons: 940,
    instant_booking: true, headline: 'Türk dili — başlanğıcdan C1 səviyyəsinə qədər. Sertifikatlı müəllim.',
    specializations: ['Conversation', 'IELTS', 'Business'],
    profiles: { full_name: 'Ayşe Kaya', country: 'Turkey', city: 'Istanbul', is_online: true, avatar_url: null },
    user_languages: [{ is_teaching: true, languages: { flag_emoji: '🇹🇷', name_az: 'Türk' } }],
  },
] as unknown[]) as TutorWithProfile[]

interface TutorGridProps {
  tutors: TutorWithProfile[]
  isLoading: boolean
  isError?: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  onLoadMore: () => void
}

export default function TutorGrid({
  tutors,
  isLoading,
  isError,
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

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">Müəllimlər yüklənmədi. Səhifəni yeniləyin.</p>
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

  // Show demo cards when DB is empty (pre-launch)
  if (!tutors.length) {
    return (
      <div className="space-y-5">
        {/* Coming soon banner */}
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-primary/20 bg-primary/8">
          <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shrink-0">
            <Lock className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Tezliklə açılacaq</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Müəllimlər qeydiyyatdan keçir. Aşağıda nümunə profilləri görə bilərsiniz.
            </p>
          </div>
        </div>

        {/* Demo cards with blur/lock overlay */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {DEMO_TUTORS.map((tutor) => (
              <DemoTutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
          {/* Bottom fade out */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none rounded-b-2xl" />
        </div>
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

// Read-only preview card for demo data
function DemoTutorCard({ tutor }: { tutor: TutorWithProfile }) {
  const profile = (tutor as any).profiles
  const langs: any[] = (tutor as any).user_languages ?? []
  const specs = tutor.specializations?.slice(0, 3) ?? []

  const initials = profile?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?'

  // Consistent color per name
  const hue = (initials.charCodeAt(0) * 37 + initials.charCodeAt(1 % initials.length) * 17) % 360
  const avatarGradient = `hsl(${hue}deg 60% 45%), hsl(${(hue + 40) % 360}deg 55% 38%)`

  return (
    <div className="relative rounded-2xl border border-border bg-card overflow-hidden select-none transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
      {/* Top strip */}
      <div className="h-1 w-full gradient-bg" />
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="relative shrink-0">
            <div
              className="h-14 w-14 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
              style={{ background: `linear-gradient(135deg, ${avatarGradient})` }}
            >
              {initials}
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${profile?.is_online ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="font-bold text-base leading-tight truncate">{profile?.full_name}</h3>
            {profile?.country && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{profile.city}, {profile.country}</span>
              </div>
            )}
            <div className="flex items-center gap-1 mt-1.5">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-amber-400">{(tutor.average_rating ?? 0).toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({tutor.total_reviews})</span>
            </div>
          </div>
        </div>

        {tutor.headline && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{tutor.headline}</p>
        )}

        {langs.filter(l => l.is_teaching).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {langs.filter(l => l.is_teaching).map((ul, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium flex items-center gap-1.5">
                <span>{ul.languages?.flag_emoji}</span>
                {ul.languages?.name_az}
              </span>
            ))}
          </div>
        )}

        {specs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {specs.map((s) => (
              <span key={s} className="text-xs px-2 py-0.5 rounded-full border border-border/70 text-muted-foreground">{s}</span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Video className="h-3 w-3" />
            <span>{tutor.total_lessons} dərs</span>
          </div>
          {tutor.instant_booking && (
            <div className="flex items-center gap-1 text-emerald-400 font-medium">
              <Zap className="h-3 w-3" />
              <span>Ani rezerv</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-border/50">
          <div className="flex-1 h-8 px-3 text-xs rounded-full border border-border/70 flex items-center justify-center text-muted-foreground">Profil</div>
          <div className="flex-1 h-8 px-3 text-xs rounded-full gradient-bg text-white flex items-center justify-center opacity-60">Rezerv et</div>
        </div>
      </div>
    </div>
  )
}
