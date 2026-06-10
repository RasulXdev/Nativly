'use client'

import { format, differenceInMinutes } from 'date-fns'
import { az } from 'date-fns/locale'
import { Calendar, Video, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useUpcomingLessons } from '@/hooks/useLessons'
import { getInitials } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
import EmptyState from '@/components/shared/EmptyState'

export default function UpcomingLessons() {
  const { data: rawLessons, isLoading } = useUpcomingLessons()
  const lessons = rawLessons as Array<{
    id: string
    scheduled_at: string
    duration_minutes: number
    room_id: string | null
    tutor: { profiles: { full_name: string; avatar_url: string | null } } | null
  }> | undefined

  const canJoin = (scheduledAt: string) => {
    const diff = differenceInMinutes(new Date(scheduledAt), new Date())
    return diff <= 5 && diff >= -90
  }

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Gələn dərslər
        </CardTitle>
        <Link href="/schedule">
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary h-7 text-xs">
            Hamısı
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : !lessons?.length ? (
          <EmptyState
            icon={Calendar}
            title="Gələn dərs yoxdur"
            description="Müəllim seçib dərs rezerv edin"
          />
        ) : (
          <div className="space-y-3">
            {lessons.slice(0, 3).map((lesson) => {
              const tutorProfile = (lesson.tutor as any)?.profiles
              const joinable = canJoin(lesson.scheduled_at)
              return (
                <div
                  key={lesson.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors"
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={tutorProfile?.avatar_url ?? ''} />
                    <AvatarFallback className="gradient-bg text-white text-xs font-semibold">
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
                        {format(new Date(lesson.scheduled_at), 'd MMM, HH:mm', { locale: az })}
                      </span>
                      <span>·</span>
                      <span>{lesson.duration_minutes} dəq</span>
                    </div>
                  </div>
                  {joinable ? (
                    <Link href={`/room/${lesson.room_id ?? lesson.id}`}>
                      <Button size="sm" className="h-8 text-xs rounded-full gradient-bg border-0 text-white">
                        <Video className="h-3 w-3 mr-1" />
                        Qoşul
                      </Button>
                    </Link>
                  ) : (
                    <Badge variant="outline" className="text-xs font-normal">
                      {format(new Date(lesson.scheduled_at), 'HH:mm')}
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
