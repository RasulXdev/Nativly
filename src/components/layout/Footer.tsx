import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import Logo from '@/components/shared/Logo'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()

  const links = {
    company: [
      { href: `/${locale}/about`, label: t('about') },
      { href: `/${locale}/how-it-works`, label: 'Necə işləyir' },
      { href: `/${locale}/become-tutor`, label: 'Müəllim ol' },
    ],
    support: [
      { href: `/${locale}/faq`, label: t('faq') },
      { href: `/${locale}/contact`, label: t('contact') },
    ],
    legal: [
      { href: `/${locale}/privacy`, label: t('privacy') },
      { href: `/${locale}/terms`, label: t('terms') },
    ],
  }

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-xs">
              Native müəllimlərlə 1-on-1 video dərslər. İstənilən vaxt, istənilən yerdən dil öyrən.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/nativly.az" target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Instagram
              </a>
              <a href="https://t.me/nativly" target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Telegram
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t('company')}</h3>
            <ul className="space-y-2">
              {links.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t('support')}</h3>
            <ul className="space-y-2">
              {links.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t('legal')}</h3>
            <ul className="space-y-2">
              {links.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">{t('copyright')}</p>
          <div className="flex gap-4">
            <Link href={`/${locale}/privacy`}
              className="text-xs text-muted-foreground hover:text-foreground">
              {t('privacy')}
            </Link>
            <Link href={`/${locale}/terms`}
              className="text-xs text-muted-foreground hover:text-foreground">
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
