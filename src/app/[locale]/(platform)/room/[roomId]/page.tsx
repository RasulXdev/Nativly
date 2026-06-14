'use client'

import { useState, useEffect, useRef, use, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import {
  Mic, MicOff, Video, VideoOff, Monitor, MonitorOff,
  MessageSquare, FileText, PhoneOff, Users, Wifi, WifiOff,
  Star, ChevronRight, ArrowLeft, Loader2
} from 'lucide-react'
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoTrack,
  useTracks,
  useTrackToggle,
  useChat,
  useConnectionState,
  useLocalParticipant,
} from '@livekit/components-react'
import { Track, ConnectionState } from 'livekit-client'
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
  shared_notes?: string | null
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
  const [showEndDialog, setShowEndDialog] = useState(false)
  const [sharedNotes, setSharedNotes] = useState('')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [lesson, setLesson] = useState<LessonInfo | null>(null)
  const [loadingLesson, setLoadingLesson] = useState(true)
  const [networkGood, setNetworkGood] = useState(true)

  // LiveKit connection
  const [token, setToken] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [participantName, setParticipantName] = useState('')
  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sharedNotesRef = useRef('')
  const endedRef = useRef(false)

  useEffect(() => { sharedNotesRef.current = sharedNotes }, [sharedNotes])

  useEffect(() => {
    async function fetchLesson() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
        setParticipantName(profile?.full_name || t('room.defaultParticipant'))
      } else {
        setParticipantName(t('room.defaultParticipant'))
      }
      const { data } = await supabase
        .from('lessons')
        .select(`
          id, room_id, scheduled_at, duration_minutes, status, shared_notes,
          tutor:tutor_profiles!lessons_tutor_id_fkey(
            profiles(full_name, avatar_url)
          )
        `)
        .or(`room_id.eq.${roomId},id.eq.${roomId}`)
        .single()
      const lessonData = data as LessonInfo | null
      setLesson(lessonData)
      if (lessonData?.shared_notes) setSharedNotes(lessonData.shared_notes)
      setLoadingLesson(false)
    }
    fetchLesson()
  }, [roomId])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const handleJoin = async () => {
    if (!serverUrl) {
      toast.error(t('room.notConfigured'))
      return
    }
    setConnecting(true)
    try {
      const res = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, participantName }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to get token')
      }
      const { token: t } = await res.json()
      setToken(t)
      setPhase('in')
      timerRef.current = setInterval(() => setElapsedSeconds(s => s + 1), 1000)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('room.connectionFailed'))
    } finally {
      setConnecting(false)
    }
  }

  const handleEndCall = async () => {
    if (endedRef.current) return
    endedRef.current = true
    if (timerRef.current) clearInterval(timerRef.current)
    setShowEndDialog(false)

    if (lesson?.id) {
      const supabase = createClient()
      await supabase.from('lessons').update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        actual_duration_minutes: Math.round(elapsedSeconds / 60),
        shared_notes: sharedNotesRef.current || null,
      }).eq('id', lesson.id)
    }
    setToken(null) // unmounts LiveKitRoom -> disconnects
    setPhase('post')
  }

  const handleSubmitReview = async () => {
    if (!rating || !lesson?.id) return
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: tutorRow } = await supabase
      .from('lessons')
      .select('tutor_id')
      .eq('id', lesson.id)
      .single()

    if (tutorRow?.tutor_id) {
      await supabase.from('reviews').insert({
        lesson_id: lesson.id,
        student_id: user.id,
        tutor_id: tutorRow.tutor_id,
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

  const tutorName = lesson?.tutor?.profiles?.full_name ?? t('room.defaultTutor')
  const tutorAvatar = lesson?.tutor?.profiles?.avatar_url ?? ''
  const durationMins = lesson?.duration_minutes ?? 30

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
      <div className="min-h-dvh bg-background dark flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-2xl space-y-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" /> {tc('back')}
          </Button>

          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 space-y-5 sm:space-y-6">
            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold">{t('preCall.title')}</h1>
              <p className="text-muted-foreground text-sm">{t('preCall.subtitle')}</p>
            </div>

            {/* Lesson Info */}
            {lesson && (
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-muted/30 border border-border/60">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
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
            <div className="space-y-2.5">
              {[
                { label: t('preCall.camera'), icon: camEnabled ? Video : VideoOff, ok: camEnabled, toggle: () => setCamEnabled(v => !v) },
                { label: t('preCall.microphone'), icon: micEnabled ? Mic : MicOff, ok: micEnabled, toggle: () => setMicEnabled(v => !v) },
                { label: t('preCall.networkQuality'), icon: networkGood ? Wifi : WifiOff, ok: networkGood, toggle: () => setNetworkGood(v => !v) },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-xl border border-border/60">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.ok ? 'bg-emerald-500/10' : 'bg-destructive/10'}`}>
                      <item.icon className={`h-4 w-4 ${item.ok ? 'text-emerald-500' : 'text-destructive'}`} />
                    </div>
                    <span className="text-sm font-medium truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs whitespace-nowrap ${item.ok ? 'text-emerald-500' : 'text-destructive'}`}>
                      {item.ok ? t('preCall.good') : t('preCall.poor')}
                    </span>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={item.toggle}>
                      {tc('edit')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={handleJoin} disabled={connecting} className="w-full gradient-bg border-0 text-white h-12 text-base font-semibold rounded-xl">
              {connecting ? <Loader2 className="h-5 w-5 animate-spin" /> : t('preCall.join')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  /* ── POST-CALL ── */
  if (phase === 'post') {
    return (
      <div className="min-h-dvh bg-background dark flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-lg space-y-5">
          <div className="text-center space-y-1">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-3">
              <Video className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">{t('postCall.title')}</h1>
            <p className="text-muted-foreground text-sm">
              {t('postCall.duration')}: {formatTimer(elapsedSeconds)}
            </p>
          </div>

          {!reviewSubmitted ? (
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 space-y-5">
              <h2 className="font-semibold">{t('postCall.writeReview')}</h2>

              {/* Star rating */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setRating(s)} className="transition-transform hover:scale-110">
                    <Star className={`h-7 w-7 sm:h-8 sm:w-8 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
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
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-6 text-center">
              <p className="text-emerald-500 font-semibold">{t('postCall.reviewSubmitted')}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
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
  if (!token || !serverUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 dark">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect
      audio={micEnabled}
      video={camEnabled}
      onDisconnected={() => { if (phase === 'in') handleEndCall() }}
      data-lk-theme="default"
      className="h-screen"
    >
      <RoomAudioRenderer />
      <InCallView
        tutorName={tutorName}
        tutorAvatar={tutorAvatar}
        durationMins={durationMins}
        elapsedSeconds={elapsedSeconds}
        formatTimer={formatTimer}
        sharedNotes={sharedNotes}
        setSharedNotes={setSharedNotes}
        onRequestEnd={() => setShowEndDialog(true)}
      />

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
    </LiveKitRoom>
  )
}

/* ── In-call view (inside LiveKitRoom context) ── */
function InCallView({
  tutorName,
  tutorAvatar,
  durationMins,
  elapsedSeconds,
  formatTimer,
  sharedNotes,
  setSharedNotes,
  onRequestEnd,
}: {
  tutorName: string
  tutorAvatar: string
  durationMins: number
  elapsedSeconds: number
  formatTimer: (s: number) => string
  sharedNotes: string
  setSharedNotes: (v: string) => void
  onRequestEnd: () => void
}) {
  const t = useTranslations('video')
  const [showChat, setShowChat] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [chatInput, setChatInput] = useState('')

  const connectionState = useConnectionState()
  const { localParticipant } = useLocalParticipant()
  const { toggle: toggleMic, enabled: micOn } = useTrackToggle({ source: Track.Source.Microphone })
  const { toggle: toggleCam, enabled: camOn } = useTrackToggle({ source: Track.Source.Camera })
  const { toggle: toggleScreen, enabled: screenOn } = useTrackToggle({ source: Track.Source.ScreenShare })
  const { chatMessages, send } = useChat()

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  )

  const localCameraTrack = useMemo(
    () => tracks.find(tr => tr.participant.isLocal && tr.source === Track.Source.Camera),
    [tracks]
  )
  const remoteCameraTrack = useMemo(
    () => tracks.find(tr => !tr.participant.isLocal && tr.source === Track.Source.Camera),
    [tracks]
  )
  const screenShareTrack = useMemo(
    () => tracks.find(tr => tr.source === Track.Source.ScreenShare && tr.publication),
    [tracks]
  )

  const remoteConnected = !!remoteCameraTrack?.participant
  const remainingMins = Math.max(0, durationMins - Math.floor(elapsedSeconds / 60))
  const lessonEndingWarning = remainingMins <= 5

  const handleSendChat = () => {
    if (!chatInput.trim()) return
    send(chatInput)
    setChatInput('')
  }

  // The main stage: screen share takes priority, then remote camera, else placeholder.
  const mainTrack = (screenShareTrack?.publication && screenShareTrack) || (remoteCameraTrack?.publication && remoteCameraTrack) || null

  return (
    <div className="flex flex-col h-dvh bg-zinc-950 dark overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-zinc-900/80 backdrop-blur border-b border-zinc-800 shrink-0 gap-2 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={tutorAvatar} />
            <AvatarFallback className="gradient-bg text-white text-xs">{getInitials(tutorName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{tutorName}</p>
            <p className="text-xs text-zinc-400 truncate">{t('room.title')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {connectionState === ConnectionState.Reconnecting && (
            <span className="text-xs text-amber-400 animate-pulse font-medium hidden sm:inline">{t('room.reconnecting')}</span>
          )}
          {lessonEndingWarning && (
            <span className="text-xs text-amber-400 animate-pulse font-medium whitespace-nowrap">
              {remainingMins} {t('room.minutesLeft')}
            </span>
          )}
          <div className="flex items-center gap-1.5 bg-zinc-800 rounded-full px-2.5 py-1">
            <div className={`w-2 h-2 rounded-full shrink-0 ${connectionState === ConnectionState.Connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-xs text-zinc-300 font-mono">{formatTimer(elapsedSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Video area */}
        <div className="flex-1 min-w-0 flex items-center justify-center bg-zinc-950 relative p-2 sm:p-4">
          {/* Remote / main video */}
          <div className="w-full h-full max-w-4xl max-h-full bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 overflow-hidden">
            {mainTrack ? (
              <VideoTrack trackRef={mainTrack} className="w-full h-full object-contain rounded-2xl" />
            ) : (
              <div className="text-center space-y-3">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 mx-auto">
                  <AvatarImage src={tutorAvatar} />
                  <AvatarFallback className="gradient-bg text-white text-xl sm:text-2xl font-bold">{getInitials(tutorName)}</AvatarFallback>
                </Avatar>
                <p className="text-zinc-400 text-xs sm:text-sm">{t('room.waitingForParticipant')}</p>
              </div>
            )}
          </div>

          {/* Self video (PiP) */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-24 sm:w-36 aspect-video bg-zinc-800 rounded-xl border border-zinc-700 flex items-center justify-center overflow-hidden shadow-lg">
            {camOn && localCameraTrack?.publication ? (
              <VideoTrack trackRef={localCameraTrack} className="w-full h-full object-cover" />
            ) : (
              <VideoOff className="h-5 w-5 text-zinc-500" />
            )}
          </div>
        </div>

        {/* Side panel */}
        {(showChat || showNotes) && (
          <div className="w-64 sm:w-72 md:w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col shrink-0 max-h-full overflow-hidden">
            {/* Panel tabs */}
            <div className="flex border-b border-zinc-800 shrink-0">
              <button
                onClick={() => { setShowChat(true); setShowNotes(false) }}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${showChat ? 'text-white border-b-2 border-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {t('room.chat')}
              </button>
              <button
                onClick={() => { setShowNotes(true); setShowChat(false) }}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${showNotes ? 'text-white border-b-2 border-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
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
                    <div key={m.id ?? i} className="bg-zinc-800 rounded-xl p-2.5 overflow-hidden">
                      <p className="text-xs text-zinc-400 mb-1 truncate">
                        {m.from?.identity === localParticipant.identity ? t('room.you') : (m.from?.name || m.from?.identity || '—')} · {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-sm text-white break-words overflow-wrap-anywhere">{m.message}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2.5 border-t border-zinc-800 shrink-0 flex gap-2">
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                    placeholder={t('room.messagePlaceholder')}
                    className="flex-1 min-w-0 bg-zinc-800 text-white text-sm rounded-xl px-3 py-2 outline-none border border-zinc-700 focus:border-primary"
                  />
                  <Button size="sm" onClick={handleSendChat} className="shrink-0 gradient-bg border-0 text-white">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}

            {showNotes && (
              <>
                <div className="flex-1 p-3 min-h-0 flex flex-col overflow-hidden">
                  <p className="text-xs text-zinc-400 mb-2 shrink-0">{t('room.sharedNotes')}</p>
                  <Textarea
                    value={sharedNotes}
                    onChange={e => setSharedNotes(e.target.value)}
                    placeholder={t('room.notesPlaceholder')}
                    className="flex-1 resize-none bg-zinc-800 border-zinc-700 text-white text-sm min-h-0"
                  />
                </div>
                <div className="p-2.5 border-t border-zinc-800 shrink-0">
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
      <div className="shrink-0 bg-zinc-900/90 backdrop-blur border-t border-zinc-800 px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-center gap-1.5 sm:gap-3">
          <button
            onClick={() => toggleMic()}
            className={`flex flex-col items-center gap-0.5 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-colors ${micOn ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-destructive/20 hover:bg-destructive/30'}`}
            title={micOn ? t('room.mute') : t('room.unmute')}
          >
            {micOn ? <Mic className="h-4 w-4 sm:h-5 sm:w-5 text-white" /> : <MicOff className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />}
            <span className="text-[9px] sm:text-[10px] text-zinc-400 hidden sm:block">{micOn ? t('room.mute') : t('room.unmute')}</span>
          </button>

          <button
            onClick={() => toggleCam()}
            className={`flex flex-col items-center gap-0.5 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-colors ${camOn ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-destructive/20 hover:bg-destructive/30'}`}
            title={camOn ? t('room.cameraOff') : t('room.cameraOn')}
          >
            {camOn ? <Video className="h-4 w-4 sm:h-5 sm:w-5 text-white" /> : <VideoOff className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />}
            <span className="text-[9px] sm:text-[10px] text-zinc-400 hidden sm:block">{camOn ? t('room.cameraOff') : t('room.cameraOn')}</span>
          </button>

          <button
            onClick={() => toggleScreen()}
            className={`flex flex-col items-center gap-0.5 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-colors hidden sm:flex ${screenOn ? 'bg-primary/20' : 'bg-zinc-800 hover:bg-zinc-700'}`}
          >
            {screenOn ? <MonitorOff className="h-4 w-4 sm:h-5 sm:w-5 text-primary" /> : <Monitor className="h-4 w-4 sm:h-5 sm:w-5 text-white" />}
            <span className="text-[9px] sm:text-[10px] text-zinc-400 hidden sm:block">{screenOn ? t('room.stopShare') : t('room.screenShare')}</span>
          </button>

          <button
            onClick={() => { setShowChat(v => !v); setShowNotes(false) }}
            className={`flex flex-col items-center gap-0.5 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-colors ${showChat ? 'bg-primary/20' : 'bg-zinc-800 hover:bg-zinc-700'}`}
          >
            <MessageSquare className={`h-4 w-4 sm:h-5 sm:w-5 ${showChat ? 'text-primary' : 'text-white'}`} />
            <span className="text-[9px] sm:text-[10px] text-zinc-400 hidden sm:block">{t('room.chat')}</span>
          </button>

          <button
            onClick={() => { setShowNotes(v => !v); setShowChat(false) }}
            className={`flex flex-col items-center gap-0.5 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-colors ${showNotes ? 'bg-primary/20' : 'bg-zinc-800 hover:bg-zinc-700'}`}
          >
            <FileText className={`h-4 w-4 sm:h-5 sm:w-5 ${showNotes ? 'text-primary' : 'text-white'}`} />
            <span className="text-[9px] sm:text-[10px] text-zinc-400 hidden sm:block">{t('room.notes')}</span>
          </button>

          <button
            onClick={onRequestEnd}
            className="flex flex-col items-center gap-0.5 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-destructive hover:bg-destructive/90 transition-colors ml-1 sm:ml-2"
          >
            <PhoneOff className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            <span className="text-[9px] sm:text-[10px] text-white hidden sm:block">{t('room.endCall')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
