import type { Metadata } from 'next'
import TutorRegisterForm from '@/components/auth/TutorRegisterForm'

export const metadata: Metadata = {
  title: 'Müəllim qeydiyyatı — Nativly',
  description: 'Nativly platformasında müəllim kimi qeydiyyatdan keçin.',
}

export default function TutorRegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <TutorRegisterForm />
      </div>
    </div>
  )
}
