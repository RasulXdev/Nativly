'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Settings, Save, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface Plan {
  id: string
  name_az: string | null
  name_en: string | null
  name_ru: string | null
  price_azn: number
  duration_minutes: number
  description_az: string | null
  description_en: string | null
  description_ru: string | null
  stripe_price_id: string | null
  is_active: boolean | null
}

export default function AdminSettingsPage() {
  const t = useTranslations('admin.settings')
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('subscription_plans').select('*').order('price_azn').then(({ data }) => {
      setPlans((data as Plan[]) ?? [])
      setLoading(false)
    })
  }, [])

  function update<K extends keyof Plan>(id: string, field: K, value: Plan[K]) {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  async function save(plan: Plan) {
    setSaving(plan.id)
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('subscription_plans') as any).update({
      name_en: plan.name_en ?? undefined,
      name_az: plan.name_az ?? undefined,
      name_ru: plan.name_ru ?? undefined,
      price_azn: plan.price_azn,
      duration_minutes: plan.duration_minutes,
      description_en: plan.description_en ?? undefined,
      description_az: plan.description_az ?? undefined,
      description_ru: plan.description_ru ?? undefined,
      stripe_price_id: plan.stripe_price_id ?? undefined,
      is_active: plan.is_active ?? true,
    }).eq('id', plan.id)
    setSaving(null)
    if (error) toast.error(error.message)
    else toast.success('Plan saved')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0">
          <Settings className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">{t('title')}</h1>
          <p className="text-xs text-muted-foreground">{t('subtitle')}</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      ) : plans.map(plan => (
        <div key={plan.id} className="rounded-2xl border border-border bg-card p-5 space-y-5">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold">{plan.name_en ?? plan.name_az ?? 'Plan'}</h2>
            <label className="ml-auto flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-muted-foreground">{t('active')}</span>
              <div
                onClick={() => update(plan.id, 'is_active', !plan.is_active)}
                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${plan.is_active ? 'gradient-bg' : 'bg-muted'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${plan.is_active ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">{t('nameEn')}</Label>
              <Input value={plan.name_en ?? ''} onChange={e => update(plan.id, 'name_en', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('nameAz')}</Label>
              <Input value={plan.name_az ?? ''} onChange={e => update(plan.id, 'name_az', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('nameRu')}</Label>
              <Input value={plan.name_ru ?? ''} onChange={e => update(plan.id, 'name_ru', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('priceAzn')}</Label>
              <Input
                type="number"
                value={plan.price_azn}
                onChange={e => update(plan.id, 'price_azn', Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('durationMinutes')}</Label>
              <Input
                type="number"
                value={plan.duration_minutes}
                onChange={e => update(plan.id, 'duration_minutes', Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('stripePriceId')}</Label>
              <Input
                value={plan.stripe_price_id ?? ''}
                onChange={e => update(plan.id, 'stripe_price_id', e.target.value)}
                placeholder="price_..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">{t('descriptionAz')}</Label>
              <Input value={plan.description_az ?? ''} onChange={e => update(plan.id, 'description_az', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('descriptionEn')}</Label>
              <Input value={plan.description_en ?? ''} onChange={e => update(plan.id, 'description_en', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('descriptionRu')}</Label>
              <Input value={plan.description_ru ?? ''} onChange={e => update(plan.id, 'description_ru', e.target.value)} />
            </div>
          </div>

          <Button
            size="sm"
            className="gradient-bg text-white gap-2"
            onClick={() => save(plan)}
            disabled={saving === plan.id}
          >
            <Save className="h-4 w-4" />
            {saving === plan.id ? t('saving') : t('save')}
          </Button>
        </div>
      ))}
    </div>
  )
}
