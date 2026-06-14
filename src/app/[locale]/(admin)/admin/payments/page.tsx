'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { CreditCard, Check, Clock } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { GlassCard } from '@/components/ui/glass-card'
import { getInitials } from '@/lib/utils'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface Payout {
  id: string
  amount_azn: number
  status: 'pending' | 'paid'
  created_at: string
  paid_at: string | null
  admin_note: string | null
  tutor: { full_name: string; avatar_url: string; email: string }
  lesson: { scheduled_at: string; duration_minutes: number }
}

export default function AdminPaymentsPage() {
  const t = useTranslations('admin.payments')
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'pending' | 'paid'>('pending')
  const [markingId, setMarkingId] = useState<string | null>(null)
  const [note, setNote] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/payouts?status=${tab}`)
    const data = await res.json()
    setPayouts(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [tab])

  useEffect(() => { load() }, [load])

  async function confirmPaid() {
    if (!markingId) return
    await fetch('/api/admin/payouts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payoutId: markingId, note }),
    })
    toast.success(t('markedAsPaid'))
    setMarkingId(null)
    setNote('')
    load()
  }

  const tabs = [
    { label: t('pendingTab'), value: 'pending' as const },
    { label: t('paidTab'), value: 'paid' as const },
  ]

  return (
    <div className="space-y-5">
      <GlassCard title={t('title')} icon={CreditCard}>
        {/* Tabs */}
        <div className="flex gap-2 px-5 pt-3 border-b border-border/30 pb-px">
          {tabs.map(tb => (
            <button
              key={tb.value}
              onClick={() => setTab(tb.value)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === tb.value
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {/* Payouts list */}
        <div className="divide-y divide-border/30">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
            </div>
          ) : payouts.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">{tab === 'pending' ? t('noPending') : t('noPaid')}</div>
          ) : payouts.map(p => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="gradient-bg text-white text-xs font-bold">{getInitials(p.tutor?.full_name ?? '?')}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.tutor?.full_name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {p.lesson?.scheduled_at ? format(new Date(p.lesson.scheduled_at), 'd MMM yyyy') : '—'}
                  {p.lesson?.duration_minutes && ` · ${p.lesson.duration_minutes} min`}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-bold text-base">{p.amount_azn}₼</span>
                {p.status === 'paid' ? (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 gap-1 text-xs">
                    <Check className="h-3 w-3" />{t('paid')}
                    {p.paid_at && <span className="ml-1 opacity-70">{format(new Date(p.paid_at), 'd MMM')}</span>}
                  </Badge>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 gap-1 text-xs">
                      <Clock className="h-3 w-3" />{t('pending')}
                    </Badge>
                    <Button
                      size="sm"
                      className="h-7 text-xs gradient-bg text-white"
                      onClick={() => { setMarkingId(p.id); setNote('') }}
                    >
                      {t('markPaid')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Confirm dialog */}
      <Dialog open={!!markingId} onOpenChange={open => !open && setMarkingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('markAsPaidTitle')}</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder={t('notePlaceholder')}
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setMarkingId(null)}>{t('cancel')}</Button>
            <Button className="gradient-bg text-white" onClick={confirmPaid}>{t('confirm')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
