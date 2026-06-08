'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'
import { cn } from '@/lib/utils'

const keys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'] as const

export default function FAQ() {
  const t = useTranslations('landing.faq')
  const [open, setOpen] = useState<string | null>('q1')

  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-3xl">
        <AnimateOnScroll className="text-center mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-4xl font-bold">{t('title')}</h2>
        </AnimateOnScroll>

        <AnimateOnScroll className="space-y-2">
          {keys.map((key) => {
            const isOpen = open === key
            return (
              <div
                key={key}
                className={cn(
                  'border rounded-2xl overflow-hidden transition-all duration-200',
                  isOpen ? 'border-primary/30 bg-primary/3 shadow-sm' : 'border-border bg-card hover:border-primary/20'
                )}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                  onClick={() => setOpen(isOpen ? null : key)}
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-sm">{t(key)}</span>
                  <ChevronDown className={cn('h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200', isOpen && 'rotate-180 text-primary')} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(key.replace('q', 'a') as `a${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}`)}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </AnimateOnScroll>
      </div>
    </section>
  )
}
