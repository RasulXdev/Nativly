import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import { UserPlus, Search, Calendar, Video, CheckCircle, ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

export const metadata: Metadata = {
  title: 'Necə işləyir?',
  description: 'Nativly ilə dil öyrənmək 4 addımda asandır.',
}

const STEPS = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Qeydiyyatdan keç',
    desc: 'Pulsuz hesab yarat. Ad, email, dil səviyyən — 2 dəqiqə çəkir.',
    detail: 'Google hesabınla bir klikdə qeydiyyatdan keçə bilərsiniz. Heç bir kredit kartı lazım deyil.',
    accent: 'bg-blue-500/10 text-blue-600',
  },
  {
    icon: Search,
    number: '02',
    title: 'Müəllim seç',
    desc: 'Dil, qiymət, reytinq, ixtisas üzrə filtr et.',
    detail: 'Hər müəllimin profilini, intro videosunu, rəylərini oxu. Sənə uyğun olanı seç.',
    accent: 'bg-violet-500/10 text-violet-600',
  },
  {
    icon: Calendar,
    number: '03',
    title: 'Vaxt rezerv et',
    desc: 'Sənə uyğun vaxtı seç, 30 və ya 60 dəq dərs sifariş et.',
    detail: 'Sınaq dərsi üçün cəmi $5 ödə. Beğənsən davam et, beğənməsən — pul geri.',
    accent: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    icon: Video,
    number: '04',
    title: 'Dərsə qoşul',
    desc: 'Yüksək keyfiyyətli video zəng, dərs materialları, qeydlər.',
    detail: 'Brauzerindən birbaşa qoşul — heç bir proqram yükləmə lazım deyil.',
    accent: 'bg-amber-500/10 text-amber-600',
  },
]

const FEATURES = [
  'Heç bir gizli ödəniş yoxdur',
  '24 saat əvvəl pulsuz ləğvetmə',
  'İstənilən cihazdan qoşulma',
  'Avtomatik dərs qeydləri',
  'Ev tapşırığı + materiallar',
  '30 gün pul-geri zəmanəti',
]

export default async function HowItWorksPage() {
  const locale = await getLocale()

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
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Necə işləyir?</h1>
            <p className="text-lg text-white/50 mt-4 max-w-xl mx-auto">
              4 addımda dil öyrənməyə başla — ilk dərsdən fərq hiss edəcəksən
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              const isEven = i % 2 === 1
              return (
                <AnimateOnScroll key={step.number} animation={isEven ? 'slide-right' : 'slide-left'}>
                  <div className={cn(
                    'grid md:grid-cols-[auto_1fr] gap-6 items-start p-6 md:p-8 rounded-2xl border border-border/60 bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300',
                  )}>
                    <div className="flex items-center gap-5">
                      <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center shrink-0', step.accent)}>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Niyə Nativly?</h2>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <div className="grid sm:grid-cols-2 gap-3">
              {FEATURES.map((f) => (
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
          style={{
            background: `radial-gradient(ellipse 50% 50% at 50% 50%, oklch(0.28 0.16 262 / 0.3) 0%, transparent 60%)`,
          }}
        />
        <div className="relative z-10 container mx-auto max-w-xl px-4 py-20 md:py-24 text-center space-y-6">
          <AnimateOnScroll>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Hazırsansa, başla!</h2>
            <p className="text-white/50 mt-2">İlk sınaq dərsin cəmi $5 — riskisiz.</p>
            <div className="pt-3">
              <Link
                href={`/${locale}/register`}
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'gradient-bg border-0 rounded-xl h-12 px-10 font-semibold shadow-lg shadow-primary/25 hover:scale-[1.02] transition-all duration-300'
                )}
              >
                İndi başla
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  )
}
