import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get('conversationId')

  if (conversationId) {
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:profiles!messages_sender_id_fkey(full_name, avatar_url)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(50)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  const { data: participations } = await supabase
    .from('conversation_participants')
    .select(`
      conversation_id,
      last_read_at,
      conversation:conversations!conversation_participants_conversation_id_fkey(
        id, type, updated_at,
        participants:conversation_participants(
          user:profiles!conversation_participants_user_id_fkey(id, full_name, avatar_url, is_online)
        )
      )
    `)
    .eq('user_id', user.id)
    .order('conversation(updated_at)', { ascending: false })

  const conversationIds = (participations ?? []).map(p => p.conversation_id)
  const lastMessages: Record<string, { content: string; created_at: string | null }> = {}

  if (conversationIds.length > 0) {
    for (const cid of conversationIds) {
      const { data: lm } = await supabase
        .from('messages')
        .select('content, created_at')
        .eq('conversation_id', cid)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      if (lm) lastMessages[cid] = lm
    }
  }

  const conversations = (participations ?? []).map(p => ({
    ...p.conversation,
    last_message: lastMessages[p.conversation_id] ?? null,
    other_participant: (p.conversation as { participants?: { user: { id: string; full_name: string; avatar_url: string; is_online: boolean } }[] } | null)?.participants?.find(
      (part) => part.user.id !== user.id
    )?.user,
  }))

  return NextResponse.json(conversations)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { conversationId, content } = await request.json()
  if (!conversationId || !content?.trim()) {
    return NextResponse.json({ error: 'conversationId and content are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: user.id, content: content.trim() })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  return NextResponse.json(data, { status: 201 })
}
