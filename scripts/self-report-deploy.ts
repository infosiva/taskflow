// Run post-deploy: npx tsx scripts/self-report-deploy.ts
// Reports TaskFlow's own deploy to its Agent Ops feed
export {}

const BASE_URL = process.env.TASKFLOW_URL || 'https://taskflow.app'
const API_KEY = process.env.AGENT_API_KEY || ''

if (!API_KEY) {
  console.error('AGENT_API_KEY required')
  process.exit(1)
}

async function report() {
  const res = await fetch(`${BASE_URL}/api/agent/activity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      project: 'taskflow',
      agentName: 'DeployAgent',
      status: 'completed',
      message: `TaskFlow deployed to production`,
      details: {
        commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) || 'unknown',
        branch: process.env.VERCEL_GIT_COMMIT_REF || 'main',
        deployedAt: new Date().toISOString(),
      },
    }),
  })

  if (res.ok) {
    console.log('✓ Deploy reported to TaskFlow Agent Ops')
  } else {
    console.error('✗ Report failed:', res.status, await res.text())
  }
}

report()
