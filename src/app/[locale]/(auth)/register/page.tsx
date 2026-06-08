import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import RegisterForm from '@/components/auth/RegisterForm'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth')
  return { title: t('register') }
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}
