import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function CTA() {
  const t = useTranslations('landing.cta')
  const locale = useLocale()

  return (
    <section className="py-20 px-4 bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-2xl text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">{t('title')}</h2>
        <p className="text-primary-foreground/80 text-lg">{t('subtitle')}</p>
        <Link href={`/${locale}/register`} className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}>
          {t('button')}
        </Link>
      </div>
    </section>
  )
}
