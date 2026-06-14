import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  DollarSign, Clock, Users, Star, CheckCircle, ArrowRight,
  GraduationCap, Globe, Headphones, TrendingUp, Shield, Zap
} from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('public.becomeTutor')
  return { title: t('metaTitle'), description: t('metaDesc') }
}

const BENEFIT_ICONS = [DollarSign, Clock, Users, Headphones, Shield, TrendingUp]
const BENEFIT_BG = ['bg-emerald-500/12 text-emerald-600', 'bg-blue-500/12 text-blue-600', 'bg-violet-500/12 text-violet-600', 'bg-amber-500/12 text-amber-600', 'bg-teal-500/12 text-teal-600', 'bg-rose-500/12 text-rose-600']
const PROCESS_ICONS = [GraduationCap, Globe, Zap, Star]

export default async function BecomeTutorPage() {
  const t = await getTranslations('public.becomeTutor')
  const benefits = t.raw('benefits') as { title: string; desc: string }[]
  const requirements = t.raw('requirements') as string[]
  const process = t.raw('process') as { step: string; title: string; desc: string }[]
  const earnings = [
    { label: t('earningPartLabel'), amount: '$400–$800', bar: '35%' },
    { label: t('earningFullLabel'), amount: '$1,000–$2,500', bar: '65%' },
    { label: t('earningExpertLabel'), amount: '$2,500–$5,000', bar: '90%' },
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
              radial-gradient(ellipse 70% 50% at 30% 30%, oklch(0.30 0.18 262 / 0.45) 0%, transparent 60%),
              radial-gradient(ellipse 50% 45% at 75% 70%, oklch(0.35 0.14 280 / 0.3) 0%, transparent 55%),
              radial-gradient(ellipse 35% 30% at 60% 20%, oklch(0.60 0.15 70 / 0.06) 0%, transparent 50%)
            `,
          }}
        />
        <div className="absolute top-[15%] right-[5%] w-[280px] h-[280px] rounded-full bg-primary/10 blur-[100px] hero-orb-1 pointer-events-none" />
        <div className="absolute bottom-[20%] left-[8%] w-[220px] h-[220px] rounded-full bg-amber-400/6 blur-[80px] hero-orb-3 pointer-events-none" />
        <div className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimateOnScroll animation="slide-left">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-amber-300/80 bg-amber-400/10 rounded-full px-3.5 py-1.5 ring-1 ring-amber-400/15">
                  <Star className="h-3 w-3 fill-amber-300" />
                  {t('badge')}
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.08] tracking-tight text-white">
                  {t('heroTitle1')}{' '}
                  <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent">
                    {t('heroTitleHighlight')}
                  </span>
                </h1>

                <p className="text-lg text-white/55 leading-relaxed max-w-lg">{t('heroSubtitle')}</p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/register/tutor"
                    className={cn(
                      buttonVariants({ size: 'lg' }),
                      'gradient-bg border-0 rounded-xl h-12 px-8 text-[0.95rem] font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300'
                    )}
                  >
                    {t('applyNow')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className={cn(
                      buttonVariants({ size: 'lg', variant: 'outline' }),
                      'rounded-xl h-12 px-8 text-[0.95rem] border-white/15 text-white/80 hover:bg-white/10 hover:text-white bg-transparent'
                    )}
                  >
                    {t('askQuestion')}
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Earnings card */}
            <AnimateOnScroll animation="slide-right">
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary/20 via-violet-500/10 to-amber-400/10 blur-xl" />
                <div className="relative rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] p-8 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-white">{t('earningsTitle')}</h3>
                    <DollarSign className="h-5 w-5 text-emerald-400" />
                  </div>
                  {earnings.map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/50">{item.label}</span>
                        <span className="font-bold text-emerald-400 text-sm">{item.amount}</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500/60 to-emerald-400/80"
                          style={{ width: item.bar }}
                        />
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-white/30 pt-2 border-t border-white/[0.06]">{t('earningsNote')}</p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <AnimateOnScroll className="text-center mb-14 space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t('whyTitle')}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">{t('whySubtitle')}</p>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b, i) => {
              const Icon = BENEFIT_ICONS[i]
              return (
                <AnimateOnScroll key={b.title} delay={i * 80}>
                  <div className="group relative rounded-2xl border border-border/50 bg-white/70 backdrop-blur-sm p-6 space-y-4 card-lift gradient-border shadow-sm h-full">
                    <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', BENEFIT_BG[i])}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-[1.05rem]">{b.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                  </div>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 md:py-28 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <AnimateOnScroll className="text-center mb-14 space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t('processTitle')}</h2>
            <p className="text-muted-foreground">{t('processSubtitle')}</p>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => {
              const Icon = PROCESS_ICONS[i]
              return (
                <AnimateOnScroll key={p.step} delay={i * 100}>
                  <div className="relative text-center space-y-4 p-6">
                    {i < process.length - 1 && (
                      <div className="hidden lg:block absolute top-10 left-[60%] w-[calc(100%-20%)] h-px border-t-2 border-dashed border-primary/15" />
                    )}
                    <div className="relative mx-auto w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/20">
                      <Icon className="h-6 w-6 text-white" />
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center text-[0.65rem] font-bold text-primary">
                        {p.step}
                      </span>
                    </div>
                    <h3 className="font-bold text-[1.05rem]">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{p.desc}</p>
                  </div>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 items-start">
            <AnimateOnScroll animation="slide-left">
              <div className="space-y-4 md:sticky md:top-24">
                <h2 className="text-3xl font-extrabold tracking-tight">{t('requirementsTitle')}</h2>
                <p className="text-muted-foreground leading-relaxed">{t('requirementsSubtitle')}</p>
                <Link
                  href="/register/tutor"
                  className={cn(buttonVariants({ size: 'default' }), 'gradient-bg border-0 rounded-xl font-semibold')}
                >
                  {t('apply')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="slide-right">
              <ul className="space-y-3">
                {requirements.map((r) => (
                  <li
                    key={r}
                    className="flex items-start gap-3.5 p-4 rounded-xl border border-border/50 bg-white/70 backdrop-blur-sm hover:border-primary/20 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-[0.9rem] leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[oklch(0.13_0.04_265)]" />
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.30 0.18 262 / 0.35) 0%, transparent 60%)` }}
        />
        <div className="relative z-10 container mx-auto max-w-2xl px-4 py-20 md:py-24 text-center space-y-6">
          <AnimateOnScroll>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              {t('ctaTitle1')}{' '}
              <span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                {t('ctaHighlight')}
              </span>
            </h2>
            <p className="text-white/50 mt-3 max-w-md mx-auto">{t('ctaSubtitle')}</p>
            <div className="pt-4">
              <Link
                href="/register/tutor"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'gradient-bg border-0 rounded-xl h-12 px-10 text-[0.95rem] font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300'
                )}
              >
                {t('apply')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  )
}
