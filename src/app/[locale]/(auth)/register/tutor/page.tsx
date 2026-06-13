import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import TutorOnboardingForm from '@/components/auth/TutorOnboardingForm'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth')
  return { title: `${t('tutorJoinTitle')} — Nativly` }
}

export default function TutorRegisterPage() {
  return (
    <div className="min-h-screen bg-background relative">
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: `
            radial-gradient(ellipse 50% 30% at 80% 10%, oklch(0.395 0.195 262 / 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 10% 80%, oklch(0.74 0.16 70 / 0.04) 0%, transparent 60%)
          `,
        }}
      />
      <div className="relative z-10 px-4 py-10">
        <TutorOnboardingForm />
      </div>
    </div>
  )
}
