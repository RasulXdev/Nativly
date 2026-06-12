import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { targetUserId } = await request.json()
  if (!targetUserId) return NextResponse.json({ error: 'targetUserId required' }, { status: 400 })

  // Check if conversation already exists
  const { data: existing } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', user.id)

  const myConvIds = (existing ?? []).map(e => e.conversation_id)

  if (myConvIds.length > 0) {
    const { data: shared } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', targetUserId)
      .in('conversation_id', myConvIds)
    if (shared && shared.length > 0) {
      return NextResponse.json({ conversationId: shared[0].conversation_id })
    }
  }

  // Create new conversation
  const { data: conv, error } = await supabase
    .from('conversations')
    .insert({ type: 'direct' })
    .select()
    .single()

  if (error || !conv) return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })

  await supabase.from('conversation_participants').insert([
    { conversation_id: conv.id, user_id: user.id },
    { conversation_id: conv.id, user_id: targetUserId },
  ])

  return NextResponse.json({ conversationId: conv.id }, { status: 201 })
}
