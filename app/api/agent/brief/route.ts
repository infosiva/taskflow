import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { projectBriefs } from '@/db/schema'
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
    const { project, ...briefData } = body
    if (!project) return NextResponse.json({ error: 'project required' }, { status: 400 })

    const existing = await db.select({ id: projectBriefs.id }).from(projectBriefs).where(eq(projectBriefs.project, project)).limit(1)

    if (existing.length > 0) {
      await db.update(projectBriefs).set({ ...briefData, updatedAt: new Date() }).where(eq(projectBriefs.project, project))
      return NextResponse.json({ updated: true })
    } else {
      const [row] = await db.insert(projectBriefs).values({ project, ...briefData }).returning()
      return NextResponse.json({ id: row.id, created: true })
    }
  } catch (err) {
    console.error('[agent/brief] POST error:', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const project = searchParams.get('project')

    if (project) {
      const [brief] = await db.select().from(projectBriefs).where(eq(projectBriefs.project, project)).limit(1)
      return NextResponse.json({ brief: brief ?? null })
    }

    const briefs = await db.select().from(projectBriefs).orderBy(projectBriefs.project)
    return NextResponse.json({ briefs })
  } catch (err) {
    console.error('[agent/brief] GET error:', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const { project, status } = await req.json()
    if (!project || !status) return NextResponse.json({ error: 'project + status required' }, { status: 400 })

    const update: Record<string, unknown> = { status, updatedAt: new Date() }
    if (status === 'approved') update.approvedAt = new Date()
    if (status === 'done') update.doneAt = new Date()

    await db.update(projectBriefs).set(update).where(eq(projectBriefs.project, project))
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[agent/brief] PATCH error:', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
