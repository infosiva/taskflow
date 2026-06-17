import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { cellValues } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

type Params = { params: Promise<{ taskId: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  const { taskId } = await params
  const session = await auth()
  const isDev = process.env.NODE_ENV === 'development'
  if (!session?.user?.id && !isDev) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { columnId, value } = await req.json()

  await db.insert(cellValues)
    .values({ taskId, columnId, value })
    .onConflictDoUpdate({ target: [cellValues.taskId, cellValues.columnId], set: { value, updatedAt: new Date() } })

  return NextResponse.json({ ok: true })
}
