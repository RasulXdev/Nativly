import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import RegisterForm from '@/components/auth/RegisterForm'
import AuthShell from '@/components/auth/AuthShell'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth')
  return { title: t('register') }
}

export default async function RegisterPage() {
  const t = await getTranslations('auth')
  return (
    <AuthShell title={t('createAccount')} subtitle={t('registerSubtitle')}>
      <RegisterForm />
    </AuthShell>
  )
}
