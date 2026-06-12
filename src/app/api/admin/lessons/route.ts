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
  const status = searchParams.get('status') ?? ''
  const limit = parseInt(searchParams.get('limit') ?? '20')

  const admin = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (admin as any)
    .from('lessons')
    .select(`
      id, scheduled_at, duration_minutes, status, price,
      student:profiles!lessons_student_id_fkey(full_name, avatar_url),
      tutor:tutor_profiles!lessons_tutor_id_fkey(
        profiles:profiles!tutor_profiles_user_id_fkey(full_name, avatar_url)
      )
    `, { count: 'exact' })
    .order('scheduled_at', { ascending: false })
    .limit(limit)

  if (status) query = query.eq('status', status)

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ lessons: data, total: count })
}
