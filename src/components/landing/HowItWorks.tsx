'use client'

import { useTranslations } from 'next-intl'
import { UserPlus, Search, CalendarCheck, Video } from 'lucide-react'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

const icons = [UserPlus, Search, CalendarCheck, Video]
const stepKeys = ['step1', 'step2', 'step3', 'step4'] as const

export default function HowItWorks() {
  const t = useTranslations('landing.howItWorks')

  return (
    <section className="py-24 sm:py-28 px-4 bg-muted/30 relative overflow-hidden" id="how-it-works">
      <div className="container mx-auto max-w-6xl relative">
        <AnimateOnScroll className="text-center mb-16">
          <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">{t('title')}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">{t('title')}</h2>
          <p className="text-muted-foreground text-lg">{t('subtitle')}</p>
        </AnimateOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stepKeys.map((key, i) => {
            const Icon = icons[i]
            return (
              <AnimateOnScroll key={key} delay={i * 120} animation="fade-up" className="h-full">
                <div className="relative group h-full">
                  {i < 3 && (
                    <div className="hidden lg:block absolute top-8 left-[calc(100%+0.25rem)] w-[calc(100%-2rem)] h-px border-t-2 border-dashed border-primary/15 z-0" />
                  )}
                  <div className="relative bg-card border border-border/50 rounded-2xl p-6 text-center card-lift h-full">
                    <div className="w-14 h-14 rounded-2xl gradient-bg text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-5 shadow-md shadow-primary/15 group-hover:scale-110 transition-transform duration-300">
                      {i + 1}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/6 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-base mb-2">{t(`${key}.title`)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`${key}.desc`)}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}
