import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Star, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

const MOCK_TUTORS = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    country: 'GB',
    flag: '🇬🇧',
    language: 'İngilis dili',
    rating: 4.9,
    reviews: 312,
    lessons: 1840,
    price: 18,
    specializations: ['IELTS', 'Business English'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    bio: 'CELTA sertifikatlı, 8 illik təcrübə ilə həm yeni başlayanlar, həm də IELTS hazırlıq üçün ideal.',
  },
  {
    id: '2',
    name: 'Mikhail Ivanov',
    country: 'RU',
    flag: '🇷🇺',
    language: 'Rus dili',
    rating: 4.8,
    reviews: 198,
    lessons: 920,
    price: 12,
    specializations: ['Danışıq', 'Qrammatika'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mikhail',
    bio: 'Filologiya üzrə magistr, uşaqlar və yeniyetmələr üçün ixtisaslaşmışam.',
  },
  {
    id: '3',
    name: 'Elif Kaya',
    country: 'TR',
    flag: '🇹🇷',
    language: 'Türk dili',
    rating: 5.0,
    reviews: 87,
    lessons: 430,
    price: 10,
    specializations: ['Danışıq', 'Səyahət'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elif',
    bio: 'Müasir Türk dilini öyrədin, Türkiyə mədəniyyəti ilə tanış olun.',
  },
  {
    id: '4',
    name: 'Hans Müller',
    country: 'DE',
    flag: '🇩🇪',
    language: 'Alman dili',
    rating: 4.9,
    reviews: 145,
    lessons: 780,
    price: 20,
    specializations: ['TestDaF', 'İş Almancası'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hans',
    bio: 'TestDaF, Goethe sertifikatları üçün hazırlıq. 10+ il təcrübə.',
  },
  {
    id: '5',
    name: 'Marie Dubois',
    country: 'FR',
    flag: '🇫🇷',
    language: 'Fransız dili',
    rating: 4.7,
    reviews: 203,
    lessons: 1100,
    price: 16,
    specializations: ['DELF', 'Danışıq'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marie',
    bio: 'Paris-dan native müəllim. DELF/DALF hazırlığı üçün mükəmməl.',
  },
  {
    id: '6',
    name: 'Carlos Ruiz',
    country: 'ES',
    flag: '🇪🇸',
    language: 'İspan dili',
    rating: 4.8,
    reviews: 167,
    lessons: 890,
    price: 14,
    specializations: ['DELE', 'Latin Amerika'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
    bio: 'Madrid-dən native müəllim, həm Avropa, həm Latin Amerika İspancası öyrədir.',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
    </div>
  )
}

export default function TutorShowcase() {
  const t = useTranslations('landing.tutorShowcase')
  const locale = useLocale()

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <AnimateOnScroll className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{t('title')}</h2>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </AnimateOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_TUTORS.map((tutor, i) => (
            <AnimateOnScroll key={tutor.id} delay={i * 100} animation="fade-up">
              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-14 w-14 shrink-0">
                      <AvatarImage src={tutor.avatar} alt={tutor.name} />
                      <AvatarFallback>{tutor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{tutor.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>{tutor.flag}</span>
                        <span>{tutor.language}</span>
                      </div>
                      <StarRating rating={tutor.rating} />
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-primary">${tutor.price}</div>
                      <div className="text-xs text-muted-foreground">/ saat</div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{tutor.bio}</p>

                  <div className="flex flex-wrap gap-1">
                    {tutor.specializations.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <span>{tutor.lessons} dərs</span>
                    <span>{tutor.reviews} rəy</span>
                  </div>

                  <Link
                    href={`/${locale}/tutors/${tutor.id}`}
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full')}
                  >
                    Profili gör
                  </Link>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll className="text-center mt-10">
          <Link href={`/${locale}/tutors`} className={cn(buttonVariants({ size: 'lg' }))}>
            Bütün müəllimləri gör →
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
