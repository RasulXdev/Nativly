import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import TutorShowcase from '@/components/landing/TutorShowcase'
import Testimonials from '@/components/landing/Testimonials'
import FAQ from '@/components/landing/FAQ'
import CTA from '@/components/landing/CTA'

export const metadata: Metadata = {
  title: 'Nativly — Native Müəllimlərlə Dil Öyrən',
  description:
    'Sertifikatlı native müəllimlər, 1-on-1 video dərslər, elastik cədvəl. İngilis, rus, alman, fransız, türk dili öyrən. İlk sınaq dərsi $5.',
  openGraph: {
    title: 'Nativly — Native Müəllimlərlə Dil Öyrən',
    description: 'Sertifikatlı native müəllimlərlə 1-on-1 video dərslər',
    type: 'website',
  },
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
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
