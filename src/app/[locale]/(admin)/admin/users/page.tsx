'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Users, Search, ChevronLeft, ChevronRight, Shield, GraduationCap, User, MoreVertical, Check, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTable, type ColumnDef } from '@/components/ui/data-table'
import { GlassCard } from '@/components/ui/glass-card'
import { getInitials } from '@/lib/utils'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface User {
  id: string
  full_name: string
  email: string
  role: 'student' | 'tutor' | 'admin'
  is_active: boolean
  created_at: string
  avatar_url: string
  last_seen_at: string
}

const ROLE_ICONS = { admin: Shield, tutor: GraduationCap, student: User }
const ROLE_COLORS = {
  admin: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  tutor: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  student: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
}

export default function AdminUsersPage() {
  const t = useTranslations('admin.users')
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [page, setPage] = useState(0)
  const limit = 20

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ limit: String(limit), offset: String(page * limit) })
    if (search) params.set('search', search)
    if (role) params.set('role', role)
    const res = await fetch(`/api/admin/users?${params}`)
    const data = await res.json()
    setUsers(data.users ?? [])
    setTotal(data.total ?? 0)
    setLoading(false)
  }, [search, role, page])

  useEffect(() => { load() }, [load])

  useEffect(() => { setPage(0) }, [search, role])

  async function handleAction(userId: string, action: string, value: unknown) {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action, value }),
    })
    toast.success(t('updated'))
    load()
  }

  return (
    <div className="space-y-5">
      <GlassCard
        title={t('title')}
        icon={Users}
      >
        {/* Filters */}
        <div className="px-5 pt-4 pb-3 flex flex-col sm:flex-row gap-3 border-b border-border/30">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {['', 'student', 'tutor', 'admin'].map(r => (
              <Button
                key={r}
                size="sm"
                variant={role === r ? 'default' : 'outline'}
                onClick={() => setRole(r)}
                className="capitalize text-xs"
              >
                {r || t('all')}
              </Button>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground px-5 pt-3">{t('totalUsers', { count: total })}</div>

        {/* Table */}
        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5 space-y-4">
          <DataTable<User>
            data={users}
            emptyState={<span className="text-sm text-muted-foreground">{t('noUsers')}</span>}
            columns={[
              {
                key: 'full_name',
                header: t('title'),
                sortable: true,
                render: (u) => (
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <Avatar className="h-9 w-9 ring-1 ring-white/10">
                        <AvatarImage src={u.avatar_url} />
                        <AvatarFallback className="gradient-bg text-white text-xs font-bold">{getInitials(u.full_name)}</AvatarFallback>
                      </Avatar>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${u.is_active ? 'bg-emerald-400' : 'bg-muted-foreground/50'}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate text-foreground">{u.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                  </div>
                ),
              },
              {
                key: 'role',
                header: t('role'),
                sortable: true,
                render: (u) => {
                  const RoleIcon = ROLE_ICONS[u.role]
                  return (
                    <Badge className={`text-[11px] border font-medium ${ROLE_COLORS[u.role]}`}>
                      <RoleIcon className="h-3 w-3 mr-1" />
                      <span className="capitalize">{u.role}</span>
                    </Badge>
                  )
                },
              },
              {
                key: 'is_active',
                header: t('status'),
                sortable: true,
                align: 'center',
                render: (u) => (
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${u.is_active ? 'bg-emerald-500/12 text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-400' : 'bg-muted-foreground'}`} />
                    {u.is_active ? t('statusActive') : t('statusInactive')}
                  </span>
                ),
              },
              {
                key: 'created_at',
                header: t('joined'),
                sortable: true,
                align: 'right',
                className: 'text-xs text-muted-foreground tabular-nums whitespace-nowrap',
                render: (u) => format(new Date(u.created_at), 'd MMM yyyy'),
              },
              {
                key: 'actions',
                header: '',
                align: 'right',
                render: (u) => (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors outline-none shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => handleAction(u.id, 'toggle_active', !u.is_active)}>
                        {u.is_active ? <X className="h-3.5 w-3.5 mr-2 text-destructive" /> : <Check className="h-3.5 w-3.5 mr-2 text-emerald-500" />}
                        {u.is_active ? t('deactivate') : t('activate')}
                      </DropdownMenuItem>
                      {u.role !== 'admin' && (
                        <DropdownMenuItem onClick={() => handleAction(u.id, 'change_role', u.role === 'tutor' ? 'student' : 'tutor')}>
                          <Shield className="h-3.5 w-3.5 mr-2" />
                          {u.role === 'tutor' ? t('makeStudent') : t('makeTutor')}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ),
              },
            ]}
          />

          {/* Pagination */}
          {total > limit && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {page * limit + 1}–{Math.min((page + 1) * limit, total)} of {total}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={(page + 1) * limit >= total} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          </div>
        )}
      </GlassCard>
    </div>
  )
}
