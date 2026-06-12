'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Shield, Clock, CreditCard } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

export default function CTA() {
  const t = useTranslations('landing.cta')

  return (
    <section className="py-24 sm:py-28 px-4 relative overflow-hidden section-dark">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.395_0.195_262_/_0.12)_0%,transparent_60%)]" />

      <div className="container mx-auto max-w-3xl relative z-10">
        <AnimateOnScroll className="text-center space-y-7">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {t('title')}
          </h2>

          <p className="text-lg text-white/50">
            {t('subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-white text-foreground hover:bg-white/90 text-base px-8 h-12 gap-2 rounded-full shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 font-semibold'
              )}
            >
              {t('button')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-4">
            {[
              { icon: CreditCard, text: t('trustNoCard') },
              { icon: Clock, text: t('trustCancel') },
              { icon: Shield, text: t('trustGuarantee') },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-white/35 text-sm">
                <item.icon className="h-4 w-4" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
