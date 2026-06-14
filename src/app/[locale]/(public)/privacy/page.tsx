import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Shield } from 'lucide-react'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('privacy')
  return { title: t('title'), description: t('intro') }
}

export default async function PrivacyPage() {
  const t = await getTranslations('privacy')
  const sections = t.raw('sections') as { title: string; content: string }[]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[oklch(0.13_0.04_265)]" />
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse 50% 50% at 50% 50%, oklch(0.25 0.12 262 / 0.3) 0%, transparent 60%)` }}
        />
        <div className="absolute top-[30%] left-[15%] w-[220px] h-[220px] rounded-full bg-primary/8 blur-[80px] hero-orb-1 pointer-events-none" />
        <div className="relative z-10 container mx-auto max-w-2xl px-4 py-16 md:py-20 text-center space-y-3">
          <AnimateOnScroll>
            <div className="inline-flex items-center gap-2 bg-white/[0.06] text-white/70 rounded-full px-4 py-1.5 text-sm font-medium ring-1 ring-white/[0.08] mb-3">
              <Shield className="h-3.5 w-3.5 text-amber-300" />
              {t('title')}
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">{t('title')}</h1>
            <p className="text-white/40 mt-2">{t('lastUpdated')}</p>
          </AnimateOnScroll>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl space-y-6">
          <AnimateOnScroll>
            <p className="text-muted-foreground leading-relaxed">{t('intro')}</p>
          </AnimateOnScroll>

          {sections.map((section, i) => (
            <AnimateOnScroll key={i} delay={i * 40}>
              <div className="space-y-3 p-6 rounded-2xl border border-border/50 bg-white/70 backdrop-blur-sm hover:border-primary/15 hover:shadow-sm transition-all duration-300">
                <h2 className="text-lg font-bold">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed text-sm">{section.content}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>
    </div>
  )
}
