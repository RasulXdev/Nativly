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
  Sparkles,
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
    { href: '/tutor-earnings', label: t('earnings'), icon: BarChart3 },
    { href: '/tutor-settings', label: t('settings'), icon: Settings },
  ]

  const adminNav: NavItem[] = [
    { href: '/admin', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/admin/users', label: t('admin'), icon: Users },
    { href: '/admin/tutors', label: t('tutors'), icon: GraduationCap },
    { href: '/admin/lessons', label: t('lessons'), icon: BookOpen },
    { href: '/admin/payments', label: t('wallet'), icon: CreditCard },
    { href: '/admin/settings', label: t('settings'), icon: Settings },
  ]

  const role = profile?.role ?? 'student'
  const navItems = role === 'admin' ? adminNav : role === 'tutor' ? tutorNav : studentNav

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-300 ease-in-out',
        'border-r border-sidebar-border bg-sidebar',
        sidebarCollapsed ? 'w-[72px]' : 'w-[252px]'
      )}
    >
      {/* Subtle ambient glow at top */}
      <div
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse 100% 80% at 50% 0%, oklch(0.62 0.18 255 / 0.12) 0%, transparent 70%)',
        }}
      />

      {/* Logo */}
      <Link
        href="/"
        className={cn(
          'relative z-10 flex items-center h-[60px] border-b border-sidebar-border/60 transition-all hover:opacity-80',
          sidebarCollapsed ? 'justify-center px-0' : 'px-5 gap-3'
        )}
      >
        {sidebarCollapsed ? (
          <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center glow-sm-teal">
            <span className="text-white font-black text-base">N</span>
          </div>
        ) : (
          <>
            <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center shadow-md">
              <span className="text-white font-black text-sm">N</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-sidebar-foreground leading-none">
                Nativly
              </span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5 font-medium">
                Platform
              </span>
            </div>
            <div className="ml-auto">
              <div className="inline-flex items-center gap-1 text-[9px] font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5 border border-primary/15">
                <Sparkles className="h-2.5 w-2.5" />
                Pro
              </div>
            </div>
          </>
        )}
      </Link>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 py-4 overflow-y-auto overflow-x-hidden px-2.5 space-y-0.5">
        {!sidebarCollapsed && (
          <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-2 pb-2 pt-1">
            {role === 'admin' ? 'Admin' : role === 'tutor' ? 'Tutor' : 'Student'} Menu
          </p>
        )}
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href as Parameters<typeof Link>[0]['href']}
              title={sidebarCollapsed ? item.label : undefined}
              className={cn(
                'relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 group',
                sidebarCollapsed
                  ? 'h-10 w-10 mx-auto justify-center'
                  : 'h-10 px-3 gap-3',
                active
                  ? 'gradient-bg text-white nav-active-glow'
                  : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              {/* Active left indicator line */}
              {active && !sidebarCollapsed && (
                <span className="absolute -left-2.5 top-2 bottom-2 w-0.5 rounded-full bg-primary/60" />
              )}

              <item.icon
                className={cn(
                  'shrink-0 transition-all duration-200',
                  sidebarCollapsed ? 'h-[18px] w-[18px]' : 'h-4 w-4',
                  active ? 'text-white' : 'group-hover:scale-110'
                )}
              />
              {!sidebarCollapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}
              {!sidebarCollapsed && item.badge != null && item.badge > 0 && (
                <span className="ml-auto text-[10px] font-bold bg-accent text-white rounded-full h-4.5 min-w-[18px] flex items-center justify-center px-1">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}

              {/* Collapsed tooltip */}
              {sidebarCollapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-popover border border-border text-foreground text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-xl">
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="relative z-10 border-t border-sidebar-border/60 p-2.5 space-y-1.5">
        {/* Back to site */}
        <Link
          href="/"
          title={sidebarCollapsed ? t('home') : undefined}
          className={cn(
            'relative flex items-center rounded-xl text-sm font-medium text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200 group',
            sidebarCollapsed ? 'h-10 w-10 mx-auto justify-center' : 'h-10 px-3 gap-3'
          )}
        >
          <ArrowLeft className={cn('shrink-0', sidebarCollapsed ? 'h-[18px] w-[18px]' : 'h-4 w-4')} />
          {!sidebarCollapsed && <span className="flex-1 truncate">{t('home')}</span>}
          {sidebarCollapsed && (
            <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-popover border border-border text-foreground text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-xl">
              {t('home')}
            </span>
          )}
        </Link>

        {/* User profile card */}
        {!sidebarCollapsed && profile && (
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-sidebar-accent/60 hover:bg-sidebar-accent transition-colors cursor-pointer border border-sidebar-border/40">
            <div className="relative shrink-0">
              <Avatar className="h-7 w-7 ring-1 ring-primary/30">
                <AvatarImage src={profile.avatar_url ?? ''} alt={profile.full_name} />
                <AvatarFallback className="gradient-bg text-white text-[10px] font-bold">
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-sidebar ring-1 ring-sidebar" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate text-sidebar-foreground leading-tight">{profile.full_name}</p>
              <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5 capitalize">{profile.role ?? 'student'}</p>
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebarCollapsed}
          className="w-full flex items-center justify-center h-8 rounded-xl hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground transition-colors"
          aria-label={sidebarCollapsed ? 'Expand' : 'Collapse'}
        >
          {sidebarCollapsed
            ? <ChevronRight className="h-4 w-4" />
            : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  )
}
