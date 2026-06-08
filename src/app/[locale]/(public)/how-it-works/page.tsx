import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import { UserPlus, Search, Calendar, Video, CheckCircle } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

export const metadata: Metadata = {
  title: 'Necə işləyir?',
  description: 'Nativly ilə dil öyrənmək 4 addımda asandır. Qeydiyyat, müəllim seçimi, rezervasiya və video dərs.',
}

const STEPS = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Qeydiyyatdan keç',
    desc: 'Pulsuz hesab yarat. Ad, email, dil səviyyən — 2 dəqiqə çəkir.',
    detail: 'Google hesabınla bir klikdə qeydiyyatdan keçə bilərsiniz. Heç bir kredit kartı lazım deyil.',
  },
  {
    icon: Search,
    number: '02',
    title: 'Müəllim seç',
    desc: 'Dil, qiymət, reytinq, ixtisas üzrə filtr et.',
    detail: 'Hər müəllimin profilini, intro videosunu, rəylərini oxu. Sənə uyğun olanı seç.',
  },
  {
    icon: Calendar,
    number: '03',
    title: 'Vaxt rezerv et',
    desc: 'Sənə uyğun vaxtı seç, 30 və ya 60 dəq dərs sifariş et.',
    detail: 'Sınaq dərsi üçün cəmi $5 ödə. Beğənsən davam et, beğənməsən — pul geri.',
  },
  {
    icon: Video,
    number: '04',
    title: 'Dərsə qoşul',
    desc: 'Yüksək keyfiyyətli video zəng, dərs materialları, qeydlər.',
    detail: 'Brauzerindən birbaşa qoşul — heç bir proqram yükləmə lazım deyil. iOS, Android, PC — istənilən cihaz.',
  },
]

const FEATURES = [
  '✓ Heç bir gizli ödəniş yoxdur',
  '✓ 24 saat əvvəl pulsuz ləğvetmə',
  '✓ İstənilən cihazdan qoşulma',
  '✓ Avtomatik dərs qeydləri',
  '✓ Ev tapşırığı + materiallar',
  '✓ 30 gün pul-geri zəmanəti',
]

export default async function HowItWorksPage() {
  const locale = await getLocale()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background text-center">
        <AnimateOnScroll className="container mx-auto max-w-3xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Necə işləyir?</h1>
          <p className="text-xl text-muted-foreground">
            4 addımda dil öyrənməyə başla — ilk dərsdən növbəti günü fərq hiss edəcəksən
          </p>
        </AnimateOnScroll>
      </section>

      {/* Steps */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-16">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              const isEven = i % 2 === 1
              return (
                <AnimateOnScroll key={step.number} animation={isEven ? 'slide-right' : 'slide-left'}>
                  <div className={cn('grid md:grid-cols-2 gap-8 items-center', isEven && 'md:flex-row-reverse')}>
                    <div className={cn('space-y-4', isEven && 'md:order-2')}>
                      <div className="text-6xl font-bold text-primary/10">{step.number}</div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold">{step.title}</h2>
                      </div>
                      <p className="text-lg text-muted-foreground">{step.desc}</p>
                      <p className="text-sm text-muted-foreground">{step.detail}</p>
                    </div>
                    <div className={cn('bg-muted/30 rounded-2xl aspect-video flex items-center justify-center', isEven && 'md:order-1')}>
                      <div className="text-center space-y-3 p-8">
                        <Icon className="h-16 w-16 text-primary/30 mx-auto" />
                        <p className="text-sm text-muted-foreground font-medium">{step.title}</p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features list */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <AnimateOnScroll className="text-center mb-10">
            <h2 className="text-2xl font-bold">Niyə Nativly?</h2>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <div className="grid sm:grid-cols-2 gap-3">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  {f.replace('✓ ', '')}
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <AnimateOnScroll className="container mx-auto max-w-xl space-y-6">
          <h2 className="text-3xl font-bold">Hazırsansa, başla!</h2>
          <p className="text-muted-foreground">İlk sınaq dərsin cəmi $5 — riskisiz.</p>
          <Link href={`/${locale}/register`} className={cn(buttonVariants({ size: 'lg' }))}>
            İndi başla →
          </Link>
        </AnimateOnScroll>
      </section>
    </div>
  )
}
