'use client'

import { useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import {
  MapPin, Clock, CheckCircle2, Video, Star, Heart, MessageSquare,
  GraduationCap, Award, Zap, ArrowLeft, Users, TrendingUp, CalendarDays, Play
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useTutor } from '@/hooks/useTutors'
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites'
import { useAuth } from '@/hooks/useAuth'
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
      <div className="max-w-4xl mx-auto space-y-5">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-52 w-full rounded-2xl" />
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
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
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Back link */}
      <Link
        href="/tutors"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Müəllimlər
      </Link>

      {/* Hero profile card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
        {/* Gradient header strip */}
        <div className="h-24 gradient-bg relative">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 60% 100% at 100% 0%, rgba(255,255,255,0.1) 0%, transparent 70%)'
          }} />
          {/* Favorite button on banner */}
          {user && (
            <button
              onClick={() => toggleFav({ tutorId: id, isFav })}
              className={cn(
                'absolute top-4 right-4 p-2.5 rounded-full border transition-all duration-200',
                isFav
                  ? 'border-white/50 bg-white/20 text-white'
                  : 'border-white/30 bg-white/10 text-white hover:bg-white/20'
              )}
            >
              <Heart className={cn('h-4 w-4', isFav && 'fill-current')} />
            </button>
          )}
        </div>

        <div className="px-6 pb-6">
          {/* Avatar overlapping header */}
          <div className="flex items-end gap-4 -mt-10 mb-5">
            <div className="relative shrink-0">
              <Avatar className="h-20 w-20 ring-4 ring-card shadow-xl">
                <AvatarImage src={profile?.avatar_url ?? ''} alt={profile?.full_name} />
                <AvatarFallback className="gradient-bg text-white text-2xl font-extrabold">
                  {getInitials(profile?.full_name ?? '?')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 p-0.5 bg-card rounded-full shadow">
                <OnlineStatus isOnline={isOnline} size="md" />
              </div>
            </div>

            <div className="mb-1 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight">{profile?.full_name}</h1>
                {tutor.instant_booking && (
                  <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/12 gap-1 text-xs">
                    <Zap className="h-3 w-3" />
                    Ani rezerv
                  </Badge>
                )}
              </div>
              {profile?.country && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.city ? `${profile.city}, ` : ''}{profile.country}
                </div>
              )}
            </div>
          </div>

          {/* Headline */}
          {tutor.headline && (
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{tutor.headline}</p>
          )}

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                icon: Star,
                value: (tutor.average_rating ?? 0).toFixed(1),
                label: `${tutor.total_reviews ?? 0} rəy`,
                color: 'text-amber-400',
                bg: 'bg-amber-500/12',
              },
              {
                icon: Video,
                value: String(tutor.total_lessons ?? 0),
                label: 'Ümumi dərs',
                color: 'text-blue-400',
                bg: 'bg-blue-500/12',
              },
              {
                icon: CheckCircle2,
                value: `${tutor.completion_rate ?? 100}%`,
                label: 'Tamamlama',
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/12',
              },
              {
                icon: Clock,
                value: `${tutor.response_time_minutes ?? '<5'} dəq`,
                label: 'Cavab müddəti',
                color: 'text-violet-400',
                bg: 'bg-violet-500/12',
              },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl ${stat.bg} px-3 py-2.5 flex items-center gap-2.5`}>
                <stat.icon className={`h-4 w-4 ${stat.color} shrink-0`} />
                <div>
                  <p className="text-sm font-bold leading-tight">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Teaching languages */}
          {teachingLangs.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {teachingLangs.map((lang: any) => (
                <Badge key={lang.id} variant="secondary" className="gap-1.5 text-sm py-1">
                  <span>{lang.flag_emoji}</span>
                  {lang.name_az}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video intro */}
          {tutor.video_intro_url && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-base font-bold mb-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md gradient-bg flex items-center justify-center">
                  <Play className="h-3 w-3 text-white" />
                </div>
                Video tanıtım
              </h2>
              <video
                src={tutor.video_intro_url}
                controls
                className="w-full rounded-xl max-h-64 object-cover bg-black"
              />
            </div>
          )}

          {/* About */}
          {tutor.about && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-base font-bold mb-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md gradient-bg flex items-center justify-center">
                  <Users className="h-3 w-3 text-white" />
                </div>
                Haqqında
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {tutor.about}
              </p>
            </div>
          )}

          {/* Specializations */}
          {(tutor.specializations?.length ?? 0) > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-base font-bold mb-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md gradient-bg flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 text-white" />
                </div>
                İxtisaslar
              </h2>
              <div className="flex flex-wrap gap-2">
                {tutor.specializations!.map((spec) => (
                  <span
                    key={spec}
                    className="text-sm px-3 py-1 rounded-full border border-border bg-muted/40 font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {(tutor.education?.length ?? 0) > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-base font-bold mb-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md gradient-bg flex items-center justify-center">
                  <GraduationCap className="h-3 w-3 text-white" />
                </div>
                Təhsil
              </h2>
              <ul className="space-y-2.5">
                {tutor.education!.map((edu, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{edu}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certificates */}
          {(tutor.certificates?.length ?? 0) > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-base font-bold mb-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Award className="h-3 w-3 text-white" />
                </div>
                Sertifikatlar
              </h2>
              <div className="flex flex-wrap gap-2">
                {tutor.certificates!.map((cert) => (
                  <Badge key={cert} variant="secondary" className="gap-1.5 text-sm py-1">
                    <Award className="h-3 w-3 text-amber-500" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Availability schedule */}
          {availability.filter((a) => a.is_active).length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md gradient-bg flex items-center justify-center">
                  <CalendarDays className="h-3 w-3 text-white" />
                </div>
                Həftəlik cədvəl
              </h2>
              <AvailabilityGrid slots={availability.filter((a) => a.is_active)} />
            </div>
          )}

          {/* Reviews */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <TutorReviews
              tutorId={id}
              averageRating={tutor.average_rating ?? 0}
              totalReviews={tutor.total_reviews ?? 0}
            />
          </div>
        </div>

        {/* Booking sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-2xl border border-border bg-card overflow-hidden">
            {/* Price header */}
            <div className="gradient-bg px-5 py-4 text-white">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">${tutor.hourly_rate}</span>
                <span className="text-sm text-white/70">/saat</span>
              </div>
              {tutor.trial_rate != null && (
                <p className="text-xs text-white/80 mt-1">
                  Sınaq dərsi: <span className="font-bold text-amber-300">${tutor.trial_rate}</span>
                </p>
              )}
            </div>

            <div className="p-5 space-y-4">
              {/* Mini stats */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'Dərslər', value: tutor.total_lessons ?? 0 },
                  { label: 'Tələbələr', value: Math.floor((tutor.total_lessons ?? 0) * 0.7) },
                  { label: 'Rəylər', value: tutor.total_reviews ?? 0 },
                  { label: 'Təcrübə', value: `${tutor.years_experience ?? 0} il` },
                ].map((stat) => (
                  <div key={stat.label} className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-base font-extrabold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* CTA buttons */}
              <div className="space-y-2.5">
                <Button
                  className="w-full rounded-xl gradient-bg border-0 text-white h-11 font-semibold shadow-md btn-glow"
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
                <div className="flex items-start gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                  <Zap className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>Bu müəllim ani rezervi dəstəkləyir — dərsiniz dərhal təsdiqlənir</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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

const DAY_LABELS: Record<string, string> = {
  monday: 'B.e',
  tuesday: 'Ç.a',
  wednesday: 'Çər',
  thursday: 'C.a',
  friday: 'Cüm',
  saturday: 'Şnb',
  sunday: 'Baz',
}

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

function AvailabilityGrid({ slots }: { slots: any[] }) {
  const byDay = DAY_ORDER.reduce<Record<string, any[]>>((acc, d) => {
    acc[d] = slots.filter((s) => s.day_of_week === d)
    return acc
  }, {} as Record<string, any[]>)

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {DAY_ORDER.map((day) => {
        const daySlots = byDay[day]
        const hasSlots = daySlots.length > 0
        return (
          <div key={day} className="flex flex-col items-center gap-1.5">
            <span className={`text-[11px] font-semibold ${hasSlots ? 'text-foreground' : 'text-muted-foreground/50'}`}>
              {DAY_LABELS[day]}
            </span>
            <div className={`w-full rounded-lg p-1.5 min-h-[52px] flex flex-col gap-1 ${hasSlots ? 'bg-primary/10 border border-primary/20' : 'bg-white/4 border border-border/30'}`}>
              {daySlots.map((slot, i) => (
                <span key={i} className="text-[9px] font-medium text-primary text-center leading-tight">
                  {slot.start_time.slice(0, 5)}–{slot.end_time.slice(0, 5)}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
