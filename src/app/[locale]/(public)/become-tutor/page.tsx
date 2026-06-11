import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import {
  DollarSign, Clock, Users, Star, CheckCircle, ArrowRight,
  GraduationCap, Globe, Headphones, TrendingUp, Shield, Zap
} from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

export const metadata: Metadata = {
  title: 'Müəllim ol — Nativly',
  description: 'Nativly-də müəllim olaraq qeydiyyatdan keçin. Elastik iş saatları, yüksək qazanc, 5000+ tələbə bazası.',
}

const BENEFITS = [
  {
    icon: DollarSign,
    title: 'Yüksək Qazanc',
    desc: 'Hər keçirdiyiniz dərs üçün sabit ödəniş. Aylıq $500–$3000 qazanc potensialı.',
    accent: 'from-emerald-500/15 to-emerald-500/5',
    iconBg: 'bg-emerald-500/12 text-emerald-600',
  },
  {
    icon: Clock,
    title: 'Elastik Cədvəl',
    desc: 'Öz vaxtını özün planla. Həftədə 5 saat da, 40 saat da işləyə bilərsiniz.',
    accent: 'from-blue-500/15 to-blue-500/5',
    iconBg: 'bg-blue-500/12 text-blue-600',
  },
  {
    icon: Users,
    title: 'Geniş Tələbə Bazası',
    desc: '5000+ aktiv tələbə sizi gözləyir. Qeydiyyatdan sonra sürətlə başlayın.',
    accent: 'from-violet-500/15 to-violet-500/5',
    iconBg: 'bg-violet-500/12 text-violet-600',
  },
  {
    icon: Headphones,
    title: 'Platforma Dəstəyi',
    desc: 'Texniki dəstək, ödəniş sistemi, dərs planlaşdırma — hamısı hazırdır.',
    accent: 'from-amber-500/15 to-amber-500/5',
    iconBg: 'bg-amber-500/12 text-amber-600',
  },
  {
    icon: Shield,
    title: 'Təhlükəsiz Ödəniş',
    desc: 'Qazancınız hər ay avtomatik hesabınıza köçürülür. Gizli ödəniş yoxdur.',
    accent: 'from-teal-500/15 to-teal-500/5',
    iconBg: 'bg-teal-500/12 text-teal-600',
  },
  {
    icon: TrendingUp,
    title: 'Karyera İnkişafı',
    desc: 'Reytinqiniz artdıqca daha çox tələbə cəlb edirsiniz. Uğur sizin əlinizdədir.',
    accent: 'from-rose-500/15 to-rose-500/5',
    iconBg: 'bg-rose-500/12 text-rose-600',
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
  {
    step: '01',
    title: 'Müraciət et',
    desc: 'Onlayn formu doldurun — cəmi 5 dəqiqə.',
    icon: GraduationCap,
  },
  {
    step: '02',
    title: 'Müsahibə keç',
    desc: 'Komandamızla 20 dəqiqəlik video müsahibə.',
    icon: Globe,
  },
  {
    step: '03',
    title: 'Sınaq dərsi ver',
    desc: 'Real tələbə ilə qiymətləndirilmiş sınaq dərsi.',
    icon: Zap,
  },
  {
    step: '04',
    title: 'Dərslərə başla!',
    desc: 'Profilinizi doldurun, tələbə almağa başlayın.',
    icon: Star,
  },
]

export default async function BecomeTutorPage() {
  return (
    <div className="min-h-screen">
      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* background */}
        <div className="absolute inset-0 bg-[oklch(0.13_0.04_265)]" />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 50% at 30% 30%, oklch(0.30 0.18 262 / 0.45) 0%, transparent 60%),
              radial-gradient(ellipse 50% 45% at 75% 70%, oklch(0.35 0.14 280 / 0.3) 0%, transparent 55%),
              radial-gradient(ellipse 35% 30% at 60% 20%, oklch(0.60 0.15 70 / 0.06) 0%, transparent 50%)
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
        {/* geometric lines */}
        <div className="absolute top-0 right-0 w-[600px] h-[400px] opacity-[0.04]">
          <div className="absolute top-24 right-12 w-96 h-px bg-gradient-to-l from-white to-transparent" />
          <div className="absolute top-40 right-20 w-72 h-px bg-gradient-to-l from-white to-transparent" />
          <div className="absolute top-56 right-8 w-80 h-px bg-gradient-to-l from-white to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimateOnScroll animation="slide-left">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-amber-300/80 bg-amber-400/10 rounded-full px-3.5 py-1.5 ring-1 ring-amber-400/15">
                  <Star className="h-3 w-3 fill-amber-300" />
                  500+ müəllim artıq bizimlə
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.08] tracking-tight text-white">
                  Müəllim olaraq{' '}
                  <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent">
                    qazanmağa başla
                  </span>
                </h1>

                <p className="text-lg text-white/55 leading-relaxed max-w-lg">
                  Nativly ilə elastik iş saatları, yüksək qazanc potensialı və
                  5000+ tələbə bazasına çıxış əldə edin.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/register/tutor"
                    className={cn(
                      buttonVariants({ size: 'lg' }),
                      'gradient-bg border-0 rounded-xl h-12 px-8 text-[0.95rem] font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300'
                    )}
                  >
                    İndi müraciət et
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className={cn(
                      buttonVariants({ size: 'lg', variant: 'outline' }),
                      'rounded-xl h-12 px-8 text-[0.95rem] border-white/15 text-white/80 hover:bg-white/10 hover:text-white bg-transparent'
                    )}
                  >
                    Sual ver
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Earnings card */}
            <AnimateOnScroll animation="slide-right">
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary/20 via-violet-500/10 to-amber-400/10 blur-xl" />
                <div className="relative rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] p-8 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-white">Aylıq qazanc potensialı</h3>
                    <DollarSign className="h-5 w-5 text-emerald-400" />
                  </div>
                  {[
                    { label: 'Part-time (10 saat/həftə)', amount: '$400–$800', bar: '35%' },
                    { label: 'Full-time (25 saat/həftə)', amount: '$1,000–$2,500', bar: '65%' },
                    { label: 'Ekspert (40+ saat/həftə)', amount: '$2,500–$5,000', bar: '90%' },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/50">{item.label}</span>
                        <span className="font-bold text-emerald-400 text-sm">{item.amount}</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500/60 to-emerald-400/80"
                          style={{ width: item.bar }}
                        />
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-white/30 pt-2 border-t border-white/[0.06]">
                    * Platform tərəfindən idarə olunan qiymətlər əsasında
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ─── Benefits ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <AnimateOnScroll className="text-center mb-14 space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Niyə Nativly?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Müəllimlərimizə ən yaxşı şəraiti yaratmaq üçün çalışırıq
            </p>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon
              return (
                <AnimateOnScroll key={b.title} delay={i * 80}>
                  <div className="group relative rounded-2xl border border-border/60 bg-card p-6 space-y-4 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 h-full">
                    <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', b.iconBg)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-[1.05rem]">{b.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                  </div>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Process ──────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <AnimateOnScroll className="text-center mb-14 space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Necə başlayırsan?</h2>
            <p className="text-muted-foreground">Sadə 4 addım — 10 dəqiqəyə müraciətini tamamla</p>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((p, i) => {
              const Icon = p.icon
              return (
                <AnimateOnScroll key={p.step} delay={i * 100}>
                  <div className="relative text-center space-y-4 p-6">
                    {i < PROCESS.length - 1 && (
                      <div className="hidden lg:block absolute top-10 left-[60%] w-[calc(100%-20%)] h-px border-t-2 border-dashed border-primary/15" />
                    )}
                    <div className="relative mx-auto w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/20">
                      <Icon className="h-6 w-6 text-white" />
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center text-[0.65rem] font-bold text-primary">
                        {p.step}
                      </span>
                    </div>
                    <h3 className="font-bold text-[1.05rem]">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{p.desc}</p>
                  </div>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Requirements ─────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 items-start">
            <AnimateOnScroll animation="slide-left">
              <div className="space-y-4 md:sticky md:top-24">
                <h2 className="text-3xl font-extrabold tracking-tight">Tələblər</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Aşağıdakı şərtlərə cavab verirsinizsə, müraciət edə bilərsiniz.
                </p>
                <Link
                  href="/register/tutor"
                  className={cn(buttonVariants({ size: 'default' }), 'gradient-bg border-0 rounded-xl font-semibold')}
                >
                  Müraciət et
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="slide-right">
              <ul className="space-y-3">
                {REQUIREMENTS.map((r, i) => (
                  <li
                    key={r}
                    className="flex items-start gap-3.5 p-4 rounded-xl border border-border/60 bg-card hover:border-primary/20 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-[0.9rem] leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[oklch(0.13_0.04_265)]" />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.30 0.18 262 / 0.35) 0%, transparent 60%)
            `,
          }}
        />

        <div className="relative z-10 container mx-auto max-w-2xl px-4 py-20 md:py-24 text-center space-y-6">
          <AnimateOnScroll>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Hazırsan?{' '}
              <span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                Başla!
              </span>
            </h2>
            <p className="text-white/50 mt-3 max-w-md mx-auto">
              Müraciət prosesi 5 dəqiqə çəkir. Komandamız 1-3 iş günü ərzində cavab verir.
            </p>
            <div className="pt-4">
              <Link
                href="/register/tutor"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'gradient-bg border-0 rounded-xl h-12 px-10 text-[0.95rem] font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300'
                )}
              >
                Müraciət et
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  )
}
