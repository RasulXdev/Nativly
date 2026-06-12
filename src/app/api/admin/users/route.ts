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
  const search = searchParams.get('search') ?? ''
  const role = searchParams.get('role') ?? ''
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const offset = parseInt(searchParams.get('offset') ?? '0')

  const admin = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (admin as any).from('profiles')
    .select('id, full_name, email, role, is_active, created_at, avatar_url, last_seen_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
  }
  if (role) {
    query = query.eq('role', role)
  }

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ users: data, total: count })
}

export async function PATCH(request: NextRequest) {
  const adminUser = await checkAdmin()
  if (!adminUser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { userId, action, value } = await request.json()
  const admin = createAdminClient()

  if (action === 'toggle_active') {
    await admin.from('profiles').update({ is_active: value }).eq('id', userId)
  } else if (action === 'change_role') {
    await admin.from('profiles').update({ role: value }).eq('id', userId)
  }

  return NextResponse.json({ success: true })
}
