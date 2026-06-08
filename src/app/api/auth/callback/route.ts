import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const locale = searchParams.get('locale') ?? 'az'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Get user to check role for redirect
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single() as { data: { role: string } | null; error: unknown }

        const role = profile?.role ?? 'student'
        const redirectPath =
          role === 'admin'
            ? `/${locale}/admin`
            : role === 'tutor'
              ? `/${locale}/tutor-dashboard`
              : `/${locale}/dashboard`

        return NextResponse.redirect(`${origin}${redirectPath}`)
      }

      return NextResponse.redirect(`${origin}/${locale}/dashboard`)
    }
  }

  return NextResponse.redirect(
    `${origin}/${locale}/login?error=auth_callback_error`
  )
}
