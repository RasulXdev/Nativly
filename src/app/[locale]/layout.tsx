import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Toaster } from '@/components/ui/sonner'
import QueryProvider from '@/components/providers/QueryProvider'
import '@/styles/globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const APP_URL = 'https://nativly.az'

const OG_IMAGE = {
  url: `${APP_URL}/og-image.png`,
  width: 1200,
  height: 630,
  alt: 'Nativly — Dil Öyrənmə Platforması',
}

const LOCALE_MAP: Record<string, string> = {
  az: 'az_AZ',
  en: 'en_US',
  ru: 'ru_RU',
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params

  return {
    title: {
      default: 'Nativly — Dil Öyrənmə Platforması',
      template: '%s | Nativly',
    },
    description:
      'Native müəllimlərlə 1-on-1 video dərslər. İstənilən vaxt, istənilən yerdən dil öyrən.',
    keywords: ['dil öyrənmə', 'online dərslər', 'ingilis dili', 'nativly', 'azerbaijan language learning'],
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${APP_URL}/${locale}`,
      languages: {
        az: `${APP_URL}/az`,
        en: `${APP_URL}/en`,
        ru: `${APP_URL}/ru`,
      },
    },
    openGraph: {
      title: 'Nativly — Dil Öyrənmə Platforması',
      description: 'Native müəllimlərlə 1-on-1 video dərslər. İstənilən vaxt, istənilən yerdən dil öyrən.',
      url: `${APP_URL}/${locale}`,
      siteName: 'Nativly',
      locale: LOCALE_MAP[locale] ?? 'az_AZ',
      type: 'website',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Nativly — Dil Öyrənmə Platforması',
      description: 'Native müəllimlərlə 1-on-1 video dərslər.',
      images: [OG_IMAGE.url],
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'az' | 'en' | 'ru')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            {children}
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
