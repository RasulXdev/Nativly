'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Bell, Search, LogOut, Settings, LayoutDashboard, Command } from 'lucide-react'
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

export default function TopBar() {
  const t = useTranslations('nav')
  const { profile, signOut } = useAuth()
  const router = useRouter()
  const locale = useLocale()

  const role = profile?.role ?? 'student'
  const dashboardHref = `/${locale}/${role === 'admin' ? 'admin' : role === 'tutor' ? 'tutor-dashboard' : 'dashboard'}`

  return (
    <header className="sticky top-0 z-40 flex h-[60px] items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-4 sm:px-6 shrink-0">
      {/* Search bar */}
      <div className="flex-1 max-w-xs">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70 group-focus-within:text-primary/70 pointer-events-none transition-colors" />
          <input
            type="text"
            placeholder="Axtar... (⌘K)"
            className="platform-input w-full h-9 pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        {/* Notification bell */}
        <button className="relative h-9 w-9 flex items-center justify-center rounded-xl hover:bg-white/6 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-1 ring-background" />
          <span className="sr-only">Bildirişlər</span>
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-border mx-1" />

        {/* User dropdown */}
        {profile && (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/6 transition-colors cursor-pointer group">
                <Avatar className="h-7 w-7 ring-1 ring-white/20 group-hover:ring-primary/40 transition-all">
                  <AvatarImage src={profile.avatar_url ?? ''} alt={profile.full_name} />
                  <AvatarFallback className="gradient-bg text-white text-[10px] font-bold">
                    {getInitials(profile.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-foreground leading-tight truncate max-w-[100px]">
                    {profile.full_name?.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {role === 'tutor' ? 'Müəllim' : role === 'admin' ? 'Admin' : 'Tələbə'}
                  </p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark bg-popover text-popover-foreground w-52" align="end" sideOffset={8}>
              <div className="flex flex-col space-y-0.5 p-2.5 border-b border-border mb-1">
                <p className="text-sm font-semibold leading-tight">{profile.full_name}</p>
                <p className="text-xs leading-tight text-muted-foreground">{profile.email}</p>
              </div>
              <DropdownMenuItem onClick={() => router.push(dashboardHref)}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                {t('dashboard')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/${locale}/settings`)}>
                <Settings className="mr-2 h-4 w-4" />
                {t('settings')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut().then(() => router.push(`/${locale}`))}
                className="text-destructive focus:text-destructive"
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
