import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { workspaces } from '@/db/schema'
import { eq } from 'drizzle-orm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    const workspaceId = sub.metadata?.workspace_id
    if (!workspaceId) return NextResponse.json({ received: true })

    const plan: 'free' | 'pro' | 'team' = sub.status === 'active'
      ? (sub.items.data[0]?.price?.nickname?.toLowerCase().includes('team') ? 'team' : 'pro')
      : 'free'

    await db.update(workspaces).set({ plan }).where(eq(workspaces.id, workspaceId))
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const workspaceId = sub.metadata?.workspace_id
    if (workspaceId) {
      await db.update(workspaces).set({ plan: 'free' }).where(eq(workspaces.id, workspaceId))
    }
  }

  return NextResponse.json({ received: true })
}
