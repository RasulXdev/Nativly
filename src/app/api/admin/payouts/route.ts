import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return user
}

export async function GET(request: NextRequest) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') ?? 'pending'

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('tutor_payouts')
    .select(`
      id, amount_azn, status, created_at, paid_at, admin_note,
      tutor:profiles!tutor_payouts_tutor_id_fkey(full_name, avatar_url, email),
      lesson:lessons(scheduled_at, duration_minutes)
    `)
    .eq('status', status)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(request: NextRequest) {
  const adminUser = await checkAdmin()
  if (!adminUser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { payoutId, note } = await request.json()
  const admin = createAdminClient()

  await admin.from('tutor_payouts').update({
    status: 'paid',
    paid_at: new Date().toISOString(),
    admin_note: note ?? null,
  }).eq('id', payoutId)

  return NextResponse.json({ success: true })
}
