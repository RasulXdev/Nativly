import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('nav')
  return {
    title: `${t('tutors')} — Nativly`,
  }
}

export default async function TutorsPage() {
  const t = await getTranslations('nav')

  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-[70vh] flex flex-col items-center justify-center px-4 py-24">
        <div className="text-center max-w-md space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto">
            <Search className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">{t('tutors')}</h1>
          <p className="text-muted-foreground">
            Tutor browsing is coming in Day 3. For now, explore our featured tutors on the homepage.
          </p>
          <Link href="/" className={cn(buttonVariants({ size: 'lg' }), 'rounded-full gradient-bg border-0')}>
            Ana səhifəyə qayıt
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
