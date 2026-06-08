import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Düzgün e-poçt daxil edin'),
  password: z.string().min(6, 'Şifrə ən azı 6 simvol olmalıdır'),
})

export const registerSchema = z
  .object({
    full_name: z.string().min(2, 'Ad ən azı 2 simvol olmalıdır').max(100),
    email: z.string().email('Düzgün e-poçt daxil edin'),
    password: z.string().min(6, 'Şifrə ən azı 6 simvol olmalıdır'),
    confirm_password: z.string(),
    agree_terms: z.literal(true, {
      error: 'Şərtləri qəbul etməlisiniz',
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Şifrələr uyğun gəlmir',
    path: ['confirm_password'],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email('Düzgün e-poçt daxil edin'),
})

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Şifrə ən azı 6 simvol olmalıdır'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Şifrələr uyğun gəlmir',
    path: ['confirm_password'],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
