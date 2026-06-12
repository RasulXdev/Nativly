'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Check } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'
import type { LandingPlan } from '@/lib/data/landing'

const featureKeys = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'] as const

export default function Pricing({ plans }: { plans: LandingPlan[] }) {
  const t = useTranslations('landing.pricing')

  return (
    <section className="py-24 sm:py-28 px-4 bg-muted/30 relative" id="pricing">
      <div className="container mx-auto max-w-6xl">
        <AnimateOnScroll className="text-center mb-12">
          <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">{t('title')}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">{t('title')}</h2>
          <p className="text-muted-foreground text-lg mb-6">{t('subtitle')}</p>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-3 gap-5 items-stretch pt-3">
          {plans.map((plan, i) => (
            <AnimateOnScroll key={plan.id} delay={i * 100} animation="fade-up" className="h-full">
              <div className="relative h-full">
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <Badge className="px-4 py-1 rounded-full gradient-bg border-0 shadow-md shadow-primary/20 text-white text-xs whitespace-nowrap">
                      {t('popular')}
                    </Badge>
                  </div>
                )}
                <Card
                  className={cn(
                    'relative h-full rounded-2xl overflow-hidden transition-all duration-400',
                    plan.popular
                      ? 'border-primary/30 shadow-xl shadow-primary/8 ring-1 ring-primary/20'
                      : 'border-border/50 card-lift'
                  )}
                >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 h-1 gradient-bg" />
                )}

                <CardHeader className="pb-3 pt-8">
                  <h3 className="text-lg font-extrabold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.lessonsPerMonth} {t('lessonsPerMonth')} × {plan.minutes} min
                  </p>
                  <div className="pt-3 space-y-1.5">
                    <div className="flex items-end gap-1.5">
                      <span className="text-4xl font-extrabold text-foreground">₼{plan.priceAzn.toFixed(0)}</span>
                      <span className="text-muted-foreground text-sm mb-1.5">/{t('perMonth')}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-5 pt-2">
                  <ul className="space-y-2.5">
                    {featureKeys.slice(0, plan.features).map((key) => (
                      <li key={key} className="flex items-center gap-2.5 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-muted-foreground">{t(`features.${key}`)}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/register"
                    className={cn(
                      buttonVariants({
                        size: 'lg',
                        variant: plan.popular ? 'default' : 'outline',
                      }),
                      'w-full rounded-full text-sm mt-auto',
                      plan.popular && 'gradient-bg border-0 shadow-md shadow-primary/15 hover:opacity-90'
                    )}
                  >
                    {t('subscribe')}
                  </Link>
                </CardContent>
                </Card>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll className="text-center mt-8 text-sm text-muted-foreground">
          <p>Visa, Mastercard, Apple Pay, Google Pay</p>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
