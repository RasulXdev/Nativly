'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  GraduationCap,
  Calendar,
  MessageSquare,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Star,
  BookOpen,
  Users,
  BarChart3,
  CreditCard,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Logo from '@/components/shared/Logo'
import { useUIStore } from '@/stores/uiStore'
import { useAuth } from '@/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

export default function Sidebar() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebarCollapsed } = useUIStore()
  const { profile } = useAuth()

  const isActive = (href: string) => {
    const segments = pathname.split('/')
    const hrefSegments = href.split('/').filter(Boolean)
    return hrefSegments.every((seg, i) => segments.includes(seg))
  }

  const studentNav: NavItem[] = [
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/tutors', label: t('tutors'), icon: GraduationCap },
    { href: '/schedule', label: t('schedule'), icon: Calendar },
    { href: '/lessons', label: t('lessons'), icon: BookOpen },
    { href: '/messages', label: t('messages'), icon: MessageSquare },
    { href: '/wallet', label: t('wallet'), icon: Wallet },
    { href: '/settings', label: t('settings'), icon: Settings },
  ]

  const tutorNav: NavItem[] = [
    { href: '/tutor-dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/tutor-schedule', label: t('schedule'), icon: Calendar },
    { href: '/tutor-students', label: t('students'), icon: Users },
    { href: '/messages', label: t('messages'), icon: MessageSquare },
    { href: '/tutor-earnings', label: 'Qazanc', icon: BarChart3 },
    { href: '/tutor-settings', label: t('settings'), icon: Settings },
  ]

  const adminNav: NavItem[] = [
    { href: '/admin', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/admin/users', label: 'İstifadəçilər', icon: Users },
    { href: '/admin/tutors', label: t('tutors'), icon: GraduationCap },
    { href: '/admin/lessons', label: 'Dərslər', icon: BookOpen },
    { href: '/admin/payments', label: 'Ödənişlər', icon: CreditCard },
    { href: '/admin/settings', label: t('settings'), icon: Settings },
  ]

  const role = profile?.role ?? 'student'
  const navItems = role === 'admin' ? adminNav : role === 'tutor' ? tutorNav : studentNav

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col h-screen sticky top-0 border-r border-border/60 bg-sidebar transition-all duration-300 shrink-0',
        sidebarCollapsed ? 'w-[68px]' : 'w-[240px]'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center h-16 px-4 border-b border-border/40', sidebarCollapsed && 'justify-center px-2')}>
        {sidebarCollapsed ? (
          <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
        ) : (
          <Logo />
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto px-2">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href as Parameters<typeof Link>[0]['href']}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                sidebarCollapsed && 'justify-center px-2'
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon className={cn('shrink-0', sidebarCollapsed ? 'h-5 w-5' : 'h-4 w-4')} />
              {!sidebarCollapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}
              {!sidebarCollapsed && item.badge != null && item.badge > 0 && (
                <Badge variant="destructive" className="h-5 min-w-5 px-1 text-xs rounded-full">
                  {item.badge > 99 ? '99+' : item.badge}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Profile + Collapse */}
      <div className="border-t border-border/40 p-3 space-y-2">
        {!sidebarCollapsed && profile && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-accent transition-colors cursor-pointer">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={profile.avatar_url ?? ''} alt={profile.full_name} />
              <AvatarFallback className="gradient-bg text-white text-xs font-semibold">
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{profile.full_name}</p>
              <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={toggleSidebarCollapsed}
          className="w-full flex items-center justify-center h-8 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          aria-label={sidebarCollapsed ? 'Genişlət' : 'Daralt'}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  )
}
