'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Mail, MessageSquare, Clock, Send, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

export default function ContactPage() {
  const t = useTranslations('public.contact')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const contactInfo = [
    { icon: Mail, title: t('emailLabel'), value: 'info@nativly.az', desc: t('emailDesc'), accent: 'bg-blue-500/10 text-blue-600' },
    { icon: MessageSquare, title: 'Telegram', value: '@nativly', desc: t('telegramDesc'), accent: 'bg-violet-500/10 text-violet-600' },
    { icon: Clock, title: t('hoursLabel'), value: '09:00 – 21:00', desc: t('hoursDesc'), accent: 'bg-amber-500/10 text-amber-600' },
  ]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSent(true)
    toast.success(t('sent'))
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[oklch(0.13_0.04_265)]" />
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse 50% 50% at 50% 50%, oklch(0.28 0.16 262 / 0.35) 0%, transparent 60%)` }}
        />
        <div className="relative z-10 container mx-auto max-w-2xl px-4 py-16 md:py-24 text-center space-y-4">
          <AnimateOnScroll>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{t('title')}</h1>
            <p className="text-white/50 text-lg mt-3">{t('subtitle')}</p>
          </AnimateOnScroll>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10">
            {/* Contact info */}
            <AnimateOnScroll animation="slide-left" className="space-y-5">
              <h2 className="text-2xl font-extrabold tracking-tight">{t('infoTitle')}</h2>
              <div className="space-y-3">
                {contactInfo.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="flex items-start gap-4 p-5 rounded-xl border border-border/60 bg-card hover:border-primary/20 transition-colors">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.accent}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{item.title}</p>
                        <p className="text-primary text-sm font-medium">{item.value}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </AnimateOnScroll>

            {/* Contact form */}
            <AnimateOnScroll animation="slide-right">
              <div className="rounded-2xl border border-border/60 bg-card p-6 md:p-8">
                <h2 className="text-xl font-bold mb-6">{t('send')}</h2>

                {sent ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className="font-bold text-lg">{t('sent')}</h3>
                    <p className="text-sm text-muted-foreground">{t('emailDesc')}</p>
                    <Button variant="outline" onClick={() => setSent(false)} className="mt-2 rounded-xl">
                      {t('sendAgain')}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name">{t('name')} *</Label>
                        <Input id="name" placeholder={t('name')} required className="rounded-xl h-11" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email">{t('email')} *</Label>
                        <Input id="email" type="email" placeholder="email@mail.com" required className="rounded-xl h-11" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="subject">{t('subject')} *</Label>
                      <Input id="subject" placeholder={t('subject')} required className="rounded-xl h-11" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="message">{t('message')} *</Label>
                      <Textarea id="message" placeholder={t('message')} rows={5} required className="rounded-xl resize-none" />
                    </div>
                    <Button type="submit" className="w-full gradient-bg border-0 rounded-xl h-11 font-semibold" disabled={loading}>
                      {loading ? `${t('send')}...` : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          {t('send')}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>
    </div>
  )
}
