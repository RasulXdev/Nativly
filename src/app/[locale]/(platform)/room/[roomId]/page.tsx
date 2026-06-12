'use client'

import { useState, useEffect, useRef, use } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import {
  Mic, MicOff, Video, VideoOff, Monitor, MonitorOff,
  MessageSquare, FileText, PhoneOff, Users, Wifi, WifiOff,
  Star, ChevronRight, ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { getInitials } from '@/lib/utils'

type CallPhase = 'pre' | 'in' | 'post'

interface LessonInfo {
  id: string
  room_id: string | null
  scheduled_at: string
  duration_minutes: number
  status: string
  tutor?: {
    profiles?: { full_name?: string; avatar_url?: string }
  }
  student?: {
    full_name?: string
    avatar_url?: string
  }
}

export default function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params)
  const t = useTranslations('video')
  const tc = useTranslations('common')
  const router = useRouter()

  const [phase, setPhase] = useState<CallPhase>('pre')
  const [micEnabled, setMicEnabled] = useState(true)
  const [camEnabled, setCamEnabled] = useState(true)
  const [screenSharing, setScreenSharing] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [showEndDialog, setShowEndDialog] = useState(false)
  const [sharedNotes, setSharedNotes] = useState('')
  const [chatMessage, setChatMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<{ from: string; text: string; time: string }[]>([])
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [lesson, setLesson] = useState<LessonInfo | null>(null)
  const [loadingLesson, setLoadingLesson] = useState(true)
  const [networkGood, setNetworkGood] = useState(true)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startedAtRef = useRef<Date | null>(null)

  useEffect(() => {
    async function fetchLesson() {
      const supabase = createClient()
      const { data } = await supabase
        .from('lessons')
        .select(`
          id, room_id, scheduled_at, duration_minutes, status,
          tutor:tutor_profiles!lessons_tutor_id_fkey(
            profiles(full_name, avatar_url)
          )
        `)
        .or(`room_id.eq.${roomId},id.eq.${roomId}`)
        .single()
      setLesson(data as LessonInfo | null)
      setLoadingLesson(false)
    }
    fetchLesson()
  }, [roomId])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const handleJoin = () => {
    setPhase('in')
    startedAtRef.current = new Date()
    timerRef.current = setInterval(() => {
      setElapsedSeconds(s => s + 1)
    }, 1000)
  }

  const handleEndCall = async () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setShowEndDialog(false)

    if (lesson?.id) {
      const supabase = createClient()
      await supabase.from('lessons').update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        actual_duration_minutes: Math.round(elapsedSeconds / 60),
        shared_notes: sharedNotes || null,
      }).eq('id', lesson.id)
    }
    setPhase('post')
  }

  const handleSendChat = () => {
    if (!chatMessage.trim()) return
    setChatMessages(prev => [...prev, { from: 'You', text: chatMessage, time: formatTimer(elapsedSeconds) }])
    setChatMessage('')
  }

  const handleSubmitReview = async () => {
    if (!rating || !lesson?.id) return
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: tutorProfile } = await supabase
      .from('tutor_profiles')
      .select('id')
      .eq('user_id', lesson.tutor?.profiles ? Object.values(lesson)[0] : '')
      .single()

    if (tutorProfile) {
      await supabase.from('reviews').insert({
        lesson_id: lesson.id,
        student_id: user.id,
        tutor_id: tutorProfile.id,
        rating,
        comment: reviewText,
      })
    }
    setReviewSubmitted(true)
    toast.success(t('postCall.reviewSubmitted'))
  }

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const tutorName = lesson?.tutor?.profiles?.full_name ?? 'Tutor'
  const tutorAvatar = lesson?.tutor?.profiles?.avatar_url ?? ''
  const durationMins = lesson?.duration_minutes ?? 30
  const remainingMins = Math.max(0, durationMins - Math.floor(elapsedSeconds / 60))
  const lessonEndingWarning = remainingMins <= 5 && phase === 'in'

  if (loadingLesson) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background dark">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">{tc('loading')}</p>
        </div>
      </div>
    )
  }

  /* ── PRE-CALL ── */
  if (phase === 'pre') {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center p-4 overflow-x-hidden">
        <div className="w-full max-w-2xl space-y-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" /> {tc('back')}
          </Button>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold">{t('preCall.title')}</h1>
              <p className="text-muted-foreground text-sm">{t('preCall.subtitle')}</p>
            </div>

            {/* Lesson Info */}
            {lesson && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/60">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage src={tutorAvatar} />
                  <AvatarFallback className="gradient-bg text-white font-bold">
                    {getInitials(tutorName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-semibold truncate">{t('preCall.with')} {tutorName}</p>
                  <p className="text-sm text-muted-foreground">{durationMins} {tc('minutes')}</p>
                </div>
              </div>
            )}

            {/* Device checks */}
            <div className="space-y-3">
              {[
                { label: t('preCall.camera'), icon: camEnabled ? Video : VideoOff, ok: camEnabled, toggle: () => setCamEnabled(v => !v) },
                { label: t('preCall.microphone'), icon: micEnabled ? Mic : MicOff, ok: micEnabled, toggle: () => setMicEnabled(v => !v) },
                { label: t('preCall.networkQuality'), icon: networkGood ? Wifi : WifiOff, ok: networkGood, toggle: () => setNetworkGood(v => !v) },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl border border-border/60">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.ok ? 'bg-emerald-500/10' : 'bg-destructive/10'}`}>
                      <item.icon className={`h-4 w-4 ${item.ok ? 'text-emerald-500' : 'text-destructive'}`} />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${item.ok ? 'text-emerald-500' : 'text-destructive'}`}>
                      {item.ok ? t('preCall.good') : t('preCall.poor')}
                    </span>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={item.toggle}>
                      {tc('edit')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={handleJoin} className="w-full gradient-bg border-0 text-white h-12 text-base font-semibold rounded-xl">
              {t('preCall.join')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  /* ── POST-CALL ── */
  if (phase === 'post') {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center p-4 overflow-x-hidden">
        <div className="w-full max-w-lg space-y-5">
          <div className="text-center space-y-1">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-3">
              <Video className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">{t('postCall.title')}</h1>
            <p className="text-muted-foreground text-sm">
              {t('postCall.duration')}: {formatTimer(elapsedSeconds)}
            </p>
          </div>

          {!reviewSubmitted ? (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <h2 className="font-semibold">{t('postCall.writeReview')}</h2>

              {/* Star rating */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setRating(s)} className="transition-transform hover:scale-110">
                    <Star className={`h-8 w-8 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                  </button>
                ))}
              </div>

              <Textarea
                placeholder={t('postCall.reviewPlaceholder')}
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                rows={3}
                className="resize-none"
              />

              <Button
                onClick={handleSubmitReview}
                disabled={!rating}
                className="w-full gradient-bg border-0 text-white"
              >
                {t('postCall.submitReview')}
              </Button>
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
              <p className="text-emerald-500 font-semibold">{t('postCall.reviewSubmitted')}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => router.push('/tutors')}>
              {t('postCall.bookNext')}
            </Button>
            <Button className="flex-1 gradient-bg border-0 text-white" onClick={() => router.push('/dashboard')}>
              {t('postCall.returnDashboard')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  /* ── IN-CALL ── */
  return (
    <div className="flex flex-col h-screen bg-zinc-950 dark overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/80 backdrop-blur border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={tutorAvatar} />
            <AvatarFallback className="gradient-bg text-white text-xs">{getInitials(tutorName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-white">{tutorName}</p>
            <p className="text-xs text-zinc-400">{t('room.title')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lessonEndingWarning && (
            <span className="text-xs text-amber-400 animate-pulse font-medium">
              {remainingMins} {t('room.minutesLeft')}
            </span>
          )}
          <div className="flex items-center gap-1.5 bg-zinc-800 rounded-full px-3 py-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-zinc-300 font-mono">{formatTimer(elapsedSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 min-h-0">
        {/* Video area */}
        <div className="flex-1 flex items-center justify-center bg-zinc-950 relative p-4">
          {/* Remote video placeholder */}
          <div className="w-full max-w-3xl aspect-video bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
            <div className="text-center space-y-3">
              <Avatar className="h-20 w-20 mx-auto">
                <AvatarImage src={tutorAvatar} />
                <AvatarFallback className="gradient-bg text-white text-2xl font-bold">{getInitials(tutorName)}</AvatarFallback>
              </Avatar>
              <p className="text-zinc-400 text-sm">{t('room.waitingForParticipant')}</p>
            </div>
          </div>

          {/* Self video (PiP) */}
          <div className="absolute bottom-6 right-6 w-32 sm:w-40 aspect-video bg-zinc-800 rounded-xl border border-zinc-700 flex items-center justify-center overflow-hidden">
            {camEnabled ? (
              <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
                <Users className="h-6 w-6 text-zinc-400" />
              </div>
            ) : (
              <VideoOff className="h-6 w-6 text-zinc-500" />
            )}
          </div>
        </div>

        {/* Side panel */}
        {(showChat || showNotes) && (
          <div className="w-72 sm:w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col shrink-0">
            {/* Panel tabs */}
            <div className="flex border-b border-zinc-800 shrink-0">
              <button
                onClick={() => { setShowChat(true); setShowNotes(false) }}
                className={`flex-1 py-3 text-xs font-medium transition-colors ${showChat ? 'text-white border-b-2 border-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {t('room.chat')}
              </button>
              <button
                onClick={() => { setShowNotes(true); setShowChat(false) }}
                className={`flex-1 py-3 text-xs font-medium transition-colors ${showNotes ? 'text-white border-b-2 border-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {t('room.notes')}
              </button>
            </div>

            {showChat && (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
                  {chatMessages.length === 0 && (
                    <p className="text-zinc-500 text-xs text-center mt-4">{t('room.chat')}</p>
                  )}
                  {chatMessages.map((m, i) => (
                    <div key={i} className="bg-zinc-800 rounded-xl p-2.5">
                      <p className="text-xs text-zinc-400 mb-1">{m.from} · {m.time}</p>
                      <p className="text-sm text-white">{m.text}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-zinc-800 shrink-0 flex gap-2">
                  <input
                    value={chatMessage}
                    onChange={e => setChatMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                    placeholder="Message..."
                    className="flex-1 bg-zinc-800 text-white text-sm rounded-xl px-3 py-2 outline-none border border-zinc-700 focus:border-primary"
                  />
                  <Button size="sm" onClick={handleSendChat} className="shrink-0 gradient-bg border-0 text-white">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}

            {showNotes && (
              <>
                <div className="flex-1 p-3 min-h-0 flex flex-col">
                  <p className="text-xs text-zinc-400 mb-2">{t('room.sharedNotes')}</p>
                  <Textarea
                    value={sharedNotes}
                    onChange={e => setSharedNotes(e.target.value)}
                    placeholder={t('room.notesPlaceholder')}
                    className="flex-1 resize-none bg-zinc-800 border-zinc-700 text-white text-sm min-h-0"
                  />
                </div>
                <div className="p-3 border-t border-zinc-800 shrink-0">
                  <Button size="sm" variant="outline" className="w-full text-xs border-zinc-700 text-zinc-300" onClick={() => toast.success(t('room.notesSaved'))}>
                    {t('room.saveNotes')}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Controls bar */}
      <div className="shrink-0 bg-zinc-900/90 backdrop-blur border-t border-zinc-800 px-4 py-3">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => setMicEnabled(v => !v)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-colors ${micEnabled ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-destructive/20 hover:bg-destructive/30'}`}
            title={micEnabled ? t('room.mute') : t('room.unmute')}
          >
            {micEnabled ? <Mic className="h-5 w-5 text-white" /> : <MicOff className="h-5 w-5 text-destructive" />}
            <span className="text-[10px] text-zinc-400">{micEnabled ? t('room.mute') : t('room.unmute')}</span>
          </button>

          <button
            onClick={() => setCamEnabled(v => !v)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-colors ${camEnabled ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-destructive/20 hover:bg-destructive/30'}`}
            title={camEnabled ? t('room.cameraOff') : t('room.cameraOn')}
          >
            {camEnabled ? <Video className="h-5 w-5 text-white" /> : <VideoOff className="h-5 w-5 text-destructive" />}
            <span className="text-[10px] text-zinc-400">{camEnabled ? t('room.cameraOff') : t('room.cameraOn')}</span>
          </button>

          <button
            onClick={() => setScreenSharing(v => !v)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-colors ${screenSharing ? 'bg-primary/20' : 'bg-zinc-800 hover:bg-zinc-700'}`}
          >
            {screenSharing ? <MonitorOff className="h-5 w-5 text-primary" /> : <Monitor className="h-5 w-5 text-white" />}
            <span className="text-[10px] text-zinc-400">{screenSharing ? t('room.stopShare') : t('room.screenShare')}</span>
          </button>

          <button
            onClick={() => { setShowChat(v => !v); setShowNotes(false) }}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-colors ${showChat ? 'bg-primary/20' : 'bg-zinc-800 hover:bg-zinc-700'}`}
          >
            <MessageSquare className={`h-5 w-5 ${showChat ? 'text-primary' : 'text-white'}`} />
            <span className="text-[10px] text-zinc-400">{t('room.chat')}</span>
          </button>

          <button
            onClick={() => { setShowNotes(v => !v); setShowChat(false) }}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-colors ${showNotes ? 'bg-primary/20' : 'bg-zinc-800 hover:bg-zinc-700'}`}
          >
            <FileText className={`h-5 w-5 ${showNotes ? 'text-primary' : 'text-white'}`} />
            <span className="text-[10px] text-zinc-400">{t('room.notes')}</span>
          </button>

          <button
            onClick={() => setShowEndDialog(true)}
            className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-destructive hover:bg-destructive/90 transition-colors ml-2"
          >
            <PhoneOff className="h-5 w-5 text-white" />
            <span className="text-[10px] text-white">{t('room.endCall')}</span>
          </button>
        </div>
      </div>

      {/* End call dialog */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent className="dark bg-zinc-900 border-zinc-800 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle>{t('room.endCall')}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {t('room.endCallConfirm')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowEndDialog(false)} className="border-zinc-700 text-zinc-300">
              {tc('cancel')}
            </Button>
            <Button variant="destructive" onClick={handleEndCall}>
              {t('room.endCall')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
