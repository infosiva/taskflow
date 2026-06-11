import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { tasks, members } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { generateText } from '@/lib/ai'
import { checkRateLimit } from '@/lib/rateLimit'
import { checkAiQuota } from '@/lib/planGate'
import { reportToTaskFlow } from '@/lib/reportToTaskFlow'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anon'
  const { ok } = checkRateLimit(`ai-assign:${ip}`, 60)
  if (!ok) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })

  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { taskId, workspaceId } = await req.json()
  if (!taskId || !workspaceId) return NextResponse.json({ error: 'taskId and workspaceId required' }, { status: 400 })

  const quota = await checkAiQuota(workspaceId, session.user.id)
  if (!quota.ok) return NextResponse.json({ error: quota.error }, { status: quota.status ?? 402 })

  const [taskRows, memberRows] = await Promise.all([
    db.select({ title: tasks.title }).from(tasks).where(eq(tasks.id, taskId)).limit(1),
    db.select({ userId: members.userId, role: members.role }).from(members).where(eq(members.workspaceId, workspaceId)),
  ])

  const task = taskRows[0]
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  const memberList = memberRows.map(m => `${m.userId} (${m.role})`).join(', ') || 'No members'
  const prompt = `Given this task, suggest the best person to assign it to based on their role.\n\nTask: ${task.title}\nTeam members: ${memberList}\n\nRespond with JSON: { "userId": "<user_id>", "reason": "<1 sentence reason>" }`

  const { text } = await generateText(prompt, { maxTokens: 150 })
  try {
    const match = text.match(/\{[\s\S]*\}/)
    const result = match ? JSON.parse(match[0]) : null
    void reportToTaskFlow({ project: 'taskflow', agentName: 'AssignAgent', status: 'completed', message: `AI assigned task: ${task.title}` })
    return NextResponse.json({ suggestion: result })
  } catch {
    return NextResponse.json({ suggestion: null })
  }
}
