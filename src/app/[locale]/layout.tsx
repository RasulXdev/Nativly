import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import '@/styles/globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Nativly — Dil Öyrənmə Platforması',
    template: '%s | Nativly',
  },
  description:
    'Native müəllimlərlə 1-on-1 video dərslər. İstənilən vaxt, istənilən yerdən dil öyrən.',
  keywords: ['dil öyrənmə', 'online dərslər', 'ingilis dili', 'nativly'],
  openGraph: {
    title: 'Nativly',
    description: 'Native müəllimlərlə 1-on-1 video dərslər',
    url: 'https://nativly.az',
    siteName: 'Nativly',
    locale: 'az_AZ',
    type: 'website',
  },
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
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
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
