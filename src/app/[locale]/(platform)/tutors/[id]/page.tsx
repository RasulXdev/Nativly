'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import {
  MapPin, Clock, CheckCircle2, Video, Star, Heart, MessageSquare,
  GraduationCap, Award, Zap, ArrowLeft
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useTutor } from '@/hooks/useTutors'
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites'
import { useAuth } from '@/hooks/useAuth'
import Rating from '@/components/shared/Rating'
import OnlineStatus from '@/components/shared/OnlineStatus'
import TutorReviews from '@/components/tutors/TutorReviews'
import BookingModal from '@/components/tutors/BookingModal'
import { getInitials, cn } from '@/lib/utils'
import { Link } from '@/i18n/navigation'

export default function TutorProfilePage() {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const [bookingOpen, setBookingOpen] = useState(searchParams.get('book') === '1')

  const { data: tutor, isLoading } = useTutor(id)
  const { data: favorites = [] } = useFavorites()
  const { mutate: toggleFav } = useToggleFavorite()

  const profile = (tutor as any)?.profiles
  const languages: any[] = (tutor as any)?.user_languages ?? []
  const availability: any[] = (tutor as any)?.tutor_availability ?? []

  const isFav = favorites.includes(id)
  const isOnline = profile?.is_online ?? false

  const teachingLangs = languages.filter((ul) => ul.is_teaching).map((ul) => ul.languages).filter(Boolean)

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex gap-5">
          <Skeleton className="h-24 w-24 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-60 w-full rounded-2xl" />
      </div>
    )
  }

  if (!tutor) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Müəllim tapılmadı</p>
        <Link href="/tutors">
          <Button variant="outline" className="mt-4 rounded-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri qayıt
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back */}
      <Link href="/tutors" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Müəllimlər
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header card */}
          <div className="rounded-2xl border border-border p-6">
            <div className="flex items-start gap-5">
              <div className="relative shrink-0">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url ?? ''} alt={profile?.full_name} />
                  <AvatarFallback className="gradient-bg text-white text-xl font-bold">
                    {getInitials(profile?.full_name ?? '?')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 p-0.5 bg-background rounded-full">
                  <OnlineStatus isOnline={isOnline} size="md" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h1 className="text-xl font-bold">{profile?.full_name}</h1>
                    {profile?.country && (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {profile.city ? `${profile.city}, ` : ''}{profile.country}
                      </div>
                    )}
                  </div>
                  {user && (
                    <button
                      onClick={() => toggleFav({ tutorId: id, isFav })}
                      className={cn(
                        'p-2 rounded-full border transition-all',
                        isFav
                          ? 'border-rose-200 bg-rose-50 text-rose-500'
                          : 'border-border hover:border-rose-300 hover:text-rose-500'
                      )}
                    >
                      <Heart className={cn('h-4 w-4', isFav && 'fill-current')} />
                    </button>
                  )}
                </div>

                {tutor.headline && (
                  <p className="text-sm text-muted-foreground mt-2">{tutor.headline}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <Rating
                    value={tutor.average_rating ?? 0}
                    count={tutor.total_reviews ?? 0}
                    size="md"
                  />
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Video className="h-4 w-4" />
                    <span>{tutor.total_lessons} dərs</span>
                  </div>
                  {tutor.completion_rate != null && (
                    <div className="flex items-center gap-1.5 text-sm text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>%{tutor.completion_rate} tamamlama</span>
                    </div>
                  )}
                  {tutor.response_time_minutes != null && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{tutor.response_time_minutes} dəq cavab müddəti</span>
                    </div>
                  )}
                </div>

                {/* Teaching languages */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {teachingLangs.map((lang: any) => (
                    <Badge key={lang.id} variant="secondary" className="gap-1.5">
                      <span>{lang.flag_emoji}</span>
                      {lang.name_az}
                    </Badge>
                  ))}
                  {tutor.instant_booking && (
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 gap-1">
                      <Zap className="h-3 w-3" />
                      Ani rezerv
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          {tutor.about && (
            <div className="rounded-2xl border border-border p-6">
              <h2 className="text-base font-semibold mb-3">Haqqında</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {tutor.about}
              </p>
            </div>
          )}

          {/* Specializations */}
          {(tutor.specializations?.length ?? 0) > 0 && (
            <div className="rounded-2xl border border-border p-6">
              <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                İxtisaslar
              </h2>
              <div className="flex flex-wrap gap-2">
                {tutor.specializations!.map((spec) => (
                  <Badge key={spec} variant="outline" className="rounded-full">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {(tutor.education?.length ?? 0) > 0 && (
            <div className="rounded-2xl border border-border p-6">
              <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                Təhsil
              </h2>
              <ul className="space-y-2">
                {tutor.education!.map((edu, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    {edu}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certificates */}
          {(tutor.certificates?.length ?? 0) > 0 && (
            <div className="rounded-2xl border border-border p-6">
              <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" />
                Sertifikatlar
              </h2>
              <div className="flex flex-wrap gap-2">
                {tutor.certificates!.map((cert) => (
                  <Badge key={cert} variant="secondary" className="gap-1.5">
                    <Award className="h-3 w-3 text-amber-500" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="rounded-2xl border border-border p-6">
            <TutorReviews
              tutorId={id}
              averageRating={tutor.average_rating ?? 0}
              totalReviews={tutor.total_reviews ?? 0}
            />
          </div>
        </div>

        {/* Booking sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-2xl border border-border p-5 space-y-5">
            {/* Price */}
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-primary">${tutor.hourly_rate}</span>
                <span className="text-sm text-muted-foreground">/saat</span>
              </div>
              {tutor.trial_rate != null && (
                <p className="text-xs text-muted-foreground mt-1">
                  Sınaq dərsi: <span className="font-semibold text-amber-600">${tutor.trial_rate}</span>
                </p>
              )}
            </div>

            <Separator />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 text-center">
              {[
                { label: 'Dərslər', value: tutor.total_lessons },
                { label: 'Tələbələr', value: Math.floor((tutor.total_lessons ?? 0) * 0.7) },
                { label: 'Rəylər', value: tutor.total_reviews },
                { label: 'Təcrübə', value: `${tutor.years_experience ?? 0} il` },
              ].map((stat) => (
                <div key={stat.label} className="bg-muted/50 rounded-xl p-2.5">
                  <p className="text-base font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <Separator />

            {/* CTA */}
            <div className="space-y-2.5">
              <Button
                className="w-full rounded-xl gradient-bg border-0 text-white h-11 font-semibold"
                onClick={() => setBookingOpen(true)}
              >
                Dərs rezerv et
              </Button>
              <Button variant="outline" className="w-full rounded-xl h-11">
                <MessageSquare className="h-4 w-4 mr-2" />
                Mesaj göndər
              </Button>
            </div>

            {tutor.instant_booking && (
              <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 rounded-xl p-3">
                <Zap className="h-3.5 w-3.5 shrink-0" />
                Bu müəllim ani rezervi dəstəkləyir — dərsiniz dərhal təsdiqlənir
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {tutor && (
        <BookingModal
          tutor={tutor}
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </div>
  )
}
