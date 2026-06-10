import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { workspaces, members } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { workspaceId } = await req.json()

  const membership = await db.select().from(members)
    .where(and(eq(members.workspaceId, workspaceId), eq(members.userId, session.user.id)))
    .limit(1)
  if (!membership[0] || !['owner', 'admin'].includes(membership[0].role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId)).limit(1)
  if (!ws?.stripeCustomerId) return NextResponse.json({ error: 'No subscription' }, { status: 400 })

  const origin = req.headers.get('origin') || process.env.NEXTAUTH_URL!

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: ws.stripeCustomerId,
    return_url: `${origin}/workspace`,
  })

  return NextResponse.json({ url: portalSession.url })
}
