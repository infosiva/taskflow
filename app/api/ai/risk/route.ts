import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { tasks } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { generateText } from '@/lib/ai'
import { checkRateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anon'
  const { ok } = checkRateLimit(`ai-risk:${ip}`, 20)
  if (!ok) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })

  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { boardId } = await req.json()
  if (!boardId) return NextResponse.json({ error: 'boardId required' }, { status: 400 })

  const taskRows = await db
    .select({ id: tasks.id, title: tasks.title })
    .from(tasks)
    .where(eq(tasks.boardId, boardId))

  if (!taskRows.length) return NextResponse.json({ risks: [] })

  const now = new Date()
  const taskList = taskRows.map(t => `- "${t.title}" (id: ${t.id})`).join('\n')
  const prompt = `Analyse these tasks and flag any that appear at risk. Return JSON array of { id, reason } for at-risk tasks only.\n\nTasks:\n${taskList}\n\nAt-risk tasks (JSON):`

  const { text } = await generateText(prompt, { maxTokens: 300 })
  try {
    const match = text.match(/\[[\s\S]*\]/)
    const risks = match ? JSON.parse(match[0]) : []
    return NextResponse.json({ risks })
  } catch {
    return NextResponse.json({ risks: [] })
  }
}
