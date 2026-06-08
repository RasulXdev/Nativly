'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import SocialButtons from './SocialButtons'
import Logo from '@/components/shared/Logo'

export default function RegisterForm() {
  const t = useTranslations('auth')
  const router = useRouter()
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
          data: {
            full_name: data.full_name,
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success(t('emailSent'), {
        description: t('checkEmail'),
      })

      router.push('/login')
    } catch {
      toast.error('Xəta baş verdi')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-2">
          <Logo />
        </div>
        <CardTitle className="text-2xl">{t('register')}</CardTitle>
        <CardDescription>
          {t('hasAccount')}{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            {t('loginNow')}
          </Link>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <SocialButtons mode="register" />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">və ya</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">{t('fullName')}</Label>
            <Input
              id="full_name"
              placeholder="Adınız Soyadınız"
              {...register('full_name')}
              disabled={isLoading}
            />
            {errors.full_name && (
              <p className="text-sm text-destructive">{errors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password">{t('confirmPassword')}</Label>
            <Input
              id="confirm_password"
              type="password"
              {...register('confirm_password')}
              disabled={isLoading}
            />
            {errors.confirm_password && (
              <p className="text-sm text-destructive">{errors.confirm_password.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="agree_terms"
              {...register('agree_terms')}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="agree_terms" className="text-sm font-normal">
              {t('agreeToTerms')}{' '}
              <Link href="/terms" className="text-primary hover:underline">
                {t('termsOfService')}
              </Link>{' '}
              və{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                {t('privacyPolicy')}
              </Link>
            </Label>
          </div>
          {errors.agree_terms && (
            <p className="text-sm text-destructive">{errors.agree_terms.message}</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
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
      </CardContent>
    </Card>
  )
}
