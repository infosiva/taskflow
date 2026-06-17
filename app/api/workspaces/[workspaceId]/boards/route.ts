import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { boards, groups, columns, workspaces, members } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

type Params = { params: Promise<{ workspaceId: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { workspaceId } = await params
  const session = await auth()
  const isDev = process.env.NODE_ENV === 'development'
  if (!session?.user?.id && !isDev) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await db.select().from(boards).where(eq(boards.workspaceId, workspaceId)).orderBy(boards.createdAt)
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest, { params }: Params) {
  const { workspaceId } = await params
  const session = await auth()
  const isDev = process.env.NODE_ENV === 'development'
  if (!session?.user?.id && !isDev) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  // Check free tier limit
  const [ws] = await db.select({ plan: workspaces.plan }).from(workspaces).where(eq(workspaces.id, workspaceId)).limit(1)
  if (ws?.plan === 'free') {
    const existing = await db.select({ id: boards.id }).from(boards).where(eq(boards.workspaceId, workspaceId))
    if (existing.length >= 5) return NextResponse.json({ error: 'Free plan limit: 5 boards. Upgrade to Pro.' }, { status: 403 })
  }

  const [board] = await db.insert(boards).values({
    workspaceId,
    name: body.name ?? 'Untitled Board',
    icon: body.icon ?? '📋',
    color: body.color ?? '#6366f1',
  }).returning()

  // Seed default groups
  await db.insert(groups).values([
    { boardId: board.id, name: 'To Do', color: '#94a3b8', position: 0 },
    { boardId: board.id, name: 'In Progress', color: '#f59e0b', position: 1 },
    { boardId: board.id, name: 'Done', color: '#22c55e', position: 2 },
  ])

  // Seed default columns
  await db.insert(columns).values([
    { boardId: board.id, name: 'Status', type: 'status', config: { options: [
      { label: 'Not Started', color: '#94a3b8' },
      { label: 'Working on it', color: '#f59e0b' },
      { label: 'Done', color: '#22c55e' },
      { label: 'Stuck', color: '#ef4444' },
    ]}, position: 0 },
    { boardId: board.id, name: 'Priority', type: 'priority', config: {}, position: 1 },
    { boardId: board.id, name: 'Due Date', type: 'due_date', config: {}, position: 2 },
    { boardId: board.id, name: 'Assignee', type: 'person', config: {}, position: 3 },
  ])

  return NextResponse.json(board, { status: 201 })
}
