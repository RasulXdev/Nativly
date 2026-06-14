'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Star, ArrowLeft, Quote, BookOpen, Sparkles, Globe, TrendingUp } from 'lucide-react'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher'
import { TEACHING_LANGUAGES } from '@/lib/constants/teaching'

const FLAGS = TEACHING_LANGUAGES.map((l) => l.flag)

const STATS = [
  { value: '5,000+', label: 'Active Students', trend: '+18%' },
  { value: '500+', label: 'Expert Tutors', trend: '+24%' },
  { value: '4.9', label: 'Avg Rating', trend: '★★★★★' },
]

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  const t = useTranslations('auth')

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-[1.1fr_1fr]">

      {/* ── Brand panel ─────────────────────────────────────────── */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 xl:p-16 text-white">
        {/* Deep obsidian base */}
        <div className="absolute inset-0 bg-[oklch(0.07_0.008_235)]" />

        {/* Teal mesh gradients */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 55% at 15% 15%, oklch(0.50 0.18 255 / 0.28) 0%, transparent 60%),
              radial-gradient(ellipse 55% 45% at 85% 80%, oklch(0.40 0.16 258 / 0.20) 0%, transparent 55%),
              radial-gradient(ellipse 45% 40% at 60% 50%, oklch(0.72 0.17 68 / 0.06) 0%, transparent 55%)
            `,
          }}
        />

        {/* Fine grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px),
              linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative orbs */}
        <div className="absolute top-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full opacity-20 hero-orb-1"
          style={{ background: 'radial-gradient(circle, oklch(0.62 0.18 255) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-[240px] h-[240px] rounded-full opacity-15 hero-orb-2"
          style={{ background: 'radial-gradient(circle, oklch(0.72 0.17 68) 0%, transparent 70%)' }} />

        {/* Top: Logo + badge */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-base font-extrabold shadow-lg glow-sm-teal transition-all group-hover:scale-105">
              N
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight block leading-none">Nativly</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Language Platform</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 text-xs text-white/50 bg-white/[0.05] rounded-full px-3 py-1.5 ring-1 ring-white/[0.08] backdrop-blur-sm">
            <Globe className="h-3 w-3 text-primary" />
            <span>{t('languageCount', { count: FLAGS.length })}</span>
          </div>
        </div>

        {/* Middle: Headline + testimonial */}
        <div className="relative z-10 max-w-md space-y-8">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300/90 bg-amber-400/10 rounded-full px-3 py-1.5 ring-1 ring-amber-400/20 backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              {t('nativeBadge')}
            </div>
            <h2 className="text-4xl xl:text-[2.75rem] font-extrabold leading-[1.08] tracking-tight">
              {t('brandTagline')}
            </h2>
            <p className="text-[0.95rem] text-white/50 leading-relaxed max-w-sm">{t('brandSubtext')}</p>
          </div>

          {/* Testimonial card */}
          <figure className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-white/[0.04] backdrop-blur-md" />
            <div className="absolute inset-0 border border-white/[0.08] rounded-2xl" />
            <div className="relative p-6">
              <Quote className="absolute top-4 right-4 h-6 w-6 text-primary/25 fill-primary/10" />
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs text-amber-400/80 ml-1.5 font-semibold">5.0</span>
              </div>
              <blockquote className="text-[0.9rem] leading-relaxed text-white/80 font-medium">
                &ldquo;{t('testimonialQuote')}&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-xs font-bold ring-2 ring-white/10">
                  A
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/90">{t('testimonialAuthor')}</p>
                  <p className="text-xs text-white/40">{t('testimonialRole')}</p>
                </div>
              </figcaption>
            </div>
          </figure>
        </div>

        {/* Bottom: Stats + flags */}
        <div className="relative z-10 space-y-5">
          <div className="grid grid-cols-3 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 backdrop-blur-sm">
                <p className="text-lg font-extrabold tracking-tight">{s.value}</p>
                <p className="text-[10px] text-white/40 mt-0.5 leading-tight">{s.label}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <TrendingUp className="h-2.5 w-2.5 text-primary" />
                  <span className="text-[9px] text-primary font-semibold">{s.trend}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Language flags */}
          <div className="flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-white/30 shrink-0" />
            <div className="flex gap-1.5 flex-wrap">
              {FLAGS.map((f) => (
                <span
                  key={f}
                  className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-sm hover:bg-white/10 transition-colors cursor-default"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* ── Form panel ──────────────────────────────────────────── */}
      <main className="relative flex flex-col min-h-screen lg:min-h-0 bg-background">
        {/* Warm ambient light */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 60% 45% at 100% 0%, oklch(0.50 0.18 255 / 0.05) 0%, transparent 65%),
              radial-gradient(ellipse 50% 40% at 0% 100%, oklch(0.72 0.17 68 / 0.04) 0%, transparent 60%)
            `,
          }}
        />

        <div className="relative z-10 flex flex-col flex-1 px-6 sm:px-10">
          {/* Top bar */}
          <div className="flex items-center justify-between py-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground/45 hover:text-primary transition-colors duration-200 group"
            >
              <div className="w-7 h-7 rounded-lg border border-border/60 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-200">
                <ArrowLeft className="h-3.5 w-3.5" />
              </div>
              <span className="hidden sm:inline">{t('backHome')}</span>
            </Link>
            <LanguageSwitcher />
          </div>

          {/* Form area */}
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="w-full max-w-[400px] auth-enter">
              {/* Mobile logo */}
              <Link href="/" className="lg:hidden flex justify-center mb-8">
                <span className="inline-flex items-center gap-2.5">
                  <span className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white text-base font-extrabold shadow-lg glow-sm-teal">
                    N
                  </span>
                  <span className="text-xl font-extrabold tracking-tight">Nativly</span>
                </span>
              </Link>

              {/* Heading */}
              <div className="mb-8">
                <h1 className="text-[1.75rem] font-extrabold tracking-tight text-foreground">{title}</h1>
                <p className="text-foreground/50 mt-1.5 text-[0.95rem]">{subtitle}</p>
              </div>

              {children}
            </div>
          </div>

          {/* Footer */}
          <div className="py-4 text-center">
            <p className="text-xs text-muted-foreground/60">
              © 2025 Nativly · All rights reserved
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
