'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'
import AuthShell from '@/components/auth/AuthShell'

export default function ForgotPasswordPage() {
  const t = useTranslations('auth')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/settings`,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      setSent(true)
      toast.success(t('emailSentToast'))
    } catch {
      toast.error(t('error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell title={t('forgotPassword')} subtitle={t('forgotSubtitle')}>
      {!sent ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                className="pl-10 rounded-xl h-11"
                {...register('email')}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full gradient-bg border-0 rounded-xl h-11 font-semibold" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('resetPassword')}
          </Button>
        </form>
      ) : (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-7 w-7 text-emerald-500" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{t('emailSent')}</p>
            <p className="text-sm text-muted-foreground mt-1">
              E-poçtunuzu yoxlayın və linkə klikləyin.
            </p>
          </div>
        </div>
      )}

      <div className="text-center mt-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t('login')}
        </Link>
      </div>
    </AuthShell>
  )
}
