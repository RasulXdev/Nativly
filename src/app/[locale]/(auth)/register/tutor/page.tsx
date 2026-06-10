import type { Metadata } from 'next'
import TutorOnboardingForm from '@/components/auth/TutorOnboardingForm'

export const metadata: Metadata = {
  title: 'Müəllim qeydiyyatı — Nativly',
  description: 'Nativly platformasında müəllim kimi qeydiyyatdan keçin.',
}

export default function TutorRegisterPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <TutorOnboardingForm />
    </div>
  )
}
