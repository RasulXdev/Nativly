import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
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
        <div className="relative z-10 container mx-auto max-w-2xl px-4 py-16 md:py-20 text-center space-y-3">
          <AnimateOnScroll>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">{t('title')}</h1>
            <p className="text-white/40 mt-2">{t('lastUpdated')}</p>
          </AnimateOnScroll>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl space-y-8">
          <AnimateOnScroll>
            <p className="text-muted-foreground leading-relaxed">{t('intro')}</p>
          </AnimateOnScroll>

          {sections.map((section, i) => (
            <AnimateOnScroll key={i} delay={i * 40}>
              <div className="space-y-3 p-5 rounded-xl border border-border/40 bg-card/50 hover:border-border/60 transition-colors">
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
