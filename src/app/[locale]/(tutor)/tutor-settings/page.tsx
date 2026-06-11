'use client'

import { useState, useRef } from 'react'
import {
  Settings, User, Video, Bell, Camera, X,
  Link2, Zap, BellRing, BellOff, CheckCircle2,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useTutorProfile, useUpdateTutorProfile, useUpdateProfile } from '@/hooks/useTutorProfile'
import { createClient } from '@/lib/supabase/client'
import { getInitials } from '@/lib/utils'
import { toast } from 'sonner'

const SPECIALIZATION_OPTIONS = [
  'IELTS', 'TOEFL', 'Business English', 'Uşaqlar üçün', 'Danışıq',
  'Qrammatika', 'Tələffüz', 'Akademik yazı', 'Səyahət', 'İntervyu hazırlığı',
]

const NOTIFICATION_ITEMS = [
  { key: 'booking', icon: CheckCircle2, label: 'Yeni rezervasiya', desc: 'Tələbə sizi rezerv etdikdə bildiriş al', color: 'text-emerald-400', bg: 'bg-emerald-500/10', default: true },
  { key: 'reminder', icon: BellRing, label: 'Dərs xatırlatması', desc: '1 saat əvvəl avtomatik xatırlatma', color: 'text-blue-400', bg: 'bg-blue-500/10', default: true },
  { key: 'cancel', icon: BellOff, label: 'Dərs ləğvi', desc: 'Tələbə dərsi ləğv etdikdə', color: 'text-rose-400', bg: 'bg-rose-500/10', default: true },
  { key: 'review', icon: CheckCircle2, label: 'Yeni rəy', desc: 'Tələbə rəy bildirdikdə', color: 'text-amber-400', bg: 'bg-amber-500/10', default: true },
  { key: 'payment', icon: CheckCircle2, label: 'Ödəniş', desc: 'Dərs ödənişi alındıqda', color: 'text-violet-400', bg: 'bg-violet-500/10', default: true },
  { key: 'marketing', icon: Bell, label: 'Xəbər emailləri', desc: 'Nativly yenilikləri və təklifləri', color: 'text-muted-foreground', bg: 'bg-muted', default: false },
]

export default function TutorSettingsPage() {
  const { data: profile, isLoading } = useTutorProfile()
  const updateTutor = useUpdateTutorProfile()
  const updateProf = useUpdateProfile()
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)

  const tutorProfile = profile as (typeof profile & {
    profiles?: { full_name: string; avatar_url: string | null; bio: string | null }
    headline?: string
    about?: string
    specializations?: string[]
    instant_booking?: boolean
    video_intro_url?: string
  }) | null

  const [bio, setBio] = useState(tutorProfile?.profiles?.bio ?? '')
  const [headline, setHeadline] = useState(tutorProfile?.headline ?? '')
  const [about, setAbout] = useState(tutorProfile?.about ?? '')
  const [specs, setSpecs] = useState<string[]>(tutorProfile?.specializations ?? [])
  const [instantBooking, setInstantBooking] = useState(tutorProfile?.instant_booking ?? true)
  const [videoUrl, setVideoUrl] = useState(tutorProfile?.video_intro_url ?? '')
  const [avatarUrl, setAvatarUrl] = useState(tutorProfile?.profiles?.avatar_url ?? '')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const profileLoaded = !!tutorProfile
  useState(() => {
    if (!profileLoaded) return
    setBio(tutorProfile?.profiles?.bio ?? '')
    setHeadline(tutorProfile?.headline ?? '')
    setAbout(tutorProfile?.about ?? '')
    setSpecs(tutorProfile?.specializations ?? [])
    setInstantBooking(tutorProfile?.instant_booking ?? true)
    setVideoUrl(tutorProfile?.video_intro_url ?? '')
    setAvatarUrl(tutorProfile?.profiles?.avatar_url ?? '')
  })

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const path = `${user.id}/${Date.now()}-${file.name}`
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (upErr) throw upErr
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      await updateProf.mutateAsync({ avatar_url: publicUrl })
      setAvatarUrl(publicUrl)
      toast.success('Avatar yeniləndi')
    } catch {
      toast.error('Avatar yüklənmədi')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const saveProfile = async () => {
    try {
      await Promise.all([
        updateProf.mutateAsync({ bio }),
        updateTutor.mutateAsync({ headline, about, specializations: specs }),
      ])
      toast.success('Profil yeniləndi')
    } catch {
      toast.error('Xəta baş verdi')
    }
  }

  const saveLesson = async () => {
    try {
      await updateTutor.mutateAsync({ video_intro_url: videoUrl, instant_booking: instantBooking })
      toast.success('Dərs tənzimləmələri yeniləndi')
    } catch {
      toast.error('Xəta baş verdi')
    }
  }

  const toggleSpec = (s: string) =>
    setSpecs((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-11 w-72 rounded-xl" />
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-11 w-full rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ── Page header ──────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl gradient-bg p-6 text-white">
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
        />
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/8 float-slow" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="relative shrink-0">
            <Avatar className="h-16 w-16 border-2 border-white/30">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-white/15 text-white text-xl font-bold">
                {getInitials(tutorProfile?.profiles?.full_name ?? 'M')}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md"
            >
              <Camera className="h-3 w-3 text-primary" />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Tənzimləmələr</h1>
            <p className="text-sm text-white/70 mt-0.5">
              {tutorProfile?.profiles?.full_name} · {headline || 'Başlıq əlavə et'}
            </p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────── */}
      <Tabs defaultValue="profile" className="space-y-5">
        <TabsList className="rounded-2xl h-12 bg-card border border-border p-1 w-full sm:w-auto grid grid-cols-3 sm:inline-flex gap-1">
          <TabsTrigger value="profile" className="rounded-xl text-xs sm:text-sm gap-1.5 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <User className="h-3.5 w-3.5" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="lesson" className="rounded-xl text-xs sm:text-sm gap-1.5 data-[state=active]:bg-violet-500 data-[state=active]:text-white">
            <Video className="h-3.5 w-3.5" />
            Dərs
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl text-xs sm:text-sm gap-1.5 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
            <Bell className="h-3.5 w-3.5" />
            Bildiriş
          </TabsTrigger>
        </TabsList>

        {/* ── PROFILE TAB ───────────────────────────────── */}
        <TabsContent value="profile" className="space-y-5 mt-0">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
            <div className="flex items-center gap-2 pb-1 border-b border-border/60">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-blue-500" />
              </div>
              <h2 className="font-semibold text-sm">Profil məlumatları</h2>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Başlıq</Label>
              <Input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="IELTS Expert | Native English Speaker"
                className="rounded-xl h-11"
              />
              <p className="text-xs text-muted-foreground">{headline.length} / 80 simvol</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Haqqımda</Label>
              <Textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Özünüz haqqında ətraflı yazın — təcrübəniz, metodologiyanız, nailiyyətləriniz..."
                className="rounded-xl min-h-[120px] resize-none"
              />
              <p className="text-xs text-muted-foreground">{about.length} simvol</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Qısa bio</Label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Profil kartında görünəcək qısa bio..."
                className="rounded-xl min-h-[80px] resize-none"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">İxtisaslar</Label>
              <div className="flex flex-wrap gap-2">
                {SPECIALIZATION_OPTIONS.map((s) => {
                  const active = specs.includes(s)
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSpec(s)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all duration-200 font-medium ${
                        active
                          ? 'gradient-bg text-white border-transparent shadow-sm shadow-primary/20'
                          : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground bg-muted/30'
                      }`}
                    >
                      {active && <CheckCircle2 className="h-3 w-3" />}
                      {s}
                    </button>
                  )
                })}
              </div>
              {specs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {specs.map((s) => (
                    <Badge key={s} className="text-xs bg-primary/10 text-primary border-primary/20 gap-1 pl-2 pr-1">
                      {s}
                      <button
                        onClick={() => toggleSpec(s)}
                        className="rounded-full hover:bg-primary/20 p-0.5 transition-colors"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={saveProfile}
              disabled={updateTutor.isPending || updateProf.isPending}
              className="gradient-bg border-0 text-white rounded-xl h-11 px-8"
            >
              {updateTutor.isPending ? 'Saxlanılır...' : 'Profili yenilə'}
            </Button>
          </div>
        </TabsContent>

        {/* ── LESSON TAB ────────────────────────────────── */}
        <TabsContent value="lesson" className="space-y-5 mt-0">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
            <div className="flex items-center gap-2 pb-1 border-b border-border/60">
              <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Video className="h-3.5 w-3.5 text-violet-500" />
              </div>
              <h2 className="font-semibold text-sm">Tanıtım videosu</h2>
            </div>

            <p className="text-sm text-muted-foreground">
              YouTube və ya Vimeo linkindən video əlavə edin. Profil səhifənizdə göstəriləcək.
            </p>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Video URL</Label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="rounded-xl h-11 pl-10"
                />
              </div>
            </div>

            {videoUrl ? (
              <div className="rounded-2xl overflow-hidden border border-border aspect-video bg-muted/40 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Video className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Video önizləmə</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 aspect-video bg-muted/20 flex items-center justify-center">
                <div className="text-center">
                  <Video className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Video URL daxil edin</p>
                </div>
              </div>
            )}
          </div>

          {/* Instant booking card */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4 pb-1 border-b border-border/60">
              <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-violet-500" />
              </div>
              <h2 className="font-semibold text-sm">Ani rezervasiya</h2>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="h-4 w-4 text-violet-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Birbaşa rezervasiya</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tələbələr öncədən razılaşma olmadan dərs rezerv edə bilər
                  </p>
                </div>
              </div>
              <Switch checked={instantBooking} onCheckedChange={setInstantBooking} />
            </div>

            <div className="mt-4 rounded-xl bg-amber-500/8 border border-amber-500/20 p-3 flex items-start gap-2">
              <span className="text-base shrink-0">💡</span>
              <p className="text-xs text-muted-foreground">
                Qiymətlər platform tərəfindən idarə olunur — siz qiymət təyin etmirsiniz.
                Hər tamamlanan dərs üçün sabit ödəniş alırsınız.
              </p>
            </div>

            <Button
              onClick={saveLesson}
              disabled={updateTutor.isPending}
              className="gradient-bg border-0 text-white rounded-xl h-11 px-8 mt-4"
            >
              {updateTutor.isPending ? 'Saxlanılır...' : 'Yadda saxla'}
            </Button>
          </div>
        </TabsContent>

        {/* ── NOTIFICATIONS TAB ─────────────────────────── */}
        <TabsContent value="notifications" className="space-y-5 mt-0">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-border/60">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Bell className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <h2 className="font-semibold text-sm">Bildiriş tənzimləmələri</h2>
            </div>

            <div className="space-y-2">
              {NOTIFICATION_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.key}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border/60 hover:border-border transition-colors bg-muted/10"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}>
                      <Icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.default} />
                  </div>
                )
              })}
            </div>

            <Button className="gradient-bg border-0 text-white rounded-xl h-11 px-8">
              Bildirişləri yenilə
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
