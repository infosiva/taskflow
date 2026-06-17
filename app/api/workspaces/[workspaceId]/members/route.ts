import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { members, users } from '@/db/schema'
import { eq } from 'drizzle-orm'

type Params = { params: Promise<{ workspaceId: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { workspaceId } = await params
  const session = await auth()
  const isDev = process.env.NODE_ENV === 'development'
  if (!session?.user?.id && !isDev) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await db
    .select({ userId: members.userId, role: members.role, name: users.name, email: users.email, image: users.image })
    .from(members)
    .leftJoin(users, eq(users.id, members.userId))
    .where(eq(members.workspaceId, workspaceId))

  return NextResponse.json(rows)
}
