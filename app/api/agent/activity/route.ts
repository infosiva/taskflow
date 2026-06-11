import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { agentRuns } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

export const runtime = 'nodejs'

const AGENT_API_KEY = process.env.AGENT_API_KEY || ''

function authorized(req: NextRequest): boolean {
  if (!AGENT_API_KEY) return false
  const auth = req.headers.get('authorization') ?? ''
  return auth === `Bearer ${AGENT_API_KEY}`
}

// POST /api/agent/activity — called by portfolio project agents to report status
export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { project, agentName, status, message, details, durationMs, tokenCost } = body

    if (!project || !agentName || !message) {
      return NextResponse.json({ error: 'project, agentName, message required' }, { status: 400 })
    }

    const [run] = await db.insert(agentRuns).values({
      project,
      agentName,
      status: status ?? 'completed',
      message,
      details: details ?? {},
      durationMs: durationMs ?? null,
      tokenCost: tokenCost ?? null,
    }).returning()

    return NextResponse.json({ id: run.id, created: true })
  } catch (err) {
    console.error('[agent/activity] POST error:', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}

// GET /api/agent/activity — returns recent runs (auth required)
export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const project = searchParams.get('project')
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 200)

  try {
    const runs = project
      ? await db.select().from(agentRuns).where(eq(agentRuns.project, project)).orderBy(desc(agentRuns.createdAt)).limit(limit)
      : await db.select().from(agentRuns).orderBy(desc(agentRuns.createdAt)).limit(limit)

    return NextResponse.json({ runs })
  } catch (err) {
    console.error('[agent/activity] GET error:', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
