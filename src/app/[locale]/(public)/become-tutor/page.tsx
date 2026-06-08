import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import { DollarSign, Clock, Users, Star, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

export const metadata: Metadata = {
  title: 'Müəllim ol',
  description: 'Nativly-də müəllim olaraq qeydiyyatdan keçin. Elastik iş saatları, yüksək qazanc, 5000+ tələbə bazası.',
}

const BENEFITS = [
  {
    icon: DollarSign,
    title: 'Yüksək Qazanc',
    desc: '$10–$30/saat qiymət özün təyin et. Aylıq $500–$3000 qazana bilərsiniz.',
  },
  {
    icon: Clock,
    title: 'Elastik Cədvəl',
    desc: 'Öz vaxtını özün planla. Həftədə 5 saat da, 40 saat da işləyə bilərsiniz.',
  },
  {
    icon: Users,
    title: 'Geniş Tələbə Bazası',
    desc: '5000+ aktiv tələbə. Qeydiyyatdan sonra sürətlə tələbə tapa bilərsiniz.',
  },
  {
    icon: Star,
    title: 'Platforma Dəstəyi',
    desc: 'Texniki dəstək, dərs materialları, ödəniş sistemi — hamısı biz tərəfdən.',
  },
]

const REQUIREMENTS = [
  'Native səviyyəsində dil biliyi (C2 və ya native)',
  'Dərs vermə təcrübəsi (TEFL/TESOL/CELTA sertifikatı üstünlükdür)',
  'Sabit internet, vebkamera və mikrofon',
  'Müntəzəm iş saatları (həftədə minimum 5 saat)',
  'Müsbət ünsiyyət bacarıqları',
]

const PROCESS = [
  { step: '01', title: 'Müraciət', desc: 'Onlayn formu doldurun — 5 dəqiqə çəkir.' },
  { step: '02', title: 'Müsahibə', desc: 'Komandamızla 20 dəqiqəlik video müsahibə.' },
  { step: '03', title: 'Sınaq Dərsi', desc: 'Real tələbə ilə qiymətləndirilmiş sınaq dərsi.' },
  { step: '04', title: 'Başla!', desc: 'Profilinizi doldurun, tələbə almağa başlayın.' },
]

export default async function BecomeTutorPage() {
  const locale = await getLocale()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-4xl grid md:grid-cols-2 gap-12 items-center">
          <AnimateOnScroll animation="slide-left" className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Müəllim olaraq<br />
              <span className="text-primary">qazanmağa başla</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Nativly-də 500+ müəllimlə qoşul. Elastik iş saatları, əlçatan platforma,
              yüksək qazanc.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/${locale}/register/tutor`}
                className={cn(buttonVariants({ size: 'lg' }))}
              >
                İndi müraciət et
              </Link>
              <Link
                href={`/${locale}/contact`}
                className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}
              >
                Sual ver
              </Link>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="slide-right">
            <div className="bg-card border rounded-2xl p-8 space-y-4">
              <h3 className="font-semibold text-lg">Aylıq qazanc potensialı</h3>
              {[
                { label: 'Part-time (10 saat/həftə)', amount: '$400–$800' },
                { label: 'Full-time (25 saat/həftə)', amount: '$1000–$2500' },
                { label: 'Ekspert (40+ saat/həftə)', amount: '$2500–$5000' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="font-bold text-primary">{item.amount}</span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">* Orta qiymət $15/saat əsasında</p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <AnimateOnScroll className="text-center mb-12">
            <h2 className="text-3xl font-bold">Niyə Nativly?</h2>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon
              return (
                <AnimateOnScroll key={b.title} delay={i * 100}>
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardContent className="pt-6 space-y-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">{b.title}</h3>
                      <p className="text-sm text-muted-foreground">{b.desc}</p>
                    </CardContent>
                  </Card>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-2xl">
          <AnimateOnScroll className="text-center mb-8">
            <h2 className="text-2xl font-bold">Tələblər</h2>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <ul className="space-y-3">
              {REQUIREMENTS.map((r) => (
                <li key={r} className="flex items-start gap-3 text-sm">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <AnimateOnScroll className="text-center mb-12">
            <h2 className="text-3xl font-bold">Necə başlayırsan?</h2>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((p, i) => (
              <AnimateOnScroll key={p.step} delay={i * 100}>
                <div className="text-center space-y-3">
                  <div className="text-5xl font-bold text-primary/15">{p.step}</div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll className="text-center mt-12">
            <Link
              href={`/${locale}/register/tutor`}
              className={cn(buttonVariants({ size: 'lg' }))}
            >
              Müraciət et →
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  )
}
