import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
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
        <div className="relative z-10 container mx-auto max-w-2xl px-4 py-16 md:py-24 text-center space-y-4">
          <AnimateOnScroll>
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
            <h2 className="text-2xl font-extrabold tracking-tight">{t('moreQuestions')}</h2>
          </AnimateOnScroll>
          {extraFaqs.map((item, i) => (
            <AnimateOnScroll key={i} delay={i * 60}>
              <div className="rounded-xl border border-border/60 bg-card p-5 space-y-2 hover:border-primary/20 transition-colors">
                <h3 className="font-semibold">{item.q}</h3>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>
    </div>
  )
}
