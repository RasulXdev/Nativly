'use client'

import { format } from 'date-fns'
import { az } from 'date-fns/locale'
import { BookOpen, Clock, CheckCircle2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import EmptyState from '@/components/shared/EmptyState'
import { useLessonHistory } from '@/hooks/useLessons'
import { getInitials } from '@/lib/utils'

interface PastLesson {
  id: string
  scheduled_at: string
  duration_minutes: number
  status: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tutor: any
}

export default function LessonsPage() {
  const { data: raw, isLoading } = useLessonHistory()
  const lessons = (raw ?? []) as PastLesson[]

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-2xl gradient-bg p-6 text-white">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Dərslərim</h1>
            <p className="text-sm text-white/70 mt-0.5">
              {lessons.length > 0
                ? `${lessons.length} tamamlanmış dərs`
                : 'Tamamlanan dərslər'}
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-5">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : lessons.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="Hələ dərs yoxdur"
              description="Tamamladığınız dərslər burada görünəcək"
            />
          ) : (
            <div className="space-y-2.5">
              {lessons.map((lesson) => {
                const tutorProfile = lesson.tutor?.profiles
                return (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-white/5 transition-colors"
                  >
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={tutorProfile?.avatar_url ?? ''} />
                      <AvatarFallback className="gradient-bg text-white text-xs font-bold">
                        {getInitials(tutorProfile?.full_name ?? '?')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {tutorProfile?.full_name ?? 'Müəllim'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <Clock className="h-3 w-3" />
                        <span>
                          {format(new Date(lesson.scheduled_at), 'd MMM yyyy, HH:mm', {
                            locale: az,
                          })}
                        </span>
                        <span className="text-border">·</span>
                        <span>{lesson.duration_minutes} dəq</span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs text-emerald-400 border-emerald-500/30 shrink-0"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Tamamlandı
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
