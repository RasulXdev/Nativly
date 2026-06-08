import { useTranslations } from 'next-intl'
import { UserPlus, Search, CalendarCheck, Video } from 'lucide-react'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

const icons = [UserPlus, Search, CalendarCheck, Video]
const stepKeys = ['step1', 'step2', 'step3', 'step4'] as const

export default function HowItWorks() {
  const t = useTranslations('landing.howItWorks')

  return (
    <section className="py-24 px-4 bg-muted/40">
      <div className="container mx-auto max-w-5xl">
        <AnimateOnScroll className="text-center mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Proses</p>
          <h2 className="text-4xl font-bold mb-4">{t('title')}</h2>
          <p className="text-muted-foreground text-lg">{t('subtitle')}</p>
        </AnimateOnScroll>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stepKeys.map((key, i) => {
              const Icon = icons[i]
              return (
                <AnimateOnScroll key={key} delay={i * 120} animation="fade-up">
                  <div className="relative text-center space-y-4 group">
                    {/* Step number + Icon */}
                    <div className="relative mx-auto w-20 h-20">
                      <div className="w-20 h-20 rounded-2xl bg-card border-2 border-border group-hover:border-primary/40 shadow-sm group-hover:shadow-md transition-all duration-300 flex items-center justify-center mx-auto">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md">
                        {i + 1}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-semibold">{t(`${key}.title`)}</h3>
                      <p className="text-sm text-muted-foreground">{t(`${key}.desc`)}</p>
                    </div>
                  </div>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>

        {/* Bottom highlight */}
        <AnimateOnScroll className="mt-14 mx-auto max-w-md">
          <div className="glass border border-primary/20 rounded-2xl p-5 text-center space-y-2 shadow-sm">
            <p className="font-semibold text-sm">💡 Orta nəticə</p>
            <p className="text-sm text-muted-foreground">
              Tələbələrimizin <strong className="text-foreground">85%</strong>-i ilk 3 ayda hədəf səviyyəsinə çatır
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
