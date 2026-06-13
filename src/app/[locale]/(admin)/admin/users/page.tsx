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
  admin: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  tutor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  student: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
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
    toast.success('Updated')
    load()
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0">
          <Users className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">{t('title')}</h1>
          <p className="text-xs text-muted-foreground">{t('totalUsers', { count: total })}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
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

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="divide-y divide-border/50">
          {loading ? (
            <div className="p-4 space-y-3">
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
          ) : users.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">{t('noUsers')}</div>
          ) : users.map(u => {
            const RoleIcon = ROLE_ICONS[u.role]
            return (
              <div key={u.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                <div className="relative">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={u.avatar_url} />
                    <AvatarFallback className="gradient-bg text-white text-xs font-bold">{getInitials(u.full_name)}</AvatarFallback>
                  </Avatar>
                  {!u.is_active && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-destructive border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{u.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <Badge className={`text-xs border ${ROLE_COLORS[u.role]}`}>
                    <RoleIcon className="h-3 w-3 mr-1" />
                    {u.role}
                  </Badge>
                  <span className="text-xs text-muted-foreground w-20 text-right">
                    {format(new Date(u.created_at), 'd MMM yyyy')}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
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
              </div>
            )
          })}
        </div>

        {/* Pagination */}
        {total > limit && (
          <div className="px-4 py-3 border-t border-border/50 flex items-center justify-between">
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
    </div>
  )
}
