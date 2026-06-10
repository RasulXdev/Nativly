'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

const languages = [
  { code: 'az' as const, label: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'en' as const, label: 'English', flag: '🇬🇧' },
  { code: 'ru' as const, label: 'Русский', flag: '🇷🇺' },
]

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (newLocale: 'az' | 'en' | 'ru') => {
    router.replace(pathname, { locale: newLocale })
  }

  const current = languages.find((l) => l.code === locale) ?? languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-full px-3 h-9 text-sm font-medium hover:bg-primary/5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Globe className="h-4 w-4 text-primary/70" />
        <span className="hidden sm:inline">{current.flag} {current.code.toUpperCase()}</span>
        <span className="sm:hidden">{current.flag}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className={locale === lang.code ? 'font-semibold bg-primary/5 text-primary' : 'cursor-pointer'}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
