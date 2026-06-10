import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { workspaces, members } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

const PRICE_IDS: Record<string, string> = {
  pro: process.env.STRIPE_PRICE_PRO!,
  team: process.env.STRIPE_PRICE_TEAM!,
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { workspaceId, plan } = await req.json()
  if (!workspaceId || !PRICE_IDS[plan]) {
    return NextResponse.json({ error: 'Invalid plan or workspace' }, { status: 400 })
  }

  const membership = await db.select().from(members)
    .where(and(eq(members.workspaceId, workspaceId), eq(members.userId, session.user.id)))
    .limit(1)
  if (!membership[0] || !['owner', 'admin'].includes(membership[0].role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId)).limit(1)
  if (!ws) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })

  let customerId = ws.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email!,
      metadata: { workspace_id: workspaceId, user_id: session.user.id },
    })
    customerId = customer.id
    await db.update(workspaces).set({ stripeCustomerId: customerId }).where(eq(workspaces.id, workspaceId))
  }

  const origin = req.headers.get('origin') || process.env.NEXTAUTH_URL!

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
    metadata: { workspace_id: workspaceId },
    subscription_data: { metadata: { workspace_id: workspaceId } },
    success_url: `${origin}/workspace?upgraded=true`,
    cancel_url: `${origin}/workspace?cancelled=true`,
    allow_promotion_codes: true,
  })

  return NextResponse.json({ url: checkoutSession.url })
}
