'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useRouter } from 'next/navigation'
import { Settings, LogOut, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Logo from '@/components/shared/Logo'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher'
import { useAuth } from '@/hooks/useAuth'
import { getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const { user, profile, signOut } = useAuth()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '/tutors' as const, label: t('tutors') },
    { href: '/pricing' as const, label: t('pricing') },
    { href: '/how-it-works' as const, label: t('howItWorks') },
    { href: '/about' as const, label: t('about') },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className={cn(
        'transition-all duration-300 border-b',
        scrolled
          ? 'bg-white/88 backdrop-blur-xl border-border/50 shadow-md shadow-primary/5'
          : 'bg-white/40 backdrop-blur-md border-white/30'
      )}>
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 max-w-7xl">
          <Logo />

          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-[0.9rem] font-semibold text-foreground hover:text-primary rounded-full hover:bg-primary/6 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            {user && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full outline-none">
                  <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-primary/15 hover:ring-primary/35 transition-all">
                    <AvatarImage src={profile.avatar_url ?? ''} alt={profile.full_name} />
                    <AvatarFallback className="gradient-bg text-white text-sm font-semibold">
                      {getInitials(profile.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center gap-2 p-2">
                    <div className="flex flex-col space-y-0.5">
                      <p className="font-semibold text-sm">{profile.full_name}</p>
                      <p className="text-xs text-muted-foreground">{profile.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/${locale}/${profile.role === 'tutor' ? 'tutor-dashboard' : profile.role === 'admin' ? 'admin' : 'dashboard'}`)}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />{t('dashboard')}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/${locale}/settings`)}>
                    <Settings className="mr-2 h-4 w-4" />{t('settings')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />{t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className={cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'rounded-full px-5 font-semibold text-foreground hover:text-primary hover:bg-primary/6')}>
                  {t('login')}
                </Link>
                <Link href="/register" className={cn(buttonVariants({ size: 'default' }), 'btn-glow rounded-full px-6 gradient-bg border-0 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 shadow-md shadow-primary/20')}>
                  {t('register')}
                </Link>
              </div>
            )}

            <Button variant="ghost" size="icon" className="md:hidden rounded-full" onClick={() => setMobileOpen(v => !v)} aria-label={mobileOpen ? t('closeMenu') : t('openMenu')} aria-expanded={mobileOpen}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-border/40 px-4 py-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 text-[0.9rem] font-semibold text-foreground/78 hover:text-primary hover:bg-primary/6 rounded-xl transition-all">
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="flex gap-2 pt-3 border-t border-border/40 mt-2">
                <Link href="/login" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'flex-1 rounded-full')} onClick={() => setMobileOpen(false)}>
                  {t('login')}
                </Link>
                <Link href="/register" className={cn(buttonVariants({ size: 'sm' }), 'flex-1 rounded-full gradient-bg border-0')} onClick={() => setMobileOpen(false)}>
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
