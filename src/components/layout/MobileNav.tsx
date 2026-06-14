'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, GraduationCap, Calendar, MessageSquare, User, BarChart3 } from 'lucide-react'
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
    { href: '/tutor-earnings', label: t('earnings'), icon: BarChart3 },
    { href: '/messages', label: t('messages'), icon: MessageSquare },
    { href: '/tutor-settings', label: t('profile'), icon: User },
  ]

  const tabs = role === 'tutor' ? tutorTabs : studentTabs

  const isActive = (href: string) =>
    pathname.split('/').some((seg) => seg === href.replace('/', ''))

  return (
    <nav className="dark lg:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Frosted glass bar */}
      <div className="border-t border-border/60 bg-background/90 backdrop-blur-2xl">
        {/* Teal top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="flex h-[62px] items-stretch px-1 safe-area-pb">
          {tabs.map((tab) => {
            const active = isActive(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href as Parameters<typeof Link>[0]['href']}
                className={cn(
                  'relative flex flex-1 flex-col items-center justify-center gap-0.5 transition-all duration-200 rounded-xl mx-0.5 my-1',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {/* Active background pill */}
                {active && (
                  <span className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/15" />
                )}

                {/* Icon container */}
                <div className={cn(
                  'relative z-10 flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200',
                  active && 'gradient-bg nav-active-glow scale-110'
                )}>
                  <tab.icon className={cn('h-3.5 w-3.5', active ? 'text-white' : '')} />
                </div>

                <span className={cn(
                  'relative z-10 text-[9px] font-semibold leading-none tracking-wide',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {tab.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
