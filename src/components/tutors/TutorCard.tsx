'use client'

import { Heart, MapPin, Video, Zap, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from '@/i18n/navigation'
import { cn, getInitials } from '@/lib/utils'
import OnlineStatus from '@/components/shared/OnlineStatus'
import type { TutorWithProfile } from '@/lib/types'
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites'
import { useAuth } from '@/hooks/useAuth'

interface TutorCardProps {
  tutor: TutorWithProfile
}

export default function TutorCard({ tutor }: TutorCardProps) {
  const profile = (tutor as any).profiles
  const languages: any[] = (tutor as any).user_languages ?? []
  const { user } = useAuth()
  const { data: favorites = [] } = useFavorites()
  const { mutate: toggleFav, isPending } = useToggleFavorite()

  const isFav = favorites.includes(tutor.id)
  const isOnline = profile?.is_online ?? false

  const teachingLangs = languages
    .filter((ul) => ul.is_teaching)
    .map((ul) => ul.languages)
    .filter(Boolean)

  const specs = tutor.specializations?.slice(0, 3) ?? []

  return (
    <div className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 flex flex-col">
      {/* Top gradient strip */}
      <div className="h-1 w-full gradient-bg" />

      <div className="p-5 flex flex-col flex-1">
        {/* Favorite button */}
        {user && (
          <button
            onClick={() => toggleFav({ tutorId: tutor.id, isFav })}
            disabled={isPending}
            className={cn(
              'absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-200',
              isFav
                ? 'text-rose-400 bg-rose-500/15 shadow-sm'
                : 'text-muted-foreground hover:text-rose-400 hover:bg-rose-500/15 opacity-0 group-hover:opacity-100'
            )}
            aria-label={isFav ? 'Seçilmişlərdən sil' : 'Seçilmişlərə əlavə et'}
          >
            <Heart className={cn('h-4 w-4', isFav && 'fill-current')} />
          </button>
        )}

        {/* Header: avatar + name */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="relative shrink-0">
            <Avatar className="h-14 w-14 ring-2 ring-white/10 group-hover:ring-primary/40 transition-all duration-300">
              <AvatarImage src={profile?.avatar_url ?? ''} alt={profile?.full_name} />
              <AvatarFallback className="gradient-bg text-white font-bold text-base">
                {getInitials(profile?.full_name ?? '?')}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 p-0.5 bg-card rounded-full">
              <OnlineStatus isOnline={isOnline} />
            </div>
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="font-bold text-base leading-tight truncate group-hover:text-primary transition-colors">
              {profile?.full_name}
            </h3>
            {profile?.country && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">
                  {profile.city ? `${profile.city}, ` : ''}{profile.country}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 mt-1.5">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-amber-400">
                {(tutor.average_rating ?? 0).toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({tutor.total_reviews ?? 0} rəy)
              </span>
            </div>
          </div>
        </div>

        {/* Headline */}
        {tutor.headline && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {tutor.headline}
          </p>
        )}

        {/* Teaching languages */}
        {teachingLangs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {teachingLangs.map((lang) => (
              <Badge key={lang.id} variant="secondary" className="text-xs gap-1.5 py-0.5 font-medium">
                <span>{lang.flag_emoji}</span>
                {lang.name_az}
              </Badge>
            ))}
          </div>
        )}

        {/* Specializations */}
        {specs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {specs.map((spec) => (
              <span
                key={spec}
                className="text-xs px-2 py-0.5 rounded-full border border-border/70 text-muted-foreground"
              >
                {spec}
              </span>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground mb-4">
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

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2 pt-4 border-t border-border/50">
          <Link href={`/tutors/${tutor.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full h-8 text-xs rounded-full border-border/70">
              Profil
            </Button>
          </Link>
          <Link href={`/tutors/${tutor.id}?book=1`} className="flex-1">
            <Button size="sm" className="w-full h-8 text-xs rounded-full gradient-bg border-0 text-white shadow-md">
              Rezerv et
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
