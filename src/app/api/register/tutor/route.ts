import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  try {
    const body = await request.json()
    const { full_name, email, password, phone, city, country } = body

    if (!full_name || !email || !password) {
      return NextResponse.json({ error: 'Bütün sahələri doldurun' }, { status: 400 })
    }

    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const alreadyExists = existingUsers?.users?.some((u) => u.email === email)
    if (alreadyExists) {
      return NextResponse.json({ error: 'Bu email artıq qeydiyyatdadır. Daxil olun.' }, { status: 409 })
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, role: 'tutor' },
    })

    if (authError || !authData.user) {
      return NextResponse.json({ error: authError?.message ?? 'Qeydiyyat uğursuz oldu' }, { status: 500 })
    }

    const userId = authData.user.id

    await supabaseAdmin.from('profiles').update({
      phone: phone || null,
      city: city || null,
      country: country || null,
      role: 'tutor',
    }).eq('id', userId)

    const { data: tp } = await supabaseAdmin
      .from('tutor_profiles')
      .select('id')
      .eq('user_id', userId)
      .single()

    return NextResponse.json({
      userId,
      tutorProfileId: tp?.id ?? null,
    })
  } catch {
    return NextResponse.json({ error: 'Server xətası baş verdi' }, { status: 500 })
  }
}
