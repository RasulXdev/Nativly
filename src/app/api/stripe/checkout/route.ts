import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_placeholder', { apiVersion: '2026-05-27.dahlia' })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { planId } = await request.json()
    if (!planId) return NextResponse.json({ error: 'planId required' }, { status: 400 })

    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .eq('is_active', true)
      .single()

    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', user.id)
      .single()

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const stripe = getStripe()

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: profile?.email ?? user.email,
      line_items: plan.stripe_price_id
        ? [{ price: plan.stripe_price_id, quantity: 1 }]
        : [{
            price_data: {
              currency: 'azn',
              product_data: {
                name: plan.name_en,
                description: `${plan.lessons_per_month} lessons/month`,
              },
              unit_amount: Math.round(Number(plan.price_azn) * 100),
              recurring: { interval: 'month' },
            },
            quantity: 1,
          }],
      metadata: { planId, userId: user.id, planName: plan.name_en },
      success_url: `${appUrl}/en/settings/billing?success=1`,
      cancel_url: `${appUrl}/en/pricing`,
      subscription_data: {
        metadata: { planId, userId: user.id },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
