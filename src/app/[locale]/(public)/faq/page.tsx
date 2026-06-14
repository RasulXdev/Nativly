import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { HelpCircle } from 'lucide-react'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'
import FAQ from '@/components/landing/FAQ'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('public.faq')
  return { title: t('title'), description: t('subtitle') }
}

export default async function FAQPage() {
  const t = await getTranslations('public.faq')

  const extraFaqs = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
    { q: t('q5'), a: t('a5') },
    { q: t('q6'), a: t('a6') },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[oklch(0.13_0.04_265)]" />
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse 50% 50% at 50% 50%, oklch(0.28 0.16 262 / 0.35) 0%, transparent 60%)` }}
        />
        <div className="absolute top-[25%] left-[10%] w-[250px] h-[250px] rounded-full bg-primary/10 blur-[90px] hero-orb-1 pointer-events-none" />
        <div className="absolute bottom-[15%] right-[12%] w-[200px] h-[200px] rounded-full bg-violet-500/8 blur-[80px] hero-orb-2 pointer-events-none" />
        <div className="relative z-10 container mx-auto max-w-2xl px-4 py-16 md:py-24 text-center space-y-4">
          <AnimateOnScroll>
            <div className="inline-flex items-center gap-2 bg-white/[0.06] text-white/70 rounded-full px-4 py-1.5 text-sm font-medium ring-1 ring-white/[0.08] mb-3">
              <HelpCircle className="h-3.5 w-3.5 text-amber-300" />
              FAQ
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{t('title')}</h1>
            <p className="text-white/50 text-lg mt-3">
              {t('notFound')}{' '}
              <a href="mailto:info@nativly.az" className="text-primary hover:underline">info@nativly.az</a>
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      <div className="py-4"><FAQ /></div>

      {/* Extra FAQs */}
      <section className="py-8 px-4 pb-20">
        <div className="container mx-auto max-w-3xl space-y-4">
          <AnimateOnScroll className="mb-8">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-2">{t('moreQuestions')}</p>
            <h2 className="text-2xl font-extrabold tracking-tight">{t('moreQuestions')}</h2>
          </AnimateOnScroll>
          {extraFaqs.map((item, i) => (
            <AnimateOnScroll key={i} delay={i * 60}>
              <div className="rounded-2xl border border-border/50 bg-white/70 backdrop-blur-sm p-5 space-y-2 hover:border-primary/20 hover:shadow-sm transition-all duration-300 gradient-border">
                <h3 className="font-semibold">{item.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>
    </div>
  )
}
