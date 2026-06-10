'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { az } from 'date-fns/locale'
import { Users, Search, BookOpen, MessageSquare } from 'lucide-react'
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Tələbələrim</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {students?.length ?? 0} tələbə
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tələbə axtar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Users className="h-4 w-4 text-white" />
          </div>
          <h2 className="font-semibold text-sm">Tələbə siyahısı</h2>
        </div>

        <div className="p-5">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border/50">
                  <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-lg" />
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
            <div className="space-y-2.5">
              {filtered.map((student) => (
                <div
                  key={student.id}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-white/3 transition-all duration-200 cursor-pointer"
                  onClick={() => openStudent(student)}
                >
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage src={student.avatar_url ?? ''} />
                    <AvatarFallback className="gradient-bg text-white font-bold">
                      {getInitials(student.full_name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{student.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                  </div>

                  <div className="hidden sm:flex items-center gap-4 shrink-0">
                    <div className="text-center">
                      <p className="text-sm font-bold">{student.lessonCount}</p>
                      <p className="text-xs text-muted-foreground">dərs</p>
                    </div>
                    {student.lastLesson && (
                      <div className="text-center">
                        <p className="text-xs font-medium">
                          {format(new Date(student.lastLesson), 'd MMM', { locale: az })}
                        </p>
                        <p className="text-xs text-muted-foreground">son dərs</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {student.tutorNotes && (
                      <Badge className="text-xs bg-primary/10 text-primary border-primary/20 hidden sm:flex">
                        Qeyd
                      </Badge>
                    )}
                    <Button size="sm" variant="outline" className="h-8 text-xs rounded-lg">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Bax
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={selected.avatar_url ?? ''} />
                    <AvatarFallback className="gradient-bg text-white text-lg font-bold">
                      {getInitials(selected.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-lg">{selected.full_name}</SheetTitle>
                    <p className="text-sm text-muted-foreground">{selected.email}</p>
                  </div>
                </div>
              </SheetHeader>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-2xl font-extrabold">{selected.lessonCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">Tamamlanan dərs</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-sm font-bold">
                    {selected.lastLesson
                      ? format(new Date(selected.lastLesson), 'd MMMM', { locale: az })
                      : '—'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Son dərs</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">Müəllim qeydləri</h3>
                </div>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Bu tələbə haqqında qeydlər..."
                  className="min-h-[150px] rounded-xl text-sm resize-none"
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
