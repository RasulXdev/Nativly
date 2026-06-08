import { useTranslations } from 'next-intl'

const steps = ['step1', 'step2', 'step3', 'step4'] as const

export default function HowItWorks() {
  const t = useTranslations('landing.howItWorks')

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{t('title')}</h2>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step} className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                {i + 1}
              </div>
              <h3 className="font-semibold">{t(`${step}.title`)}</h3>
              <p className="text-sm text-muted-foreground">{t(`${step}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
