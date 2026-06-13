'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
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
import { Loader2 } from 'lucide-react'
import { getInitials, cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Link } from '@/i18n/navigation'

export default function TutorProfilePage() {
  const t = useTranslations('tutors.profile')
  const ts = useTranslations('specs')
  const tc = useTranslations('common')
  const tNav = useTranslations('nav')
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const router = useRouter()
  const locale = useLocale()
  const [bookingOpen, setBookingOpen] = useState(searchParams.get('book') === '1')
  const [sendingMessage, setSendingMessage] = useState(false)

  const { data: tutor, isLoading } = useTutor(id)
  const { data: favorites = [] } = useFavorites()
  const { mutate: toggleFav } = useToggleFavorite()

  const profile = (tutor as any)?.profiles
  const languages: any[] = (tutor as any)?.user_languages ?? []
  const availability: any[] = (tutor as any)?.tutor_availability ?? []
  const scheduleMode: string = (tutor as any)?.schedule_mode ?? 'weekly'

  const isFav = favorites.includes(id)
  const isOnline = profile?.is_online ?? false

  const teachingLangs = languages.filter((ul) => ul.is_teaching).map((ul) => ul.languages).filter(Boolean)

  const handleSendMessage = async () => {
    if (!user || !profile?.id) return
    setSendingMessage(true)
    try {
      const res = await fetch('/api/messages/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: profile.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push(`/${locale}/messages?c=${data.conversationId}`)
    } catch {
      toast.error(tc('error'))
    } finally {
      setSendingMessage(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          <div className="space-y-5">
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="h-36 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!tutor) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">{t('notFound2')}</p>
        <Link href="/tutors">
          <Button variant="outline" className="mt-4 rounded-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {tc('back')}
          </Button>
        </Link>
      </div>
    )
  }

  const stats = [
    {
      icon: Star,
      value: (tutor.average_rating ?? 0).toFixed(1),
      label: `${tutor.total_reviews ?? 0} ${t('reviewsCount')}`,
      accent: 'text-amber-400',
      glow: 'bg-amber-400/10 ring-1 ring-amber-400/20',
    },
    {
      icon: Video,
      value: String(tutor.total_lessons ?? 0),
      label: t('totalLesson'),
      accent: 'text-sky-400',
      glow: 'bg-sky-400/10 ring-1 ring-sky-400/20',
    },
    {
      icon: CheckCircle2,
      value: `${tutor.completion_rate ?? 100}%`,
      label: t('completion'),
      accent: 'text-emerald-400',
      glow: 'bg-emerald-400/10 ring-1 ring-emerald-400/20',
    },
    {
      icon: Clock,
      value: `<5 ${t('min')}`,
      label: t('responseTime'),
      accent: 'text-violet-400',
      glow: 'bg-violet-400/10 ring-1 ring-violet-400/20',
    },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/tutors"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        {tNav('tutors')}
      </Link>

      {/* ─── Hero Card ─── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card">
        {/* Tall gradient banner */}
        <div className="relative h-36 sm:h-44">
          <div className="absolute inset-0 gradient-bg" />
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 70% at 20% 0%, oklch(0.45 0.22 270 / 0.5) 0%, transparent 60%),
                radial-gradient(ellipse 60% 60% at 90% 80%, oklch(0.30 0.15 250 / 0.4) 0%, transparent 50%)
              `,
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />

          {/* Favorite */}
          {user && (
            <button
              onClick={() => toggleFav({ tutorId: id, isFav })}
              className={cn(
                'absolute top-5 right-5 z-10 p-2.5 rounded-xl backdrop-blur-sm transition-all duration-200',
                isFav
                  ? 'bg-white/20 text-white ring-1 ring-white/30'
                  : 'bg-white/10 text-white/70 ring-1 ring-white/15 hover:bg-white/20 hover:text-white'
              )}
            >
              <Heart className={cn('h-4 w-4', isFav && 'fill-current')} />
            </button>
          )}
        </div>

        {/* Profile info */}
        <div className="relative px-6 sm:px-8 pb-7">
          {/* Avatar */}
          <div className="flex items-end gap-5 -mt-12 mb-5">
            <div className="relative shrink-0">
              <div className="p-1 rounded-2xl bg-card shadow-2xl shadow-black/40">
                <Avatar className="h-24 w-24 rounded-xl">
                  <AvatarImage src={profile?.avatar_url ?? ''} alt={profile?.full_name} className="rounded-xl" />
                  <AvatarFallback className="gradient-bg text-white text-2xl font-extrabold rounded-xl">
                    {getInitials(profile?.full_name ?? '?')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 bg-card rounded-full shadow-lg">
                <OnlineStatus isOnline={isOnline} size="md" />
              </div>
            </div>

            <div className="flex-1 min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-extrabold tracking-tight leading-tight">
                  {profile?.full_name}
                </h1>
                {tutor.instant_booking && (
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25 gap-1 text-[11px] font-semibold px-2.5 py-0.5">
                    <Zap className="h-3 w-3" />
                    {t('instantBadge')}
                  </Badge>
                )}
              </div>
              {profile?.country && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground/60" />
                  {profile.city ? `${profile.city}, ` : ''}{profile.country}
                </div>
              )}
              {tutor.headline && (
                <p className="text-sm text-muted-foreground/80 mt-2.5 leading-relaxed max-w-xl">
                  {tutor.headline}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={cn('rounded-xl px-4 py-3 flex items-center gap-3', stat.glow)}
              >
                <stat.icon className={cn('h-5 w-5 shrink-0', stat.accent)} />
                <div className="min-w-0">
                  <p className="text-base font-bold leading-none">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-1 truncate">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Languages */}
          {teachingLangs.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {teachingLangs.map((lang: any) => (
                <Badge
                  key={lang.id}
                  variant="secondary"
                  className="gap-1.5 text-sm py-1.5 px-3 bg-white/[0.05] border-white/[0.08] hover:bg-white/[0.08] transition-colors"
                >
                  <span className="text-base leading-none">{lang.flag_emoji}</span>
                  {lang.name_az}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Content + Sidebar ─── */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* Main */}
        <div className="space-y-5">
          {/* Video */}
          {tutor.video_intro_url && (
            <ProfileSection icon={Play} title={t('videoIntro')}>
              <video
                src={tutor.video_intro_url}
                controls
                className="w-full rounded-xl aspect-video object-cover bg-black/50"
              />
            </ProfileSection>
          )}

          {/* About */}
          {tutor.about && (
            <ProfileSection icon={Users} title={t('about')}>
              <p className="text-sm text-muted-foreground leading-[1.75] whitespace-pre-line">
                {tutor.about}
              </p>
            </ProfileSection>
          )}

          {/* Specializations */}
          {(tutor.specializations?.length ?? 0) > 0 && (
            <ProfileSection icon={TrendingUp} title={t('specializations')}>
              <div className="flex flex-wrap gap-2">
                {tutor.specializations!.map((spec) => (
                  <span
                    key={spec}
                    className="text-sm px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] font-medium text-foreground/80 hover:bg-white/[0.07] transition-colors"
                  >
                    {ts.has(spec) ? ts(spec) : spec}
                  </span>
                ))}
              </div>
            </ProfileSection>
          )}

          {/* Education */}
          {(tutor.education?.length ?? 0) > 0 && (
            <ProfileSection icon={GraduationCap} title={t('education')}>
              <ul className="space-y-3">
                {tutor.education!.map((edu, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-foreground/85">{edu}</span>
                  </li>
                ))}
              </ul>
            </ProfileSection>
          )}

          {/* Certificates */}
          {(tutor.certificates?.length ?? 0) > 0 && (
            <ProfileSection
              icon={Award}
              title={t('certificates')}
              iconClassName="bg-gradient-to-br from-amber-500 to-orange-600"
            >
              <div className="flex flex-wrap gap-2">
                {tutor.certificates!.map((cert) => (
                  <Badge
                    key={cert}
                    variant="secondary"
                    className="gap-1.5 text-sm py-1.5 px-3 bg-amber-500/8 border-amber-500/15 text-foreground/85"
                  >
                    <Award className="h-3.5 w-3.5 text-amber-500" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </ProfileSection>
          )}

          {/* Weekly Schedule */}
          {scheduleMode === 'weekly' && availability.filter((a) => a.is_active && a.day_of_week).length > 0 && (
            <ProfileSection icon={CalendarDays} title={t('weeklySchedule')}>
              <AvailabilityGrid slots={availability.filter((a) => a.is_active && a.day_of_week)} />
            </ProfileSection>
          )}
          {scheduleMode === 'monthly' && (
            <ProfileSection icon={CalendarDays} title={t('weeklySchedule')}>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 text-primary/60" />
                <span>{t('calendarBasedSchedule')}</span>
              </div>
            </ProfileSection>
          )}

          {/* Reviews */}
          <div className="rounded-2xl border border-white/[0.06] bg-card p-6">
            <TutorReviews
              tutorId={id}
              averageRating={tutor.average_rating ?? 0}
              totalReviews={tutor.total_reviews ?? 0}
            />
          </div>
        </div>

        {/* ─── Sidebar ─── */}
        <div className="lg:sticky lg:top-4">
          <div className="rounded-2xl border border-white/[0.06] bg-card overflow-hidden">
            {/* Header */}
            <div className="relative px-6 py-5">
              <div className="absolute inset-0 gradient-bg opacity-90" />
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse 80% 100% at 100% 0%, oklch(0.5 0.2 270 / 0.35) 0%, transparent 60%)',
                }}
              />
              <div className="relative z-10">
                <span className="text-xl font-extrabold text-white">{t('subscriptionLesson')}</span>
                <p className="text-xs text-white/65 mt-1.5 leading-relaxed">
                  {t('subscriptionDesc')}
                </p>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Mini Stats */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: t('lessonsStat'), value: tutor.total_lessons ?? 0 },
                  { label: t('reviewsStat'), value: tutor.total_reviews ?? 0 },
                  { label: t('experienceStat'), value: `${tutor.years_experience ?? 0} ${t('yearsUnit')}` },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06] p-3 text-center">
                    <p className="text-lg font-extrabold leading-none">{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground mt-1.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              <Separator className="bg-white/[0.06]" />

              {/* CTAs */}
              <div className="space-y-2.5">
                <Button
                  className="w-full rounded-xl gradient-bg border-0 text-white h-11 font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.01] transition-all duration-200"
                  onClick={() => setBookingOpen(true)}
                >
                  {t('bookLesson')}
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-xl h-11 border-white/[0.08] hover:bg-white/[0.04]"
                  disabled={!user || sendingMessage}
                  onClick={handleSendMessage}
                >
                  {sendingMessage
                    ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    : <MessageSquare className="h-4 w-4 mr-2" />
                  }
                  {t('sendMessage')}
                </Button>
              </div>

              {tutor.instant_booking && (
                <div className="flex items-start gap-2.5 text-xs bg-emerald-500/8 border border-emerald-500/15 rounded-xl p-3.5">
                  <div className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="h-3 w-3 text-emerald-400" />
                  </div>
                  <span className="text-emerald-300/90 leading-relaxed">{t('instantSupports')}</span>
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


/* ─── Reusable Section Wrapper ─── */

function ProfileSection({
  icon: Icon,
  title,
  iconClassName,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  iconClassName?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-card p-6">
      <h2 className="text-base font-bold mb-4 flex items-center gap-2.5">
        <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center', iconClassName ?? 'gradient-bg')}>
          <Icon className="h-3.5 w-3.5 text-white" />
        </div>
        {title}
      </h2>
      {children}
    </div>
  )
}


/* ─── Availability Grid ─── */

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DAY_KEYS: Record<string, string> = {
  monday: 'mon', tuesday: 'tue', wednesday: 'wed', thursday: 'thu', friday: 'fri', saturday: 'sat', sunday: 'sun',
}

function AvailabilityGrid({ slots }: { slots: any[] }) {
  const td = useTranslations('tutors.days')
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
            <span className={cn(
              'text-[11px] font-semibold tracking-wide',
              hasSlots ? 'text-foreground' : 'text-muted-foreground/40'
            )}>
              {td(DAY_KEYS[day])}
            </span>
            <div className={cn(
              'w-full rounded-lg p-1.5 min-h-[52px] flex flex-col gap-1 transition-colors',
              hasSlots
                ? 'bg-primary/8 ring-1 ring-primary/20'
                : 'bg-white/[0.02] ring-1 ring-white/[0.04]'
            )}>
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
