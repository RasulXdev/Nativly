import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

export const metadata: Metadata = {
  title: 'Qiymətlər',
  description: 'Nativly dərs paketləri. Başlanğıcdan intensiv səviyyəyə qədər əlçatan qiymətlər. 30 dəqiqəlik sınaq dərsi $5.',
}

const PACKAGES_30 = [
  { name: 'Başlanğıc', lessons: 4, price: 49.99, originalPrice: 59.96, discount: 15, popular: false },
  { name: 'Populyar', lessons: 8, price: 89.99, originalPrice: 119.92, discount: 25, popular: true },
  { name: 'Premium', lessons: 12, price: 119.99, originalPrice: 179.88, discount: 33, popular: false },
  { name: 'Intensiv', lessons: 20, price: 179.99, originalPrice: 299.80, discount: 40, popular: false },
]

const PACKAGES_60 = [
  { name: 'Başlanğıc 60', lessons: 4, price: 89.99, originalPrice: 107.96, discount: 15, popular: false },
  { name: 'Populyar 60', lessons: 8, price: 159.99, originalPrice: 215.92, discount: 25, popular: true },
  { name: 'Premium 60', lessons: 12, price: 219.99, originalPrice: 323.88, discount: 32, popular: false },
]

const FEATURES_COMPARE = [
  { feature: 'Fərdi müəllim seçimi', all: true },
  { feature: 'Dərs materialları', all: true },
  { feature: 'Dərs qeydləri', all: true },
  { feature: 'Video zəng', all: true },
  { feature: 'Ev tapşırığı', starter: false, rest: true },
  { feature: 'Prioritet dəstək', premium: true, rest: false },
  { feature: 'Qeyd saxlama', all: true },
]

export default async function PricingPage() {
  const locale = await getLocale()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-b from-primary/5 to-background text-center">
        <AnimateOnScroll className="container mx-auto max-w-2xl space-y-4">
          <h1 className="text-4xl font-bold">Əlçatan Qiymətlər</h1>
          <p className="text-muted-foreground text-lg">
            Büdcənizə uyğun paket seçin. İlk sınaq dərsi cəmi $5.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 rounded-full px-4 py-1.5 text-sm font-medium">
            🎁 İlk sınaq dərsi — $5 | 30 gün pul-geri zəmanəti
          </div>
        </AnimateOnScroll>
      </section>

      {/* 30 min packages */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <AnimateOnScroll className="text-center mb-8">
            <h2 className="text-2xl font-bold">30 dəqiqəlik paketlər</h2>
            <p className="text-muted-foreground mt-1">Başlanğıc üçün ideal</p>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PACKAGES_30.map((pkg, i) => (
              <AnimateOnScroll key={pkg.name} delay={i * 80}>
                <Card className={cn('relative h-full hover:shadow-lg transition-shadow', pkg.popular && 'border-primary ring-1 ring-primary/20')}>
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="px-3 text-xs">Populyar</Badge>
                    </div>
                  )}
                  <CardHeader className="pt-8 pb-3">
                    <h3 className="font-bold">{pkg.name}</h3>
                    <p className="text-xs text-muted-foreground">{pkg.lessons} dərs × 30 dəq</p>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">${pkg.price}</span>
                      <span className="text-muted-foreground line-through text-sm ml-2">${pkg.originalPrice}</span>
                    </div>
                    <Badge variant="secondary" className="w-fit text-green-600 bg-green-50 text-xs">
                      -{pkg.discount}%
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={`/${locale}/register`}
                      className={cn(buttonVariants({ size: 'sm', variant: pkg.popular ? 'default' : 'outline' }), 'w-full')}
                    >
                      Seç
                    </Link>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 60 min packages */}
      <section className="py-8 px-4 pb-16">
        <div className="container mx-auto max-w-4xl">
          <AnimateOnScroll className="text-center mb-8">
            <h2 className="text-2xl font-bold">60 dəqiqəlik paketlər</h2>
            <p className="text-muted-foreground mt-1">Daha dərin öyrənmə üçün</p>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-3 gap-6">
            {PACKAGES_60.map((pkg, i) => (
              <AnimateOnScroll key={pkg.name} delay={i * 80}>
                <Card className={cn('relative h-full hover:shadow-lg transition-shadow', pkg.popular && 'border-primary ring-1 ring-primary/20')}>
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="px-3 text-xs">Populyar</Badge>
                    </div>
                  )}
                  <CardHeader className="pt-8 pb-3">
                    <h3 className="font-bold">{pkg.name}</h3>
                    <p className="text-xs text-muted-foreground">{pkg.lessons} dərs × 60 dəq</p>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">${pkg.price}</span>
                      <span className="text-muted-foreground line-through text-sm ml-2">${pkg.originalPrice}</span>
                    </div>
                    <Badge variant="secondary" className="w-fit text-green-600 bg-green-50 text-xs">
                      -{pkg.discount}%
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={`/${locale}/register`}
                      className={cn(buttonVariants({ size: 'sm', variant: pkg.popular ? 'default' : 'outline' }), 'w-full')}
                    >
                      Seç
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
            <h2 className="text-2xl font-bold">Ödəniş haqqında suallar</h2>
          </AnimateOnScroll>
          {[
            { q: 'Sınaq dərsi nədir?', a: 'İstənilən müəllimlə cəmi $5-a 30 dəqiqəlik sınaq dərsi keçirə bilərsiniz.' },
            { q: 'Ödəniş üsulları hansılardır?', a: 'Visa, Mastercard, Apple Pay, Google Pay qəbul edirik.' },
            { q: 'Pul-geri zəmanəti nə qədərdir?', a: 'İlk dərsdən 30 gün ərzində narazı qalarsanız, tam geri qaytarırıq.' },
            { q: 'Paketi necə istifadə edirəm?', a: 'Paket aldıqdan sonra istənilən müəllimi seçib dərs sifariş edə bilərsiniz.' },
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
