'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, Mail, Lock } from 'lucide-react'
import SocialButtons from './SocialButtons'
import AuthField from './AuthField'
import AuthDivider from './AuthDivider'

export default function LoginForm() {
  const t = useTranslations('auth')
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const redirectTo = searchParams.get('redirectTo') ?? `/${locale}/dashboard`
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single() as { data: { role: string } | null; error: unknown }

        const role = profile?.role ?? 'student'
        const destination =
          role === 'admin' ? `/${locale}/admin`
          : role === 'tutor' ? `/${locale}/tutor-dashboard`
          : redirectTo

        router.push(destination)
        router.refresh()
      }
    } catch {
      toast.error(t('errorOccurred'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <SocialButtons mode="login" />

      <AuthDivider label={t('orDivider')} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthField
          id="email"
          type="email"
          label={t('email')}
          icon={Mail}
          placeholder="email@example.com"
          autoComplete="email"
          error={errors.email?.message}
          disabled={isLoading}
          {...register('email')}
        />

        <AuthField
          id="password"
          label={t('password')}
          icon={Lock}
          password
          autoComplete="current-password"
          placeholder="••••••••"
          showLabel={t('showPassword')}
          hideLabel={t('hidePassword')}
          error={errors.password?.message}
          disabled={isLoading}
          labelAside={
            <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
              {t('forgotPassword')}
            </Link>
          }
          {...register('password')}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="btn-glow w-full h-11 rounded-xl gradient-bg border-0 font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.01] transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('loading')}
            </>
          ) : (
            t('login')
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-foreground/55">
        {t('noAccount')}{' '}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          {t('registerNow')}
        </Link>
      </p>
    </div>
  )
}
