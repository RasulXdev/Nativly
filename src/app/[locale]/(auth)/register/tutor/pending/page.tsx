import type { Metadata } from 'next'
import Link from 'next/link'
import { GraduationCap, Clock, Mail, CheckCircle2, ArrowRight } from 'lucide-react'
import Logo from '@/components/shared/Logo'

export const metadata: Metadata = {
  title: 'Müraciət göndərildi — Nativly',
}

export default function TutorPendingPage() {
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
          <h1 className="text-2xl font-extrabold tracking-tight">
            Müraciətiniz qəbul edildi!
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Nativly müəllim müraciətiniz uğurla göndərildi. Komandamız
            məlumatlarınızı nəzərdən keçirib sizinlə əlaqə saxlayacaq.
          </p>
        </div>

        {/* Timeline */}
        <div className="rounded-2xl border border-border bg-card p-5 text-left space-y-4">
          {[
            {
              icon: CheckCircle2,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10',
              title: 'Müraciət göndərildi',
              desc: 'Məlumatlarınız sistemə daxil edildi',
              done: true,
            },
            {
              icon: Clock,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10',
              title: 'Nəzərdən keçirilir',
              desc: '1-3 iş günü ərzində',
              done: false,
            },
            {
              icon: Mail,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10',
              title: 'Email bildirişi',
              desc: 'Nəticə haqqında email alacaqsınız',
              done: false,
            },
          ].map((item, i) => (
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
            Hesaba daxil ol
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Ana səhifəyə qayıt
          </Link>
        </div>
      </div>
    </div>
  )
}
