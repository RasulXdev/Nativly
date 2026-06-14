import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { GraduationCap, Clock, Mail, CheckCircle2, ArrowRight } from 'lucide-react'
import Logo from '@/components/shared/Logo'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('tutorOnboarding.pending')
  return { title: t('metaTitle') }
}

export default async function TutorPendingPage() {
  const t = await getTranslations('tutorOnboarding.pending')

  const steps = [
    { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', title: t('step1Title'), desc: t('step1Desc'), done: true },
    { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', title: t('step2Title'), desc: t('step2Desc'), done: false },
    { icon: Mail, color: 'text-blue-400', bg: 'bg-blue-500/10', title: t('step3Title'), desc: t('step3Desc'), done: false },
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo />
        </div>

        {/* Success illustration */}
        <div className="relative mx-auto w-28 h-28">
          <div className="absolute inset-0 rounded-full gradient-bg opacity-20 animate-pulse" />
          <div className="absolute inset-3 rounded-full gradient-bg opacity-30" />
          <div className="relative w-full h-full rounded-full gradient-bg flex items-center justify-center shadow-2xl">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-background shadow-lg">
            <CheckCircle2 className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-2xl font-extrabold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground leading-relaxed">{t('desc')}</p>
        </div>

        {/* Timeline */}
        <div className="rounded-2xl border border-border bg-card p-5 text-left space-y-4">
          {steps.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${item.done ? 'text-emerald-400' : 'text-foreground'}`}>
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl gradient-bg text-white font-semibold text-sm shadow-md btn-glow transition-all hover:opacity-90"
          >
            {t('login')}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('backHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}
