import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import LoginForm from '@/components/auth/LoginForm'
import AuthShell from '@/components/auth/AuthShell'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth')
  return { title: t('login') }
}

export default async function LoginPage() {
  const t = await getTranslations('auth')
  return (
    <AuthShell title={t('welcomeBack')} subtitle={t('loginSubtitle')}>
      <LoginForm />
    </AuthShell>
  )
}
