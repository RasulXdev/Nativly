import type { Metadata } from 'next'
import { Users, Target, Heart, Globe } from 'lucide-react'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

export const metadata: Metadata = {
  title: 'Haqqımızda',
  description: 'Nativly — Azərbaycan üçün yaradılmış online dil öyrənmə platforması. Missiyamız, komandamız və dəyərlərimiz haqqında.',
}

const VALUES = [
  {
    icon: Target,
    title: 'Missiyamız',
    desc: 'Hər azərbaycanlıya native müəllimlərlə keyfiyyətli dil öyrənmə imkanı yaratmaq.',
  },
  {
    icon: Users,
    title: 'Müəllimlər',
    desc: 'Hər müəllim müsahibə, sertifikat yoxlaması və sınaq dərsindən keçir.',
  },
  {
    icon: Heart,
    title: 'Tələbələr',
    desc: 'Tələbə məmnuniyyəti hər şeydən üstündür. İlk dərsdən 30 gün geri qaytarma zəmanəti.',
  },
  {
    icon: Globe,
    title: 'Dillər',
    desc: '12+ dil, 500+ müəllim, istənilən vaxt, istənilən cihazdan.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background text-center">
        <div className="container mx-auto max-w-3xl space-y-6">
          <AnimateOnScroll>
            <h1 className="text-4xl md:text-5xl font-bold">Nativly Haqqında</h1>
            <p className="text-xl text-muted-foreground mt-4">
              Azərbaycan üçün yaradılmış, native müəllimlərlə dil öyrənmə platforması
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimateOnScroll animation="slide-left">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Necə başladı?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Nativly, 2024-cü ildə Bakıda yaradıldı. Əsas ideya sadə idi: azərbaycanlılar üçün
                  keyfiyyətli, əlçatan, rahat dil öyrənmə imkanı yaratmaq.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Biz inanırıq ki, dil öyrənmək üçün xarici ölkəyə getmək lazım deyil.
                  Düzgün müəllim, düzgün metod, düzgün platforma ilə evdən, işdən, istənilən yerdən
                  sürətlə irəliləmək mümkündür.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="slide-right">
              <div className="bg-muted/30 rounded-2xl p-8 text-center space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-primary">500+</div>
                    <div className="text-sm text-muted-foreground">Sertifikatlı müəllim</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">10K+</div>
                    <div className="text-sm text-muted-foreground">Keçirilmiş dərs</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">5K+</div>
                    <div className="text-sm text-muted-foreground">Aktiv tələbə</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">4.9★</div>
                    <div className="text-sm text-muted-foreground">Orta reytinq</div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <AnimateOnScroll className="text-center mb-12">
            <h2 className="text-3xl font-bold">Dəyərlərimiz</h2>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map((v, i) => {
              const Icon = v.icon
              return (
                <AnimateOnScroll key={v.title} delay={i * 100}>
                  <div className="bg-card rounded-xl border p-6 space-y-3 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold">{v.title}</h3>
                    <p className="text-sm text-muted-foreground">{v.desc}</p>
                  </div>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* How tutors are vetted */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center space-y-8">
          <AnimateOnScroll>
            <h2 className="text-3xl font-bold">Müəllimlər necə seçilir?</h2>
            <p className="text-muted-foreground mt-3">
              Platformamızdakı hər müəllim ciddi seçim prosesindən keçir.
            </p>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-3 gap-6 text-left">
            {[
              { step: '01', title: 'Müraciət', desc: 'CV, sertifikatlar, təcrübə məlumatları.' },
              { step: '02', title: 'Müsahibə', desc: 'Komandamızla video müsahibə.' },
              { step: '03', title: 'Sınaq Dərsi', desc: 'Real tələbə ilə sınaq dərsi qiymətləndirilir.' },
            ].map((s, i) => (
              <AnimateOnScroll key={s.step} delay={i * 100}>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-primary/20">{s.step}</div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
