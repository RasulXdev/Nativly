import { useLocale } from 'next-intl'
import Link from 'next/link'
import { Star, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

const TUTORS = [
  { id: '1', name: 'Sarah Mitchell', flag: '🇬🇧', lang: 'İngilis dili', rating: 4.9, reviews: 312, lessons: 1840, price: 18, tags: ['IELTS', 'Business'], seed: 'sarah' },
  { id: '2', name: 'Mikhail Ivanov', flag: '🇷🇺', lang: 'Rus dili', rating: 4.8, reviews: 198, lessons: 920, price: 12, tags: ['Danışıq', 'Qrammatika'], seed: 'mikhail' },
  { id: '3', name: 'Elif Kaya', flag: '🇹🇷', lang: 'Türk dili', rating: 5.0, reviews: 87, lessons: 430, price: 10, tags: ['Başlanğıc', 'Danışıq'], seed: 'elif' },
  { id: '4', name: 'Hans Müller', flag: '🇩🇪', lang: 'Alman dili', rating: 4.9, reviews: 145, lessons: 780, price: 20, tags: ['TestDaF', 'İş dili'], seed: 'hans' },
  { id: '5', name: 'Marie Dubois', flag: '🇫🇷', lang: 'Fransız dili', rating: 4.7, reviews: 203, lessons: 1100, price: 16, tags: ['DELF', 'Danışıq'], seed: 'marie' },
  { id: '6', name: 'Carlos Ruiz', flag: '🇪🇸', lang: 'İspan dili', rating: 4.8, reviews: 167, lessons: 890, price: 14, tags: ['DELE', 'Danışıq'], seed: 'carlos' },
]

export default function TutorShowcase() {
  const locale = useLocale()

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <AnimateOnScroll className="text-center mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Müəllimlər</p>
          <h2 className="text-4xl font-bold mb-4">Ən yaxşı müəllimlər</h2>
          <p className="text-muted-foreground text-lg">Sertifikatlı, təcrübəli, native müəllimlər</p>
        </AnimateOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TUTORS.map((tutor, i) => (
            <AnimateOnScroll key={tutor.id} delay={i * 80} animation="fade-up">
              <div className="group bg-card border border-border rounded-2xl p-5 space-y-4 hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <Avatar className="h-14 w-14 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.seed}`} alt={tutor.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">{tutor.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-1 -right-1 text-base">{tutor.flag}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{tutor.name}</h3>
                    <p className="text-xs text-muted-foreground">{tutor.lang}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold">{tutor.rating.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({tutor.reviews})</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold text-primary">${tutor.price}</div>
                    <div className="text-xs text-muted-foreground">/saat</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {tutor.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs rounded-full bg-primary/8 text-primary border-0">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats + CTA */}
                <div className="flex items-center justify-between pt-1 border-t border-border/60">
                  <span className="text-xs text-muted-foreground">{tutor.lessons.toLocaleString()} dərs</span>
                  <Link
                    href={`/${locale}/tutors/${tutor.id}`}
                    className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-primary hover:text-primary hover:bg-primary/10 gap-1 h-7 text-xs')}
                  >
                    Profil <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll className="text-center mt-10">
          <Link href={`/${locale}/tutors`} className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'gap-2 hover:border-primary/40 hover:bg-primary/5')}>
            Bütün müəllimləri gör
            <ArrowRight className="h-4 w-4" />
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
