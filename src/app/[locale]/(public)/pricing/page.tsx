import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'
import { getLandingPlans } from '@/lib/data/landing'

export const metadata: Metadata = {
  title: 'Qiymətlər',
  description: 'Nativly aylıq abonəlik planları.',
}

const PLAN_FEATURES = [
  'Fərdi müəllim seçimi',
  'Dərs materialları daxil',
  'Dərs qeydləri',
  'Video dərslər',
  'Ev tapşırığı',
  'Prioritet dəstək',
]

export default async function PricingPage() {
  const locale = (await getLocale()) as 'az' | 'en' | 'ru'
  const plans = await getLandingPlans(locale)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[oklch(0.13_0.04_265)]" />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 55% 50% at 50% 45%, oklch(0.28 0.16 262 / 0.4) 0%, transparent 60%),
              radial-gradient(ellipse 35% 30% at 70% 70%, oklch(0.60 0.15 70 / 0.08) 0%, transparent 50%)
            `,
          }}
        />
        <div className="relative z-10 container mx-auto max-w-2xl px-4 py-16 md:py-24 text-center space-y-5">
          <AnimateOnScroll>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Aylıq Abonəlik Planları</h1>
            <p className="text-white/50 text-lg mt-3">
              Sizə uyğun planı seçin və istənilən müəllimlə dərslərə başlayın.
            </p>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 rounded-full px-4 py-1.5 text-sm font-medium ring-1 ring-emerald-500/15 mt-2">
              <Sparkles className="h-3.5 w-3.5" />
              İstənilən vaxt ləğv et — gizli ödəniş yoxdur
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {plans.map((plan, i) => (
              <AnimateOnScroll key={plan.id} delay={i * 80} className="h-full">
                <Card className={cn(
                  'relative h-full hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 rounded-2xl',
                  plan.popular
                    ? 'border-primary ring-1 ring-primary/20 shadow-lg shadow-primary/10'
                    : 'border-border/60'
                )}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="px-3 text-xs gradient-bg border-0">Populyar</Badge>
                    </div>
                  )}
                  <CardHeader className="pt-8 pb-3">
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">{plan.lessonsPerMonth} dərs/ay × {plan.minutes} dəq</p>
                    <div className="mt-3 flex items-end gap-1.5">
                      <span className="text-4xl font-extrabold tracking-tight">₼{plan.priceAzn.toFixed(0)}</span>
                      <span className="text-muted-foreground text-sm mb-1.5">/ay</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <ul className="space-y-2.5">
                      {PLAN_FEATURES.slice(0, plan.features).map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-muted-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/${locale}/register`}
                      className={cn(
                        buttonVariants({ size: 'default', variant: plan.popular ? 'default' : 'outline' }),
                        'w-full rounded-xl font-semibold',
                        plan.popular && 'gradient-bg border-0'
                      )}
                    >
                      Abonə ol
                    </Link>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-2xl space-y-6">
          <AnimateOnScroll className="text-center space-y-3">
            <h2 className="text-2xl font-extrabold tracking-tight">Abonəlik haqqında suallar</h2>
          </AnimateOnScroll>
          {[
            { q: 'Abonəlik necə işləyir?', a: 'Aylıq plan seçirsiniz və hər ay planınıza uyğun sayda dərs hüququ alırsınız. Hər dərs üçün istənilən müəllimi seçə bilərsiniz.' },
            { q: 'Ödəniş üsulları hansılardır?', a: 'Visa, Mastercard, Apple Pay, Google Pay qəbul edirik.' },
            { q: 'İstədiyim vaxt ləğv edə bilərəmmi?', a: 'Bəli, abonəliyi istənilən vaxt ləğv edə bilərsiniz. Cari dövrün sonuna qədər dərs hüququnuz qalır.' },
            { q: 'İstifadə olunmayan dərslər keçirmi?', a: 'Hər ay dərs hüququ yenilənir. Cari ayın dərslərini ayın sonuna qədər istifadə etmək tövsiyə olunur.' },
          ].map((item, i) => (
            <AnimateOnScroll key={i} delay={i * 80}>
              <div className="rounded-xl border border-border/60 bg-card p-5 space-y-2 hover:border-primary/20 transition-colors">
                <h3 className="font-semibold text-sm">{item.q}</h3>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>
    </div>
  )
}
