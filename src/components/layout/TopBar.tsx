'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Bell, Search, LogOut, Settings, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Axtar..."
            className="pl-9 h-9 bg-muted/50 border-transparent focus:border-border focus:bg-background"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          <span className="sr-only">Bildirişlər</span>
        </Button>

        {/* User dropdown */}
        {profile && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-primary/15 hover:ring-primary/35 transition-all">
                <AvatarImage src={profile.avatar_url ?? ''} alt={profile.full_name} />
                <AvatarFallback className="gradient-bg text-white text-sm font-semibold">
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-semibold leading-none">{profile.full_name}</p>
                <p className="text-xs leading-none text-muted-foreground">{profile.email}</p>
              </div>
              <DropdownMenuSeparator />
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
