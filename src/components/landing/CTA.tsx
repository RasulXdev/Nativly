import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

export default function CTA() {
  const t = useTranslations('landing.cta')
  const locale = useLocale()

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-teal-700" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      <div className="container mx-auto max-w-3xl relative z-10">
        <AnimateOnScroll className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-white/90">
            <Sparkles className="h-3.5 w-3.5" />
            Riskisiz başla
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {t('title')}
            </h2>
            <p className="text-white/75 text-lg">{t('subtitle')}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/${locale}/register`}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-white text-primary hover:bg-white/90 text-base px-8 gap-2 shadow-lg hover:scale-[1.02] transition-all duration-200'
              )}
            >
              {t('button')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/${locale}/tutors`}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'border-white/30 text-white hover:bg-white/10 hover:border-white/50 text-base px-8 transition-all duration-200'
              )}
            >
              Müəllimləri kəşf et
            </Link>
          </div>

          <p className="text-white/50 text-sm">
            ✓ Kredit kartı tələb olunmur &nbsp;·&nbsp; ✓ İstənilən vaxt ləğv et &nbsp;·&nbsp; ✓ 30 gün zəmanət
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
