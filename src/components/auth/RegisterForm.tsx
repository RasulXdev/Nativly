'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, User } from 'lucide-react'
import SocialButtons from './SocialButtons'
import AuthField from './AuthField'
import AuthDivider from './AuthDivider'

export default function RegisterForm() {
  const t = useTranslations('auth')
  const router = useRouter()
  const locale = useLocale()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { agree_terms: true },
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.full_name },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success(t('emailSent'), { description: t('checkEmail') })
      router.push(`/${locale}/login`)
    } catch {
      toast.error('Xəta baş verdi')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <SocialButtons mode="register" />

      <AuthDivider label={t('orDivider')} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthField
          id="full_name"
          label={t('fullName')}
          icon={User}
          placeholder="Adınız Soyadınız"
          autoComplete="name"
          error={errors.full_name?.message}
          disabled={isLoading}
          {...register('full_name')}
        />

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
          placeholder="••••••••"
          autoComplete="new-password"
          showLabel={t('showPassword')}
          hideLabel={t('hidePassword')}
          error={errors.password?.message}
          disabled={isLoading}
          {...register('password')}
        />

        <AuthField
          id="confirm_password"
          label={t('confirmPassword')}
          icon={Lock}
          password
          placeholder="••••••••"
          autoComplete="new-password"
          showLabel={t('showPassword')}
          hideLabel={t('hidePassword')}
          error={errors.confirm_password?.message}
          disabled={isLoading}
          {...register('confirm_password')}
        />

        <div className="space-y-1.5">
          <div className="flex items-start gap-2.5">
            <input
              type="checkbox"
              id="agree_terms"
              {...register('agree_terms')}
              className="mt-0.5 h-4 w-4 rounded border-border accent-primary cursor-pointer"
            />
            <Label htmlFor="agree_terms" className="text-[0.8rem] font-normal leading-relaxed text-foreground/65">
              {t('agreeToTerms')}{' '}
              <Link href="/terms" className="text-primary hover:underline font-medium">
                {t('termsOfService')}
              </Link>{' '}
              və{' '}
              <Link href="/privacy" className="text-primary hover:underline font-medium">
                {t('privacyPolicy')}
              </Link>
            </Label>
          </div>
          {errors.agree_terms && (
            <p className="text-xs text-destructive font-medium">{errors.agree_terms.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="btn-glow w-full h-11 rounded-xl gradient-bg border-0 font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.01] transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Yüklənir...
            </>
          ) : (
            t('register')
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-foreground/55">
        {t('hasAccount')}{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          {t('loginNow')}
        </Link>
      </p>
    </div>
  )
}
