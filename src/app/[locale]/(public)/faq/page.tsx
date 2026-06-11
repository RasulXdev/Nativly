import type { Metadata } from 'next'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'
import FAQ from '@/components/landing/FAQ'

export const metadata: Metadata = {
  title: 'FAQ — Tez-tez verilən suallar',
  description: 'Nativly haqqında ən çox verilən suallar və cavablar.',
}

const EXTRA_FAQS = [
  {
    q: 'Dərs zamanı texniki problem yaranarsa nə olur?',
    a: 'Texniki problem yaranarsa dərsi yenidən cədvəlləşdiririk. Müəllimin problemi olarsa tam geri ödəyirik.',
  },
  {
    q: 'Fərqli müəllimlərlə sınaq dərsi keçirə bilərəmmi?',
    a: 'Bəli, istənilən müəllimlə sınaq dərsi keçirə bilərsiniz. Hər sınaq $5-dır.',
  },
  {
    q: 'Dərsin tarixi dəyişdirilə bilərmi?',
    a: '24 saat əvvəl dərsi pulsuz yenidən planlaşdıra bilərsiniz. Daha az vaxt qalırsa cancellation policy tətbiq olunur.',
  },
  {
    q: 'Uşaqlar üçün dərslər varmı?',
    a: 'Bəli, uşaqlarla (6+ yaş) işləmək üçün ixtisaslaşmış müəllimlər var. Filtrə "Uşaqlar" seçin.',
  },
  {
    q: 'Qrup dərsləri varmı?',
    a: 'Hazırda yalnız 1-on-1 dərslər keçiririk. Qrup dərsləri yaxın gələcəkdə planlaşdırılır.',
  },
  {
    q: 'Dərs yazılır?',
    a: 'Hər iki tərəfin razılığı olduqda dərs yazıla bilər. Yazılmış dərslər 7 gün saxlanılır.',
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[oklch(0.13_0.04_265)]" />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 50% 50% at 50% 50%, oklch(0.28 0.16 262 / 0.35) 0%, transparent 60%)`,
          }}
        />
        <div className="relative z-10 container mx-auto max-w-2xl px-4 py-16 md:py-24 text-center space-y-4">
          <AnimateOnScroll>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Tez-tez verilən suallar</h1>
            <p className="text-white/50 text-lg mt-3">
              Sualınızı tapmırsınızsa,{' '}
              <a href="mailto:info@nativly.az" className="text-primary hover:underline">info@nativly.az</a>{' '}
              ünvanına yazın.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* FAQ from landing */}
      <div className="py-4">
        <FAQ />
      </div>

      {/* Extra FAQs */}
      <section className="py-8 px-4 pb-20">
        <div className="container mx-auto max-w-3xl space-y-4">
          <AnimateOnScroll className="mb-8">
            <h2 className="text-2xl font-extrabold tracking-tight">Əlavə suallar</h2>
          </AnimateOnScroll>
          {EXTRA_FAQS.map((item, i) => (
            <AnimateOnScroll key={i} delay={i * 60}>
              <div className="rounded-xl border border-border/60 bg-card p-5 space-y-2 hover:border-primary/20 transition-colors">
                <h3 className="font-semibold">{item.q}</h3>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>
    </div>
  )
}
