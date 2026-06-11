import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { tasks, boards } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { generateText } from '@/lib/ai'
import { checkRateLimit } from '@/lib/rateLimit'
import { checkAiQuota } from '@/lib/planGate'
import { reportToTaskFlow } from '@/lib/reportToTaskFlow'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anon'
  const { ok } = checkRateLimit(`ai-risk:${ip}`, 60)
  if (!ok) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })

  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { boardId } = await req.json()
  if (!boardId) return NextResponse.json({ error: 'boardId required' }, { status: 400 })

  const [board] = await db.select({ workspaceId: boards.workspaceId }).from(boards).where(eq(boards.id, boardId)).limit(1)
  if (!board) return NextResponse.json({ error: 'Board not found' }, { status: 404 })

  const quota = await checkAiQuota(board.workspaceId, session.user.id)
  if (!quota.ok) return NextResponse.json({ error: quota.error }, { status: quota.status ?? 402 })

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
    if (risks.length > 0) void reportToTaskFlow({ project: 'taskflow', agentName: 'RiskAgent', status: 'completed', message: `Flagged ${risks.length} at-risk tasks` })
    return NextResponse.json({ risks })
  } catch {
    return NextResponse.json({ risks: [] })
  }
}
