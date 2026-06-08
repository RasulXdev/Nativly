import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Hero() {
  const t = useTranslations('landing')
  const locale = useLocale()

  return (
    <section className="py-20 px-4 text-center bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto max-w-4xl space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          {t('heroTitle')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('heroSubtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/${locale}/register`} className={cn(buttonVariants({ size: 'lg' }))}>
            {t('heroCta')}
          </Link>
          <Link href={`/${locale}/tutors`} className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}>
            {t('heroCtaSecondary')}
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
          <span>✓ {t('stats.tutors')}</span>
          <span>✓ {t('stats.lessons')}</span>
          <span>✓ {t('stats.rating')}</span>
          <span>✓ {t('stats.students')}</span>
        </div>
      </div>
    </section>
  )
}
