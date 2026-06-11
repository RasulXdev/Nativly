import type { Metadata } from 'next'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

export const metadata: Metadata = {
  title: 'Gizlilik Siyasəti',
  description: 'Nativly gizlilik siyasəti.',
}

const SECTIONS = [
  {
    title: '1. Toplayılan məlumatlar',
    content: `Qeydiyyat zamanı ad, soyad, email ünvanı, doğum tarixi kimi şəxsi məlumatlar toplanır. Platforma istifadəsi zamanı dərs tarixçəsi, ödəniş məlumatları (Stripe vasitəsilə şifrələnmiş) və ünsiyyət qeydləri saxlanılır. Texniki məlumatlar (IP ünvanı, brauzer növü, cihaz məlumatı) analitika məqsədilə toplanır.`,
  },
  {
    title: '2. Məlumatların istifadəsi',
    content: `Toplayılan məlumatlar xidmət göstərilməsi, tərəfdaşların uyğunlaşdırılması, ödənişlərin işlənməsi, xidmət bildirişlərinin göndərilməsi, platforma keyfiyyətinin yaxşılaşdırılması və qanuni öhdəliklərin yerinə yetirilməsi üçün istifadə olunur. Məlumatlar heç bir üçüncü şəxsə satılmır.`,
  },
  {
    title: '3. Məlumatların paylaşılması',
    content: `Məlumatlar yalnız: (a) xidmət provayderlər (Supabase, Stripe, LiveKit) ilə lazımi həddə, (b) qanuni tələb halında dövlət orqanları ilə, (c) sizin açıq razılığınızla paylaşıla bilər. Üçüncü tərəf müəllimlər yalnız öz dərslərindəki tələbə məlumatlarına çıxış əldə edir.`,
  },
  {
    title: '4. Məlumatların saxlanılması',
    content: `Şəxsi məlumatlar hesab silinənə qədər saxlanılır. Ödəniş məlumatları maliyyə qanunvericiliyinə uyğun olaraq 7 il saxlanılır. Video çəkilişlər (razılaşma olduqda) 7 gün sonra silinir.`,
  },
  {
    title: '5. Çərəzlər (Cookies)',
    content: `Platforma sessiya idarəsi, istifadəçi seçimlərinin yadda saxlanması və analitika üçün çərəzlərdən istifadə edir. Brauzer tənzimləmələrindən çərəzləri söndürə bilərsiniz, lakin bu bəzi funksiyalara təsir edə bilər.`,
  },
  {
    title: '6. Uşaqların məxfiliyi',
    content: `Platforma 13 yaşından kiçik uşaqlardan şəxsi məlumat toplamır. 13–18 yaş arası istifadəçilər valideyn icazəsi ilə qeydiyyatdan keçə bilər.`,
  },
  {
    title: '7. Hüquqlarınız',
    content: `Məlumatlarınıza dair aşağıdakı hüquqlara sahibsiniz: Məlumatlara baxmaq, düzəliş etmək, silmək tələb etmək, işlənməyə etiraz etmək, daşıma hüququ. Bu hüquqları həyata keçirmək üçün info@nativly.az ünvanına yazın.`,
  },
  {
    title: '8. Əlaqə',
    content: `Gizlilik siyasəti ilə bağlı suallarınız üçün: info@nativly.az | Nativly MMC, Bakı, Azərbaycan`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[oklch(0.13_0.04_265)]" />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 50% 50% at 50% 50%, oklch(0.25 0.12 262 / 0.3) 0%, transparent 60%)`,
          }}
        />
        <div className="relative z-10 container mx-auto max-w-2xl px-4 py-16 md:py-20 text-center space-y-3">
          <AnimateOnScroll>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Gizlilik Siyasəti</h1>
            <p className="text-white/40 mt-2">Son yenilənmə: Yanvar 2026</p>
          </AnimateOnScroll>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl space-y-8">
          <AnimateOnScroll>
            <p className="text-muted-foreground leading-relaxed">
              Bu Gizlilik Siyasəti, Nativly platformasını (nativly.az) istifadə etdikdə
              şəxsi məlumatlarınızın necə toplanıldığını, istifadə edildiyini və qorundunu izah edir.
              Platformanı istifadə etməklə bu siyasəti qəbul etdiyinizi bildirirsiniz.
            </p>
          </AnimateOnScroll>

          {SECTIONS.map((section, i) => (
            <AnimateOnScroll key={i} delay={i * 40}>
              <div className="space-y-3 p-5 rounded-xl border border-border/40 bg-card/50 hover:border-border/60 transition-colors">
                <h2 className="text-lg font-bold">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed text-sm">{section.content}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>
    </div>
  )
}
