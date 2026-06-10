'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Check } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

const AZN_RATE = 1.7

const PACKAGES = [
  { id: 1, name: 'Başlanğıc', lessons: 4, minutes: 30, price: 49.99, originalPrice: 59.96, discount: 15, popular: false, features: 4 },
  { id: 2, name: 'Populyar', lessons: 8, minutes: 30, price: 89.99, originalPrice: 119.92, discount: 25, popular: true, features: 5 },
  { id: 3, name: 'Premium', lessons: 12, minutes: 30, price: 119.99, originalPrice: 179.88, discount: 33, popular: false, features: 6 },
]

const featureKeys = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'] as const

export default function Pricing() {
  const t = useTranslations('landing.pricing')
  const [currency, setCurrency] = useState<'USD' | 'AZN'>('USD')

  const formatPrice = (usd: number) => {
    if (currency === 'AZN') return `₼${(usd * AZN_RATE).toFixed(0)}`
    return `$${usd}`
  }

  return (
    <section className="py-24 sm:py-28 px-4 bg-muted/30 relative" id="pricing">
      <div className="container mx-auto max-w-6xl">
        <AnimateOnScroll className="text-center mb-12">
          <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">{t('title')}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">{t('title')}</h2>
          <p className="text-muted-foreground text-lg mb-6">{t('subtitle')}</p>

          <div className="inline-flex items-center bg-card border border-border/50 rounded-full p-1">
            {(['USD', 'AZN'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={cn(
                  'px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer',
                  currency === c
                    ? 'gradient-bg text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-3 gap-5 items-stretch">
          {PACKAGES.map((pkg, i) => (
            <AnimateOnScroll key={pkg.id} delay={i * 100} animation="fade-up" className="h-full">
              <Card
                className={cn(
                  'relative h-full rounded-2xl overflow-hidden transition-all duration-400',
                  pkg.popular
                    ? 'border-primary/30 shadow-xl shadow-primary/8 ring-1 ring-primary/10 scale-[1.03]'
                    : 'border-border/50 card-lift'
                )}
              >
                {pkg.popular && (
                  <>
                    <div className="absolute top-0 left-0 right-0 h-1 gradient-bg" />
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="px-4 py-1 rounded-full gradient-bg border-0 shadow-md shadow-primary/20 text-white text-xs">
                        {t('popular')}
                      </Badge>
                    </div>
                  </>
                )}

                <CardHeader className="pb-3 pt-8">
                  <h3 className="text-lg font-extrabold">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {pkg.lessons} {t('perLesson').replace('/', '×')} {pkg.minutes} min
                  </p>
                  <div className="pt-3 space-y-1.5">
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-extrabold text-foreground">{formatPrice(pkg.price)}</span>
                      <span className="text-muted-foreground line-through text-sm mb-1.5">
                        {formatPrice(pkg.originalPrice)}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-emerald-600 bg-emerald-50 border-emerald-200/50 rounded-full text-xs">
                      -{pkg.discount}% {t('discount')}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5 pt-2">
                  <ul className="space-y-2.5">
                    {featureKeys.slice(0, pkg.features).map((key) => (
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
                        variant: pkg.popular ? 'default' : 'outline',
                      }),
                      'w-full rounded-full text-sm',
                      pkg.popular && 'gradient-bg border-0 shadow-md shadow-primary/15 hover:opacity-90'
                    )}
                  >
                    {t('buyNow')}
                  </Link>
                </CardContent>
              </Card>
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
