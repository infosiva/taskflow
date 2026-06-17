import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { tasks, groups, columns, cellValues } from '@/db/schema'
import { eq, inArray } from 'drizzle-orm'

type Params = { params: Promise<{ boardId: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { boardId } = await params
  const session = await auth()
  const isDev = process.env.NODE_ENV === 'development'
  if (!session?.user?.id && !isDev) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [groupRows, taskRows, columnRows] = await Promise.all([
    db.select().from(groups).where(eq(groups.boardId, boardId)).orderBy(groups.position),
    db.select().from(tasks).where(eq(tasks.boardId, boardId)).orderBy(tasks.position),
    db.select().from(columns).where(eq(columns.boardId, boardId)).orderBy(columns.position),
  ])

  let cellRows: typeof cellValues.$inferSelect[] = []
  if (taskRows.length) {
    cellRows = await db.select().from(cellValues).where(
      inArray(cellValues.taskId, taskRows.map(t => t.id))
    )
  }

  return NextResponse.json({ groups: groupRows, tasks: taskRows, columns: columnRows, cells: cellRows })
}
