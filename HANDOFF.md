# HANDOFF — TaskFlow agent infrastructure: plan gate + checklist agent + token optimiser
**Date:** 2026-06-11  **Status:** COMPLETE
**Goal:** Full agent ops loop — agents submit plans for approval before code push, nightly checklist agent on VPS, token optimisation across all layers.

## Previous work (complete — do not redo)
Tracks 1/2/3/4/5/6 all complete. See git log for details. Build passes.

---

## Files touched
- `db/schema.ts` — `agentPlans` table added, pushed to Neon
- `app/api/agent/plan/route.ts` — POST/GET/PATCH plan gate API (NEW)
- `app/briefs/page.tsx` — Plan Review tab added alongside Brief Review tab
- `lib/planGate.ts` — `checkAiQuota` (preserved) + `submitAndWait` (NEW)
- `scripts/checklist-agent.ts` — VPS nightly 20-point checker for 12 projects (NEW)
- `lib/reportToTaskFlow.ts` — already optimal, no changes needed
- AI routes (assign/risk/summary/subtasks) — already ≤200 tokens, no changes needed

## Steps
- [x] Write HANDOFF
- [x] Add `agentPlans` table to `db/schema.ts`
- [x] Create `app/api/agent/plan/route.ts`
- [x] Extend `/briefs` page with Plan Review tab
- [x] Create `lib/planGate.ts` with `submitAndWait` + restored `checkAiQuota`
- [x] Token optimiser: AI route prompts already ≤200 tokens (no change)
- [x] Token optimiser: `reportToTaskFlow` already ≤5 fields (no change)
- [x] Create `scripts/checklist-agent.ts`
- [x] `npm run build` passes
- [x] `npx drizzle-kit push` to Neon — "Changes applied"
- [x] Commit all

## Success criteria (all met)
- Agent calls `planGate.submitAndWait(plan)` → posts to `/api/agent/plan` → returns `approved`/`rejected` ✓
- `/briefs` Plan Review tab shows pending plans with Approve/Reject buttons ✓
- `scripts/checklist-agent.ts` checks 20 items per project, posts to TaskFlow activity feed ✓
- AI route prompts ≤200 tokens each ✓
- `reportToTaskFlow` payload ≤5 fields ✓
- Build passes ✓

## Next: VPS deployment
Deploy checklist agent to VPS:
```bash
scp taskflow/scripts/checklist-agent.ts root@31.97.56.148:/root/agents/taskflow/scripts/
ssh root@31.97.56.148 "cd /root/agents/taskflow && npx tsc scripts/checklist-agent.ts --esModuleInterop --target es2020 --module commonjs"
pm2 start /root/agents/taskflow/scripts/checklist-agent.js --name checklist-agent --cron "0 2 * * *" --no-autorestart
```
Set on VPS: `AGENT_API_KEY=<same as Vercel env>` and `NEXT_PUBLIC_APP_URL=https://taskflow.app`
