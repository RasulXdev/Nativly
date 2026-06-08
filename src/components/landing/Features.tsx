import { useTranslations } from 'next-intl'
import { Video, Clock, Award, DollarSign, BarChart, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const icons = [Video, Clock, Award, DollarSign, BarChart, BookOpen]
const keys = ['video', 'schedule', 'certified', 'price', 'levels', 'materials'] as const

export default function Features() {
  const t = useTranslations('landing.features')

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{t('title')}</h2>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {keys.map((key, i) => {
            const Icon = icons[i]
            return (
              <Card key={key} className="border-0 shadow-sm">
                <CardContent className="pt-6 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{t(`${key}.title`)}</h3>
                  <p className="text-sm text-muted-foreground">{t(`${key}.desc`)}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
