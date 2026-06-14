'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Search, LogOut, Settings, LayoutDashboard, Zap } from 'lucide-react'
import NotificationBell from '@/components/notifications/NotificationBell'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { getInitials } from '@/lib/utils'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'

export default function TopBar() {
  const t = useTranslations('nav')
  const { profile, signOut } = useAuth()
  const router = useRouter()
  const locale = useLocale()

  const role = profile?.role ?? 'student'
  const dashboardHref = `/${locale}/${role === 'admin' ? 'admin' : role === 'tutor' ? 'tutor-dashboard' : 'dashboard'}`

  const roleLabel = role === 'tutor' ? t('roleTutor') : role === 'admin' ? t('roleAdmin') : t('roleStudent')
  const roleColor = role === 'admin'
    ? 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    : role === 'tutor'
      ? 'text-primary bg-primary/10 border-primary/20'
      : 'text-violet-400 bg-violet-400/10 border-violet-400/20'

  return (
    <header className="sticky top-0 z-40 flex h-[60px] items-center gap-3 border-b border-border bg-background/85 backdrop-blur-xl px-4 sm:px-6 shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary pointer-events-none transition-colors duration-200" />
          <input
            type="text"
            placeholder={`${t('search') ?? 'Axtar'}...`}
            className={cn(
              'w-full h-9 pl-9 pr-4 text-sm rounded-xl transition-all duration-200',
              'bg-secondary/60 border border-border text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:bg-background focus:border-primary/40 focus:ring-2 focus:ring-primary/12',
              'hover:border-border/80'
            )}
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted border border-border text-[9px] text-muted-foreground font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        {/* Quick action */}
        <button className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-xl bg-primary/10 border border-primary/15 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors">
          <Zap className="h-3 w-3" />
          <span>Quick</span>
        </button>

        <div className="h-5 w-px bg-border mx-0.5" />

        {/* Notifications */}
        <NotificationBell />

        <div className="h-5 w-px bg-border mx-0.5" />

        {/* User menu */}
        {profile && (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-xl hover:bg-secondary/60 transition-colors cursor-pointer group">
                <div className="relative">
                  <Avatar className="h-7 w-7 ring-1 ring-primary/25 group-hover:ring-primary/50 transition-all duration-200">
                    <AvatarImage src={profile.avatar_url ?? ''} alt={profile.full_name} />
                    <AvatarFallback className="gradient-bg text-white text-[10px] font-bold">
                      {getInitials(profile.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-background" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-foreground leading-tight truncate max-w-[90px]">
                    {profile.full_name?.split(' ')[0]}
                  </p>
                  <p className={cn('text-[9px] font-semibold leading-tight rounded-full px-1.5 py-0.5 border inline-block mt-0.5', roleColor)}>
                    {roleLabel}
                  </p>
                </div>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="dark bg-popover text-popover-foreground w-56 shadow-2xl border-border"
              align="end"
              sideOffset={8}
            >
              {/* Profile header */}
              <div className="p-3 border-b border-border mb-1">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-9 w-9 ring-1 ring-primary/30">
                    <AvatarImage src={profile.avatar_url ?? ''} alt={profile.full_name} />
                    <AvatarFallback className="gradient-bg text-white text-xs font-bold">
                      {getInitials(profile.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-tight truncate">{profile.full_name}</p>
                    <p className="text-xs leading-tight text-muted-foreground truncate mt-0.5">{profile.email}</p>
                  </div>
                </div>
                <div className="mt-2.5">
                  <span className={cn('text-[10px] font-semibold rounded-full px-2 py-0.5 border', roleColor)}>
                    {roleLabel}
                  </span>
                </div>
              </div>

              <DropdownMenuItem
                onClick={() => router.push(dashboardHref)}
                className="cursor-pointer rounded-lg mx-1 text-sm"
              >
                <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                {t('dashboard')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/${locale}/settings`)}
                className="cursor-pointer rounded-lg mx-1 text-sm"
              >
                <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                {t('settings')}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="mx-1" />
              <DropdownMenuItem
                onClick={() => signOut().then(() => router.push(`/${locale}`))}
                className="cursor-pointer rounded-lg mx-1 mb-1 text-sm text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t('logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
