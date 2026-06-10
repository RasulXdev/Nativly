'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, GraduationCap, Calendar, MessageSquare, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

export default function MobileNav() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const { profile } = useAuth()

  const role = profile?.role ?? 'student'

  const studentTabs = [
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/tutors', label: t('tutors'), icon: GraduationCap },
    { href: '/schedule', label: t('schedule'), icon: Calendar },
    { href: '/messages', label: t('messages'), icon: MessageSquare },
    { href: '/settings', label: t('profile'), icon: User },
  ]

  const tutorTabs = [
    { href: '/tutor-dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/tutor-schedule', label: t('schedule'), icon: Calendar },
    { href: '/messages', label: t('messages'), icon: MessageSquare },
    { href: '/tutor-settings', label: t('profile'), icon: User },
  ]

  const tabs = role === 'tutor' ? tutorTabs : studentTabs

  const isActive = (href: string) =>
    pathname.split('/').some((seg) => seg === href.replace('/', ''))

  return (
    <nav className="dark lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-xl">
      <div className="flex h-16 items-stretch px-2">
        {tabs.map((tab) => {
          const active = isActive(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href as Parameters<typeof Link>[0]['href']}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all duration-150 rounded-xl mx-0.5',
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className={cn(
                'flex items-center justify-center w-8 h-6 rounded-lg transition-all duration-150',
                active && 'gradient-bg nav-active-glow'
              )}>
                <tab.icon className={cn('h-4 w-4', active ? 'text-white' : '')} />
              </div>
              <span className={active ? 'text-primary font-semibold' : ''}>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
