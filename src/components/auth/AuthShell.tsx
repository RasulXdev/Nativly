'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Star, ArrowLeft, Quote } from 'lucide-react'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher'

const FLAGS = ['🇬🇧', '🇷🇺', '🇩🇪', '🇫🇷', '🇹🇷', '🇪🇸', '🇮🇹', '🇨🇳', '🇯🇵']

/**
 * Split-screen auth shell: an immersive dark brand panel (left, lg+) beside the
 * form panel (right). Shared by login / register / forgot-password.
 */
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
    <div className="min-h-screen w-full lg:grid lg:grid-cols-[1.05fr_1fr] bg-background">
      {/* ─── Brand panel ─────────────────────────────────────────── */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 xl:p-16 text-white">
        {/* base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(155deg, oklch(0.19 0.05 264) 0%, oklch(0.16 0.05 268) 45%, oklch(0.13 0.04 272) 100%)',
          }}
        />
        {/* aurora orbs */}
        <div className="absolute -top-20 -left-16 w-[460px] h-[460px] rounded-full bg-primary/30 blur-[120px] hero-orb-1" />
        <div className="absolute bottom-[-10%] right-[-8%] w-[420px] h-[420px] rounded-full bg-violet-500/20 blur-[130px] hero-orb-2" />
        <div className="absolute top-[38%] left-[30%] w-[280px] h-[280px] rounded-full bg-amber-400/12 blur-[110px] hero-orb-3" />
        {/* dot texture */}
        <div className="absolute inset-0 dot-pattern opacity-[0.4] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

        {/* top: logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/25 flex items-center justify-center text-base font-extrabold transition-transform group-hover:scale-105">
              N
            </div>
            <span className="text-xl font-extrabold tracking-tight">Nativly</span>
          </Link>
        </div>

        {/* middle: headline + testimonial */}
        <div className="relative z-10 max-w-md space-y-10">
          <div className="space-y-5">
            <h2 className="text-4xl xl:text-[2.75rem] font-extrabold leading-[1.1] tracking-tight">
              {t('brandTagline')}
            </h2>
            <p className="text-base text-white/65 leading-relaxed">{t('brandSubtext')}</p>
          </div>

          <figure className="relative rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 p-6 shadow-2xl">
            <Quote className="absolute -top-3 left-6 h-7 w-7 text-primary fill-primary/20 rotate-180" />
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <blockquote className="text-[0.95rem] leading-relaxed text-white/90 font-medium">
              “{t('testimonialQuote')}”
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-sm font-bold ring-2 ring-white/15">
                A
              </div>
              <div>
                <p className="text-sm font-bold">{t('testimonialAuthor')}</p>
                <p className="text-xs text-white/55">{t('testimonialRole')}</p>
              </div>
            </figcaption>
          </figure>
        </div>

        {/* bottom: stats + flag marquee */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-8">
            {[
              { v: '5,000+', l: t('statStudents') },
              { v: '500+', l: t('statTutors') },
              { v: '4.9', l: t('statRating') },
            ].map((s, i) => (
              <div key={s.l} className="flex items-center gap-8">
                {i > 0 && <span className="h-9 w-px bg-white/15" />}
                <div>
                  <p className="text-2xl font-extrabold tracking-tight">{s.v}</p>
                  <p className="text-xs text-white/50 mt-0.5">{s.l}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 opacity-80">
            {FLAGS.map((f) => (
              <span
                key={f}
                className="w-9 h-9 rounded-xl bg-white/[0.07] border border-white/10 flex items-center justify-center text-base"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </aside>

      {/* ─── Form panel ──────────────────────────────────────────── */}
      <main className="relative flex flex-col min-h-screen lg:min-h-0 px-6 sm:px-10">
        {/* subtle mesh on mobile/light side */}
        <div className="absolute inset-0 hero-mesh opacity-60 lg:opacity-0 pointer-events-none" />

        {/* top bar */}
        <div className="relative z-10 flex items-center justify-between py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backHome')}
          </Link>
          <LanguageSwitcher />
        </div>

        {/* form */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-[400px] auth-enter">
            {/* mobile logo */}
            <Link href="/" className="lg:hidden flex justify-center mb-8">
              <span className="inline-flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white text-base font-extrabold shadow-md shadow-primary/20">
                  N
                </span>
                <span className="text-xl font-extrabold tracking-tight">Nativly</span>
              </span>
            </Link>

            <div className="mb-8">
              <h1 className="text-[1.75rem] font-extrabold tracking-tight text-foreground">{title}</h1>
              <p className="text-foreground/55 mt-1.5 text-[0.95rem]">{subtitle}</p>
            </div>

            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
