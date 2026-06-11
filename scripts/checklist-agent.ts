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
import { execSync, execFileSync } from 'child_process'

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

// Resolve app root — supports app/ and src/app/ layouts, plus monorepos (agenttrace)
function appRoot(dir: string): string {
  if (fs.existsSync(path.join(dir, 'src/app'))) return path.join(dir, 'src/app')
  if (fs.existsSync(path.join(dir, 'app'))) return path.join(dir, 'app')
  // monorepo: check apps/dashboard
  const mono = path.join(dir, 'apps/dashboard/src/app')
  if (fs.existsSync(mono)) return mono
  return path.join(dir, 'app') // fallback
}

function searchDirs(dir: string): string[] {
  return [
    path.join(dir, 'app'), path.join(dir, 'src/app'),
    path.join(dir, 'lib'), path.join(dir, 'src/lib'),
    // monorepo (agenttrace)
    path.join(dir, 'apps/dashboard/src/app'), path.join(dir, 'apps/dashboard/src/lib'),
    path.join(dir, 'apps/dashboard/src/components'), path.join(dir, 'components'), path.join(dir, 'src/components'),
  ].filter(d => fs.existsSync(d))
}

function grepR(dir: string, pattern: string): boolean {
  try {
    const targets = searchDirs(dir)
    if (!targets.length) return false
    const result = execFileSync('grep', ['-rl', '-F', pattern, ...targets], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
    return result.trim().length > 0
  } catch { return false }
}

// Grep with regex pattern
function grepRE(dir: string, pattern: string): boolean {
  try {
    const targets = searchDirs(dir)
    if (!targets.length) return false
    const result = execFileSync('grep', ['-rlE', pattern, ...targets], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
    return result.trim().length > 0
  } catch {
    return false
  }
}

function readFile(dir: string, rel: string): string {
  try { return fs.readFileSync(path.join(dir, rel), 'utf8') } catch { return '' }
}

function checkProject(project: string): CheckResult[] {
  const dir = path.join(PROJECTS_DIR, project)
  if (!fs.existsSync(dir)) return [{ id: 'dir_exists', pass: false, detail: 'Project dir not found' }]

  const appDir = appRoot(dir)
  const isAppRoot = (rel: string) => fs.existsSync(path.join(appDir, rel))
  const appContains = (rel: string, needle: string) => {
    try { return fs.readFileSync(path.join(appDir, rel), 'utf8').includes(needle) } catch { return false }
  }

  const checks: CheckResult[] = []

  // 1. sitemap.ts exists
  checks.push({ id: 'sitemap', pass: isAppRoot('sitemap.ts') || isAppRoot('sitemap.tsx') })

  // 2. robots.txt exists (check monorepo path too)
  const monoPublic = path.join(dir, 'apps/dashboard/public')
  checks.push({ id: 'robots', pass: fileExists(dir, 'public/robots.txt') || fs.existsSync(path.join(monoPublic, 'robots.txt')) })

  // 3. og.png exists (check monorepo path too)
  checks.push({ id: 'og_png', pass: fileExists(dir, 'public/og.png') || fs.existsSync(path.join(monoPublic, 'og.png')) })

  // 4. metadataBase set in layout
  checks.push({ id: 'metadataBase', pass: appContains('layout.tsx', 'metadataBase') })

  // 5. JSON-LD in layout or via SchemaOrg component
  checks.push({ id: 'json_ld', pass: appContains('layout.tsx', 'application/ld+json') || appContains('layout.tsx', 'SchemaOrg') || grepR(dir, 'application/ld+json') })

  // 6. No fake stats
  const fakePatterns = ['10,000 users', '50,000', '100,000 users', '4.9/5', '★★★★★']
  const pageContent = readFile(appDir, 'page.tsx')
  checks.push({ id: 'no_fake_stats', pass: !fakePatterns.some(p => pageContent.includes(p)) })

  // 7. Chatbot component present
  checks.push({ id: 'chatbot', pass: fileExists(dir, 'components/FloatingChatWrapper.tsx') || fileExists(dir, 'src/components/FloatingChatWrapper.tsx') || grepR(dir, 'FloatingChat') || grepR(dir, 'ChatWidget') })

  // 8. Feedback component present
  checks.push({ id: 'feedback', pass: grepR(dir, 'FeedbackWidget') || grepR(dir, 'feedback-widget') })

  // 9. Rate limiting on AI routes
  checks.push({ id: 'rate_limit', pass: grepR(dir, 'checkRateLimit') || grepR(dir, 'rateLimit') })

  // 10. No hardcoded API keys as fallback defaults (real hardcoded values, not empty string fallbacks)
  const hasHardcodedKey = grepRE(dir, "process\\.env\\.[A-Z_]+ \\|\\| ['\"]sk-") ||
    grepRE(dir, "process\\.env\\.[A-Z_]+ \\|\\| ['\"]gsk_") ||
    grepRE(dir, "process\\.env\\.[A-Z_]+ \\|\\| ['\"]AIza")
  checks.push({ id: 'no_hardcoded_keys', pass: !hasHardcodedKey })

  // 11. .env not committed (check git tracking, not filesystem presence)
  const envTracked = (() => {
    try {
      const r = execFileSync('git', ['ls-files', '.env'], { cwd: dir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
      return r.trim().length > 0
    } catch { return false }
  })()
  checks.push({ id: 'no_env_committed', pass: !envTracked })

  // 12. package.json exists
  checks.push({ id: 'package_json', pass: fileExists(dir, 'package.json') })

  // 13. Next.js app router used
  checks.push({ id: 'app_router', pass: fs.existsSync(appDir) })

  // 14. Layout.tsx exists
  checks.push({ id: 'app_layout', pass: isAppRoot('layout.tsx') })

  // 15. No fake press logos
  const fakePressLogos = ['CNN', 'Forbes', 'Guardian', 'WIRED', 'TechCrunch'].filter(p => pageContent.includes(p))
  checks.push({ id: 'no_fake_press', pass: fakePressLogos.length === 0, detail: fakePressLogos.join(', ') || undefined })

  // 16. No auth wall on landing page
  const hasAuthWall = pageContent.includes("redirect('/login')") || pageContent.includes('redirect("/login")')
  checks.push({ id: 'no_landing_auth_wall', pass: !hasAuthWall })

  // 17. AI fallback chain present
  checks.push({ id: 'ai_fallback', pass: grepR(dir, 'GROQ_API_KEY') || fileExists(dir, 'lib/ai.ts') || fileExists(dir, 'src/lib/ai.ts') })

  // 18. Keyword-rich title in layout metadata
  const layoutTsx = readFile(appDir, 'layout.tsx')
  checks.push({ id: 'keyword_title', pass: layoutTsx.includes('title:') })

  // 19. Analytics/tracker present
  const layoutHasAnalytics = layoutTsx.includes('31.97.56.148') || layoutTsx.includes('googletagmanager') || layoutTsx.includes('plausible') || layoutTsx.includes('posthog')
  checks.push({ id: 'analytics', pass: layoutHasAnalytics })

  // 20. Freemium gate: not hard-gating all pages behind auth
  const hasGlobalAuthWall = appContains('(app)/layout.tsx', "redirect('/login')") || fileContains(dir, 'middleware.ts', "redirect('/login')")
  checks.push({ id: 'freemium_gate', pass: !hasGlobalAuthWall })

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
