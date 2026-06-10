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

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('landing')
  return {
    title: `Nativly — ${t('heroTitle')}`,
    description: t('heroSubtitle'),
    openGraph: {
      title: `Nativly — ${t('heroTitle')}`,
      description: t('heroSubtitle'),
      type: 'website',
    },
  }
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <TutorShowcase />
        <DashboardPreview />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
