'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { GraduationCap, Star, BookOpen, Check, X, Sparkles } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getInitials } from '@/lib/utils'
import { format } from 'date-fns'
import { toast } from 'sonner'

type Status = 'pending' | 'approved' | 'rejected'

interface TutorApp {
  id: string
  headline: string
  about: string
  application_status: Status
  is_featured: boolean
  average_rating: number
  total_lessons: number
  created_at: string
  specializations: string[]
  profiles: { id: string; full_name: string; email: string; avatar_url: string; created_at: string }
}

const STATUS_COLORS = {
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
}

export default function AdminTutorsPage() {
  const t = useTranslations('admin.tutors')
  const [tutors, setTutors] = useState<TutorApp[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Status>('pending')

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/tutors?status=${activeTab}`)
    const data = await res.json()
    setTutors(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [activeTab])

  useEffect(() => { load() }, [load])

  async function handleAction(tutorId: string, action: string) {
    await fetch('/api/admin/tutors', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tutorId, action }),
    })
    toast.success(action === 'approve' ? 'Approved!' : action === 'reject' ? 'Rejected' : 'Updated')
    load()
  }

  const tabs: { label: string; value: Status }[] = [
    { label: t('pendingTab'), value: 'pending' },
    { label: t('approvedTab'), value: 'approved' },
    { label: t('rejectedTab'), value: 'rejected' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">{t('title')}</h1>
          <p className="text-xs text-muted-foreground">{t('subtitle')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-px">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.value
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          [1, 2, 3].map(i => <Skeleton key={i} className="h-36 rounded-2xl" />)
        ) : tutors.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-border">
            <GraduationCap className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{t('noApplications', { status: activeTab })}</p>
          </div>
        ) : tutors.map(tutor => (
          <div key={tutor.id} className="rounded-2xl border border-border bg-card p-4 space-y-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarFallback className="gradient-bg text-white font-bold text-sm">{getInitials(tutor.profiles?.full_name ?? 'TU')}</AvatarFallback>
                <AvatarFallback />
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm">{tutor.profiles?.full_name}</p>
                  <Badge className={`text-xs border ${STATUS_COLORS[tutor.application_status]}`}>{tutor.application_status}</Badge>
                  {tutor.is_featured && (
                    <Badge className="text-xs bg-yellow-500/10 text-yellow-500 border-yellow-500/20 border">
                      <Sparkles className="h-3 w-3 mr-1" />{t('featured')}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{tutor.profiles?.email}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{tutor.headline}</p>
              </div>
              <p className="text-xs text-muted-foreground shrink-0">{format(new Date(tutor.created_at), 'd MMM yyyy')}</p>
            </div>

            {tutor.about && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{tutor.about}</p>
            )}

            {tutor.specializations?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tutor.specializations.map((s: string) => (
                  <span key={s} className="text-xs bg-muted/50 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {tutor.average_rating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                    {tutor.average_rating.toFixed(1)}
                  </span>
                )}
                {tutor.total_lessons > 0 && (
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    {tutor.total_lessons} {t('lessons')}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs border-muted-foreground/20 gap-1.5"
                  onClick={() => handleAction(tutor.id, 'toggle_feature')}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {tutor.is_featured ? t('unfeature') : t('feature')}
                </Button>
                {tutor.application_status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/5 gap-1.5"
                      onClick={() => handleAction(tutor.id, 'reject')}
                    >
                      <X className="h-3.5 w-3.5" />
                      {t('reject')}
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 text-xs gradient-bg text-white gap-1.5"
                      onClick={() => handleAction(tutor.id, 'approve')}
                    >
                      <Check className="h-3.5 w-3.5" />
                      {t('approve')}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
