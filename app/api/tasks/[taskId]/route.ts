import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { tasks } from '@/db/schema'
import { eq } from 'drizzle-orm'

type Params = { params: Promise<{ taskId: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const { taskId } = await params
  const session = await auth()
  const isDev = process.env.NODE_ENV === 'development'
  if (!session?.user?.id && !isDev) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const allowed = ['title', 'groupId', 'position'] as const
  const update: Partial<typeof tasks.$inferInsert> = {}
  for (const key of allowed) {
    if (key in body) (update as Record<string, unknown>)[key] = body[key]
  }

  await db.update(tasks).set(update).where(eq(tasks.id, taskId))
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { taskId } = await params
  const session = await auth()
  const isDev = process.env.NODE_ENV === 'development'
  if (!session?.user?.id && !isDev) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await db.delete(tasks).where(eq(tasks.id, taskId))
  return NextResponse.json({ ok: true })
}
