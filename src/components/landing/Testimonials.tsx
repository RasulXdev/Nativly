'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Aynur Həsənova',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aynur',
    language: 'İngilis dili',
    rating: 5,
    text: 'Nativly ilə 3 ayda IELTS-dən 7.0 aldım! Sarah müəllimim mükəmməl idi — həm peşəkar, həm də çox mehriban. Platformanın istifadəsi isə son dərəcə asandır.',
    result: 'IELTS 7.0',
  },
  {
    id: 2,
    name: 'Rəşad Quliyev',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rashad',
    language: 'Alman dili',
    rating: 5,
    text: 'Almaniyanı seçdikdən sonra Hans müəllimlə işlədim. 6 ayda A2-dən B2-yə çatdım. İndi Münhendə universitet oxuyuram. Nativly həyatımı dəyişdi.',
    result: 'B2 səviyyəsi',
  },
  {
    id: 3,
    name: 'Leyla Əliyeva',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=leyla',
    language: 'Rus dili',
    rating: 5,
    text: 'Qonşu ölkə ilə iş görürdük, rus dili lazım idi. Mikhail müəllimlə 2 ayda danışıq səviyyəsinə çatdım. Qiymət çox əlçatandır, keyfiyyət isə əla.',
    result: 'İş üçün Rus dili',
  },
  {
    id: 4,
    name: 'Tural Məmmədov',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tural',
    language: 'İspan dili',
    rating: 5,
    text: 'Hər həftə 3 dərs alıram Carlos ilə. Elastik cədvəl sistemini çox bəyənirəm — işim olduqda asanlıqla vaxt dəyişə bilirəm. Tövsiyə edirəm!',
    result: 'A1 → B1',
  },
  {
    id: 5,
    name: 'Nigar Rəhimli',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nigar',
    language: 'Fransız dili',
    rating: 4,
    text: 'Marie ilə Fransız dili öyrənmək çox maraqlıdır. Dərs materialları hər dəfə hazır olur, heç vaxt vaxt itirmirik. Video keyfiyyəti də çox yaxşıdır.',
    result: 'DELF B1 keçdi',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < count ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
        />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const t = useTranslations('landing.testimonials')
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const next = () => setCurrent((c) => (c + 1) % TESTIMONIALS.length)

  const visible = [
    TESTIMONIALS[current],
    TESTIMONIALS[(current + 1) % TESTIMONIALS.length],
    TESTIMONIALS[(current + 2) % TESTIMONIALS.length],
  ]

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <AnimateOnScroll className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{t('title')}</h2>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </AnimateOnScroll>

        {/* Desktop: 3 visible */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {visible.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-xl border p-6 space-y-4 hover:shadow-md transition-shadow"
            >
              <Stars count={item.rating} />
              <p className="text-sm text-muted-foreground leading-relaxed">"{item.text}"</p>
              <div className="flex items-center gap-3 pt-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={item.avatar} alt={item.name} />
                  <AvatarFallback>{item.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.language} · {item.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: 1 visible */}
        <div className="md:hidden">
          <div className="bg-card rounded-xl border p-6 space-y-4">
            <Stars count={TESTIMONIALS[current].rating} />
            <p className="text-sm text-muted-foreground leading-relaxed">
              "{TESTIMONIALS[current].text}"
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={TESTIMONIALS[current].avatar} alt={TESTIMONIALS[current].name} />
                <AvatarFallback>{TESTIMONIALS[current].name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{TESTIMONIALS[current].name}</p>
                <p className="text-xs text-muted-foreground">
                  {TESTIMONIALS[current].language} · {TESTIMONIALS[current].result}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button variant="outline" size="icon" onClick={prev} aria-label="Əvvəlki">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/30'
                }`}
                aria-label={`${i + 1}-ci rəy`}
              />
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={next} aria-label="Növbəti">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
