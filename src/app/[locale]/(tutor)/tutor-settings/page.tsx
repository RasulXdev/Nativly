'use client'

import { useState, useRef } from 'react'
import { Settings, User, Video, Bell, Camera, X } from 'lucide-react'
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

  // Sync state when profile loads
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
      await updateTutor.mutateAsync({
        video_intro_url: videoUrl,
        instant_booking: instantBooking,
      })
      toast.success('Dərs tənzimləmələri yeniləndi')
    } catch {
      toast.error('Xəta baş verdi')
    }
  }

  const toggleSpec = (s: string) => {
    setSpecs((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
          <Settings className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Tənzimləmələr</h1>
          <p className="text-sm text-muted-foreground">Profil, dərs və bildiriş tənzimləmələri</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-5">
        <TabsList className="rounded-xl h-11 bg-card border border-border p-1 w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
          <TabsTrigger value="profile" className="rounded-lg text-xs sm:text-sm">
            <User className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="lesson" className="rounded-lg text-xs sm:text-sm">
            <Video className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
            Dərs
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg text-xs sm:text-sm">
            <Bell className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
            Bildiriş
          </TabsTrigger>
        </TabsList>

        {/* Profile tab */}
        <TabsContent value="profile" className="space-y-5 mt-0">
          {/* Avatar */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">Profil şəkli</h2>
            <div className="flex items-center gap-5">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="gradient-bg text-white text-xl font-bold">
                    {getInitials(tutorProfile?.profiles?.full_name ?? 'M')}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full gradient-bg flex items-center justify-center shadow-md border-2 border-background"
                >
                  <Camera className="h-3 w-3 text-white" />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium">{tutorProfile?.profiles?.full_name}</p>
                <p className="text-xs text-muted-foreground mb-2">JPG, PNG — maks. 2MB</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="rounded-lg h-8 text-xs"
                >
                  {uploadingAvatar ? 'Yüklənir...' : 'Şəkil yüklə'}
                </Button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
          </div>

          {/* Profile fields */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold">Profil məlumatları</h2>

            <div className="space-y-2">
              <Label>Başlıq</Label>
              <Input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="IELTS Expert | Native English Speaker"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Haqqımda</Label>
              <Textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Özünüz haqqında ətraflı yazın..."
                className="rounded-xl min-h-[120px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Qısa bio</Label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Qısa bio..."
                className="rounded-xl min-h-[80px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>İxtisaslar</Label>
              <div className="flex flex-wrap gap-2">
                {SPECIALIZATION_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSpec(s)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      specs.includes(s)
                        ? 'gradient-bg text-white border-transparent'
                        : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                    }`}
                  >
                    {specs.includes(s) && <span className="mr-1">✓</span>}
                    {s}
                  </button>
                ))}
              </div>
              {specs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {specs.map((s) => (
                    <Badge key={s} className="text-xs bg-primary/10 text-primary border-primary/20 gap-1">
                      {s}
                      <button onClick={() => toggleSpec(s)}>
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
              className="gradient-bg border-0 text-white rounded-xl w-full sm:w-auto px-8"
            >
              {updateTutor.isPending ? 'Saxlanılır...' : 'Profili yenilə'}
            </Button>
          </div>
        </TabsContent>

        {/* Lesson tab: video intro + instant booking */}
        <TabsContent value="lesson" className="space-y-5 mt-0">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold">Tanıtım videosu</h2>
            <p className="text-sm text-muted-foreground">
              YouTube, Vimeo və ya digər video platformadan link daxil edin. Bu video profil səhifənizdə göstəriləcək.
            </p>

            <div className="space-y-2">
              <Label>Video URL</Label>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="rounded-xl"
              />
            </div>

            {videoUrl && (
              <div className="rounded-xl overflow-hidden border border-border aspect-video bg-black/50 flex items-center justify-center">
                <p className="text-xs text-muted-foreground">Video önizləmə</p>
              </div>
            )}

            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-white/3">
              <div>
                <p className="text-sm font-medium">Ani rezervasiya</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tələbələr sizinlə birbaşa razılaşma olmadan rezerv edə bilər
                </p>
              </div>
              <Switch
                checked={instantBooking}
                onCheckedChange={setInstantBooking}
              />
            </div>

            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
              <p className="text-xs text-muted-foreground">
                💡 Qiymətlər platform tərəfindən idarə olunur — siz qiymət təyin etmirsiniz.
                Hər keçirdiyiniz dərs üçün sabit ödəniş alırsınız.
              </p>
            </div>

            <Button
              onClick={saveLesson}
              disabled={updateTutor.isPending}
              className="gradient-bg border-0 text-white rounded-xl w-full sm:w-auto px-8"
            >
              {updateTutor.isPending ? 'Saxlanılır...' : 'Yadda saxla'}
            </Button>
          </div>
        </TabsContent>

        {/* Notifications tab */}
        <TabsContent value="notifications" className="space-y-5 mt-0">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold">Bildiriş tənzimləmələri</h2>

            {[
              { label: 'Yeni rezervasiya', desc: 'Tələbə sizi rezerv etdikdə', default: true },
              { label: 'Dərs xatırlatması', desc: '1 saat əvvəl xatırlatma göndər', default: true },
              { label: 'Dərs ləğvi', desc: 'Tələbə dərsi ləğv etdikdə', default: true },
              { label: 'Yeni rəy', desc: 'Tələbə rəy bildirdikdə', default: true },
              { label: 'Ödəniş', desc: 'Dərs ödənişi alındıqda', default: true },
              { label: 'Marketing emailləri', desc: 'Nativly yenilikləri və təklifləri', default: false },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-white/3"
              >
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <Switch defaultChecked={item.default} />
              </div>
            ))}

            <Button className="gradient-bg border-0 text-white rounded-xl w-full sm:w-auto px-8">
              Bildirişləri yenilə
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
