import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { UserPlus, Search, Calendar, Video, CheckCircle, ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('public.howItWorks')
  return { title: t('title'), description: t('subtitle') }
}

const ICONS = [UserPlus, Search, Calendar, Video]
const ACCENTS = ['bg-blue-500/10 text-blue-600', 'bg-violet-500/10 text-violet-600', 'bg-emerald-500/10 text-emerald-600', 'bg-amber-500/10 text-amber-600']

export default async function HowItWorksPage() {
  const t = await getTranslations('public.howItWorks')
  const steps = t.raw('steps') as { number: string; title: string; desc: string; detail: string }[]
  const features = t.raw('features') as string[]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[oklch(0.13_0.04_265)]" />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 35% 40%, oklch(0.28 0.16 262 / 0.4) 0%, transparent 60%),
              radial-gradient(ellipse 45% 40% at 75% 65%, oklch(0.30 0.12 280 / 0.25) 0%, transparent 55%),
              radial-gradient(ellipse 30% 25% at 60% 20%, oklch(0.60 0.15 68 / 0.06) 0%, transparent 50%)
            `,
          }}
        />
        <div className="absolute top-[25%] left-[8%] w-[280px] h-[280px] rounded-full bg-primary/10 blur-[100px] hero-orb-1 pointer-events-none" />
        <div className="absolute bottom-[15%] right-[8%] w-[220px] h-[220px] rounded-full bg-violet-500/8 blur-[80px] hero-orb-2 pointer-events-none" />
        <div className="relative z-10 container mx-auto max-w-3xl px-4 py-20 md:py-28 text-center space-y-4">
          <AnimateOnScroll>
            <div className="inline-flex items-center gap-2 bg-white/[0.06] text-white/70 rounded-full px-4 py-1.5 text-sm font-medium ring-1 ring-white/[0.08] mb-3">
              <Calendar className="h-3.5 w-3.5 text-amber-300" />
              {t('title')}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{t('title')}</h1>
            <p className="text-lg text-white/50 mt-4 max-w-xl mx-auto">{t('subtitle')}</p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 md:py-28 px-4 relative overflow-hidden">
        <div className="absolute -top-20 right-[-8%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
        <div className="container mx-auto max-w-4xl relative">
          <div className="space-y-6">
            {steps.map((step, i) => {
              const Icon = ICONS[i]
              const isEven = i % 2 === 1
              return (
                <AnimateOnScroll key={step.number} animation={isEven ? 'slide-right' : 'slide-left'}>
                  <div className="group grid md:grid-cols-[auto_1fr] gap-6 items-start p-6 md:p-8 rounded-2xl border border-border/50 bg-white/70 backdrop-blur-sm card-lift gradient-border shadow-sm">
                    <div className="flex items-center gap-5">
                      <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300', ACCENTS[i])}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-4xl font-extrabold gradient-text md:hidden">{step.number}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-extrabold gradient-text hidden md:block">{step.number}</span>
                        <h2 className="text-xl font-bold">{step.title}</h2>
                      </div>
                      <p className="text-muted-foreground">{step.desc}</p>
                      <p className="text-sm text-muted-foreground/70">{step.detail}</p>
                    </div>
                  </div>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 px-4 section-tinted relative overflow-hidden">
        <div className="absolute bottom-0 left-[-5%] w-[250px] h-[250px] rounded-full bg-violet-500/5 blur-[90px] pointer-events-none" />
        <div className="container mx-auto max-w-3xl relative">
          <AnimateOnScroll className="text-center mb-10 space-y-3">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase">{t('whyTitle')}</p>
            <h2 className="text-2xl font-extrabold tracking-tight">{t('whyTitle')}</h2>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <div className="grid sm:grid-cols-2 gap-3">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-3 p-4 rounded-xl border border-border/40 bg-white/70 backdrop-blur-sm hover:border-primary/20 hover:shadow-sm transition-all duration-200">
                  <div className="w-6 h-6 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{f}</span>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[oklch(0.13_0.04_265)]" />
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse 50% 50% at 50% 50%, oklch(0.28 0.16 262 / 0.3) 0%, transparent 60%)` }}
        />
        <div className="absolute top-[30%] left-[20%] w-[200px] h-[200px] rounded-full bg-primary/8 blur-[80px] hero-orb-3 pointer-events-none" />
        <div className="relative z-10 container mx-auto max-w-xl px-4 py-20 md:py-24 text-center space-y-6">
          <AnimateOnScroll>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">{t('ctaTitle')}</h2>
            <p className="text-white/50 mt-2">{t('ctaSubtitle')}</p>
            <div className="pt-3">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'btn-glow gradient-bg border-0 rounded-full h-12 px-10 font-semibold shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/35 hover:scale-[1.03] transition-all duration-300'
                )}
              >
                {t('ctaButton')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  )
}
