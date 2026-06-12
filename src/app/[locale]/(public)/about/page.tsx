import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Users, Target, Heart, Globe } from 'lucide-react'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('public.about')
  return { title: t('title'), description: t('subtitle') }
}

export default async function AboutPage() {
  const t = await getTranslations('public.about')

  const values = [
    { icon: Target, title: t('mission'), desc: t('missionText'), accent: 'bg-blue-500/10 text-blue-600' },
    { icon: Users, title: t('tutorsValue'), desc: t('tutorsValueText'), accent: 'bg-violet-500/10 text-violet-600' },
    { icon: Heart, title: t('students'), desc: t('studentsText'), accent: 'bg-rose-500/10 text-rose-600' },
    { icon: Globe, title: t('languages'), desc: t('languagesText'), accent: 'bg-emerald-500/10 text-emerald-600' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[oklch(0.13_0.04_265)]" />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 40% 40%, oklch(0.28 0.16 262 / 0.4) 0%, transparent 60%),
              radial-gradient(ellipse 40% 40% at 70% 70%, oklch(0.30 0.12 280 / 0.25) 0%, transparent 55%)
            `,
          }}
        />
        <div className="relative z-10 container mx-auto max-w-3xl px-4 py-20 md:py-28 text-center space-y-5">
          <AnimateOnScroll>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{t('title')}</h1>
            <p className="text-lg text-white/50 mt-4 max-w-xl mx-auto">{t('subtitle')}</p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimateOnScroll animation="slide-left">
              <div className="space-y-5">
                <h2 className="text-3xl font-extrabold tracking-tight">{t('storyTitle')}</h2>
                <p className="text-muted-foreground leading-relaxed">{t('story1')}</p>
                <p className="text-muted-foreground leading-relaxed">{t('story2')}</p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="slide-right">
              <div className="rounded-2xl border border-border/60 bg-card p-8">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { v: '500+', l: t('stat1') },
                    { v: '10K+', l: t('stat2') },
                    { v: '5K+', l: t('stat3') },
                    { v: '4.9', l: t('stat4') },
                  ].map((s) => (
                    <div key={s.l} className="text-center space-y-1">
                      <div className="text-3xl font-extrabold gradient-text">{s.v}</div>
                      <div className="text-xs text-muted-foreground">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <AnimateOnScroll className="text-center mb-14 space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight">{t('valuesTitle')}</h2>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-2 gap-5">
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <AnimateOnScroll key={v.title} delay={i * 100}>
                  <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-4 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 h-full">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${v.accent}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-[1.05rem]">{v.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                  </div>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* Vetting */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-10">
          <AnimateOnScroll className="space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight">{t('vettingTitle')}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">{t('vettingSubtitle')}</p>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-3 gap-8 text-left">
            {[
              { step: '01', title: t('vetting1Title'), desc: t('vetting1Desc') },
              { step: '02', title: t('vetting2Title'), desc: t('vetting2Desc') },
              { step: '03', title: t('vetting3Title'), desc: t('vetting3Desc') },
            ].map((s, i) => (
              <AnimateOnScroll key={s.step} delay={i * 100}>
                <div className="space-y-3 p-5 rounded-xl border border-border/40 bg-card/50">
                  <div className="text-3xl font-extrabold gradient-text">{s.step}</div>
                  <h3 className="font-bold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
