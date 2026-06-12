'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Star, ArrowLeft, Quote, BookOpen, Sparkles } from 'lucide-react'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher'
import { TEACHING_LANGUAGES } from '@/lib/constants/teaching'

const FLAGS = TEACHING_LANGUAGES.map((l) => l.flag)

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
    <div className="min-h-screen w-full lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* ─── Brand panel ─────────────────────────────────────────── */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 xl:p-16 text-white">
        {/* layered background */}
        <div className="absolute inset-0 bg-[oklch(0.13_0.04_265)]" />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 20% 20%, oklch(0.30 0.18 262 / 0.5) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 80% 75%, oklch(0.35 0.14 280 / 0.35) 0%, transparent 55%),
              radial-gradient(ellipse 40% 40% at 55% 45%, oklch(0.60 0.15 70 / 0.08) 0%, transparent 50%)
            `,
          }}
        />
        {/* animated noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
        {/* geometric accent lines */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.04]">
          <div className="absolute top-20 right-10 w-80 h-px bg-gradient-to-l from-white to-transparent" />
          <div className="absolute top-32 right-16 w-60 h-px bg-gradient-to-l from-white to-transparent" />
          <div className="absolute top-44 right-6 w-72 h-px bg-gradient-to-l from-white to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-[0.04]">
          <div className="absolute bottom-32 left-10 w-64 h-px bg-gradient-to-r from-white to-transparent" />
          <div className="absolute bottom-44 left-16 w-48 h-px bg-gradient-to-r from-white to-transparent" />
        </div>

        {/* top: logo + badge */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20 flex items-center justify-center text-base font-extrabold transition-all group-hover:scale-105 group-hover:bg-white/15">
              N
            </div>
            <span className="text-xl font-extrabold tracking-tight">Nativly</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-white/40 bg-white/[0.05] rounded-full px-3 py-1.5 ring-1 ring-white/[0.08]">
            <BookOpen className="h-3 w-3" />
            <span>{FLAGS.length}+ dil</span>
          </div>
        </div>

        {/* middle: headline + testimonial */}
        <div className="relative z-10 max-w-md space-y-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-300/80 bg-amber-400/10 rounded-full px-3 py-1 ring-1 ring-amber-400/15">
              <Sparkles className="h-3 w-3" />
              Native müəllimlərlə öyrən
            </div>
            <h2 className="text-4xl xl:text-[2.75rem] font-extrabold leading-[1.08] tracking-tight">
              {t('brandTagline')}
            </h2>
            <p className="text-[0.95rem] text-white/55 leading-relaxed max-w-sm">{t('brandSubtext')}</p>
          </div>

          <figure className="relative rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] p-6">
            <Quote className="absolute -top-3 left-6 h-6 w-6 text-white/20 fill-white/5 rotate-180" />
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <blockquote className="text-[0.9rem] leading-relaxed text-white/80 font-medium">
              &ldquo;{t('testimonialQuote')}&rdquo;
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/80 to-violet-500/60 flex items-center justify-center text-xs font-bold ring-2 ring-white/10">
                A
              </div>
              <div>
                <p className="text-sm font-semibold text-white/90">{t('testimonialAuthor')}</p>
                <p className="text-xs text-white/40">{t('testimonialRole')}</p>
              </div>
            </figcaption>
          </figure>
        </div>

        {/* bottom: stats + flags */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-8">
            {[
              { v: '5,000+', l: t('statStudents') },
              { v: '500+', l: t('statTutors') },
              { v: '4.9', l: t('statRating') },
            ].map((s, i) => (
              <div key={s.l} className="flex items-center gap-8">
                {i > 0 && <span className="h-8 w-px bg-white/10" />}
                <div>
                  <p className="text-xl font-extrabold tracking-tight">{s.v}</p>
                  <p className="text-[0.7rem] text-white/40 mt-0.5 uppercase tracking-wider">{s.l}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-1.5">
            {FLAGS.map((f) => (
              <span
                key={f}
                className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-sm"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </aside>

      {/* ─── Form panel ──────────────────────────────────────────── */}
      <main className="relative flex flex-col min-h-screen lg:min-h-0 bg-background">
        {/* subtle warm ambient on form side */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: `
              radial-gradient(ellipse 50% 40% at 80% 10%, oklch(0.395 0.195 262 / 0.06) 0%, transparent 60%),
              radial-gradient(ellipse 40% 50% at 20% 90%, oklch(0.74 0.16 70 / 0.04) 0%, transparent 60%)
            `,
          }}
        />

        <div className="relative z-10 flex flex-col flex-1 px-6 sm:px-10">
          {/* top bar */}
          <div className="flex items-center justify-between py-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/50 hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('backHome')}
            </Link>
            <LanguageSwitcher />
          </div>

          {/* form */}
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="w-full max-w-[400px] auth-enter">
              {/* mobile logo */}
              <Link href="/" className="lg:hidden flex justify-center mb-8">
                <span className="inline-flex items-center gap-2.5">
                  <span className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white text-base font-extrabold shadow-lg shadow-primary/25">
                    N
                  </span>
                  <span className="text-xl font-extrabold tracking-tight">Nativly</span>
                </span>
              </Link>

              <div className="mb-8">
                <h1 className="text-[1.75rem] font-extrabold tracking-tight text-foreground">{title}</h1>
                <p className="text-foreground/50 mt-1.5 text-[0.95rem]">{subtitle}</p>
              </div>

              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
