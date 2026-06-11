import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { feedback } from '@/db/schema'
import { desc } from 'drizzle-orm'
import { checkRateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anon'
  const { ok } = checkRateLimit(`feedback:${ip}`, 10)
  if (!ok) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })

  const body = await req.json()
  const { rating, message, page, project } = body

  if (!rating || !['love', 'meh', 'broken'].includes(rating)) {
    return NextResponse.json({ error: 'rating must be love | meh | broken' }, { status: 400 })
  }

  await db.insert(feedback).values({
    project: project || 'taskflow',
    rating,
    message: message?.slice(0, 500) || null,
    page: page || null,
  })

  return NextResponse.json({ ok: true })
}

export async function GET() {
  const rows = await db
    .select()
    .from(feedback)
    .orderBy(desc(feedback.createdAt))
    .limit(50)
  return NextResponse.json({ feedback: rows })
}
