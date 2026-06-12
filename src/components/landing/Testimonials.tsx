'use client'

import { useTranslations } from 'next-intl'
import { Star, Quote } from 'lucide-react'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

const TESTIMONIALS = [
  { id: 1, name: 'Aynur H.', rating: 5, result: 'IELTS 7.0' },
  { id: 2, name: 'Rəşad Q.', rating: 5, result: 'B2 Level' },
  { id: 3, name: 'Leyla Ə.', rating: 5, result: 'Business RU' },
  { id: 4, name: 'Tural M.', rating: 5, result: 'A1 → B1' },
  { id: 5, name: 'Nigar R.', rating: 5, result: 'DELF B1' },
  { id: 6, name: 'Kamran A.', rating: 5, result: 'IELTS 8.0' },
]

function TestimonialCard({ item }: { item: typeof TESTIMONIALS[0] }) {
  const t = useTranslations('landing.testimonials')
  const text = t(`items.${item.id - 1}.text`)
  const city = t(`items.${item.id - 1}.city`)
  return (
    <div className="w-[320px] shrink-0 bg-card border border-border/50 rounded-2xl p-5 mx-2">
      <Quote className="h-5 w-5 text-primary/15 mb-3" />
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">&ldquo;{text}&rdquo;</p>
      <div className="flex items-center justify-between pt-3 border-t border-border/40">
        <div>
          <p className="font-semibold text-sm">{item.name}</p>
          <p className="text-xs text-muted-foreground">{city}</p>
        </div>
        <div className="text-right">
          <div className="flex gap-0.5 justify-end mb-0.5">
            {Array.from({ length: item.rating }).map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-[11px] font-semibold text-primary">{item.result}</p>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const t = useTranslations('landing.testimonials')
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS]

  return (
    <section className="py-24 sm:py-28 bg-background overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4">
        <AnimateOnScroll className="text-center mb-14">
          <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">{t('title')}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">{t('title')}</h2>
          <p className="text-muted-foreground text-lg">{t('subtitle')}</p>
        </AnimateOnScroll>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex" style={{ animation: 'marquee 45s linear infinite' }}>
          {doubled.map((item, i) => (
            <TestimonialCard key={`${item.id}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
