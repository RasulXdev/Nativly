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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin as any)
    .from('tutor_profiles')
    .select(`
      id, headline, about, application_status, is_featured, average_rating, total_lessons, created_at,
      specializations, certificates, education,
      profiles:profiles!tutor_profiles_user_id_fkey(id, full_name, email, avatar_url, created_at)
    `)
    .eq('application_status', status)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(request: NextRequest) {
  const adminUser = await checkAdmin()
  if (!adminUser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { tutorId, action, reason } = await request.json()
  const admin = createAdminClient()

  if (action === 'approve') {
    await admin.from('tutor_profiles').update({
      application_status: 'approved',
      approved_at: new Date().toISOString(),
    }).eq('id', tutorId)

    const { data: tp } = await admin.from('tutor_profiles').select('user_id').eq('id', tutorId).single()
    if (tp) {
      await admin.from('profiles').update({ role: 'tutor' }).eq('id', tp.user_id)
    }
  } else if (action === 'reject') {
    await admin.from('tutor_profiles').update({
      application_status: 'rejected',
    }).eq('id', tutorId)
  } else if (action === 'toggle_feature') {
    const { data: current } = await admin.from('tutor_profiles').select('is_featured').eq('id', tutorId).single()
    await admin.from('tutor_profiles').update({ is_featured: !current?.is_featured }).eq('id', tutorId)
  }

  return NextResponse.json({ success: true })
}
