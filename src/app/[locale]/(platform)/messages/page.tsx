'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { format, isToday, isYesterday } from 'date-fns'
import { Send, Search, MessageSquare, Paperclip, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import EmptyState from '@/components/shared/EmptyState'
import { createClient } from '@/lib/supabase/client'
import { getInitials } from '@/lib/utils'
import { toast } from 'sonner'

interface OtherUser {
  id: string
  full_name: string
  avatar_url: string
  is_online: boolean
}

interface Conversation {
  id: string
  type: string
  updated_at: string
  last_message: { content: string; created_at: string } | null
  other_participant: OtherUser | undefined
}

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
}

function formatMsgTime(dateStr: string) {
  const d = new Date(dateStr)
  if (isToday(d)) return format(d, 'HH:mm')
  if (isYesterday(d)) return format(d, 'HH:mm')
  return format(d, 'd MMM')
}

export default function MessagesPage() {
  const t = useTranslations('messages')

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [sending, setSending] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [isDesktop, setIsDesktop] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelRef = useRef<any>(null)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id)
    })
  }, [])

  const fetchConversations = useCallback(async () => {
    setLoadingConvs(true)
    const res = await fetch('/api/messages')
    if (res.ok) setConversations(await res.json())
    setLoadingConvs(false)
  }, [])

  useEffect(() => { fetchConversations() }, [fetchConversations])

  const fetchMessages = useCallback(async (convId: string) => {
    setLoadingMsgs(true)
    const res = await fetch(`/api/messages?conversationId=${convId}`)
    if (res.ok) setMessages(await res.json())
    setLoadingMsgs(false)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const selectConversation = useCallback((conv: Conversation) => {
    setSelectedConv(conv)
    fetchMessages(conv.id)

    if (channelRef.current) {
      const supabase = createClient()
      supabase.removeChannel(channelRef.current)
    }

    const supabase = createClient()
    const channel = supabase
      .channel(`messages:${conv.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conv.id}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()
    channelRef.current = channel
  }, [fetchMessages])

  const handleSend = async () => {
    if (!messageText.trim() || !selectedConv || sending) return
    setSending(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: selectedConv.id, content: messageText.trim() }),
      })
      if (res.ok) {
        const msg = await res.json()
        setMessages(prev => [...prev, msg])
        setMessageText('')
        if (textareaRef.current) textareaRef.current.style.height = 'auto'
        fetchConversations()
      } else {
        toast.error(t('sendError'))
      }
    } finally {
      setSending(false)
    }
  }

  const filtered = conversations.filter(c =>
    !search || c.other_participant?.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  const showList = isDesktop || !selectedConv
  const showChat = isDesktop || !!selectedConv

  return (
    <div className="h-[calc(100vh-8rem)] flex overflow-hidden rounded-2xl border border-border bg-card">
      {/* Conversation list */}
      {showList && (
        <div className={`${isDesktop ? 'w-72 shrink-0' : 'w-full'} flex flex-col border-r border-border`}>
          <div className="px-4 py-4 border-b border-border/60 space-y-3 shrink-0">
            <h1 className="font-bold text-lg">{t('title')}</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('searchConversations')}
                className="w-full bg-muted/40 rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary border border-border/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConvs ? (
              <div className="p-3 space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <Skeleton className="h-11 w-11 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title={t('noConversations')}
                description={t('noConversationsDesc')}
                className="py-12"
              />
            ) : (
              filtered.map(conv => {
                const isSelected = selectedConv?.id === conv.id
                const other = conv.other_participant
                return (
                  <button
                    key={conv.id}
                    onClick={() => selectConversation(conv)}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-muted/40 transition-colors border-b border-border/30 ${isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-11 w-11">
                        <AvatarImage src={other?.avatar_url ?? ''} />
                        <AvatarFallback className="gradient-bg text-white text-sm font-bold">
                          {getInitials(other?.full_name ?? '?')}
                        </AvatarFallback>
                      </Avatar>
                      {other?.is_online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold truncate">{other?.full_name ?? 'User'}</p>
                        {conv.last_message && (
                          <span className="text-xs text-muted-foreground shrink-0 ml-1">
                            {formatMsgTime(conv.last_message.created_at)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {conv.last_message?.content ?? ''}
                      </p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* Chat panel */}
      {showChat && (
        <div className="flex-1 flex flex-col min-w-0">
          {!selectedConv ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={MessageSquare}
                title={t('selectConversation')}
                description={t('selectConversationDesc')}
              />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60 shrink-0">
                {!isDesktop && (
                  <button onClick={() => setSelectedConv(null)} className="p-1 rounded-lg hover:bg-muted mr-1 text-muted-foreground text-lg">
                    ←
                  </button>
                )}
                <div className="relative shrink-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={selectedConv.other_participant?.avatar_url ?? ''} />
                    <AvatarFallback className="gradient-bg text-white text-xs font-bold">
                      {getInitials(selectedConv.other_participant?.full_name ?? '?')}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConv.other_participant?.is_online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{selectedConv.other_participant?.full_name ?? 'User'}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedConv.other_participant?.is_online ? t('online') : t('lastSeen')}
                  </p>
                </div>
                <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {loadingMsgs ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                        <Skeleton className="h-10 w-48 rounded-2xl" />
                      </div>
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground text-sm">{t('noMessages')}</p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isMine = msg.sender_id === currentUserId
                    const showDate = i === 0 || (
                      new Date(msg.created_at).toDateString() !== new Date(messages[i - 1].created_at).toDateString()
                    )
                    return (
                      <div key={msg.id}>
                        {showDate && (
                          <div className="text-center my-3">
                            <span className="text-xs text-muted-foreground bg-muted/40 px-3 py-1 rounded-full">
                              {isToday(new Date(msg.created_at)) ? t('today') : isYesterday(new Date(msg.created_at)) ? t('yesterday') : format(new Date(msg.created_at), 'd MMM yyyy')}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isMine ? 'gradient-bg text-white rounded-br-md' : 'bg-muted/60 text-foreground rounded-bl-md'
                          }`}>
                            <p className="break-words">{msg.content}</p>
                            <p className={`text-[10px] mt-1 ${isMine ? 'text-white/60' : 'text-muted-foreground'}`}>
                              {format(new Date(msg.created_at), 'HH:mm')}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="shrink-0 p-3 border-t border-border/60">
                <div className="flex items-end gap-2">
                  <button className="p-2 rounded-xl hover:bg-muted text-muted-foreground shrink-0 mb-0.5">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <textarea
                      ref={textareaRef}
                      value={messageText}
                      onChange={e => setMessageText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSend()
                        }
                      }}
                      onInput={e => {
                        const el = e.currentTarget
                        el.style.height = 'auto'
                        el.style.height = Math.min(el.scrollHeight, 120) + 'px'
                      }}
                      placeholder={t('typeMessage')}
                      rows={1}
                      className="w-full bg-muted/40 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary border border-border/50 resize-none overflow-hidden"
                      style={{ minHeight: '40px', maxHeight: '120px' }}
                    />
                  </div>
                  <Button
                    onClick={handleSend}
                    disabled={!messageText.trim() || sending}
                    size="icon"
                    className="shrink-0 gradient-bg border-0 text-white rounded-xl h-10 w-10 mb-0.5"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
