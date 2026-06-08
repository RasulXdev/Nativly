'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const questions = Array.from({ length: 10 }, (_, i) => `q${i + 1}`) as `q${number}`[]

export default function FAQ() {
  const t = useTranslations('landing.faq')
  const [open, setOpen] = useState<string | null>(null)

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">{t('title')}</h2>
        </div>
        <div className="space-y-2">
          {questions.map((q) => {
            const aKey = `a${q.slice(1)}` as `a${number}`
            const isOpen = open === q
            return (
              <div key={q} className="border rounded-lg overflow-hidden bg-background">
                <button
                  className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-muted/50 transition-colors"
                  onClick={() => setOpen(isOpen ? null : q)}
                >
                  {t(q)}
                  <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground">
                    {t(aKey)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
