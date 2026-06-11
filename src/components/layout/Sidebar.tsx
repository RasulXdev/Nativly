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
  ArrowLeft,
  BookOpen,
  Users,
  BarChart3,
  CreditCard,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'
import { useAuth } from '@/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

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
    return hrefSegments.every((seg) => segments.includes(seg))
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
        'hidden lg:flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-300 ease-in-out',
        'border-r border-border bg-sidebar',
        sidebarCollapsed ? 'w-[72px]' : 'w-[248px]'
      )}
    >
      {/* Logo — ana səhifəyə link */}
      <Link
        href="/"
        className={cn(
          'flex items-center h-[60px] border-b border-border/60 transition-all hover:opacity-75',
          sidebarCollapsed ? 'justify-center px-0' : 'px-5'
        )}
      >
        {sidebarCollapsed ? (
          <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg nav-active-glow">
            <span className="text-white font-black text-base">N</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center shadow-md">
              <span className="text-white font-black text-sm">N</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-foreground">Nativly</span>
          </div>
        )}
      </Link>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden px-2.5 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href as Parameters<typeof Link>[0]['href']}
              title={sidebarCollapsed ? item.label : undefined}
              className={cn(
                'relative flex items-center rounded-xl text-sm font-medium transition-all duration-150 group',
                sidebarCollapsed
                  ? 'h-10 w-10 mx-auto justify-center'
                  : 'h-10 px-3 gap-3',
                active
                  ? 'gradient-bg text-white nav-active-glow'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/6'
              )}
            >
              <item.icon className={cn('shrink-0 transition-transform duration-150', sidebarCollapsed ? 'h-[18px] w-[18px]' : 'h-4 w-4', active && !sidebarCollapsed && 'scale-105')} />
              {!sidebarCollapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}
              {!sidebarCollapsed && item.badge != null && item.badge > 0 && (
                <span className="ml-auto text-[10px] font-bold bg-destructive text-white rounded-full h-4.5 min-w-[18px] flex items-center justify-center px-1">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
              {/* Collapsed tooltip */}
              {sidebarCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-popover border border-border text-foreground text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg">
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom — Back to site + Profile + Collapse */}
      <div className="border-t border-border/60 p-2.5 space-y-2">
        <Link
          href="/"
          title={sidebarCollapsed ? 'Ana səhifə' : undefined}
          className={cn(
            'relative flex items-center rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/6 transition-all duration-150 group',
            sidebarCollapsed ? 'h-10 w-10 mx-auto justify-center' : 'h-10 px-3 gap-3'
          )}
        >
          <ArrowLeft className={cn('shrink-0', sidebarCollapsed ? 'h-[18px] w-[18px]' : 'h-4 w-4')} />
          {!sidebarCollapsed && <span className="flex-1 truncate">Ana səhifə</span>}
          {sidebarCollapsed && (
            <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-popover border border-border text-foreground text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg">
              Ana səhifə
            </span>
          )}
        </Link>

        {!sidebarCollapsed && profile && (
          <div className="flex items-center gap-2.5 px-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/8 transition-colors cursor-pointer">
            <Avatar className="h-7 w-7 shrink-0 ring-1 ring-white/20">
              <AvatarImage src={profile.avatar_url ?? ''} alt={profile.full_name} />
              <AvatarFallback className="gradient-bg text-white text-[10px] font-bold">
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate text-foreground leading-tight">{profile.full_name}</p>
              <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">{profile.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={toggleSidebarCollapsed}
          className="w-full flex items-center justify-center h-8 rounded-xl hover:bg-white/6 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={sidebarCollapsed ? 'Genişlət' : 'Daralt'}
        >
          {sidebarCollapsed
            ? <ChevronRight className="h-4 w-4" />
            : <ChevronLeft className="h-4 w-4" />
          }
        </button>
      </div>
    </aside>
  )
}
