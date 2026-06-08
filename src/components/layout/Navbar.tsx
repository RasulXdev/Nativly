'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Settings, LogOut, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'
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

  const navLinks = [
    { href: `/${locale}/tutors`, label: t('tutors') },
    { href: `/${locale}/pricing`, label: t('pricing') },
    { href: `/${locale}/how-it-works`, label: t('howItWorks') },
    { href: `/${locale}/about`, label: t('about') },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-border/50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
          <Logo />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-primary/10 rounded-lg transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            {user && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full outline-none">
                  <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                    <AvatarImage src={profile.avatar_url ?? ''} alt={profile.full_name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
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
                <Link href={`/${locale}/login`} className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
                  {t('login')}
                </Link>
                <Link href={`/${locale}/register`} className={cn(buttonVariants({ size: 'sm' }))}>
                  {t('register')}
                </Link>
              </div>
            )}

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/50 px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-primary/10 rounded-lg transition-all">
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="flex gap-2 pt-2">
                <Link href={`/${locale}/login`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'flex-1')}>{t('login')}</Link>
                <Link href={`/${locale}/register`} className={cn(buttonVariants({ size: 'sm' }), 'flex-1')}>{t('register')}</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
