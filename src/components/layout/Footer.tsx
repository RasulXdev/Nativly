'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Logo from '@/components/shared/Logo'

export default function Footer() {
  const t = useTranslations('footer')

  const links = {
    company: [
      { href: '/about' as const, label: t('about') },
      { href: '/how-it-works' as const, label: t('help') },
      { href: '/become-tutor' as const, label: t('careers') },
    ],
    support: [
      { href: '/faq' as const, label: t('faq') },
      { href: '/contact' as const, label: t('contact') },
    ],
    legal: [
      { href: '/privacy' as const, label: t('privacy') },
      { href: '/terms' as const, label: t('terms') },
    ],
  }

  return (
    <footer className="border-t border-border/30 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              {t('about')}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm">{t('company')}</h3>
            <ul className="space-y-2">
              {links.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm">{t('support')}</h3>
            <ul className="space-y-2">
              {links.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm">{t('legal')}</h3>
            <ul className="space-y-2">
              {links.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/30">
          <p className="text-xs text-muted-foreground text-center">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
