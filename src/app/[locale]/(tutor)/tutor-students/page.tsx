'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { format } from 'date-fns'
import { az, enUS, ru, type Locale } from 'date-fns/locale'
import { Users, Search, BookOpen, GraduationCap, TrendingUp, Calendar } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { GlassCard } from '@/components/ui/glass-card'
import HeroBanner from '@/components/dashboard/HeroBanner'
import { useTutorStudents, useUpdateTutorNotes } from '@/hooks/useTutorStudents'
import { getInitials } from '@/lib/utils'
import EmptyState from '@/components/shared/EmptyState'
import { toast } from 'sonner'

type Student = {
  id: string
  full_name: string
  avatar_url: string | null
  email: string
  lessonCount: number
  lastLesson: string | null
  tutorNotes: string
  lastLessonId: string
}

const LOCALES: Record<string, Locale> = { az, en: enUS, ru }

export default function TutorStudentsPage() {
  const t = useTranslations('tutorStudents')
  const dfLocale = LOCALES[useLocale()] ?? enUS
  const { data: rawStudents, isLoading } = useTutorStudents()
  const updateNotes = useUpdateTutorNotes()

  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Student | null>(null)
  const [notes, setNotes] = useState('')

  const students = rawStudents as Student[] | undefined
  const filtered = students?.filter((s) =>
    s.full_name.toLowerCase().includes(search.toLowerCase())
  )

  const totalLessons = students?.reduce((acc, s) => acc + s.lessonCount, 0) ?? 0
  const withNotes = students?.filter((s) => s.tutorNotes).length ?? 0

  const openStudent = (s: Student) => {
    setSelected(s)
    setNotes(s.tutorNotes)
  }

  const saveNotes = async () => {
    if (!selected) return
    try {
      await updateNotes.mutateAsync({ lessonId: selected.lastLessonId, notes })
      toast.success(t('notesSaved'))
      setSelected((prev) => prev ? { ...prev, tutorNotes: notes } : null)
    } catch {
      toast.error(t('errorOccurred'))
    }
  }

  return (
    <div className="space-y-6">
      <HeroBanner
        variant="gold"
        greeting={t('myStudents')}
        title={`${students?.length ?? 0} ${t('studentsCount')}`}
        subtitle={`${totalLessons} ${t('totalLessons')}`}
      >
        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium text-white">
            <TrendingUp className="h-3.5 w-3.5" />
            {totalLessons} {t('lessonsChip')}
          </div>
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium text-white">
            <BookOpen className="h-3.5 w-3.5" />
            {withNotes} {t('notesChip')}
          </div>
        </div>
      </HeroBanner>

      {/* ── Search + list ────────────────────────────────── */}
      <GlassCard title={t('studentList')} icon={GraduationCap}>
        <div className="px-5 pt-3 pb-3 border-b border-border/30">
          <div className="relative w-full sm:w-60 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/70 group-focus-within:text-primary/70 pointer-events-none transition-colors" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-xl border border-border/70 bg-background/80 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50 hover:border-border transition-all"
            />
          </div>
        </div>

        <div className="p-5">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border/50 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-11 w-11 rounded-full shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-3.5 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : !filtered?.length ? (
            <EmptyState
              icon={Users}
              title={search ? t('notFound') : t('noStudents')}
              description={search ? t('adjustSearch') : t('firstLessonHint')}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((student) => (
                <div
                  key={student.id}
                  onClick={() => openStudent(student)}
                  className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
                >
                  {/* Avatar + name */}
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-11 w-11 shrink-0">
                      <AvatarImage src={student.avatar_url ?? ''} />
                      <AvatarFallback className="gradient-bg text-white font-bold text-sm">
                        {getInitials(student.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">{student.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex flex-wrap gap-1.5">
                    <Badge className="text-[10px] h-5 px-2 bg-primary/10 text-primary border-primary/20 font-medium">
                      {student.lessonCount} {t('lessons')}
                    </Badge>
                    {student.lastLesson && (
                      <Badge className="text-[10px] h-5 px-2 bg-muted text-muted-foreground border-border">
                        <Calendar className="h-2.5 w-2.5 mr-1" />
                        {format(new Date(student.lastLesson), 'd MMM', { locale: dfLocale })}
                      </Badge>
                    )}
                    {student.tutorNotes && (
                      <Badge className="text-[10px] h-5 px-2 bg-amber-500/10 text-amber-500 border-amber-500/20">
                        <BookOpen className="h-2.5 w-2.5 mr-1" />
                        {t('note')}
                      </Badge>
                    )}
                  </div>

                  {/* Hover overlay cue */}
                  <div className="absolute inset-x-0 bottom-0 h-0.5 rounded-b-2xl gradient-bg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          )}
        </div>
      </GlassCard>

      {/* ── Student detail sheet ─────────────────────────── */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="pb-5">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selected.avatar_url ?? ''} />
                    <AvatarFallback className="gradient-bg text-white text-xl font-bold">
                      {getInitials(selected.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-lg">{selected.full_name}</SheetTitle>
                    <p className="text-sm text-muted-foreground">{selected.email}</p>
                  </div>
                </div>
              </SheetHeader>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
                  <p className="text-3xl font-black text-primary">{selected.lessonCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('completedLessons')}</p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
                  <p className="text-sm font-bold">
                    {selected.lastLesson
                      ? format(new Date(selected.lastLesson), 'd MMMM', { locale: dfLocale })
                      : '—'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{t('lastLesson')}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-6 rounded-2xl border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">{t('lessonProgress')}</span>
                  <span className="text-xs text-muted-foreground">{selected.lessonCount} / 20 {t('lessons')}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full gradient-bg rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((selected.lessonCount / 20) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Notes editor */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg gradient-bg flex items-center justify-center">
                    <BookOpen className="h-3 w-3 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm">{t('tutorNotes')}</h3>
                </div>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('notesPlaceholder')}
                  className="min-h-[140px] rounded-xl text-sm resize-none"
                />
                <Button
                  onClick={saveNotes}
                  disabled={updateNotes.isPending}
                  className="w-full gradient-bg border-0 text-white rounded-xl"
                >
                  {updateNotes.isPending ? t('saving') : t('saveNotes')}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
