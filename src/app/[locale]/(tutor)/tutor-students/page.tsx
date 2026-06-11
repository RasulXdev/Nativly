'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { az } from 'date-fns/locale'
import { Users, Search, BookOpen, GraduationCap, TrendingUp, Calendar } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
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

export default function TutorStudentsPage() {
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
      toast.success('Qeydlər saxlanıldı')
      setSelected((prev) => prev ? { ...prev, tutorNotes: notes } : null)
    } catch {
      toast.error('Xəta baş verdi')
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Hero header ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl gradient-bg p-6 text-white">
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
        />
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/8 float-slow" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Tələbələrim</h1>
              <p className="text-sm text-white/70 mt-0.5">{students?.length ?? 0} tələbə · {totalLessons} ümumi dərs</p>
            </div>
          </div>
          {/* Stats chips */}
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              {totalLessons} dərs
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium">
              <BookOpen className="h-3.5 w-3.5" />
              {withNotes} qeyd
            </div>
          </div>
        </div>
      </div>

      {/* ── Search + list ────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shrink-0">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-semibold text-sm">Tələbə siyahısı</h2>
          </div>
          <div className="relative w-full sm:w-60 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/70 group-focus-within:text-primary/70 pointer-events-none transition-colors" />
            <input
              type="text"
              placeholder="Tələbə axtar..."
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
              title={search ? 'Tələbə tapılmadı' : 'Hələ tələbə yoxdur'}
              description={search ? 'Axtarışı dəyişdirin' : 'İlk dərsi keçirdikdən sonra tələbələr burada görünəcək'}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((student) => (
                <div
                  key={student.id}
                  onClick={() => openStudent(student)}
                  className="group relative rounded-2xl border border-border/60 bg-card p-4 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 cursor-pointer"
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
                      {student.lessonCount} dərs
                    </Badge>
                    {student.lastLesson && (
                      <Badge className="text-[10px] h-5 px-2 bg-muted text-muted-foreground border-border">
                        <Calendar className="h-2.5 w-2.5 mr-1" />
                        {format(new Date(student.lastLesson), 'd MMM', { locale: az })}
                      </Badge>
                    )}
                    {student.tutorNotes && (
                      <Badge className="text-[10px] h-5 px-2 bg-amber-500/10 text-amber-500 border-amber-500/20">
                        <BookOpen className="h-2.5 w-2.5 mr-1" />
                        Qeyd
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
      </div>

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
                  <p className="text-xs text-muted-foreground mt-1">Tamamlanan dərs</p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
                  <p className="text-sm font-bold">
                    {selected.lastLesson
                      ? format(new Date(selected.lastLesson), 'd MMMM', { locale: az })
                      : '—'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Son dərs</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-6 rounded-2xl border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">Dərs tərəqqisi</span>
                  <span className="text-xs text-muted-foreground">{selected.lessonCount} / 20 dərs</span>
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
                  <h3 className="font-semibold text-sm">Müəllim qeydləri</h3>
                </div>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Bu tələbə haqqında qeydlər..."
                  className="min-h-[140px] rounded-xl text-sm resize-none"
                />
                <Button
                  onClick={saveNotes}
                  disabled={updateNotes.isPending}
                  className="w-full gradient-bg border-0 text-white rounded-xl"
                >
                  {updateNotes.isPending ? 'Saxlanılır...' : 'Qeydləri saxla'}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
