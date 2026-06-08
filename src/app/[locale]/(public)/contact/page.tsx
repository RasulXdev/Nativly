'use client'

import { useState } from 'react'
import { Mail, MessageSquare, Clock, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

const CONTACT_INFO = [
  {
    icon: Mail,
    title: 'E-poçt',
    value: 'info@nativly.az',
    desc: '24–48 saat ərzində cavab veririk',
  },
  {
    icon: MessageSquare,
    title: 'Telegram',
    value: '@nativly',
    desc: 'Sürətli dəstək üçün',
  },
  {
    icon: Clock,
    title: 'İş saatları',
    value: '09:00 – 21:00',
    desc: 'Bazar ertəsi – Şənbə',
  },
]

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSent(true)
    toast.success('Mesajınız göndərildi! Tezliklə cavab verəcəyik.')
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-b from-primary/5 to-background text-center">
        <AnimateOnScroll className="container mx-auto max-w-2xl space-y-4">
          <h1 className="text-4xl font-bold">Bizimlə əlaqə</h1>
          <p className="text-muted-foreground text-lg">
            Sualınız, təklifiniz və ya şikayətiniz varsa — yazın, tez cavab veririk.
          </p>
        </AnimateOnScroll>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <AnimateOnScroll animation="slide-left" className="space-y-6">
              <h2 className="text-2xl font-bold">Bizimlə əlaqə</h2>
              <div className="space-y-4">
                {CONTACT_INFO.map((item) => {
                  const Icon = item.icon
                  return (
                    <Card key={item.title} className="hover:shadow-sm transition-shadow">
                      <CardContent className="pt-5 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-primary">{item.value}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </AnimateOnScroll>

            {/* Contact form */}
            <AnimateOnScroll animation="slide-right">
              <div className="bg-card border rounded-2xl p-6 space-y-6">
                <h2 className="text-xl font-semibold">Mesaj göndər</h2>

                {sent ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="text-5xl">✅</div>
                    <h3 className="font-semibold text-lg">Mesajınız göndərildi!</h3>
                    <p className="text-sm text-muted-foreground">24–48 saat ərzində cavab verəcəyik.</p>
                    <Button variant="outline" onClick={() => setSent(false)} className="mt-4">
                      Yenidən göndər
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Ad Soyad *</Label>
                        <Input id="name" placeholder="Adınız" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-poçt *</Label>
                        <Input id="email" type="email" placeholder="email@mail.com" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Mövzu *</Label>
                      <Input id="subject" placeholder="Nə barədə yazmaq istəyirsiniz?" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Mesaj *</Label>
                      <Textarea
                        id="message"
                        placeholder="Mesajınızı buraya yazın..."
                        rows={5}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        'Göndərilir...'
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Göndər
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
