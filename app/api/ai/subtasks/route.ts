import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { tasks } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { generateText } from '@/lib/ai'
import { checkRateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anon'
  const { ok } = checkRateLimit(`ai-subtasks:${ip}`, 20)
  if (!ok) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })

  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { taskId } = await req.json()
  if (!taskId) return NextResponse.json({ error: 'taskId required' }, { status: 400 })

  const rows = await db.select({ title: tasks.title }).from(tasks).where(eq(tasks.id, taskId)).limit(1)
  const task = rows[0]
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  const prompt = `Break this task into 3-5 concrete subtasks. Return JSON array of strings only, no explanation.\n\nTask: ${task.title}\n\nSubtasks (JSON array):`

  const { text } = await generateText(prompt, { maxTokens: 200 })
  try {
    const match = text.match(/\[[\s\S]*\]/)
    const subtasks: string[] = match ? JSON.parse(match[0]) : []
    return NextResponse.json({ subtasks: subtasks.slice(0, 5) })
  } catch {
    return NextResponse.json({ subtasks: [] })
  }
}
