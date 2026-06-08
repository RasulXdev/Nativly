import type { Metadata } from 'next'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'
import FAQ from '@/components/landing/FAQ'

export const metadata: Metadata = {
  title: 'FAQ — Tez-tez verilən suallar',
  description: 'Nativly haqqında ən çox verilən suallar və cavablar. Dərs, ödəniş, müəllim, ləğvetmə siyasəti.',
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
      <section className="py-16 px-4 bg-gradient-to-b from-primary/5 to-background text-center">
        <AnimateOnScroll className="container mx-auto max-w-2xl space-y-4">
          <h1 className="text-4xl font-bold">Tez-tez verilən suallar</h1>
          <p className="text-muted-foreground text-lg">
            Sualınızı tapmırsınızsa, <a href="mailto:info@nativly.az" className="text-primary hover:underline">info@nativly.az</a> ünvanına yazın.
          </p>
        </AnimateOnScroll>
      </section>

      {/* Embedded FAQ from landing (core questions) */}
      <div className="py-4">
        <FAQ />
      </div>

      {/* Additional FAQs */}
      <section className="py-8 px-4 pb-20">
        <div className="container mx-auto max-w-3xl space-y-4">
          <AnimateOnScroll className="mb-8">
            <h2 className="text-2xl font-bold">Əlavə suallar</h2>
          </AnimateOnScroll>
          {EXTRA_FAQS.map((item, i) => (
            <AnimateOnScroll key={i} delay={i * 60}>
              <div className="bg-card border rounded-lg p-5 space-y-2 hover:shadow-sm transition-shadow">
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
