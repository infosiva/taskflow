import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { tasks } from '@/db/schema'
import { eq } from 'drizzle-orm'

type Params = { params: Promise<{ boardId: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const { boardId } = await params
  const session = await auth()
  const isDev = process.env.NODE_ENV === 'development'
  if (!session?.user?.id && !isDev) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { groupId, title, position } = await req.json()

  const DEV_USER_ID = 'siva-1781686963884'
  const userId = session?.user?.id ?? DEV_USER_ID

  const [task] = await db.insert(tasks).values({
    groupId, boardId, title: title ?? 'Untitled', position: position ?? 0, createdBy: userId,
  }).returning()

  return NextResponse.json(task, { status: 201 })
}
