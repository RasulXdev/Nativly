'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Star, ArrowRight, MapPin, GraduationCap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'
import type { FeaturedTutor } from '@/lib/data/landing'

type TutorCard = {
  id: string
  name: string
  flag: string
  country: string
  rating: number
  reviews: number
  lessons: number
  tags: string[]
  online: boolean
}

export default function TutorShowcase({ tutors = [] }: { tutors?: FeaturedTutor[] }) {
  const t = useTranslations('landing.tutorShowcase')
  const tc = useTranslations('tutors.card')

  // Only real featured tutors from the DB — no mock data.
  const filtered: TutorCard[] = tutors.map((t) => ({
    id: t.id,
    name: t.name,
    flag: '🎓',
    country: t.headline,
    rating: t.rating,
    reviews: t.reviews,
    lessons: t.lessons,
    tags: t.specializations,
    online: true,
  }))

  return (
    <section className="py-24 sm:py-28 px-4 bg-background relative overflow-hidden" id="tutors">
      <div className="absolute -top-20 right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-[-5%] w-[300px] h-[300px] rounded-full bg-violet-500/6 blur-[100px] pointer-events-none" />
      <div className="container mx-auto max-w-6xl">
        <AnimateOnScroll className="text-center mb-10">
          <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">{t('title')}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">{t('title')}</h2>
          <p className="text-muted-foreground text-lg">{t('subtitle')}</p>
        </AnimateOnScroll>

        {filtered.length === 0 ? (
          <AnimateOnScroll className="max-w-md mx-auto text-center rounded-3xl border border-dashed border-border bg-card/50 py-14 px-6">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-5">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('emptyTitle')}</h3>
            <p className="text-muted-foreground text-sm mb-6">{t('emptyDesc')}</p>
            <Link
              href="/become-tutor"
              className={cn(buttonVariants({ size: 'lg' }), 'gap-2 rounded-full px-8 gradient-bg border-0')}
            >
              {t('becomeTutor')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimateOnScroll>
        ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tutor, i) => (
            <AnimateOnScroll key={tutor.id} delay={i * 60} animation="fade-up" className="h-full">
              <div className="group bg-white/75 border border-white/80 backdrop-blur-sm rounded-2xl p-5 card-lift gradient-border shadow-sm h-full flex flex-col">
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center text-xl">
                      {tutor.flag}
                    </div>
                    {tutor.online && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{tutor.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {tutor.country}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold">{tutor.rating.toFixed(1)}</span>
                      <span className="text-[11px] text-muted-foreground">({tutor.reviews})</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-extrabold text-primary">{tutor.lessons}</p>
                    <p className="text-[10px] text-muted-foreground">{tc('lessons')}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tutor.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[11px] rounded-full bg-primary/5 text-primary/70 border border-primary/10 font-medium px-2.5 py-0.5">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-border/40 mt-auto">
                  <Link
                    href={`/tutors/${tutor.id}` as '/tutors'}
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'flex-1 rounded-full text-xs h-8')}
                  >
                    {tc('viewProfile')}
                  </Link>
                  <Link
                    href={`/tutors/${tutor.id}` as '/tutors'}
                    className={cn(buttonVariants({ size: 'sm' }), 'flex-1 rounded-full text-xs h-8 gradient-bg border-0 shadow-sm shadow-primary/15')}
                  >
                    {tc('bookNow')}
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
        )}

        {filtered.length > 0 && (
          <AnimateOnScroll className="text-center mt-10">
            <Link href="/tutors" className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'gap-2 rounded-full px-8 hover:border-primary/30 hover:bg-primary/3')}>
              {t('viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimateOnScroll>
        )}
      </div>
    </section>
  )
}
