import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_placeholder', { apiVersion: '2026-05-27.dahlia' })
}

// Helper to safely get period timestamps from Stripe subscription
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPeriod(sub: any) {
  const start = sub.current_period_start ?? sub.items?.data?.[0]?.current_period?.start
  const end = sub.current_period_end ?? sub.items?.data?.[0]?.current_period?.end
  return {
    start: start ? new Date(start * 1000).toISOString() : null,
    end: end ? new Date(end * 1000).toISOString() : null,
  }
}

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  const body = await request.text()
  const sig = request.headers.get('stripe-signature') ?? ''
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    if (event.type === 'customer.subscription.created') {
      const sub = event.data.object as Stripe.Subscription
      const { planId, userId } = sub.metadata
      if (!planId || !userId) return NextResponse.json({ received: true })

      const { data: plan } = await supabase
        .from('subscription_plans')
        .select('lessons_per_month')
        .eq('id', planId)
        .single()

      if (plan) {
        const period = getPeriod(sub) as { start: string; end: string }
        await supabase.from('user_subscriptions').upsert({
          student_id: userId,
          plan_id: planId,
          status: 'active',
          lessons_remaining: plan.lessons_per_month,
          lessons_total: plan.lessons_per_month,
          current_period_start: period.start,
          current_period_end: period.end,
          stripe_subscription_id: sub.id,
          stripe_customer_id: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
        }, { onConflict: 'student_id' })
      }
    }

    if (event.type === 'invoice.payment_succeeded') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invoice = event.data.object as any
      const sub_ = invoice.subscription
      const subId = typeof sub_ === 'string' ? sub_ : sub_?.id
      if (!subId) return NextResponse.json({ received: true })

      const sub = await stripe.subscriptions.retrieve(subId)
      const { planId, userId } = sub.metadata
      if (!planId || !userId) return NextResponse.json({ received: true })

      const { data: plan } = await supabase
        .from('subscription_plans')
        .select('lessons_per_month')
        .eq('id', planId)
        .single()

      if (plan) {
        const period = getPeriod(sub) as { start: string; end: string }
        await supabase.from('user_subscriptions').update({
          lessons_remaining: plan.lessons_per_month,
          lessons_total: plan.lessons_per_month,
          status: 'active',
          current_period_start: period.start,
          current_period_end: period.end,
          updated_at: new Date().toISOString(),
        }).eq('stripe_subscription_id', subId)
      }
    }

    if (event.type === 'invoice.payment_failed') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invoice = event.data.object as any
      const sub_ = invoice.subscription
      const subId = typeof sub_ === 'string' ? sub_ : sub_?.id
      if (subId) {
        await supabase.from('user_subscriptions').update({
          status: 'past_due',
          updated_at: new Date().toISOString(),
        }).eq('stripe_subscription_id', subId)
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription
      await supabase.from('user_subscriptions').update({
        status: 'expired',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('stripe_subscription_id', sub.id)
    }

    if (event.type === 'customer.subscription.updated') {
      const sub = event.data.object as Stripe.Subscription
      const period = getPeriod(sub) as { start: string; end: string }
      await supabase.from('user_subscriptions').update({
        status: sub.status === 'active' ? 'active' : sub.status === 'canceled' ? 'cancelled' : sub.status,
        current_period_start: period.start,
        current_period_end: period.end,
        updated_at: new Date().toISOString(),
      }).eq('stripe_subscription_id', sub.id)
    }
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
