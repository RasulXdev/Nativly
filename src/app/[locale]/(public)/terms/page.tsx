import type { Metadata } from 'next'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

export const metadata: Metadata = {
  title: 'İstifadə Şərtləri',
  description: 'Nativly platformasının istifadə şərtləri. Tələbə və müəllim öhdəlikləri, ödəniş şərtləri, ləğvetmə siyasəti.',
}

const SECTIONS = [
  {
    title: '1. Ümumi müddəalar',
    content: `Bu İstifadə Şərtləri, Nativly platforması (nativly.az) ilə istifadəçi arasındakı hüquqi münasibəti tənzimləyir. Platformanı istifadə etməklə bu şərtləri qəbul etmiş sayılırsınız. 18 yaşdan kiçiksinizsə, valideyn icazəsi tələb olunur.`,
  },
  {
    title: '2. Hesab yaradılması',
    content: `Hesab yaratmaq üçün düzgün məlumatlar vermək məcburidir. Hesab məlumatlarınızın gizliliyini qorumaq sizin məsuliyyətinizdədir. Hesabınızı üçüncü şəxsə verə bilməzsiniz. Şübhəli fəaliyyət aşkar edildikdə hesabı dondurma hüququnu saxlayırıq.`,
  },
  {
    title: '3. Dərs sifariş etmə',
    content: `Dərs sifariş etdikdə müəyəyyən məbləğ tutulur. Müəllim tərəfindən təsdiq olunduqda sifariş qüvvəyə minir. Ani rezervasiya aktiv müəllimlər üçün avtomatik təsdiq alınır.`,
  },
  {
    title: '4. Ödəniş şərtləri',
    content: `Bütün ödənişlər Stripe vasitəsilə həyata keçirilir. Qiymətlər USD-dədir. Müvafiq valyuta konvertasiya bankınız tərəfindən aparılır. Paket alındıqdan sonra ləğvetmə 30 gün ərzində mümkündür (istifadə olunmamış dərslər üçün). Ödəniş məlumatları platformamızda saxlanılmır.`,
  },
  {
    title: '5. Ləğvetmə siyasəti',
    content: `Dərsdən 24+ saat əvvəl: tam geri qaytarma. 12–24 saat: 50% geri qaytarma. 12 saatdan az: geri qaytarma yoxdur. Müəllim ləğv edərsə: tam geri qaytarma + kompensasiya. Texniki problem olduqda (platformamızdan asılı): tam geri qaytarma.`,
  },
  {
    title: '6. Müəllim öhdəlikləri',
    content: `Müəllimlər: doğru məlumat vermək, cədvəli idarə etmək, dərslərə vaxtında qoşulmaq, keyfiyyətli tədris materialı hazırlamaq öhdəliyindədirlər. Müəllim-tələbə münasibəti platforma vasitəsilə saxlanılmalıdır.`,
  },
  {
    title: '7. Tələbə öhdəlikləri',
    content: `Tələbələr: dürüst rəy vermək, müəllimlərə hörmətli davranmaq, vaxtında dərslərə qoşulmaq öhdəliyindədirlər. Hər hansı sui-istifadə aşkar edilərsə hesab bağlana bilər.`,
  },
  {
    title: '8. Məhdudiyyətlər',
    content: `Platformadan aşağıdakılar yasaqdır: qeyri-qanuni fəaliyyət, başqa istifadəçiləri aldatmaq, spam göndərmək, platformanın texniki infrastrukturuna müdaxilə etmək, müəllimlərə birbaşa ödəniş edərək platformanı bypass etmək.`,
  },
  {
    title: '9. Məsuliyyətin məhdudlaşdırılması',
    content: `Nativly, müəllim-tələbə münasibətlərindən yaranan zərərə görə məsuliyyət daşımır. Platformanın texniki nasazlıqları üçün kompensasiya dərs krediti şəklindədir. Maksimum məsuliyyət son 3 aylıq ödəniş məbləği ilə məhdudlaşır.`,
  },
  {
    title: '10. Şərtlərin dəyişdirilməsi',
    content: `Bu şərtlər dəyişdirildikdə qeydiyyatlı istifadəçilərə email bildirişi göndərilir. Yeni şərtlər 30 gün sonra qüvvəyə minir. Şərtlərlə razılaşmasanız, hesabınızı silə bilərsiniz.`,
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <section className="py-16 px-4 bg-muted/30 text-center">
        <AnimateOnScroll className="container mx-auto max-w-2xl space-y-3">
          <h1 className="text-4xl font-bold">İstifadə Şərtləri</h1>
          <p className="text-muted-foreground">Son yenilənmə: Yanvar 2026</p>
        </AnimateOnScroll>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl space-y-8">
          <AnimateOnScroll>
            <p className="text-muted-foreground leading-relaxed">
              Nativly platformasına xoş gəlmisiniz. Aşağıdakı şərtlər platformanın istifadəsini tənzimləyir.
              Xahiş edirik bu şərtləri diqqətlə oxuyun.
            </p>
          </AnimateOnScroll>

          {SECTIONS.map((section, i) => (
            <AnimateOnScroll key={i} delay={i * 40}>
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed text-sm">{section.content}</p>
              </div>
            </AnimateOnScroll>
          ))}

          <AnimateOnScroll>
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              Suallarınız üçün: <a href="mailto:legal@nativly.az" className="text-primary hover:underline">legal@nativly.az</a>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  )
}
