'use client'

import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'
import { cn } from '@/lib/utils'

const TESTIMONIALS = [
  { id: 1, name: 'Aynur Həsənova', seed: 'aynur', lang: 'İngilis', rating: 5, result: 'IELTS 7.0', text: 'Nativly ilə 3 ayda IELTS 7.0 aldım. Sarah müəllimim mükəmməl idi — peşəkar, mehriban, hər dərsi çox faydalı keçdi.' },
  { id: 2, name: 'Rəşad Quliyev', seed: 'rashad', lang: 'Alman', rating: 5, result: 'B2 — Almaniya', text: 'Hans ilə 6 ayda A2-dən B2-yə çatdım. İndi Münhendə oxuyuram. Nativly həyatımı dəyişdi, yüz faiz tövsiyə edirəm.' },
  { id: 3, name: 'Leyla Əliyeva', seed: 'leyla', lang: 'Rus', rating: 5, result: 'İş üçün Rus dili', text: 'Biznes görüşlər üçün rus dili lazım idi. Mikhail ilə 2 ayda danışıq səviyyəsinə çatdım. Çox sərfəli qiymət, əla keyfiyyət.' },
  { id: 4, name: 'Tural Məmmədov', seed: 'tural', lang: 'İspan', rating: 5, result: 'A1 → B1', text: 'Carlos ilə həftədə 3 dərs alıram. Elastik cədvəl sistemi möhtəşəmdir — işim olduqda asanlıqla dəyişirəm. Çox razıyam!' },
  { id: 5, name: 'Nigar Rəhimli', seed: 'nigar', lang: 'Fransız', rating: 5, result: 'DELF B1', text: 'Marie ilə Fransız öyrənmək zövqlüdür. Hər dərs materialları hazır gəlir. DELF imtahanını keçdim, çox şadam!' },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const prev = () => setCurrent(c => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const next = () => setCurrent(c => (c + 1) % TESTIMONIALS.length)

  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <AnimateOnScroll className="text-center mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Tələbə rəyləri</p>
          <h2 className="text-4xl font-bold mb-4">Tələbələrimiz nə deyir?</h2>
          <p className="text-muted-foreground text-lg">Minlərlə tələbə artıq hədəf dilinə çatıb</p>
        </AnimateOnScroll>

        {/* Desktop: 3 cards */}
        <div className="hidden md:grid grid-cols-3 gap-5">
          {[0, 1, 2].map((offset) => {
            const item = TESTIMONIALS[(current + offset) % TESTIMONIALS.length]
            const isCenter = offset === 1
            return (
              <div key={item.id} className={cn(
                'relative bg-card border rounded-2xl p-6 space-y-4 transition-all duration-300',
                isCenter
                  ? 'border-primary/30 shadow-lg shadow-primary/8 scale-[1.02]'
                  : 'border-border opacity-80 hover:opacity-100'
              )}>
                <Quote className="h-8 w-8 text-primary/20" />
                <div className="flex gap-0.5">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{item.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-border/60">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.seed}`} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{item.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-primary font-medium">{item.result}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile: 1 card */}
        <div className="md:hidden">
          <div className="bg-card border border-primary/20 rounded-2xl p-6 space-y-4 shadow-md">
            <Quote className="h-8 w-8 text-primary/20" />
            <div className="flex gap-0.5">
              {Array.from({ length: TESTIMONIALS[current].rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">"{TESTIMONIALS[current].text}"</p>
            <div className="flex items-center gap-3 pt-2 border-t border-border/60">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${TESTIMONIALS[current].seed}`} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{TESTIMONIALS[current].name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{TESTIMONIALS[current].name}</p>
                <p className="text-xs text-primary font-medium">{TESTIMONIALS[current].result}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button variant="outline" size="icon" onClick={prev} className="rounded-full hover:border-primary/40 hover:text-primary">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={cn('rounded-full transition-all duration-300', i === current ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60')}
              />
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={next} className="rounded-full hover:border-primary/40 hover:text-primary">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
