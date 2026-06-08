import { useTranslations } from 'next-intl'
import { Video, Clock, Award, DollarSign, BarChart, BookOpen } from 'lucide-react'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

const icons = [Video, Clock, Award, DollarSign, BarChart, BookOpen]
const keys = ['video', 'schedule', 'certified', 'price', 'levels', 'materials'] as const
const gradients = [
  'from-blue-500/10 to-cyan-500/10',
  'from-violet-500/10 to-purple-500/10',
  'from-amber-500/10 to-orange-500/10',
  'from-green-500/10 to-emerald-500/10',
  'from-rose-500/10 to-pink-500/10',
  'from-primary/10 to-teal-500/10',
]
const iconColors = [
  'text-blue-600', 'text-violet-600', 'text-amber-600',
  'text-green-600', 'text-rose-600', 'text-primary',
]

export default function Features() {
  const t = useTranslations('landing.features')

  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <AnimateOnScroll className="text-center mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Üstünlüklər</p>
          <h2 className="text-4xl font-bold mb-4">{t('title')}</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t('subtitle')}</p>
        </AnimateOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {keys.map((key, i) => {
            const Icon = icons[i]
            return (
              <AnimateOnScroll key={key} delay={i * 80} animation="fade-up">
                <div className="group relative bg-card border border-border rounded-2xl p-6 space-y-4 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradients[i]} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${iconColors[i]}`} />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-base">{t(`${key}.title`)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`${key}.desc`)}</p>
                  </div>
                  {/* Hover accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </AnimateOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}
