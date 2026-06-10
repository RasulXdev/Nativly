'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Star, ArrowRight, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

const FILTERS = ['all', 'english', 'ielts', 'german', 'french', 'turkish'] as const

const TUTORS = [
  { id: '1', name: 'Sarah Mitchell', flag: '🇬🇧', country: 'London, UK', rating: 4.9, reviews: 312, lessons: 1840, price: 18, tags: ['IELTS', 'Business'], filter: 'english', online: true },
  { id: '2', name: 'Mikhail Ivanov', flag: '🇷🇺', country: 'Moscow, RU', rating: 4.8, reviews: 198, lessons: 920, price: 12, tags: ['Grammar', 'Speaking'], filter: 'english', online: true },
  { id: '3', name: 'Elif Kaya', flag: '🇹🇷', country: 'Istanbul, TR', rating: 5.0, reviews: 87, lessons: 430, price: 10, tags: ['Beginner', 'Speaking'], filter: 'turkish', online: false },
  { id: '4', name: 'Hans Müller', flag: '🇩🇪', country: 'Berlin, DE', rating: 4.9, reviews: 145, lessons: 780, price: 20, tags: ['TestDaF', 'Business'], filter: 'german', online: true },
  { id: '5', name: 'Marie Dubois', flag: '🇫🇷', country: 'Paris, FR', rating: 4.7, reviews: 203, lessons: 1100, price: 16, tags: ['DELF', 'Speaking'], filter: 'french', online: false },
  { id: '6', name: 'James Wright', flag: '🇬🇧', country: 'Manchester, UK', rating: 4.8, reviews: 167, lessons: 890, price: 14, tags: ['IELTS', 'Conversation'], filter: 'ielts', online: true },
]

const FILTER_LABELS: Record<string, string> = {
  all: 'Hamısı',
  english: 'İngilis dili',
  ielts: 'IELTS',
  german: 'Alman dili',
  french: 'Fransız dili',
  turkish: 'Türk dili',
}

export default function TutorShowcase() {
  const t = useTranslations('landing.tutorShowcase')
  const tc = useTranslations('tutors.card')
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const filtered = activeFilter === 'all'
    ? TUTORS
    : TUTORS.filter(t => t.filter === activeFilter)

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

        <AnimateOnScroll className="flex flex-wrap justify-center gap-2 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border cursor-pointer',
                activeFilter === f
                  ? 'gradient-bg text-white border-transparent shadow-lg shadow-primary/20'
                  : 'bg-white/70 border-primary/12 text-foreground/65 hover:border-primary/35 hover:text-primary hover:bg-primary/5'
              )}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </AnimateOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tutor, i) => (
            <AnimateOnScroll key={tutor.id} delay={i * 60} animation="fade-up">
              <div className="group bg-white/75 border border-white/80 backdrop-blur-sm rounded-2xl p-5 card-lift gradient-border shadow-sm">
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
                    <p className="text-lg font-extrabold text-primary">${tutor.price}</p>
                    <p className="text-[10px] text-muted-foreground">{tc('perHour')}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tutor.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[11px] rounded-full bg-primary/5 text-primary/70 border border-primary/10 font-medium px-2.5 py-0.5">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-border/40">
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

        <AnimateOnScroll className="text-center mt-10">
          <Link href="/tutors" className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'gap-2 rounded-full px-8 hover:border-primary/30 hover:bg-primary/3')}>
            {t('subtitle')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
