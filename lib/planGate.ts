import { db } from '@/lib/db'
import { workspaces, activityLog } from '@/db/schema'
import { eq, and, gte, count, sql } from 'drizzle-orm'

const FREE_AI_LIMIT = 20
const FREE_MEMBER_LIMIT = 5
const FREE_BOARD_LIMIT = 5

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
    .where(
      and(
        eq(activityLog.workspaceId, workspaceId),
        sql`${activityLog.action} like 'ai_%'`,
        gte(activityLog.createdAt, startOfMonth),
      )
    )

  if ((row?.total ?? 0) >= FREE_AI_LIMIT) {
    return { ok: false, error: `Free plan limit: ${FREE_AI_LIMIT} AI calls/month. Upgrade to Pro for unlimited AI.`, status: 402 }
  }

  await db.insert(activityLog).values({ workspaceId, userId, action: 'ai_call', diff: {} })
  return { ok: true }
}
