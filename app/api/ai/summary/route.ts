import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { tasks, comments } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { generateText } from '@/lib/ai'
import { checkRateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anon'
  const { ok } = checkRateLimit(`ai-summary:${ip}`, 20)
  if (!ok) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })

  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { taskId } = await req.json()
  if (!taskId) return NextResponse.json({ error: 'taskId required' }, { status: 400 })

  const [taskRows, commentRows] = await Promise.all([
    db.select({ title: tasks.title }).from(tasks).where(eq(tasks.id, taskId)).limit(1),
    db.select({ body: comments.body }).from(comments).where(eq(comments.taskId, taskId)),
  ])

  const task = taskRows[0]
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  const commentText = commentRows.length ? commentRows.map(c => `- ${c.body}`).join('\n') : 'No comments yet.'
  const prompt = `Summarise this task in 1-2 sentences for a busy team member.\n\nTask: ${task.title}\nComments:\n${commentText}\n\nSummary:`

  const { text, model } = await generateText(prompt, { maxTokens: 120 })
  return NextResponse.json({ summary: text.trim(), model })
}
