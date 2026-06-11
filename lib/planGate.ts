import { db } from '@/lib/db'
import { workspaces, activityLog } from '@/db/schema'
import { eq, and, gte, count, sql } from 'drizzle-orm'

const FREE_AI_LIMIT = 20

export async function checkAiQuota(workspaceId: string, userId: string): Promise<{ ok: boolean; error?: string; status?: number }> {
  const [ws] = await db.select({ plan: workspaces.plan }).from(workspaces).where(eq(workspaces.id, workspaceId)).limit(1)
  if (!ws) return { ok: false, error: 'Workspace not found', status: 404 }
  if (ws.plan !== 'free') return { ok: true }

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [row] = await db
    .select({ total: count() })
    .from(activityLog)
    .where(and(eq(activityLog.workspaceId, workspaceId), sql`${activityLog.action} like 'ai_%'`, gte(activityLog.createdAt, startOfMonth)))

  if ((row?.total ?? 0) >= FREE_AI_LIMIT) {
    return { ok: false, error: `Free plan: ${FREE_AI_LIMIT} AI calls/month. Upgrade for unlimited.`, status: 402 }
  }
  await db.insert(activityLog).values({ workspaceId, userId, action: 'ai_call', diff: {} })
  return { ok: true }
}

const TASKFLOW_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://taskflow.app'
const API_KEY = process.env.AGENT_API_KEY || ''

export type PlanInput = {
  project: string
  agentName: string
  planType?: string
  description: string
  filesTouch?: string[]
  steps?: string[]
}

export type PlanResult = 'approved' | 'rejected' | 'timeout'

const POLL_MS = 8_000
const MAX_POLLS = 112 // ~15 minutes

export async function submitAndWait(plan: PlanInput): Promise<PlanResult> {
  if (!API_KEY) return 'approved' // dev: no gate configured

  const res = await fetch(`${TASKFLOW_URL}/api/agent/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify(plan),
  })
  if (!res.ok) return 'rejected'
  const { plan: created } = await res.json()
  const id: string = created.id

  for (let i = 0; i < MAX_POLLS; i++) {
    await new Promise(r => setTimeout(r, POLL_MS))
    const pollRes = await fetch(`${TASKFLOW_URL}/api/agent/plan?id=${id}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    })
    if (!pollRes.ok) continue
    const { plan: p } = await pollRes.json()
    if (p?.status === 'approved') return 'approved'
    if (p?.status === 'rejected') return 'rejected'
  }
  return 'timeout'
}
