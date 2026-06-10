'use client'

import { useTranslations } from 'next-intl'
import { Video, Clock, Award, Wallet, BarChart3, BookMarked } from 'lucide-react'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

const features = [
  { key: 'video' as const, icon: Video, accent: 'bg-primary/14 text-primary', ring: 'group-hover:ring-2 group-hover:ring-primary/20' },
  { key: 'schedule' as const, icon: Clock, accent: 'bg-violet-500/14 text-violet-600', ring: 'group-hover:ring-2 group-hover:ring-violet-400/20' },
  { key: 'certified' as const, icon: Award, accent: 'bg-amber-500/14 text-amber-600', ring: 'group-hover:ring-2 group-hover:ring-amber-400/20' },
  { key: 'price' as const, icon: Wallet, accent: 'bg-emerald-500/14 text-emerald-600', ring: 'group-hover:ring-2 group-hover:ring-emerald-400/20' },
  { key: 'levels' as const, icon: BarChart3, accent: 'bg-rose-500/14 text-rose-600', ring: 'group-hover:ring-2 group-hover:ring-rose-400/20' },
  { key: 'materials' as const, icon: BookMarked, accent: 'bg-sky-500/14 text-sky-600', ring: 'group-hover:ring-2 group-hover:ring-sky-400/20' },
] as const

export default function Features() {
  const t = useTranslations('landing.features')

  return (
    <section className="py-24 sm:py-28 px-4 section-tinted relative" id="features">
      <div className="container mx-auto max-w-6xl">
        <AnimateOnScroll className="text-center mb-14">
          <p className="text-sm font-semibold text-primary mb-3 tracking-widest uppercase">{t('subtitle')}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">{t('title')}</h2>
          <p className="text-foreground/60 text-lg max-w-lg mx-auto">{t('subtitle')}</p>
        </AnimateOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <AnimateOnScroll key={feature.key} delay={i * 80} animation="fade-up">
                <div className="group relative bg-white/70 border border-white/80 backdrop-blur-sm rounded-2xl p-6 space-y-4 card-lift gradient-border h-full shadow-sm hover:shadow-primary/8">
                  <div className={`w-12 h-12 rounded-2xl ${feature.accent} ${feature.ring} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-foreground">{t(`${feature.key}.title`)}</h3>
                    <p className="text-sm text-foreground/60 leading-relaxed">{t(`${feature.key}.desc`)}</p>
                  </div>
                  <div className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </AnimateOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}
