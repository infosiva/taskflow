import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { columns } from '@/db/schema'
import { eq } from 'drizzle-orm'

type Params = { params: Promise<{ boardId: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const { boardId } = await params
  const session = await auth()
  const isDev = process.env.NODE_ENV === 'development'
  if (!session?.user?.id && !isDev) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const [col] = await db.insert(columns).values({ ...body, boardId }).returning()
  return NextResponse.json(col, { status: 201 })
}
