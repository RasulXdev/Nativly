'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useAuth } from '@/hooks/useAuth'
import type { UserRole } from '@/lib/types'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const locale = useLocale()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace(`/${locale}/login`)
      return
    }

    if (requiredRole && profile?.role !== requiredRole) {
      const redirect =
        profile?.role === 'admin'
          ? `/${locale}/admin`
          : profile?.role === 'tutor'
            ? `/${locale}/tutor-dashboard`
            : `/${locale}/dashboard`
      router.replace(redirect)
    }
  }, [user, profile, loading, router, locale, requiredRole])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) return null
  if (requiredRole && profile?.role !== requiredRole) return null

  return <>{children}</>
}
