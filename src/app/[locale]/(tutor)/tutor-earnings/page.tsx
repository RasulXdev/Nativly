'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { az } from 'date-fns/locale'
import { Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import EarningsChart from '@/components/tutor/EarningsChart'
import {
  useWalletBalance,
  useTutorTransactions,
  useWithdrawalRequest,
} from '@/hooks/useTutorEarnings'
import { toast } from 'sonner'

const TX_TYPE_CONFIG = {
  lesson_earning: {
    label: 'Dərs qazancı',
    icon: ArrowDownLeft,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    sign: '+',
  },
  withdrawal: {
    label: 'Çıxarış',
    icon: ArrowUpRight,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    sign: '-',
  },
  deposit: {
    label: 'Depozit',
    icon: ArrowDownLeft,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    sign: '+',
  },
} as const

const STATUS_LABELS: Record<string, string> = {
  completed: 'Tamamlandı',
  pending: 'Gözləyir',
  failed: 'Uğursuz',
  refunded: 'Geri qaytarıldı',
}

type FilterTab = 'all' | 'earnings' | 'withdrawals'
const TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Hamısı' },
  { key: 'earnings', label: 'Gəlirlər' },
  { key: 'withdrawals', label: 'Çıxarışlar' },
]

export default function TutorEarningsPage() {
  const { data: wallet, isLoading: loadingWallet } = useWalletBalance()
  const [tab, setTab] = useState<FilterTab>('all')
  const { data: rawTxs, isLoading: loadingTxs } = useTutorTransactions(tab)
  const withdraw = useWithdrawalRequest()

  const [showModal, setShowModal] = useState(false)
  const [amount, setAmount] = useState('')
  const [bankDetails, setBankDetails] = useState('')

  const txs = rawTxs as Array<{
    id: string
    type: string
    amount: number
    status: string
    description: string | null
    created_at: string
    currency: string
  }> | undefined

  const handleWithdraw = async () => {
    const amt = Number(amount)
    try {
      await withdraw.mutateAsync({ amount: amt, bankDetails })
      toast.success('Çıxarış müraciəti göndərildi')
      setShowModal(false)
      setAmount('')
      setBankDetails('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Xəta baş verdi')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Qazanclar</h1>
        <p className="text-sm text-muted-foreground mt-1">Balans, tranzaksiyalar və çıxarış</p>
      </div>

      {/* Balance card */}
      <div className="relative overflow-hidden rounded-2xl gradient-bg p-7 text-white">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/8 float-slow" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-white/70" />
              <span className="text-sm text-white/70 font-medium">Cari balans</span>
            </div>
            {loadingWallet ? (
              <Skeleton className="h-12 w-40 bg-white/20" />
            ) : (
              <p className="text-5xl font-black tracking-tight">
                ${(wallet?.balance ?? 0).toFixed(2)}
              </p>
            )}
            {!loadingWallet && (
              <div className="flex gap-4 mt-3 text-sm text-white/70">
                <span>Ümumi qazanc: <strong className="text-white">${(wallet?.total_earned ?? 0).toFixed(2)}</strong></span>
                <span>Çıxarılıb: <strong className="text-white">${(wallet?.total_withdrawn ?? 0).toFixed(2)}</strong></span>
              </div>
            )}
          </div>

          <Button
            onClick={() => setShowModal(true)}
            className="bg-white text-primary hover:bg-white/90 border-0 rounded-full font-semibold h-11 px-6 shadow-lg btn-glow shrink-0"
          >
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Çıxarış et
          </Button>
        </div>
      </div>

      {/* Earnings chart */}
      <EarningsChart />

      {/* Transactions */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-semibold text-sm">Tranzaksiyalar</h2>
          </div>

          {/* Filter tabs */}
          <div className="flex rounded-lg border border-border overflow-hidden text-xs">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 transition-colors ${tab === t.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          {loadingTxs ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : !txs?.length ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Hələ tranzaksiya yoxdur
            </p>
          ) : (
            <div className="space-y-3">
              {txs.map((tx) => {
                const cfg = TX_TYPE_CONFIG[tx.type as keyof typeof TX_TYPE_CONFIG] ?? TX_TYPE_CONFIG.lesson_earning
                const Icon = cfg.icon
                return (
                  <div key={tx.id} className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`h-4 w-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{cfg.label}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{format(new Date(tx.created_at), 'd MMM, HH:mm', { locale: az })}</span>
                        <Badge
                          className={`text-[10px] h-4 px-1.5 ${
                            tx.status === 'completed'
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                              : tx.status === 'pending'
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/20'
                              : 'bg-red-500/15 text-red-400 border-red-500/20'
                          }`}
                        >
                          {STATUS_LABELS[tx.status] ?? tx.status}
                        </Badge>
                      </div>
                    </div>
                    <span className={`text-sm font-bold shrink-0 ${cfg.color}`}>
                      {cfg.sign}${tx.amount.toFixed(2)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Withdrawal modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Çıxarış müraciəti
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
              <p className="text-xs text-muted-foreground mb-1">Mövcud balans</p>
              <p className="text-2xl font-extrabold text-emerald-400">
                ${(wallet?.balance ?? 0).toFixed(2)}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Məbləğ (min. $50)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50.00"
                min="50"
                step="0.01"
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bank məlumatları</label>
              <input
                type="text"
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
                placeholder="IBAN, kart nömrəsi və ya bank adı..."
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Minimum çıxarış $50-dir. Müraciətlər 1-3 iş günü ərzində işlənir.
            </p>

            <Button
              onClick={handleWithdraw}
              disabled={withdraw.isPending || !amount || !bankDetails || Number(amount) < 50}
              className="w-full gradient-bg border-0 text-white rounded-xl h-11"
            >
              {withdraw.isPending ? 'Göndərilir...' : 'Müraciət göndər'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
