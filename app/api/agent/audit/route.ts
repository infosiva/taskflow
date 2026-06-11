import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { projectAudits } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const runtime = 'nodejs'

const AGENT_API_KEY = process.env.AGENT_API_KEY || ''

function authorized(req: NextRequest): boolean {
  if (!AGENT_API_KEY) return false
  const auth = req.headers.get('authorization') ?? ''
  return auth === `Bearer ${AGENT_API_KEY}`
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { project, ...auditData } = body

    if (!project) return NextResponse.json({ error: 'project required' }, { status: 400 })

    const existing = await db.select({ id: projectAudits.id }).from(projectAudits).where(eq(projectAudits.project, project)).limit(1)

    if (existing.length > 0) {
      await db.update(projectAudits).set({ ...auditData, auditedAt: new Date() }).where(eq(projectAudits.project, project))
      return NextResponse.json({ updated: true })
    } else {
      const [row] = await db.insert(projectAudits).values({ project, ...auditData }).returning()
      return NextResponse.json({ id: row.id, created: true })
    }
  } catch (err) {
    console.error('[agent/audit] POST error:', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const audits = await db.select().from(projectAudits).orderBy(projectAudits.project)
    return NextResponse.json({ audits })
  } catch (err) {
    console.error('[agent/audit] GET error:', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
