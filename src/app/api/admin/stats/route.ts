import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const admin = createAdminClient()

  const [
    { count: totalUsers },
    { count: totalTutors },
    { count: lessonsToday },
    { count: activeLessons },
    { count: pendingApplications },
  ] = await Promise.all([
    admin.from('profiles').select('*', { count: 'exact', head: true }),
    admin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'tutor'),
    admin.from('lessons').select('*', { count: 'exact', head: true })
      .gte('scheduled_at', new Date().toISOString().slice(0, 10)),
    admin.from('lessons').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
    admin.from('tutor_profiles').select('*', { count: 'exact', head: true }).eq('application_status', 'pending'),
  ])

  const { data: recentUsers } = await admin
    .from('profiles')
    .select('id, full_name, email, role, created_at, avatar_url')
    .order('created_at', { ascending: false })
    .limit(5)

  return NextResponse.json({
    totalUsers: totalUsers ?? 0,
    totalTutors: totalTutors ?? 0,
    lessonsToday: lessonsToday ?? 0,
    activeLessons: activeLessons ?? 0,
    pendingApplications: pendingApplications ?? 0,
    recentUsers: recentUsers ?? [],
  })
}
