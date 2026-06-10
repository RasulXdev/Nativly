'use client'

import { useTranslations } from 'next-intl'
import { Calendar, MessageSquare, Wallet, Play, Clock } from 'lucide-react'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

export default function DashboardPreview() {
  const t = useTranslations('landing.dashboardPreview')

  return (
    <section className="py-24 sm:py-28 px-4 section-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.395_0.195_262_/_0.15)_0%,transparent_60%)]" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <AnimateOnScroll className="text-center mb-14">
          <p className="text-sm font-semibold text-primary/80 mb-3 tracking-wide uppercase">{t('badge')}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white">{t('title')}</h2>
          <p className="text-white/50 text-lg max-w-lg mx-auto">{t('subtitle')}</p>
        </AnimateOnScroll>

        <AnimateOnScroll animation="scale-up">
          <div className="bg-white/[0.03] border border-white/8 rounded-3xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
            <div className="flex">
              <div className="hidden md:flex flex-col w-56 bg-white/[0.03] border-r border-white/8 p-4">
                <div className="flex items-center gap-2 mb-8 px-2">
                  <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-white text-[10px] font-bold">N</div>
                  <span className="text-white/90 font-bold text-sm">Nativly</span>
                </div>
                {[
                  { icon: Calendar, label: t('nav.lessons'), active: true },
                  { icon: MessageSquare, label: t('nav.messages'), active: false },
                  { icon: Wallet, label: t('nav.wallet'), active: false },
                ].map((item) => (
                  <div key={item.label} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl mb-1 text-sm ${item.active ? 'bg-primary/15 text-primary' : 'text-white/40'}`}>
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </div>
                ))}
              </div>

              <div className="flex-1 p-5 sm:p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-white/40 text-xs">{t('welcome')}</p>
                    <p className="text-white font-bold text-sm">Rasul</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-[11px] font-bold">R</div>
                  </div>
                </div>

                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">{t('upcoming')}</p>
                <div className="space-y-2.5 mb-5">
                  {[
                    { tutor: 'Sarah · IELTS Speaking', time: t('today') + ' 19:30', joinable: true },
                    { tutor: 'Hans · Business German', time: t('tomorrow') + ' 21:00', joinable: false },
                  ].map((lesson) => (
                    <div key={lesson.tutor} className="flex items-center justify-between bg-white/[0.04] border border-white/8 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">🎓</span>
                        <span className="text-sm text-white/80">{lesson.tutor}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center gap-1 text-white/40 text-xs">
                          <Clock className="h-3 w-3" />
                          {lesson.time}
                        </div>
                        {lesson.joinable ? (
                          <button className="flex items-center gap-1 bg-primary/20 text-primary text-[11px] font-semibold rounded-lg px-2.5 py-1 border border-primary/20">
                            <Play className="h-3 w-3" />
                            {t('join')}
                          </button>
                        ) : (
                          <span className="text-[11px] text-white/30 font-medium">{t('details')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { value: '12', label: t('stat.lessons') },
                    { value: '8h', label: t('stat.hours') },
                    { value: '4.9', label: t('stat.rating') },
                    { value: '$120', label: t('stat.balance') },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/[0.04] border border-white/8 rounded-xl p-3 text-center">
                      <p className="text-white font-bold text-sm">{stat.value}</p>
                      <p className="text-white/35 text-[10px] mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
