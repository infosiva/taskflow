import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { groups } from '@/db/schema'
import { eq } from 'drizzle-orm'

type Params = { params: Promise<{ boardId: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const { boardId } = await params
  const session = await auth()
  const isDev = process.env.NODE_ENV === 'development'
  if (!session?.user?.id && !isDev) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, color, position } = await req.json()

  const [group] = await db.insert(groups).values({ boardId, name, color: color ?? '#94a3b8', position: position ?? 0 }).returning()
  return NextResponse.json(group, { status: 201 })
}
