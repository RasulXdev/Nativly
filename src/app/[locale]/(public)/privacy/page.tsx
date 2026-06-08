import type { Metadata } from 'next'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

export const metadata: Metadata = {
  title: 'Gizlilik Siyasəti',
  description: 'Nativly gizlilik siyasəti. Şəxsi məlumatlarınızın toplanması, istifadəsi və qorunması haqqında.',
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
      <section className="py-16 px-4 bg-muted/30 text-center">
        <AnimateOnScroll className="container mx-auto max-w-2xl space-y-3">
          <h1 className="text-4xl font-bold">Gizlilik Siyasəti</h1>
          <p className="text-muted-foreground">Son yenilənmə: Yanvar 2026</p>
        </AnimateOnScroll>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl space-y-8">
          <AnimateOnScroll>
            <p className="text-muted-foreground leading-relaxed">
              Bu Gizlilik Siyasəti, Nativly platformasını (nativly.az) istifadə etdikdə
              şəxsi məlumatlarınızın necə toplanıldığını, istifadə edildiyini və qorundunu izah edir.
              Platformanı istifadə etməklə bu siyasəti qəbul etdiyinizi bildirirsiniz.
            </p>
          </AnimateOnScroll>

          {SECTIONS.map((section, i) => (
            <AnimateOnScroll key={i} delay={i * 50}>
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed text-sm">{section.content}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>
    </div>
  )
}
