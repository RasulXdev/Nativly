import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { ArrowRight, Star, BookOpen, Users, Zap } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function Hero() {
  const locale = useLocale()

  return (
    <section className="relative overflow-hidden hero-gradient min-h-[92vh] flex items-center">
      {/* Decorative orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-6xl px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Copy */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium">
              <Zap className="h-3.5 w-3.5 fill-current" />
              Azərbaycanda #1 dil öyrənmə platforması
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.08]">
                <span className="text-foreground">Native müəllimlə</span>
                <br />
                <span className="gradient-text">sürətlə dil öyrən</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Sertifikatlı native müəllimlər, elastik cədvəl, 1-on-1 video dərslər.
                İstənilən vaxt, istənilən yerdən.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/${locale}/register`}
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'text-base px-7 gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-200'
                )}
              >
                Pulsuz başla
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/${locale}/tutors`}
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'text-base px-7 hover:bg-primary/5 hover:border-primary/40 transition-all duration-200'
                )}
              >
                Müəllimləri gör
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-2">
                  {['🇬🇧', '🇷🇺', '🇩🇪'].map((flag, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs shadow-sm">
                      {flag}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">500+ müəllim</span>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-sm text-muted-foreground ml-1">4.9 reytinq</span>
              </div>
              <Badge variant="secondary" className="text-xs font-medium bg-amber-50 text-amber-700 border-amber-200">
                Sınaq dərsi $5
              </Badge>
            </div>
          </div>

          {/* Right: UI mockup card */}
          <div className="relative hidden lg:block">
            <div className="glass rounded-3xl p-6 shadow-2xl shadow-primary/10 float">
              <div className="bg-gradient-to-br from-primary/8 to-primary/12 rounded-2xl p-5 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-lg">🇬🇧</div>
                    <div>
                      <p className="font-semibold text-sm">Sarah Mitchell</p>
                      <p className="text-xs text-muted-foreground">İngilis · IELTS Expert · ⭐ 4.9</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-green-700 font-medium">Canlı</span>
                  </div>
                </div>
                <div className="bg-white/60 rounded-xl h-28 flex items-center justify-center">
                  <div className="text-center space-y-1.5">
                    <div className="w-10 h-10 rounded-full bg-primary/15 mx-auto flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">IELTS Speaking Practice</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: '10K+', label: 'Dərs' },
                  { value: '500+', label: 'Müəllim' },
                  { value: '4.9★', label: 'Reytinq' },
                ].map((s) => (
                  <div key={s.label} className="bg-background/70 rounded-xl p-3 text-center">
                    <p className="font-bold text-sm text-primary">{s.value}</p>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating chips */}
            <div className="absolute -top-5 -right-5 glass rounded-2xl px-3 py-2 shadow-lg border border-border/60">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <div>
                  <p className="text-xs font-semibold">IELTS 7.0 aldım!</p>
                  <p className="text-[10px] text-muted-foreground">3 ayda — Aynur</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 glass rounded-2xl px-3 py-2 shadow-lg border border-border/60">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚀</span>
                <div>
                  <p className="text-xs font-semibold">Sınaq dərsi</p>
                  <p className="text-[10px] text-primary font-bold">cəmi $5-dan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Language flags strip */}
        <div className="mt-16 pt-8 border-t border-border/40">
          <p className="text-center text-xs text-muted-foreground mb-4 uppercase tracking-widest">12 dil mövcuddur</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              ['🇬🇧', 'İngilis'], ['🇷🇺', 'Rus'], ['🇩🇪', 'Alman'],
              ['🇫🇷', 'Fransız'], ['🇹🇷', 'Türk'], ['🇪🇸', 'İspan'],
              ['🇮🇹', 'İtalyan'], ['🇨🇳', 'Çin'], ['🇯🇵', 'Yapon'],
            ].map(([flag, name]) => (
              <div key={name} className="flex items-center gap-1.5 bg-white/70 border border-border/60 rounded-full px-3 py-1.5 text-sm hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 cursor-default shadow-sm">
                <span>{flag}</span>
                <span className="text-foreground/70 font-medium text-xs">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
