'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import {
  Loader2, ChevronRight, ChevronLeft, GraduationCap, Check,
  Globe, User, FileText, Video, CalendarDays, Eye, EyeOff, Upload, X,
  Sparkles, Clock, Zap, Shield,
} from 'lucide-react'
import Logo from '@/components/shared/Logo'

const LANGUAGES = [
  { code: 'en', name: 'İngilis dili', flag: '🇬🇧' },
  { code: 'ru', name: 'Rus dili', flag: '🇷🇺' },
  { code: 'tr', name: 'Türk dili', flag: '🇹🇷' },
  { code: 'de', name: 'Alman dili', flag: '🇩🇪' },
  { code: 'fr', name: 'Fransız dili', flag: '🇫🇷' },
  { code: 'az', name: 'Azərbaycan dili', flag: '🇦🇿' },
  { code: 'ar', name: 'Ərəb dili', flag: '🇸🇦' },
  { code: 'es', name: 'İspan dili', flag: '🇪🇸' },
  { code: 'it', name: 'İtalyan dili', flag: '🇮🇹' },
  { code: 'zh', name: 'Çin dili', flag: '🇨🇳' },
  { code: 'ja', name: 'Yapon dili', flag: '🇯🇵' },
  { code: 'ko', name: 'Koreya dili', flag: '🇰🇷' },
]

const LEVELS = [
  { value: 'native', label: 'Ana dili' },
  { value: 'advanced', label: 'Təkmilləşmiş' },
  { value: 'upper_intermediate', label: 'Yuxarı orta' },
  { value: 'intermediate', label: 'Orta' },
  { value: 'elementary', label: 'Başlanğıc' },
]

const SPECIALIZATIONS = [
  'IELTS', 'TOEFL', 'Business English', 'Uşaqlar üçün', 'Danışıq',
  'Qrammatika', 'Tələffüz', 'Akademik yazı', 'Müsahibə hazırlığı', 'Ümumi İngilis',
]

const DAYS = [
  { key: 'monday', label: 'B.e.', full: 'Bazar ertəsi' },
  { key: 'tuesday', label: 'Ç.a.', full: 'Çərşənbə axşamı' },
  { key: 'wednesday', label: 'Çər.', full: 'Çərşənbə' },
  { key: 'thursday', label: 'C.a.', full: 'Cümə axşamı' },
  { key: 'friday', label: 'Cüm.', full: 'Cümə' },
  { key: 'saturday', label: 'Şən.', full: 'Şənbə' },
  { key: 'sunday', label: 'Baz.', full: 'Bazar' },
]

const STEPS = [
  { icon: User, label: 'Hesab', color: 'from-blue-500 to-indigo-600' },
  { icon: Globe, label: 'Dillər', color: 'from-emerald-500 to-teal-600' },
  { icon: FileText, label: 'Profil', color: 'from-violet-500 to-purple-600' },
  { icon: GraduationCap, label: 'Təhsil', color: 'from-amber-500 to-orange-600' },
  { icon: Video, label: 'Video', color: 'from-rose-500 to-pink-600' },
  { icon: CalendarDays, label: 'Cədvəl', color: 'from-cyan-500 to-blue-600' },
  { icon: Eye, label: 'Göndər', color: 'from-emerald-500 to-green-600' },
]

type LanguageEntry = { code: string; level: string }
type DaySchedule = { active: boolean; start: string; end: string }

interface FormData {
  full_name: string; email: string; password: string; confirm_password: string
  phone: string; country: string; city: string
  languages: LanguageEntry[]
  headline: string; about: string; specializations: string[]
  education: string[]; certificateUrls: string[]
  video_intro_url: string; instant_booking: boolean
  schedule: Record<string, DaySchedule>
}

const DEFAULT_SCHEDULE: Record<string, DaySchedule> = Object.fromEntries(
  DAYS.map((d) => [d.key, { active: false, start: '09:00', end: '18:00' }])
)

export default function TutorOnboardingForm() {
  const router = useRouter()
  const locale = useLocale()
  const supabase = createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const [step, setStep] = useState(1)
  const [userId, setUserId] = useState<string | null>(null)
  const [tutorProfileId, setTutorProfileId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [certUploading, setCertUploading] = useState(false)
  const [videoUploading, setVideoUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const [form, setForm] = useState<FormData>({
    full_name: '', email: '', password: '', confirm_password: '',
    phone: '', country: 'Azərbaycan', city: 'Bakı',
    languages: [],
    headline: '', about: '', specializations: [],
    education: [''], certificateUrls: [],
    video_intro_url: '', instant_booking: true,
    schedule: DEFAULT_SCHEDULE,
  })

  const set = (key: keyof FormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => { const next = { ...prev }; delete next[key]; return next })
  }

  // ── Step handlers ──────────────────────────────────────────────────────────

  const submitStep1 = async () => {
    const errs: Record<string, string> = {}
    if (!form.full_name.trim()) errs.full_name = 'Ad daxil edin'
    if (!form.email.includes('@')) errs.email = 'Düzgün email daxil edin'
    if (form.password.length < 6) errs.password = 'Şifrə ən azı 6 simvol olmalıdır'
    if (form.password !== form.confirm_password) errs.confirm_password = 'Şifrələr uyğun gəlmir'
    if (Object.keys(errs).length) { setErrors(errs); return false }

    setIsLoading(true)
    try {
      const res = await fetch('/api/register/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name, email: form.email, password: form.password,
          phone: form.phone, city: form.city, country: form.country,
        }),
      })
      const result = await res.json()
      if (!res.ok) { toast.error(result.error ?? 'Qeydiyyat uğursuz oldu'); return false }

      setUserId(result.userId)
      setTutorProfileId(result.tutorProfileId)

      await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
      return true
    } catch { toast.error('Xəta baş verdi'); return false }
    finally { setIsLoading(false) }
  }

  const submitStep2 = async () => {
    if (form.languages.length === 0) { setErrors({ languages: 'Ən azı bir dil seçin' }); return false }
    if (!userId) return false
    setIsLoading(true)
    try {
      const { data: langs } = await supabase.from('languages').select('id, code').in('code', form.languages.map((l) => l.code))
      if (langs && langs.length > 0) {
        await db.from('user_languages').delete().eq('user_id', userId)
        await db.from('user_languages').insert(
          form.languages.map((l) => {
            const lang = (langs as { id: string; code: string }[]).find((x) => x.code === l.code)
            return { user_id: userId, language_id: lang?.id, level: l.level as 'native' | 'advanced' | 'upper_intermediate' | 'intermediate' | 'elementary' | 'beginner', is_teaching: true, is_learning: false }
          }).filter((x) => x.language_id)
        )
      }
      return true
    } catch { toast.error('Xəta baş verdi'); return false }
    finally { setIsLoading(false) }
  }

  const submitStep3 = async () => {
    const errs: Record<string, string> = {}
    if (!form.headline.trim()) errs.headline = 'Başlıq daxil edin'
    if (!form.about.trim()) errs.about = 'Haqqımda bölməsini doldurun'
    if (Object.keys(errs).length) { setErrors(errs); return false }
    setIsLoading(true)
    try {
      await db.from('tutor_profiles').update({ headline: form.headline, about: form.about, specializations: form.specializations }).eq('user_id', userId!)
      return true
    } catch { toast.error('Xəta baş verdi'); return false }
    finally { setIsLoading(false) }
  }

  const submitStep4 = async () => {
    const edu = form.education.filter((e) => e.trim())
    setIsLoading(true)
    try {
      await db.from('tutor_profiles').update({ education: edu, certificates: form.certificateUrls }).eq('user_id', userId!)
      return true
    } catch { toast.error('Xəta baş verdi'); return false }
    finally { setIsLoading(false) }
  }

  const submitStep5 = async () => {
    setIsLoading(true)
    try {
      await db.from('tutor_profiles').update({ video_intro_url: form.video_intro_url.trim() || null, instant_booking: form.instant_booking }).eq('user_id', userId!)
      return true
    } catch { toast.error('Xəta baş verdi'); return false }
    finally { setIsLoading(false) }
  }

  const submitStep6 = async () => {
    const activeDays = Object.entries(form.schedule).filter(([, v]) => v.active)
    if (activeDays.length === 0) { setErrors({ schedule: 'Ən azı bir iş günü seçin' }); return false }
    setIsLoading(true)
    try {
      const inserts = activeDays.map(([day, v]) => ({
        tutor_id: tutorProfileId!, day_of_week: day as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
        start_time: v.start, end_time: v.end, is_active: true,
      }))
      await db.from('tutor_availability').delete().eq('tutor_id', tutorProfileId!)
      if (inserts.length) await db.from('tutor_availability').insert(inserts)
      return true
    } catch { toast.error('Xəta baş verdi'); return false }
    finally { setIsLoading(false) }
  }

  const finalSubmit = async () => {
    setIsLoading(true)
    try {
      await db.from('tutor_profiles').update({ application_status: 'pending' }).eq('user_id', userId!)
      router.push(`/${locale}/register/tutor/pending`)
    } catch { toast.error('Xəta baş verdi') }
    finally { setIsLoading(false) }
  }

  const handleNext = async () => {
    let ok = true
    if (step === 1) ok = await submitStep1()
    else if (step === 2) ok = await submitStep2()
    else if (step === 3) ok = await submitStep3()
    else if (step === 4) ok = await submitStep4()
    else if (step === 5) ok = await submitStep5()
    else if (step === 6) ok = await submitStep6()
    else if (step === 7) { await finalSubmit(); return }
    if (ok) setStep((s) => Math.min(s + 1, 7))
  }

  const toggleLanguage = (code: string) => {
    const exists = form.languages.find((l) => l.code === code)
    if (exists) set('languages', form.languages.filter((l) => l.code !== code))
    else set('languages', [...form.languages, { code, level: 'advanced' }])
  }

  const setLangLevel = (code: string, level: string) =>
    set('languages', form.languages.map((l) => l.code === code ? { ...l, level } : l))

  const handleCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    setCertUploading(true)
    try {
      const path = `${userId}/${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('documents').upload(path, file)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(path)
      set('certificateUrls', [...form.certificateUrls, publicUrl])
      toast.success('Fayl yükləndi')
    } catch { toast.error('Fayl yüklənmədi') }
    finally { setCertUploading(false) }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    if (file.size > 100 * 1024 * 1024) { toast.error('Maks. 100MB'); return }
    setVideoUploading(true)
    try {
      const path = `${userId}/intro-${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('documents').upload(path, file)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(path)
      set('video_intro_url', publicUrl)
      toast.success('Video yükləndi')
    } catch { toast.error('Video yüklənmədi') }
    finally { setVideoUploading(false) }
  }

  const currentStep = STEPS[step - 1]
  const StepIconCurrent = currentStep.icon

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-5">
          <Logo />
        </div>
        <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
          <GraduationCap className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary">Müəllim qeydiyyatı</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Müəllim kimi qoşul</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Artıq hesabın var?{' '}
          <Link href="/login" className="text-primary hover:underline font-semibold">
            Daxil ol
          </Link>
        </p>
      </div>

      {/* ── Stepper ─────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s, i) => {
            const StepIcon = s.icon
            const stepNum = i + 1
            const done = step > stepNum
            const active = step === stepNum
            return (
              <div key={s.label} className="flex flex-col items-center gap-1.5 flex-1">
                <div className="relative">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    done
                      ? `bg-gradient-to-br ${s.color} shadow-lg`
                      : active
                        ? `bg-gradient-to-br ${s.color} shadow-lg shadow-primary/20`
                        : 'border border-border/60 bg-card'
                  }`}>
                    {done ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <StepIcon className={`h-4 w-4 ${active ? 'text-white' : 'text-muted-foreground/50'}`} />
                    )}
                  </div>
                  {active && (
                    <div className={`absolute -inset-1 rounded-xl bg-gradient-to-br ${s.color} opacity-20 blur-sm -z-10`} />
                  )}
                </div>
                <span className={`text-[10px] font-semibold hidden sm:block transition-colors ${
                  active ? 'text-foreground' : done ? 'text-foreground' : 'text-muted-foreground/50'
                }`}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${currentStep.color} transition-all duration-500 ease-out`}
            style={{ width: `${((step - 1) / 6) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">Addım {step} / 7</p>
          <p className="text-xs text-muted-foreground">{Math.round(((step - 1) / 6) * 100)}% tamamlandı</p>
        </div>
      </div>

      {/* ── Step header card ────────────────────────────── */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${currentStep.color} p-5 mb-5 text-white`}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '18px 18px' }}
        />
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 float-slow" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <StepIconCurrent className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">
              {step === 1 && 'Hesab məlumatları'}
              {step === 2 && 'Hansı dilləri öyrədirsiz?'}
              {step === 3 && 'Profiliniz'}
              {step === 4 && 'Təhsil və Sertifikatlar'}
              {step === 5 && 'Təqdimat videosu'}
              {step === 6 && 'İş cədvəli'}
              {step === 7 && 'Son nəzərdən keçirmə'}
            </h2>
            <p className="text-sm text-white/70">
              {step === 1 && 'Giriş üçün istifadə ediləcək'}
              {step === 2 && 'Bir və ya bir neçə dil seçin'}
              {step === 3 && 'Tələbələr bu məlumatları görəcək'}
              {step === 4 && 'İxtiyari, lakin profili gücləndirir'}
              {step === 5 && 'Tələbələrin sizi tanıması üçün (ixtiyari)'}
              {step === 6 && 'Hansı günlər, neçəyə qədər işləyirsiniz?'}
              {step === 7 && 'Məlumatlarınızı yoxlayın və göndərin'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Step content ────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5 shadow-sm">
        {/* Step 1: Account */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ad Soyad *</Label>
              <Input value={form.full_name} onChange={(e) => set('full_name', e.target.value)} placeholder="Adınız Soyadınız" className="rounded-xl h-11" />
              {errors.full_name && <p className="text-xs text-destructive">{errors.full_name}</p>}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="email@example.com" className="rounded-xl h-11" />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Şifrə *</Label>
              <div className="relative">
                <Input type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => set('password', e.target.value)} className="rounded-xl h-11 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Şifrəni təsdiqlə *</Label>
              <div className="relative">
                <Input type={showConfirmPass ? 'text' : 'password'} value={form.confirm_password} onChange={(e) => set('confirm_password', e.target.value)} className="rounded-xl h-11 pr-10" />
                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirm_password && <p className="text-xs text-destructive">{errors.confirm_password}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Telefon</Label>
              <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+994 50 000 00 00" className="rounded-xl h-11" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Şəhər</Label>
              <Input value={form.city} onChange={(e) => set('city', e.target.value)} className="rounded-xl h-11" />
            </div>
          </div>
        )}

        {/* Step 2: Languages */}
        {step === 2 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {LANGUAGES.map((lang) => {
                const sel = form.languages.find((l) => l.code === lang.code)
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => toggleLanguage(lang.code)}
                    className={`group flex items-center gap-2.5 p-3.5 rounded-xl border text-left transition-all duration-200 ${
                      sel
                        ? 'border-primary/50 bg-primary/8 shadow-sm shadow-primary/10'
                        : 'border-border/60 hover:border-primary/30 hover:bg-muted/30'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{lang.flag}</span>
                    <span className="text-sm font-medium leading-tight flex-1">{lang.name}</span>
                    {sel && (
                      <div className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {form.languages.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-border">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Seçilmiş dillərdə səviyyə</p>
                {form.languages.map((l) => {
                  const lang = LANGUAGES.find((x) => x.code === l.code)!
                  return (
                    <div key={l.code} className="flex items-center gap-3 flex-wrap p-3 rounded-xl border border-border/50 bg-muted/10">
                      <span className="text-sm font-medium w-32 shrink-0">{lang.flag} {lang.name}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {LEVELS.map((lv) => (
                          <button
                            key={lv.value}
                            type="button"
                            onClick={() => setLangLevel(l.code, lv.value)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                              l.level === lv.value
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-transparent shadow-sm'
                                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                            }`}
                          >
                            {lv.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            {errors.languages && <p className="text-xs text-destructive">{errors.languages}</p>}
          </>
        )}

        {/* Step 3: Profile */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Başlıq *</Label>
              <Input
                value={form.headline} onChange={(e) => set('headline', e.target.value)}
                placeholder="IELTS Expert | Certified English Teacher"
                className="rounded-xl h-11"
              />
              <p className="text-xs text-muted-foreground">{form.headline.length} / 80 simvol</p>
              {errors.headline && <p className="text-xs text-destructive">{errors.headline}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Haqqımda *</Label>
              <Textarea
                value={form.about} onChange={(e) => set('about', e.target.value)}
                placeholder="Özünüz haqqında ətraflı yazın — təcrübəniz, metod, niyə müəllim olduğunuz..."
                className="rounded-xl min-h-[130px] resize-none"
              />
              <p className="text-xs text-muted-foreground">{form.about.length} simvol</p>
              {errors.about && <p className="text-xs text-destructive">{errors.about}</p>}
            </div>
            <div className="space-y-2.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">İxtisaslar</Label>
              <div className="flex flex-wrap gap-2">
                {SPECIALIZATIONS.map((s) => {
                  const active = form.specializations.includes(s)
                  return (
                    <button
                      key={s} type="button"
                      onClick={() => set('specializations', active ? form.specializations.filter((x) => x !== s) : [...form.specializations, s])}
                      className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full border transition-all duration-200 font-medium ${
                        active
                          ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white border-transparent shadow-sm'
                          : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground bg-muted/20'
                      }`}
                    >
                      {active && <Check className="h-3 w-3" />}
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Education */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="space-y-3">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Təhsil</Label>
              {form.education.map((edu, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={edu}
                    onChange={(e) => { const next = [...form.education]; next[i] = e.target.value; set('education', next) }}
                    placeholder="BSc İnformasiya Texnologiyaları, BDU"
                    className="rounded-xl h-11 flex-1"
                  />
                  <Button type="button" variant="ghost" size="icon" className="h-11 w-11 shrink-0 text-muted-foreground hover:text-destructive rounded-xl"
                    onClick={() => set('education', form.education.filter((_, j) => j !== i))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="rounded-xl"
                onClick={() => set('education', [...form.education, ''])}
              >
                + Əlavə et
              </Button>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sertifikatlar (fayl)</Label>
              <label className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-border/60 hover:border-primary/40 cursor-pointer transition-all duration-200 bg-muted/10 hover:bg-primary/5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-amber-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{certUploading ? 'Yüklənir...' : 'Fayl seçin'}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">PDF, JPG, PNG — maks. 5MB</p>
                </div>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleCertUpload} disabled={certUploading || !userId} />
              </label>
              {form.certificateUrls.length > 0 && (
                <div className="space-y-2">
                  {form.certificateUrls.map((_, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      </div>
                      <span className="text-sm font-medium flex-1">Fayl {i + 1} yükləndi</span>
                      <button type="button" onClick={() => set('certificateUrls', form.certificateUrls.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive p-1 rounded-lg hover:bg-destructive/10 transition-colors">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {!userId && (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-amber-500 shrink-0" />
                  <p className="text-xs text-muted-foreground">Fayl yükləmək üçün əvvəlcə hesab yaradın (addım 1)</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Video intro */}
        {step === 5 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Video link (YouTube / Vimeo)</Label>
              <Input
                value={form.video_intro_url} onChange={(e) => set('video_intro_url', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="rounded-xl h-11"
              />
              <p className="text-xs text-muted-foreground">1-2 dəqiqəlik təqdimat — kim olduğunuz, nə öyrətdiyiniz və metodunuz haqqında.</p>
            </div>

            {/* OR upload a file */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">və ya</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Video faylı yüklə</Label>
              <label className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-border/60 hover:border-primary/40 cursor-pointer transition-all duration-200 bg-muted/10 hover:bg-primary/5">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-rose-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{videoUploading ? 'Yüklənir...' : 'Video seçin'}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">MP4, MOV, WebM — maks. 100MB</p>
                </div>
                <input type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden" onChange={handleVideoUpload} disabled={videoUploading || !userId} />
              </label>
              {!userId && (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-amber-500 shrink-0" />
                  <p className="text-xs text-muted-foreground">Video yükləmək üçün əvvəlcə hesab yaradın (addım 1)</p>
                </div>
              )}
            </div>

            {form.video_intro_url ? (
              <div className="rounded-2xl border border-border overflow-hidden aspect-video bg-muted/30 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-2">
                    <Video className="h-7 w-7 text-rose-500" />
                  </div>
                  <p className="text-xs text-muted-foreground">Video önizləmə</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-border/50 aspect-video bg-muted/10 flex items-center justify-center">
                <div className="text-center">
                  <Video className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Video URL daxil edin</p>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-muted/10 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
                    <Zap className="h-4 w-4 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Ani rezervasiya</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Tələbələr əvvəlcədən razılıq olmadan vaxt rezerv edə bilər</p>
                  </div>
                </div>
                <Switch checked={form.instant_booking} onCheckedChange={(v) => set('instant_booking', v)} />
              </div>
            </div>

            <div className="rounded-xl bg-amber-500/8 border border-amber-500/20 p-3 flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Qiymətlər platform tərəfindən idarə olunur — siz qiymət təyin etmirsiniz. Hər dərs üçün sabit ödəniş alırsınız.
              </p>
            </div>
          </div>
        )}

        {/* Step 6: Schedule */}
        {step === 6 && (
          <div className="space-y-3">
            {DAYS.map((d) => {
              const sl = form.schedule[d.key]
              return (
                <div
                  key={d.key}
                  className={`relative rounded-xl border p-4 transition-all duration-200 ${
                    sl.active
                      ? 'border-primary/40 bg-primary/5 shadow-sm shadow-primary/5'
                      : 'border-border/50 bg-muted/10'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const next = { ...form.schedule }
                        next[d.key] = { ...sl, active: !sl.active }
                        set('schedule', next)
                      }}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                        sl.active ? 'bg-gradient-to-br from-cyan-500 to-blue-600 border-transparent shadow-sm' : 'border-border/60 bg-card'
                      }`}
                    >
                      {sl.active && <Check className="h-3.5 w-3.5 text-white" />}
                    </button>

                    <span className={`text-sm font-semibold w-32 shrink-0 ${sl.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {d.full}
                    </span>

                    {sl.active ? (
                      <div className="flex items-center gap-2 ml-auto">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <select
                            value={sl.start}
                            onChange={(e) => { const next = { ...form.schedule }; next[d.key] = { ...sl, start: e.target.value }; set('schedule', next) }}
                            className="h-8 px-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          >
                            {Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`).map((h) => (
                              <option key={h} value={h}>{h}</option>
                            ))}
                          </select>
                        </div>
                        <span className="text-xs text-muted-foreground">—</span>
                        <select
                          value={sl.end}
                          onChange={(e) => { const next = { ...form.schedule }; next[d.key] = { ...sl, end: e.target.value }; set('schedule', next) }}
                          className="h-8 px-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          {Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`).map((h) => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground ml-auto">Bağlı</span>
                    )}
                  </div>
                </div>
              )
            })}
            {errors.schedule && <p className="text-xs text-destructive">{errors.schedule}</p>}
          </div>
        )}

        {/* Step 7: Review */}
        {step === 7 && (
          <div className="space-y-4">
            {[
              { label: 'Ad', value: form.full_name, icon: User },
              { label: 'Email', value: form.email, icon: FileText },
              { label: 'Şəhər', value: `${form.city}, ${form.country}`, icon: Globe },
              {
                label: 'Dillər', icon: Globe,
                value: form.languages.map((l) => {
                  const lang = LANGUAGES.find((x) => x.code === l.code)
                  const lv = LEVELS.find((x) => x.value === l.level)
                  return `${lang?.name} (${lv?.label})`
                }).join(', ') || '—',
              },
              { label: 'Başlıq', value: form.headline || '—', icon: Sparkles },
              { label: 'İxtisaslar', value: form.specializations.join(', ') || '—', icon: GraduationCap },
              { label: 'Video', value: form.video_intro_url ? 'Əlavə edildi' : '—', icon: Video },
              { label: 'Ani rezv.', value: form.instant_booking ? 'Aktiv' : 'Deaktiv', icon: Zap },
              {
                label: 'İş günləri', icon: CalendarDays,
                value: Object.entries(form.schedule).filter(([, v]) => v.active)
                  .map(([k]) => DAYS.find((d) => d.key === k)?.full).join(', ') || '—',
              },
            ].map((row) => {
              const Icon = row.icon
              return (
                <div key={row.label} className="flex items-start gap-3 p-3.5 rounded-xl border border-border/50 bg-muted/10">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{row.label}</p>
                    <p className="text-sm font-medium mt-0.5 break-words">{row.value}</p>
                  </div>
                </div>
              )
            })}

            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 mt-2">
              <div className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-500">Təsdiq gözləyir</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Müraciətiniz 1-3 iş günü ərzində admin tərəfindən nəzərdən keçiriləcək. Nəticə haqqında email alacaqsınız.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation buttons ──────────────────────────── */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(s - 1, 1))}
          disabled={step === 1 || isLoading}
          className="rounded-xl h-11 px-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1.5" />
          Geri
        </Button>

        <Button
          onClick={handleNext}
          disabled={isLoading}
          className={`rounded-xl h-11 px-8 border-0 text-white shadow-lg bg-gradient-to-r ${currentStep.color} hover:opacity-90 transition-opacity`}
        >
          {isLoading ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Yüklənir...</>
          ) : step === 7 ? (
            <><Check className="h-4 w-4 mr-1.5" /> Göndər</>
          ) : (
            <>İrəli <ChevronRight className="h-4 w-4 ml-1.5" /></>
          )}
        </Button>
      </div>
    </div>
  )
}
