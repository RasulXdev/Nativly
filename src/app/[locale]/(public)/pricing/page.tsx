import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'
import { getLandingPlans } from '@/lib/data/landing'

export const metadata: Metadata = {
  title: 'Qiymətlər',
  description: 'Nativly aylıq abonəlik planları. Basic, Standard və Premium — büdcənizə uyğun aylıq dil dərsləri.',
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
      <section className="py-16 px-4 bg-gradient-to-b from-primary/5 to-background text-center">
        <AnimateOnScroll className="container mx-auto max-w-2xl space-y-4">
          <h1 className="text-4xl font-bold">Aylıq Abonəlik Planları</h1>
          <p className="text-muted-foreground text-lg">
            Sizə uyğun planı seçin və istənilən müəllimlə dərslərə başlayın.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 rounded-full px-4 py-1.5 text-sm font-medium">
            🎁 İstənilən vaxt ləğv et — gizli ödəniş yoxdur
          </div>
        </AnimateOnScroll>
      </section>

      {/* Subscription plans */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {plans.map((plan, i) => (
              <AnimateOnScroll key={plan.id} delay={i * 80} className="h-full">
                <Card className={cn('relative h-full hover:shadow-lg transition-shadow', plan.popular && 'border-primary ring-1 ring-primary/20')}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="px-3 text-xs">Populyar</Badge>
                    </div>
                  )}
                  <CardHeader className="pt-8 pb-3">
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">{plan.lessonsPerMonth} dərs/ay × {plan.minutes} dəq</p>
                    <div className="mt-2 flex items-end gap-1.5">
                      <span className="text-3xl font-extrabold">₼{plan.priceAzn.toFixed(0)}</span>
                      <span className="text-muted-foreground text-sm mb-1">/ay</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {PLAN_FEATURES.slice(0, plan.features).map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-muted-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/${locale}/register`}
                      className={cn(buttonVariants({ size: 'sm', variant: plan.popular ? 'default' : 'outline' }), 'w-full')}
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

      {/* FAQ mini */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-2xl space-y-6">
          <AnimateOnScroll className="text-center">
            <h2 className="text-2xl font-bold">Abonəlik haqqında suallar</h2>
          </AnimateOnScroll>
          {[
            { q: 'Abonəlik necə işləyir?', a: 'Aylıq plan seçirsiniz və hər ay planınıza uyğun sayda dərs hüququ alırsınız. Hər dərs üçün istənilən müəllimi seçə bilərsiniz.' },
            { q: 'Ödəniş üsulları hansılardır?', a: 'Visa, Mastercard, Apple Pay, Google Pay qəbul edirik.' },
            { q: 'İstədiyim vaxt ləğv edə bilərəmmi?', a: 'Bəli, abonəliyi istənilən vaxt ləğv edə bilərsiniz. Cari dövrün sonuna qədər dərs hüququnuz qalır.' },
            { q: 'İstifadə olunmayan dərslər keçirmi?', a: 'Hər ay dərs hüququ yenilənir. Cari ayın dərslərini ayın sonuna qədər istifadə etmək tövsiyə olunur.' },
          ].map((item, i) => (
            <AnimateOnScroll key={i} delay={i * 80}>
              <div className="bg-card border rounded-lg p-4 space-y-2">
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
