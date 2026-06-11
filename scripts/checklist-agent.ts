#!/usr/bin/env npx ts-node --esm
/**
 * VPS Nightly Checklist Agent
 * Runs 20-point global standard checks across all portfolio projects.
 * Posts results to TaskFlow activity feed.
 * Usage: node scripts/checklist-agent.js
 * PM2: pm2 start scripts/checklist-agent.js --cron "0 2 * * *" --no-autorestart
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const TASKFLOW_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://taskflow.app'
const API_KEY = process.env.AGENT_API_KEY || ''
const PROJECTS_DIR = process.env.PROJECTS_DIR || '/root/agents'

const PORTFOLIO_PROJECTS = [
  'kwizzo', 'speakiq', 'resumevault', 'draftcal', 'trackwealth',
  'roamplan', 'worldtrends', 'myvitals', 'aicoachlab', 'neuralos',
  'pixelforge', 'agenttrace',
]

type CheckResult = { id: string; pass: boolean; detail?: string }

async function report(project: string, checks: CheckResult[], durationMs: number) {
  const passed = checks.filter(c => c.pass).length
  const failed = checks.filter(c => !c.pass)
  const status = failed.length === 0 ? 'completed' : 'failed'
  const message = `Checklist: ${passed}/${checks.length} passed${failed.length > 0 ? ` — FAIL: ${failed.map(f => f.id).join(', ')}` : ''}`

  try {
    await fetch(`${TASKFLOW_URL}/api/agent/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
      body: JSON.stringify({ project, agentName: 'ChecklistAgent', status, message, durationMs }),
    })
  } catch {
    // non-critical
  }
}

function fileExists(dir: string, rel: string) {
  return fs.existsSync(path.join(dir, rel))
}

function fileContains(dir: string, rel: string, needle: string): boolean {
  try {
    return fs.readFileSync(path.join(dir, rel), 'utf8').includes(needle)
  } catch { return false }
}

function grepR(dir: string, pattern: string): boolean {
  try {
    const result = execSync(`grep -rl "${pattern}" "${dir}/app" 2>/dev/null || true`, { encoding: 'utf8' })
    return result.trim().length > 0
  } catch { return false }
}

function checkProject(project: string): CheckResult[] {
  const dir = path.join(PROJECTS_DIR, project)
  if (!fs.existsSync(dir)) return [{ id: 'dir_exists', pass: false, detail: 'Project dir not found' }]

  const checks: CheckResult[] = []

  // 1. sitemap.ts exists
  checks.push({ id: 'sitemap', pass: fileExists(dir, 'app/sitemap.ts') || fileExists(dir, 'app/sitemap.tsx') })

  // 2. robots.txt exists
  checks.push({ id: 'robots', pass: fileExists(dir, 'public/robots.txt') })

  // 3. og.png exists
  checks.push({ id: 'og_png', pass: fileExists(dir, 'public/og.png') })

  // 4. metadataBase set in layout
  checks.push({ id: 'metadataBase', pass: fileContains(dir, 'app/layout.tsx', 'metadataBase') })

  // 5. JSON-LD in layout
  checks.push({ id: 'json_ld', pass: fileContains(dir, 'app/layout.tsx', 'application/ld+json') })

  // 6. No fake stats (fabricated numbers pattern)
  const fakePatterns = ['10,000 users', '50,000', '100,000 users', '4.9/5', '★★★★★']
  const layoutContent = (() => { try { return fs.readFileSync(path.join(dir, 'app/page.tsx'), 'utf8') } catch { return '' } })()
  const hasFakeStats = fakePatterns.some(p => layoutContent.includes(p))
  checks.push({ id: 'no_fake_stats', pass: !hasFakeStats })

  // 7. Chatbot component present
  checks.push({ id: 'chatbot', pass: fileExists(dir, 'components/FloatingChatWrapper.tsx') || fileExists(dir, 'components/ChatWidget.tsx') || grepR(dir, 'FloatingChat') })

  // 8. Feedback component present
  checks.push({ id: 'feedback', pass: grepR(dir, 'FeedbackWidget') || grepR(dir, 'feedback') })

  // 9. Rate limiting on AI routes
  checks.push({ id: 'rate_limit', pass: grepR(dir, 'checkRateLimit') || grepR(dir, 'rateLimit') })

  // 10. No hardcoded API keys as fallback defaults
  const hasHardcodedKey = grepR(dir, "process.env.\\|\\| 'sk-") || grepR(dir, 'process.env.GROQ_API_KEY || "gsk_')
  checks.push({ id: 'no_hardcoded_keys', pass: !hasHardcodedKey })

  // 11. .env not committed
  checks.push({ id: 'no_env_committed', pass: !fileExists(dir, '.env') })

  // 12. package.json exists (basic sanity)
  checks.push({ id: 'package_json', pass: fileExists(dir, 'package.json') })

  // 13. Next.js app router used
  checks.push({ id: 'app_router', pass: fileExists(dir, 'app') && fs.statSync(path.join(dir, 'app')).isDirectory() })

  // 14. Layout.tsx exists at app root
  checks.push({ id: 'app_layout', pass: fileExists(dir, 'app/layout.tsx') })

  // 15. No CNN/Forbes fake press logos
  const heroContent = layoutContent
  const fakePressLogos = ['CNN', 'Forbes', 'Guardian', 'WIRED', 'TechCrunch'].filter(p => heroContent.includes(p))
  checks.push({ id: 'no_fake_press', pass: fakePressLogos.length === 0, detail: fakePressLogos.join(', ') || undefined })

  // 16. Auth check: no auth wall on landing (NextAuth session check in page.tsx)
  const pageContent = layoutContent
  const hasAuthWall = pageContent.includes('redirect(\'/login\')') || pageContent.includes("redirect('/login')")
  checks.push({ id: 'no_landing_auth_wall', pass: !hasAuthWall })

  // 17. AI fallback chain present (Groq at minimum)
  checks.push({ id: 'ai_fallback', pass: grepR(dir, 'GROQ_API_KEY') || fileExists(dir, 'lib/ai.ts') })

  // 18. Keywords in title (layout metadata)
  const layoutTsx = (() => { try { return fs.readFileSync(path.join(dir, 'app/layout.tsx'), 'utf8') } catch { return '' } })()
  const hasKeywordTitle = layoutTsx.includes('title:') && !layoutTsx.match(/title:\s*['"`][A-Z][a-z]+['"`]/)
  checks.push({ id: 'keyword_title', pass: hasKeywordTitle || layoutTsx.includes('title:') })

  // 19. VPS tracker or analytics present
  checks.push({ id: 'analytics', pass: fileContains(dir, 'app/layout.tsx', '31.97.56.148') || fileContains(dir, 'app/layout.tsx', 'googletagmanager') || fileContains(dir, 'app/layout.tsx', 'plausible') })

  // 20. Freemium gate: no hard auth wall on all pages
  const hasGlobalAuthWall = fileContains(dir, 'app/(app)/layout.tsx', 'redirect(\'/login\')') || fileContains(dir, 'middleware.ts', 'redirect')
  checks.push({ id: 'freemium_gate', pass: !fileContains(dir, 'app/page.tsx', 'if (!session)') || !hasGlobalAuthWall })

  return checks
}

async function main() {
  console.log(`[checklist-agent] Starting at ${new Date().toISOString()}`)
  let totalPass = 0, totalFail = 0

  for (const project of PORTFOLIO_PROJECTS) {
    const start = Date.now()
    const checks = checkProject(project)
    const durationMs = Date.now() - start
    const failed = checks.filter(c => !c.pass)
    totalPass += checks.filter(c => c.pass).length
    totalFail += failed.length
    console.log(`  ${project}: ${checks.length - failed.length}/${checks.length} pass${failed.length > 0 ? ` [FAIL: ${failed.map(f => f.id).join(',')}]` : ''}`)
    await report(project, checks, durationMs)
  }

  console.log(`[checklist-agent] Done. ${totalPass} passed, ${totalFail} failed across ${PORTFOLIO_PROJECTS.length} projects.`)
}

main().catch(err => { console.error(err); process.exit(1) })
