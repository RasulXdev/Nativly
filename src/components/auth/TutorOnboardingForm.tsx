'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Loader2, ChevronRight, ChevronLeft, GraduationCap, Check,
  Globe, User, FileText, DollarSign, CalendarDays, Eye, Upload, X
} from 'lucide-react'
import Logo from '@/components/shared/Logo'

// ─── Constants ───────────────────────────────────────────────────────────────

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
  { key: 'monday', label: 'B.e.' },
  { key: 'tuesday', label: 'Ç.a.' },
  { key: 'wednesday', label: 'Çər.' },
  { key: 'thursday', label: 'C.a.' },
  { key: 'friday', label: 'Cüm.' },
  { key: 'saturday', label: 'Şən.' },
  { key: 'sunday', label: 'Baz.' },
]

const STEPS = [
  { icon: User, label: 'Hesab' },
  { icon: Globe, label: 'Dillər' },
  { icon: FileText, label: 'Profil' },
  { icon: GraduationCap, label: 'Təhsil' },
  { icon: DollarSign, label: 'Qiymət' },
  { icon: CalendarDays, label: 'Cədvəl' },
  { icon: Eye, label: 'Nəzərdən keç' },
]

// ─── Types ────────────────────────────────────────────────────────────────────

type LanguageEntry = { code: string; level: string }
type DaySchedule = { active: boolean; start: string; end: string }

interface FormData {
  // Step 1
  full_name: string
  email: string
  password: string
  confirm_password: string
  phone: string
  country: string
  city: string
  // Step 2
  languages: LanguageEntry[]
  // Step 3
  headline: string
  about: string
  specializations: string[]
  // Step 4
  education: string[]
  certificateUrls: string[]
  // Step 5
  hourly_rate: string
  trial_rate: string
  instant_booking: boolean
  // Step 6
  schedule: Record<string, DaySchedule>
}

const DEFAULT_SCHEDULE: Record<string, DaySchedule> = Object.fromEntries(
  DAYS.map((d) => [d.key, { active: false, start: '09:00', end: '18:00' }])
)

// ─── Component ────────────────────────────────────────────────────────────────

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
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState<FormData>({
    full_name: '', email: '', password: '', confirm_password: '',
    phone: '', country: 'Azərbaycan', city: 'Bakı',
    languages: [],
    headline: '', about: '', specializations: [],
    education: [''], certificateUrls: [],
    hourly_rate: '15', trial_rate: '5', instant_booking: true,
    schedule: DEFAULT_SCHEDULE,
  })

  const set = (key: keyof FormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => { const next = { ...prev }; delete next[key]; return next })
  }

  // ── Step 1: Auth ────────────────────────────────────────────────────────────
  const submitStep1 = async () => {
    const errs: Record<string, string> = {}
    if (!form.full_name.trim()) errs.full_name = 'Ad daxil edin'
    if (!form.email.includes('@')) errs.email = 'Düzgün email daxil edin'
    if (form.password.length < 6) errs.password = 'Şifrə ən azı 6 simvol olmalıdır'
    if (form.password !== form.confirm_password) errs.confirm_password = 'Şifrələr uyğun gəlmir'
    if (Object.keys(errs).length) { setErrors(errs); return false }

    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.full_name, role: 'tutor' },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })
      if (error) { toast.error(error.message); return false }
      if (!data.user) { toast.error('Qeydiyyat uğursuz oldu'); return false }

      setUserId(data.user.id)

      // Update profile with phone/city/country
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('profiles') as any).update({
        phone: form.phone || null,
        city: form.city,
        country: form.country,
      }).eq('id', data.user.id)

      // Create tutor_profiles row
      const { data: tp, error: tpErr } = await db
        .from('tutor_profiles')
        .insert({ user_id: data.user.id, application_status: 'pending' })
        .select('id')
        .single()
      if (tpErr) { toast.error('Profil yaradılmadı'); return false }
      setTutorProfileId(tp.id)

      return true
    } catch {
      toast.error('Xəta baş verdi')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // ── Step 2: Languages ──────────────────────────────────────────────────────
  const submitStep2 = async () => {
    if (form.languages.length === 0) {
      setErrors({ languages: 'Ən azı bir dil seçin' })
      return false
    }
    if (!userId) return false
    setIsLoading(true)
    try {
      // Get language IDs
      const { data: langs } = await supabase
        .from('languages')
        .select('id, code')
        .in('code', form.languages.map((l) => l.code))

      if (langs && langs.length > 0) {
        await db.from('user_languages').delete().eq('user_id', userId)
        await db.from('user_languages').insert(
          form.languages.map((l) => {
            const lang = (langs as { id: string; code: string }[]).find((x) => x.code === l.code)
            return {
              user_id: userId,
              language_id: lang?.id,
              level: l.level as 'native' | 'advanced' | 'upper_intermediate' | 'intermediate' | 'elementary' | 'beginner',
              is_teaching: true,
              is_learning: false,
            }
          }).filter((x) => x.language_id)
        )
      }
      return true
    } catch {
      toast.error('Xəta baş verdi')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // ── Step 3: Profile ────────────────────────────────────────────────────────
  const submitStep3 = async () => {
    const errs: Record<string, string> = {}
    if (!form.headline.trim()) errs.headline = 'Başlıq daxil edin'
    if (!form.about.trim()) errs.about = 'Haqqımda bölməsini doldurun'
    if (Object.keys(errs).length) { setErrors(errs); return false }

    setIsLoading(true)
    try {
      await db.from('tutor_profiles').update({
        headline: form.headline,
        about: form.about,
        specializations: form.specializations,
      }).eq('user_id', userId!)
      return true
    } catch {
      toast.error('Xəta baş verdi')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // ── Step 4: Education & Certs ──────────────────────────────────────────────
  const submitStep4 = async () => {
    const edu = form.education.filter((e) => e.trim())
    setIsLoading(true)
    try {
      await db.from('tutor_profiles').update({
        education: edu,
        certificates: form.certificateUrls,
      }).eq('user_id', userId!)
      return true
    } catch {
      toast.error('Xəta baş verdi')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // ── Step 5: Pricing ────────────────────────────────────────────────────────
  const submitStep5 = async () => {
    const errs: Record<string, string> = {}
    if (!form.hourly_rate || Number(form.hourly_rate) < 5) errs.hourly_rate = 'Minimum $5 olmalıdır'
    if (Object.keys(errs).length) { setErrors(errs); return false }

    setIsLoading(true)
    try {
      await db.from('tutor_profiles').update({
        hourly_rate: Number(form.hourly_rate),
        trial_rate: Number(form.trial_rate) || null,
        instant_booking: form.instant_booking,
      }).eq('user_id', userId!)
      return true
    } catch {
      toast.error('Xəta baş verdi')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // ── Step 6: Schedule ───────────────────────────────────────────────────────
  const submitStep6 = async () => {
    const activeDays = Object.entries(form.schedule).filter(([, v]) => v.active)
    if (activeDays.length === 0) {
      setErrors({ schedule: 'Ən azı bir iş günü seçin' })
      return false
    }
    setIsLoading(true)
    try {
      const inserts = activeDays.map(([day, v]) => ({
        tutor_id: tutorProfileId!,
        day_of_week: day as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
        start_time: v.start,
        end_time: v.end,
        is_active: true,
      }))
      await db.from('tutor_availability').delete().eq('tutor_id', tutorProfileId!)
      if (inserts.length) await db.from('tutor_availability').insert(inserts)
      return true
    } catch {
      toast.error('Xəta baş verdi')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // ── Final submit ────────────────────────────────────────────────────────────
  const finalSubmit = async () => {
    setIsLoading(true)
    try {
      await db.from('tutor_profiles').update({
        application_status: 'pending',
      }).eq('user_id', userId!)
      router.push(`/${locale}/register/tutor/pending`)
    } catch {
      toast.error('Xəta baş verdi')
    } finally {
      setIsLoading(false)
    }
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
    if (exists) {
      set('languages', form.languages.filter((l) => l.code !== code))
    } else {
      set('languages', [...form.languages, { code, level: 'advanced' }])
    }
  }

  const setLangLevel = (code: string, level: string) => {
    set('languages', form.languages.map((l) => l.code === code ? { ...l, level } : l))
  }

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
    } catch {
      toast.error('Fayl yüklənmədi')
    } finally {
      setCertUploading(false)
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Logo />
        </div>
        <div className="flex justify-center mb-2">
          <Badge variant="secondary" className="gap-1">
            <GraduationCap className="h-3 w-3" />
            Müəllim qeydiyyatı
          </Badge>
        </div>
        <h1 className="text-2xl font-extrabold">Müəllim kimi qoşul</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Artıq hesabın var?{' '}
          <Link href={`/${locale}/login`} className="text-primary hover:underline font-medium">
            Daxil ol
          </Link>
        </p>
      </div>

      {/* Progress stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, i) => {
            const StepIcon = s.icon
            const stepNum = i + 1
            const done = step > stepNum
            const active = step === stepNum
            return (
              <div key={s.label} className="flex flex-col items-center gap-1 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  done ? 'gradient-bg' : active ? 'border-2 border-primary bg-primary/10' : 'border border-border bg-card'
                }`}>
                  {done ? (
                    <Check className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <StepIcon className={`h-3.5 w-3.5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                  )}
                </div>
                <span className={`text-[10px] font-medium hidden sm:block ${active ? 'text-primary' : done ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div
            className="h-full gradient-bg rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / 6) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-right mt-1">{step}/7</p>
      </div>

      {/* Step content */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5">
        {/* ── Step 1: Account ── */}
        {step === 1 && (
          <>
            <div>
              <h2 className="font-bold text-lg">Hesab məlumatları</h2>
              <p className="text-sm text-muted-foreground">Giriş üçün istifadə ediləcək</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Ad Soyad *</Label>
                <Input value={form.full_name} onChange={(e) => set('full_name', e.target.value)} placeholder="Adınız Soyadınız" className="rounded-xl" />
                {errors.full_name && <p className="text-xs text-destructive">{errors.full_name}</p>}
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="email@example.com" className="rounded-xl" />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Şifrə *</Label>
                <Input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} className="rounded-xl" />
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Şifrəni təsdiqlə *</Label>
                <Input type="password" value={form.confirm_password} onChange={(e) => set('confirm_password', e.target.value)} className="rounded-xl" />
                {errors.confirm_password && <p className="text-xs text-destructive">{errors.confirm_password}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Telefon</Label>
                <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+994 50 000 00 00" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Şəhər</Label>
                <Input value={form.city} onChange={(e) => set('city', e.target.value)} className="rounded-xl" />
              </div>
            </div>
          </>
        )}

        {/* ── Step 2: Languages ── */}
        {step === 2 && (
          <>
            <div>
              <h2 className="font-bold text-lg">Hansı dilləri öyrədirsiz?</h2>
              <p className="text-sm text-muted-foreground">Bir və ya bir neçə dil seçin</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LANGUAGES.map((lang) => {
                const sel = form.languages.find((l) => l.code === lang.code)
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => toggleLanguage(lang.code)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                      sel ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <span className="text-xl shrink-0">{lang.flag}</span>
                    <span className="text-sm font-medium leading-tight">{lang.name}</span>
                    {sel && <Check className="h-3 w-3 text-primary ml-auto shrink-0" />}
                  </button>
                )
              })}
            </div>

            {form.languages.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-border">
                <p className="text-sm font-medium">Seçilmiş dillərdə səviyyənizi göstərin:</p>
                {form.languages.map((l) => {
                  const lang = LANGUAGES.find((x) => x.code === l.code)!
                  return (
                    <div key={l.code} className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-medium w-32 shrink-0">{lang.flag} {lang.name}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {LEVELS.map((lv) => (
                          <button
                            key={lv.value}
                            type="button"
                            onClick={() => setLangLevel(l.code, lv.value)}
                            className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                              l.level === lv.value
                                ? 'gradient-bg text-white border-transparent'
                                : 'border-border text-muted-foreground hover:border-primary/40'
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

        {/* ── Step 3: Profile ── */}
        {step === 3 && (
          <>
            <div>
              <h2 className="font-bold text-lg">Profiliniz</h2>
              <p className="text-sm text-muted-foreground">Tələbələr bu məlumatları görəcək</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Başlıq *</Label>
                <Input
                  value={form.headline}
                  onChange={(e) => set('headline', e.target.value)}
                  placeholder="IELTS Expert | Certified English Teacher"
                  className="rounded-xl"
                />
                {errors.headline && <p className="text-xs text-destructive">{errors.headline}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Haqqımda *</Label>
                <Textarea
                  value={form.about}
                  onChange={(e) => set('about', e.target.value)}
                  placeholder="Özünüz haqqında ətraflı yazın — təcrübəniz, metod, niyə müəllim olduğunuz..."
                  className="rounded-xl min-h-[120px] resize-none"
                />
                {errors.about && <p className="text-xs text-destructive">{errors.about}</p>}
              </div>
              <div className="space-y-2">
                <Label>İxtisaslar</Label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALIZATIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        const cur = form.specializations
                        set('specializations', cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s])
                      }}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        form.specializations.includes(s)
                          ? 'gradient-bg text-white border-transparent'
                          : 'border-border text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {form.specializations.includes(s) && '✓ '}
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Step 4: Education & Certs ── */}
        {step === 4 && (
          <>
            <div>
              <h2 className="font-bold text-lg">Təhsil və Sertifikatlar</h2>
              <p className="text-sm text-muted-foreground">İxtiyari, lakin profili gücləndirir</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Təhsil</Label>
                {form.education.map((edu, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={edu}
                      onChange={(e) => {
                        const next = [...form.education]
                        next[i] = e.target.value
                        set('education', next)
                      }}
                      placeholder="BSc İnformasiya Texnologiyaları, Bakı Dövlət Universiteti"
                      className="rounded-xl flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => set('education', form.education.filter((_, j) => j !== i))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => set('education', [...form.education, ''])}
                >
                  + Əlavə et
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Sertifikatlar (fayl)</Label>
                <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors bg-white/3">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {certUploading ? 'Yüklənir...' : 'Fayl seçin (PDF, JPG, PNG)'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleCertUpload}
                    disabled={certUploading || !userId}
                  />
                </label>
                {form.certificateUrls.length > 0 && (
                  <div className="space-y-1.5">
                    {form.certificateUrls.map((url, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span className="text-xs text-muted-foreground flex-1 truncate">Fayl {i + 1} yükləndi</span>
                        <button
                          type="button"
                          onClick={() => set('certificateUrls', form.certificateUrls.filter((_, j) => j !== i))}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {!userId && (
                  <p className="text-xs text-amber-400">Fayl yükləmək üçün əvvəlcə hesab yaradın (addım 1)</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── Step 5: Pricing ── */}
        {step === 5 && (
          <>
            <div>
              <h2 className="font-bold text-lg">Qiymət təyini</h2>
              <p className="text-sm text-muted-foreground">Tələbələrə nə qədər ödəyəcəksiniz?</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Saatlik qiymət (USD) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      value={form.hourly_rate}
                      onChange={(e) => set('hourly_rate', e.target.value)}
                      className="pl-7 rounded-xl"
                      min="5"
                    />
                  </div>
                  {errors.hourly_rate && <p className="text-xs text-destructive">{errors.hourly_rate}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Sınaq dərsi (USD)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      value={form.trial_rate}
                      onChange={(e) => set('trial_rate', e.target.value)}
                      className="pl-7 rounded-xl"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Ani rezervasiya</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Tələbələr əvvəlcədən razılıq olmadan vaxt rezerv edə bilər
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => set('instant_booking', !form.instant_booking)}
                    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                      form.instant_booking ? 'gradient-bg' : 'bg-border'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                        form.instant_booking ? 'left-[22px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-card border border-border p-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Nümunəvi qazanc:</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[5, 10, 20].map((lessons) => (
                    <div key={lessons} className="rounded-lg bg-white/5 p-3">
                      <p className="text-xs text-muted-foreground">{lessons} dərs/ay</p>
                      <p className="text-base font-bold text-emerald-400">
                        ${(Number(form.hourly_rate) * 0.8 * lessons).toFixed(0)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">(%20 komissiya)</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Step 6: Schedule ── */}
        {step === 6 && (
          <>
            <div>
              <h2 className="font-bold text-lg">İş cədvəli</h2>
              <p className="text-sm text-muted-foreground">Hansı günlər, saat neçəyə qədər işləyirsiniz?</p>
            </div>
            <div className="space-y-2">
              {DAYS.map((d) => {
                const sl = form.schedule[d.key]
                return (
                  <div
                    key={d.key}
                    className={`flex flex-wrap items-center gap-3 p-3 rounded-xl border transition-all ${
                      sl.active ? 'border-primary/30 bg-primary/5' : 'border-border/50 opacity-60'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const next = { ...form.schedule }
                        next[d.key] = { ...sl, active: !sl.active }
                        set('schedule', next)
                      }}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                        sl.active ? 'gradient-bg border-transparent' : 'border-border'
                      }`}
                    >
                      {sl.active && <Check className="h-3 w-3 text-white" />}
                    </button>
                    <span className="text-sm font-medium w-20 shrink-0">{
                      ['Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə', 'Şənbə', 'Bazar'][
                        DAYS.findIndex((x) => x.key === d.key)
                      ]
                    }</span>
                    {sl.active && (
                      <>
                        <select
                          value={sl.start}
                          onChange={(e) => {
                            const next = { ...form.schedule }
                            next[d.key] = { ...sl, start: e.target.value }
                            set('schedule', next)
                          }}
                          className="h-8 px-2 rounded-lg border border-border bg-background text-sm focus:outline-none"
                        >
                          {Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`).map((h) => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                        <span className="text-xs text-muted-foreground">—</span>
                        <select
                          value={sl.end}
                          onChange={(e) => {
                            const next = { ...form.schedule }
                            next[d.key] = { ...sl, end: e.target.value }
                            set('schedule', next)
                          }}
                          className="h-8 px-2 rounded-lg border border-border bg-background text-sm focus:outline-none"
                        >
                          {Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`).map((h) => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                )
              })}
              {errors.schedule && <p className="text-xs text-destructive">{errors.schedule}</p>}
            </div>
          </>
        )}

        {/* ── Step 7: Review ── */}
        {step === 7 && (
          <>
            <div>
              <h2 className="font-bold text-lg">Son nəzərdən keçirmə</h2>
              <p className="text-sm text-muted-foreground">Məlumatlarınızı yoxlayın və göndərin</p>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Ad', value: form.full_name },
                { label: 'Email', value: form.email },
                { label: 'Şəhər', value: `${form.city}, ${form.country}` },
                {
                  label: 'Dillər',
                  value: form.languages.map((l) => {
                    const lang = LANGUAGES.find((x) => x.code === l.code)
                    const lv = LEVELS.find((x) => x.value === l.level)
                    return `${lang?.name} (${lv?.label})`
                  }).join(', ') || '—',
                },
                { label: 'Başlıq', value: form.headline || '—' },
                {
                  label: 'İxtisaslar',
                  value: form.specializations.join(', ') || '—',
                },
                { label: 'Saatlik qiymət', value: `$${form.hourly_rate}` },
                { label: 'Sınaq dərsi', value: `$${form.trial_rate}` },
                {
                  label: 'İş günləri',
                  value: Object.entries(form.schedule)
                    .filter(([, v]) => v.active)
                    .map(([k]) => DAYS.find((d) => d.key === k)?.label)
                    .join(', ') || '—',
                },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-4 p-3 rounded-xl border border-border/50 bg-white/3">
                  <span className="text-xs font-medium text-muted-foreground w-28 shrink-0">{row.label}</span>
                  <span className="text-sm font-medium flex-1">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
              <p className="text-sm font-medium text-amber-400 mb-1">⏳ Təsdiq gözləyir</p>
              <p className="text-xs text-muted-foreground">
                Müraciətiniz 1-3 iş günü ərzində admin tərəfindən nəzərdən keçiriləcək.
                Nəticə haqqında email alacaqsınız.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Navigation buttons */}
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
          className="gradient-bg border-0 text-white rounded-xl h-11 px-8 btn-glow"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Yüklənir...
            </>
          ) : step === 7 ? (
            <>
              <Check className="h-4 w-4 mr-1.5" />
              Göndər
            </>
          ) : (
            <>
              İrəli
              <ChevronRight className="h-4 w-4 ml-1.5" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
