import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

const PACKAGES = [
  {
    id: 1,
    name: 'Başlanğıc',
    lessons: 4,
    minutes: 30,
    price: 49.99,
    originalPrice: 59.96,
    discount: 15,
    popular: false,
    perLesson: 12.5,
    features: ['4 × 30 dəqiqə dərs', 'Fərdi müəllim seçimi', 'Dərs materialları', 'Dərs qeydləri'],
  },
  {
    id: 2,
    name: 'Populyar',
    lessons: 8,
    minutes: 30,
    price: 89.99,
    originalPrice: 119.92,
    discount: 25,
    popular: true,
    perLesson: 11.25,
    features: ['8 × 30 dəqiqə dərs', 'Fərdi müəllim seçimi', 'Dərs materialları', 'Dərs qeydləri', 'Ev tapşırığı'],
  },
  {
    id: 3,
    name: 'Premium',
    lessons: 12,
    minutes: 30,
    price: 119.99,
    originalPrice: 179.88,
    discount: 33,
    popular: false,
    perLesson: 10.0,
    features: ['12 × 30 dəqiqə dərs', 'Fərdi müəllim seçimi', 'Dərs materialları', 'Dərs qeydləri', 'Ev tapşırığı', 'Prioritet dəstək'],
  },
]

export default function Pricing() {
  const t = useTranslations('landing.pricing')
  const locale = useLocale()

  return (
    <section className="py-20 px-4 bg-background" id="pricing">
      <div className="container mx-auto max-w-6xl">
        <AnimateOnScroll className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{t('title')}</h2>
          <p className="text-muted-foreground">{t('subtitle')}</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-green-50 text-green-700 rounded-full px-4 py-1.5 text-sm font-medium">
            🎁 {t('trialLesson')}
          </div>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-3 gap-6">
          {PACKAGES.map((pkg, i) => (
            <AnimateOnScroll key={pkg.id} delay={i * 100} animation="fade-up">
              <Card
                className={cn(
                  'relative h-full transition-shadow hover:shadow-lg',
                  pkg.popular && 'border-primary shadow-md ring-1 ring-primary/20'
                )}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="px-4">{t('popular')}</Badge>
                  </div>
                )}

                <CardHeader className="pb-4 pt-8">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {pkg.lessons} dərs × {pkg.minutes} dəqiqə
                    </p>
                  </div>
                  <div className="space-y-1 pt-2">
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold">${pkg.price}</span>
                      <span className="text-muted-foreground line-through text-sm mb-1">
                        ${pkg.originalPrice}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary" className="text-green-600 bg-green-50">
                        -{pkg.discount}%
                      </Badge>
                      <span className="text-muted-foreground">
                        ${pkg.perLesson.toFixed(2)} / {t('perLesson')}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/${locale}/register`}
                    className={cn(
                      buttonVariants({
                        size: 'lg',
                        variant: pkg.popular ? 'default' : 'outline',
                      }),
                      'w-full mt-2'
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
          <p>💳 Visa, Mastercard, Apple Pay, Google Pay qəbul edirik</p>
          <p className="mt-1">✓ İlk dərsə 30 gün pul-geri zəmanəti</p>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
