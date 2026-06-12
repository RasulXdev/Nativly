import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = { title: 'Nativly' }

export default async function Page() {
  const t = await getTranslations('common')
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-muted-foreground text-sm">{t('underConstruction')}</p>
    </div>
  )
}
