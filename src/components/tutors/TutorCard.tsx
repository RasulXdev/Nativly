'use client'

import { Heart, MapPin, Video, Clock, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from '@/i18n/navigation'
import { cn, getInitials } from '@/lib/utils'
import Rating from '@/components/shared/Rating'
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
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      <CardContent className="p-5">
        {/* Favorite button */}
        {user && (
          <button
            onClick={() => toggleFav({ tutorId: tutor.id, isFav })}
            disabled={isPending}
            className={cn(
              'absolute top-4 right-4 z-10 p-1.5 rounded-full transition-all',
              isFav
                ? 'text-rose-500 bg-rose-50'
                : 'text-muted-foreground hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100'
            )}
            aria-label={isFav ? 'Seçilmişlərdən sil' : 'Seçilmişlərə əlavə et'}
          >
            <Heart className={cn('h-4 w-4', isFav && 'fill-current')} />
          </button>
        )}

        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative shrink-0">
            <Avatar className="h-14 w-14">
              <AvatarImage src={profile?.avatar_url ?? ''} alt={profile?.full_name} />
              <AvatarFallback className="gradient-bg text-white font-semibold">
                {getInitials(profile?.full_name ?? '?')}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 p-0.5 bg-background rounded-full">
              <OnlineStatus isOnline={isOnline} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-tight truncate">{profile?.full_name}</h3>
            {profile?.country && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="h-3 w-3" />
                <span>{profile.city ? `${profile.city}, ` : ''}{profile.country}</span>
              </div>
            )}
            <Rating
              value={tutor.average_rating ?? 0}
              count={tutor.total_reviews ?? 0}
              size="sm"
              className="mt-1"
            />
          </div>
        </div>

        {/* Headline */}
        {tutor.headline && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{tutor.headline}</p>
        )}

        {/* Languages */}
        {teachingLangs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {teachingLangs.map((lang) => (
              <Badge key={lang.id} variant="secondary" className="text-xs gap-1 py-0.5">
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
              <Badge key={spec} variant="outline" className="text-xs py-0.5 font-normal">
                {spec}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Video className="h-3 w-3" />
            <span>{tutor.total_lessons} dərs</span>
          </div>
          {tutor.instant_booking && (
            <div className="flex items-center gap-1 text-emerald-600">
              <Zap className="h-3 w-3" />
              <span>Ani rezerv</span>
            </div>
          )}
          {tutor.trial_rate != null && (
            <div className="flex items-center gap-1 text-amber-600">
              <span>Sınaq: ${tutor.trial_rate}</span>
            </div>
          )}
        </div>

        {/* Price + Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div>
            <span className="text-lg font-bold text-primary">${tutor.hourly_rate}</span>
            <span className="text-xs text-muted-foreground">/saat</span>
          </div>
          <div className="flex gap-2">
            <Link href={`/tutors/${tutor.id}`}>
              <Button variant="outline" size="sm" className="h-8 text-xs rounded-full">
                Profil
              </Button>
            </Link>
            <Link href={`/tutors/${tutor.id}?book=1`}>
              <Button size="sm" className="h-8 text-xs rounded-full gradient-bg border-0 text-white">
                Rezerv et
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
