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
    <section className="py-24 sm:py-28 px-4 bg-background relative" id="faq">
      <div className="container mx-auto max-w-3xl">
        <AnimateOnScroll className="text-center mb-14">
          <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">FAQ</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">{t('title')}</h2>
        </AnimateOnScroll>

        <AnimateOnScroll className="space-y-2.5" animation="fade-up">
          {keys.map((key, i) => {
            const isOpen = open === key
            return (
              <div
                key={key}
                className={cn(
                  'border rounded-2xl overflow-hidden transition-all duration-300',
                  isOpen
                    ? 'border-primary/20 bg-white shadow-md shadow-primary/4'
                    : 'border-border/50 bg-card hover:border-primary/12'
                )}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                  onClick={() => setOpen(isOpen ? null : key)}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'text-[11px] font-bold w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200',
                      isOpen ? 'gradient-bg text-white' : 'bg-muted text-muted-foreground'
                    )}>
                      {i + 1}
                    </span>
                    <span className="font-semibold text-sm">{t(key)}</span>
                  </div>
                  <ChevronDown className={cn(
                    'h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300',
                    isOpen && 'rotate-180 text-primary'
                  )} />
                </button>
                <div className={cn(
                  'grid transition-all duration-300',
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                )}>
                  <div className="overflow-hidden">
                    <div className="px-5 pb-4 pl-14">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t(key.replace('q', 'a') as `a${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}`)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </AnimateOnScroll>
      </div>
    </section>
  )
}
