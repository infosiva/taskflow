import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { workspaces, members } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await db
    .select({ workspace: workspaces })
    .from(members)
    .innerJoin(workspaces, eq(workspaces.id, members.workspaceId))
    .where(eq(members.userId, session.user.id))
    .orderBy(workspaces.createdAt)

  return NextResponse.json(rows.map(r => r.workspace))
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name } = await req.json()
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)
    + '-' + Math.random().toString(36).slice(2, 6)

  const [ws] = await db.insert(workspaces).values({
    name, slug, ownerId: session.user.id, plan: 'free',
  }).returning()

  await db.insert(members).values({ workspaceId: ws.id, userId: session.user.id, role: 'owner' })

  return NextResponse.json(ws, { status: 201 })
}
