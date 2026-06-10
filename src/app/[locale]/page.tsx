import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import TutorShowcase from '@/components/landing/TutorShowcase'
import DashboardPreview from '@/components/landing/DashboardPreview'
import Pricing from '@/components/landing/Pricing'
import Testimonials from '@/components/landing/Testimonials'
import FAQ from '@/components/landing/FAQ'
import CTA from '@/components/landing/CTA'
import { getLandingPackages, getFeaturedTutors } from '@/lib/data/landing'

const APP_URL = 'https://nativly.az'

type Locale = 'az' | 'en' | 'ru'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('landing')
  return {
    title: `Nativly — ${t('heroTitle')}`,
    description: t('heroSubtitle'),
    openGraph: {
      title: `Nativly — ${t('heroTitle')}`,
      description: t('heroSubtitle'),
      type: 'website',
      images: [{ url: `${APP_URL}/og-image.png`, width: 1200, height: 630 }],
    },
  }
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Nativly',
  url: APP_URL,
  description: 'Native müəllimlərlə 1-on-1 online dil dərsləri platforması — Azərbaycan üçün.',
  contactPoint: { '@type': 'ContactPoint', email: 'info@nativly.az', contactType: 'customer support' },
  sameAs: [],
}

const courseJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Online Dil Dərslər',
  description: '1-on-1 video dərslər native müəllimlərlə. İngilis, Rus, Alman, Fransız dilləri.',
  provider: { '@type': 'Organization', name: 'Nativly', url: APP_URL },
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const [packages, tutors] = await Promise.all([
    getLandingPackages(locale),
    getFeaturedTutors(),
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <TutorShowcase tutors={tutors} />
        <DashboardPreview />
        <Pricing packages={packages} />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
