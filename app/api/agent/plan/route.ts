import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { agentPlans } from '@/db/schema'
import { eq } from 'drizzle-orm'

const API_KEY = process.env.AGENT_API_KEY || ''

function auth(req: NextRequest) {
  return req.headers.get('authorization') === `Bearer ${API_KEY}`
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { project, agentName, planType, description, filesTouch, steps } = body
  if (!project || !agentName || !description) {
    return NextResponse.json({ error: 'project, agentName, description required' }, { status: 400 })
  }
  const [plan] = await db.insert(agentPlans).values({
    project,
    agentName,
    planType: planType ?? 'code_push',
    description,
    filesTouch: filesTouch ?? [],
    steps: steps ?? [],
  }).returning()
  return NextResponse.json({ plan })
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (id) {
    const [plan] = await db.select().from(agentPlans).where(eq(agentPlans.id, id))
    return NextResponse.json({ plan: plan ?? null })
  }
  const plans = await db.select().from(agentPlans).orderBy(agentPlans.submittedAt)
  return NextResponse.json({ plans })
}

export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, status } = await req.json()
  if (!id || !['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'id + status (approved|rejected) required' }, { status: 400 })
  }
  const [plan] = await db.update(agentPlans)
    .set({ status, reviewedAt: new Date() })
    .where(eq(agentPlans.id, id))
    .returning()
  return NextResponse.json({ plan })
}
