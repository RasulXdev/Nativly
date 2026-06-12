'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Star, Play, Users, BookOpen, Award } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { TEACHING_LANGUAGES } from '@/lib/constants/teaching'

export default function Hero() {
  const t = useTranslations('landing')

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center hero-mesh">
      {/* Animated background orbs */}
      <div className="absolute -top-10 left-[2%] w-[520px] h-[520px] rounded-full bg-primary/20 blur-[120px] hero-orb-1 pointer-events-none" />
      <div className="absolute bottom-0 right-[0%] w-[480px] h-[480px] rounded-full bg-violet-500/14 blur-[130px] hero-orb-2 pointer-events-none" />
      <div className="absolute top-[40%] left-[40%] w-[320px] h-[320px] rounded-full bg-amber-400/8 blur-[100px] hero-orb-3 pointer-events-none" />
      <div className="absolute top-[10%] right-[20%] w-[200px] h-[200px] rounded-full bg-sky-400/10 blur-[80px] float-slow pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-28 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <div className="space-y-8 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-primary/6 text-primary border border-primary/12 rounded-full px-4 py-1.5 text-sm font-semibold">
              <span className="w-2 h-2 bg-primary rounded-full pulse-live" />
              {t('stats.students')}
            </div>

            <div className="space-y-5">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.08] text-foreground">
                {t('heroTitle')}
              </h1>
              <p className="text-lg text-foreground/65 leading-relaxed">
                {t('heroSubtitle')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'btn-glow text-base px-8 h-12 gap-2 rounded-full gradient-bg border-0 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.03] transition-all duration-300'
                )}
              >
                {t('heroCta')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/tutors"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'text-base px-8 h-12 gap-2 rounded-full border-primary/30 text-foreground/80 hover:bg-primary/6 hover:border-primary/50 hover:text-primary transition-all duration-300'
                )}
              >
                {t('heroCtaSecondary')}
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">500+</p>
                  <p className="text-xs text-muted-foreground">{t('stats.tutors').replace(/[0-9,+\s]/g, '').trim()}</p>
                </div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">10K+</p>
                  <p className="text-xs text-muted-foreground">{t('stats.lessons').replace(/[0-9,+\s]/g, '').trim()}</p>
                </div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex items-center gap-2.5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm font-bold text-foreground">4.9</p>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="glass-dark rounded-3xl p-6 glow-blue float">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-primary/20 flex items-center justify-center text-lg">
                      🇬🇧
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white">Sarah Mitchell</p>
                      <p className="text-xs text-white/50">{t('heroCard.expert')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-400/20 rounded-full px-3 py-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full pulse-live" />
                    <span className="text-[11px] text-emerald-400 font-medium">{t('heroCard.live')}</span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/8 rounded-2xl p-5 mb-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-white/70 font-medium">{t('heroCard.speakingPractice')}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-white/60">4.9</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/30 flex items-center justify-center">
                      <Play className="h-4 w-4 text-white fill-white" />
                    </div>
                    <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-primary to-primary/70" />
                    </div>
                    <span className="text-xs text-white/40 font-mono">18:24</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { emoji: '🎓', value: '10K+', label: t('heroCard.lessons') },
                    { emoji: '👨‍🏫', value: '500+', label: t('heroCard.tutors') },
                    { emoji: '⭐', value: '4.9', label: t('heroCard.rating') },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/5 border border-white/8 rounded-xl p-3 text-center">
                      <p className="text-lg mb-0.5">{s.emoji}</p>
                      <p className="font-bold text-sm text-white">{s.value}</p>
                      <p className="text-[10px] text-white/40 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -top-3 -right-3 glass-strong rounded-2xl px-4 py-2.5 shadow-xl float-delay">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs font-bold">{t('heroCard.resultScore')}</p>
                    <p className="text-[10px] text-muted-foreground">{t('heroCard.resultTime')}</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-3 -left-3 glass-strong rounded-2xl px-4 py-2.5 shadow-xl float">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg gradient-bg-gold flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">$5</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{t('heroCard.trialLesson')}</p>
                    <p className="text-[10px] text-muted-foreground">{t('heroCard.trialDuration')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/30">
          <div className="flex flex-wrap justify-center gap-2">
            {TEACHING_LANGUAGES.map(({ flag, name, available }) => (
              <div
                key={name}
                className={cn(
                  'flex items-center gap-1.5 border rounded-full px-3.5 py-1.5 text-xs transition-all duration-200 cursor-default shadow-sm',
                  available
                    ? 'bg-white/70 border-primary/12 hover:border-primary/35 hover:bg-primary/5 hover:scale-105'
                    : 'bg-muted/40 border-border/40 opacity-60'
                )}
              >
                <span className={available ? '' : 'grayscale'}>{flag}</span>
                <span className="text-foreground/65 font-medium">{name}</span>
                {!available && (
                  <span className="ml-1 text-[9px] font-semibold text-primary/70 bg-primary/8 rounded-full px-1.5 py-0.5 leading-none">
                    {t('heroCard.comingSoon')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
