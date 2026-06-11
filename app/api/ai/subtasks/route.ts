import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { tasks } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { generateText } from '@/lib/ai'
import { checkRateLimit } from '@/lib/rateLimit'
import { checkAiQuota } from '@/lib/planGate'
import { reportToTaskFlow } from '@/lib/reportToTaskFlow'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anon'
  const { ok } = checkRateLimit(`ai-subtasks:${ip}`, 60)
  if (!ok) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })

  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { taskId, workspaceId } = await req.json()
  if (!taskId || !workspaceId) return NextResponse.json({ error: 'taskId and workspaceId required' }, { status: 400 })

  const quota = await checkAiQuota(workspaceId, session.user.id)
  if (!quota.ok) return NextResponse.json({ error: quota.error }, { status: quota.status ?? 402 })

  const rows = await db.select({ title: tasks.title }).from(tasks).where(eq(tasks.id, taskId as string)).limit(1)
  const task = rows[0]
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  const prompt = `Break this task into 3-5 concrete subtasks. Return JSON array of strings only, no explanation.\n\nTask: ${task.title}\n\nSubtasks (JSON array):`

  const { text } = await generateText(prompt, { maxTokens: 200 })
  try {
    const match = text.match(/\[[\s\S]*\]/)
    const subtasks: string[] = match ? JSON.parse(match[0]) : []
    if (subtasks.length > 0) void reportToTaskFlow({ project: 'taskflow', agentName: 'SubtasksAgent', status: 'completed', message: `Generated ${subtasks.length} subtasks for: ${task.title}` })
    return NextResponse.json({ subtasks: subtasks.slice(0, 5) })
  } catch {
    return NextResponse.json({ subtasks: [] })
  }
}
