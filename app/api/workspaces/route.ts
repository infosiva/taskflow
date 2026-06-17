import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { workspaces, members } from '@/db/schema'
import { eq } from 'drizzle-orm'

const DEV_USER_ID = 'siva-1781686963884'

export async function GET() {
  const session = await auth()
  const isDev = process.env.NODE_ENV === 'development'
  if (!session?.user?.id && !isDev) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = session?.user?.id ?? DEV_USER_ID

  const rows = await db
    .select({ workspace: workspaces })
    .from(members)
    .innerJoin(workspaces, eq(workspaces.id, members.workspaceId))
    .where(eq(members.userId, userId))
    .orderBy(workspaces.createdAt)

  return NextResponse.json(rows.map(r => r.workspace))
}

export async function POST(req: NextRequest) {
  const session = await auth()
  const isDev = process.env.NODE_ENV === 'development'
  if (!session?.user?.id && !isDev) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = session?.user?.id ?? DEV_USER_ID

  const { name } = await req.json()
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)
    + '-' + Math.random().toString(36).slice(2, 6)

  const [ws] = await db.insert(workspaces).values({
    name, slug, ownerId: userId, plan: 'free',
  }).returning()

  await db.insert(members).values({ workspaceId: ws.id, userId: userId, role: 'owner' })

  return NextResponse.json(ws, { status: 201 })
}
