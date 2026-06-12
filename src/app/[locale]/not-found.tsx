import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { HomeIcon } from 'lucide-react'

export default function NotFoundPage() {
  const t = useTranslations('errors')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background text-foreground">
      <div className="relative mb-6">
        <div className="text-[120px] font-black leading-none gradient-text select-none">404</div>
        <div className="absolute inset-0 blur-3xl opacity-20 gradient-bg rounded-full" />
      </div>
      <h1 className="text-2xl font-bold mb-2">{t('notFound.title')}</h1>
      <p className="text-muted-foreground text-sm mb-8 max-w-sm">{t('notFound.description')}</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg text-white text-sm font-semibold shadow-lg hover:opacity-90 transition-opacity"
      >
        <HomeIcon className="h-4 w-4" />
        {t('notFound.back')}
      </Link>
    </div>
  )
}
