import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Users, Target, Heart, Globe, Sparkles } from 'lucide-react'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('public.about')
  return { title: t('title'), description: t('subtitle') }
}

export default async function AboutPage() {
  const t = await getTranslations('public.about')

  const values = [
    { icon: Target, title: t('mission'), desc: t('missionText'), accent: 'bg-primary/10 text-primary' },
    { icon: Users, title: t('tutorsValue'), desc: t('tutorsValueText'), accent: 'bg-violet-500/10 text-violet-500' },
    { icon: Heart, title: t('students'), desc: t('studentsText'), accent: 'bg-rose-500/10 text-rose-400' },
    { icon: Globe, title: t('languages'), desc: t('languagesText'), accent: 'bg-emerald-500/10 text-emerald-400' },
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
              radial-gradient(ellipse 40% 40% at 70% 70%, oklch(0.30 0.12 280 / 0.25) 0%, transparent 55%),
              radial-gradient(ellipse 30% 25% at 80% 20%, oklch(0.60 0.15 68 / 0.06) 0%, transparent 50%)
            `,
          }}
        />
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-primary/10 blur-[100px] hero-orb-1 pointer-events-none" />
        <div className="absolute bottom-[10%] right-[5%] w-[250px] h-[250px] rounded-full bg-violet-500/8 blur-[90px] hero-orb-2 pointer-events-none" />
        <div className="relative z-10 container mx-auto max-w-3xl px-4 py-20 md:py-28 text-center space-y-5">
          <AnimateOnScroll>
            <div className="inline-flex items-center gap-2 bg-white/[0.06] text-white/70 rounded-full px-4 py-1.5 text-sm font-medium ring-1 ring-white/[0.08] mb-4">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Nativly
            </div>
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
                <p className="text-sm font-semibold text-primary tracking-widest uppercase">{t('storyTitle')}</p>
                <h2 className="text-3xl font-extrabold tracking-tight">{t('storyTitle')}</h2>
                <p className="text-muted-foreground leading-relaxed">{t('story1')}</p>
                <p className="text-muted-foreground leading-relaxed">{t('story2')}</p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="slide-right">
              <div className="rounded-2xl border border-border/60 bg-white/70 backdrop-blur-sm p-8 shadow-sm gradient-border">
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
      <section className="py-20 md:py-28 px-4 section-tinted relative overflow-hidden">
        <div className="absolute -top-20 right-[-10%] w-[350px] h-[350px] rounded-full bg-primary/6 blur-[100px] pointer-events-none" />
        <div className="container mx-auto max-w-5xl relative">
          <AnimateOnScroll className="text-center mb-14 space-y-3">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase">{t('valuesTitle')}</p>
            <h2 className="text-3xl font-extrabold tracking-tight">{t('valuesTitle')}</h2>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-2 gap-5">
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <AnimateOnScroll key={v.title} delay={i * 100}>
                  <div className="group relative bg-white/70 border border-white/80 backdrop-blur-sm rounded-2xl p-6 space-y-4 card-lift gradient-border h-full shadow-sm hover:shadow-primary/8">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${v.accent} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-[1.05rem]">{v.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                    <div className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* Vetting */}
      <section className="py-20 md:py-28 px-4 relative overflow-hidden">
        <div className="absolute bottom-0 left-[-5%] w-[300px] h-[300px] rounded-full bg-violet-500/5 blur-[100px] pointer-events-none" />
        <div className="container mx-auto max-w-4xl text-center space-y-10 relative">
          <AnimateOnScroll className="space-y-3">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase">{t('vettingTitle')}</p>
            <h2 className="text-3xl font-extrabold tracking-tight">{t('vettingTitle')}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">{t('vettingSubtitle')}</p>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-3 gap-6 text-left">
            {[
              { step: '01', title: t('vetting1Title'), desc: t('vetting1Desc') },
              { step: '02', title: t('vetting2Title'), desc: t('vetting2Desc') },
              { step: '03', title: t('vetting3Title'), desc: t('vetting3Desc') },
            ].map((s, i) => (
              <AnimateOnScroll key={s.step} delay={i * 100}>
                <div className="group space-y-3 p-6 rounded-2xl border border-border/50 bg-white/70 backdrop-blur-sm card-lift gradient-border shadow-sm h-full">
                  <div className="text-3xl font-extrabold gradient-text">{s.step}</div>
                  <h3 className="font-bold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
