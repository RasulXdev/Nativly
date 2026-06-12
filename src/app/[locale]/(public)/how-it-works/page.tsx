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
              radial-gradient(ellipse 45% 40% at 75% 65%, oklch(0.30 0.12 280 / 0.25) 0%, transparent 55%)
            `,
          }}
        />
        <div className="relative z-10 container mx-auto max-w-3xl px-4 py-20 md:py-28 text-center space-y-4">
          <AnimateOnScroll>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{t('title')}</h1>
            <p className="text-lg text-white/50 mt-4 max-w-xl mx-auto">{t('subtitle')}</p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">
            {steps.map((step, i) => {
              const Icon = ICONS[i]
              const isEven = i % 2 === 1
              return (
                <AnimateOnScroll key={step.number} animation={isEven ? 'slide-right' : 'slide-left'}>
                  <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start p-6 md:p-8 rounded-2xl border border-border/60 bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                    <div className="flex items-center gap-5">
                      <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center shrink-0', ACCENTS[i])}>
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
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <AnimateOnScroll className="text-center mb-10 space-y-3">
            <h2 className="text-2xl font-extrabold tracking-tight">{t('whyTitle')}</h2>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <div className="grid sm:grid-cols-2 gap-3">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-3 p-3.5 rounded-xl border border-border/40 bg-card/50">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
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
        <div className="relative z-10 container mx-auto max-w-xl px-4 py-20 md:py-24 text-center space-y-6">
          <AnimateOnScroll>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">{t('ctaTitle')}</h2>
            <p className="text-white/50 mt-2">{t('ctaSubtitle')}</p>
            <div className="pt-3">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'gradient-bg border-0 rounded-xl h-12 px-10 font-semibold shadow-lg shadow-primary/25 hover:scale-[1.02] transition-all duration-300'
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
