'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, GraduationCap } from 'lucide-react'
import SocialButtons from './SocialButtons'
import Logo from '@/components/shared/Logo'

export default function TutorRegisterForm() {
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
          data: {
            full_name: data.full_name,
            role: 'tutor',
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Müraciətiniz qəbul edildi!', {
        description: 'Email-inizə təsdiq linki göndərildi.',
      })

      router.push(`/${locale}/login`)
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
        <div className="flex justify-center mb-1">
          <Badge variant="secondary" className="gap-1">
            <GraduationCap className="h-3 w-3" />
            Müəllim qeydiyyatı
          </Badge>
        </div>
        <CardTitle className="text-2xl">Müəllim kimi qoşul</CardTitle>
        <CardDescription>
          Artıq hesabın var?{' '}
          <Link href={`/${locale}/login`} className="text-primary hover:underline font-medium">
            Daxil ol
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
            <Label htmlFor="full_name">Ad Soyad</Label>
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
            <Label htmlFor="email">Email</Label>
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
            <Label htmlFor="password">Şifrə</Label>
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
            <Label htmlFor="confirm_password">Şifrəni təsdiqlə</Label>
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

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="agree_terms"
              {...register('agree_terms')}
              className="h-4 w-4 rounded border-gray-300 mt-0.5"
            />
            <Label htmlFor="agree_terms" className="text-sm font-normal leading-snug">
              <Link href={`/${locale}/terms`} className="text-primary hover:underline">
                İstifadə şərtləri
              </Link>{' '}
              və{' '}
              <Link href={`/${locale}/privacy`} className="text-primary hover:underline">
                Gizlilik siyasəti
              </Link>
              {' '}ilə razıyam
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
              'Müəllim kimi qeydiyyat'
            )}
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground">
          Qeydiyyatdan sonra profilinizi tamamlayacaq və admin təsdiqini gözləyəcəksiniz.
        </p>
      </CardContent>
    </Card>
  )
}
