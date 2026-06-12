'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { RefreshCw, HomeIcon } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('errors')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background text-foreground">
      <div className="relative mb-6">
        <div className="text-[120px] font-black leading-none gradient-text select-none">500</div>
        <div className="absolute inset-0 blur-3xl opacity-20 gradient-bg rounded-full" />
      </div>
      <h1 className="text-2xl font-bold mb-2">{t('serverError.title')}</h1>
      <p className="text-muted-foreground text-sm mb-8 max-w-sm">{t('serverError.description')}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg text-white text-sm font-semibold shadow-lg hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="h-4 w-4" />
          {t('serverError.retry')}
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted/50 transition-colors"
        >
          <HomeIcon className="h-4 w-4" />
          {t('notFound.back')}
        </Link>
      </div>
    </div>
  )
}
