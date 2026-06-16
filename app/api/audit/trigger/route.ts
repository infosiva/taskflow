/**
 * POST /api/audit/trigger
 * Triggers portfolio QA audit for one or all projects.
 * Called by Hub dashboard "Run Audit" button.
 *
 * Body: { projects?: string[], secret: string }
 *   - projects: array of project names (omit = all 49)
 *   - secret: must match AUDIT_TRIGGER_SECRET env var
 *
 * What it does:
 * 1. Runs the 20-point static checklist per project (checklist-agent logic)
 * 2. Inserts/updates tasks in the Portfolio QA Audit TaskFlow board
 * 3. Streams progress back via SSE (text/event-stream) so Hub can show real-time status
 *
 * Each finding → qa-insert-task pattern (same board/group/column IDs)
 */
import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'

export const runtime = 'nodejs'
export const maxDuration = 300

const BOARD_ID = 'eb9b84b8-a900-4279-b126-bc8878a68402'
const GROUPS = {
  critical: 'b9d6f298-6284-4c2a-b748-2c409c972bbc',
  high:     'b9d6f298-6284-4c2a-b748-2c409c972bbc',
  medium:   'a8a0cb75-63fa-4d34-9c90-95fd1add99d9',
  low:      'a8a0cb75-63fa-4d34-9c90-95fd1add99d9',
  pass:     'a00131c8-a403-48e6-ba3c-50c764bdb893',
}
const COLS = {
  project:   '67691843-97c2-4306-98e4-253a1eadf76a',
  url:       'e2f481cd-f19e-4481-958c-0a1dedc9c77d',
  issueType: '27132f1e-cb22-464b-aac1-87ce306950bb',
  severity:  '7872927a-85c9-4857-9112-4718767e412e',
  notes:     '31e875c9-a800-4d3e-a1df-280007b5ddab',
}

const ALL_PROJECTS = [
  'kwizzo','speakiq','resumevault','draftcal','trackwealth','roamplan','worldtrends',
  'myvitals','aicoachlab','neuralos','pixelforge','agenttrace','agencyos','ai-jobs-portal',
  'ai-resume-screener','ai-social-content','ai-toolkit','anylocal','billslash','bookingcall',
  'campaignforge','clawdbotai','clipforge-ai','complybuddy','firstline','homecanvas','hub',
  'idea-agent','invoicemint','mandirates','meetscribe','nammatamil','outreach-crm','parceliq',
  'pdfideas','photorestore','playsmart','protoforge','quicktech','quizbites','quizbytesdaily',
  'replydesk','rideflow','tutiq','vidrush','voicejournal','weekendai','yt-portal','zerostaff',
]

const PROJECTS_DIR = process.env.PROJECTS_DIR || '/root/agents'

// ── Checklist logic (mirrors checklist-agent.ts) ──────────────────────────

function fileExists(dir: string, rel: string) {
  return fs.existsSync(path.join(dir, rel))
}
function fileContains(dir: string, rel: string, needle: string) {
  try { return fs.readFileSync(path.join(dir, rel), 'utf8').includes(needle) } catch { return false }
}
function appRoot(dir: string) {
  if (fs.existsSync(path.join(dir, 'src/app'))) return path.join(dir, 'src/app')
  if (fs.existsSync(path.join(dir, 'app'))) return path.join(dir, 'app')
  const mono = path.join(dir, 'apps/dashboard/src/app')
  if (fs.existsSync(mono)) return mono
  return path.join(dir, 'app')
}
function searchDirs(dir: string) {
  return [
    path.join(dir,'app'), path.join(dir,'src/app'),
    path.join(dir,'lib'), path.join(dir,'src/lib'),
    path.join(dir,'apps/dashboard/src/app'), path.join(dir,'apps/dashboard/src/lib'),
    path.join(dir,'apps/dashboard/src/components'), path.join(dir,'components'), path.join(dir,'src/components'),
  ].filter(d => fs.existsSync(d))
}
function grepR(dir: string, pattern: string) {
  try {
    const t = searchDirs(dir)
    if (!t.length) return false
    const r = execFileSync('grep', ['-rl','-F',pattern,...t], { encoding:'utf8', stdio:['pipe','pipe','pipe'] })
    return r.trim().length > 0
  } catch { return false }
}
function grepRE(dir: string, pattern: string) {
  try {
    const t = searchDirs(dir)
    if (!t.length) return false
    const r = execFileSync('grep', ['-rlE',pattern,...t], { encoding:'utf8', stdio:['pipe','pipe','pipe'] })
    return r.trim().length > 0
  } catch { return false }
}

function runChecklist(project: string): { id: string; pass: boolean; detail?: string }[] {
  const dir = path.join(PROJECTS_DIR, project)
  if (!fs.existsSync(dir)) return [{ id: 'dir_exists', pass: false, detail: 'Project dir not found on this server' }]

  const appDir = appRoot(dir)
  const isAppRoot = (rel: string) => fs.existsSync(path.join(appDir, rel))
  const appContains = (rel: string, needle: string) => {
    try { return fs.readFileSync(path.join(appDir, rel), 'utf8').includes(needle) } catch { return false }
  }
  const monoPublic = path.join(dir, 'apps/dashboard/public')

  const checks = [
    { id: 'sitemap',              pass: isAppRoot('sitemap.ts') || isAppRoot('sitemap.tsx') },
    { id: 'robots',               pass: fileExists(dir,'public/robots.txt') || fs.existsSync(path.join(monoPublic,'robots.txt')) },
    { id: 'og_png',               pass: fileExists(dir,'public/og.png') || fs.existsSync(path.join(monoPublic,'og.png')) },
    { id: 'metadataBase',         pass: appContains('layout.tsx','metadataBase') },
    { id: 'json_ld',              pass: appContains('layout.tsx','application/ld+json') || appContains('layout.tsx','SchemaOrg') || grepR(dir,'application/ld+json') },
    { id: 'no_fake_stats',        pass: !['10,000 users','50,000','100,000 users','4.9/5','★★★★★'].some(p => { try { return fs.readFileSync(path.join(appDir,'page.tsx'),'utf8').includes(p) } catch { return false } }) },
    { id: 'chatbot',              pass: fileExists(dir,'components/FloatingChatWrapper.tsx') || fileExists(dir,'src/components/FloatingChatWrapper.tsx') || grepR(dir,'FloatingChat') || grepR(dir,'ChatWidget') },
    { id: 'feedback',             pass: grepR(dir,'FeedbackWidget') || grepR(dir,'feedback-widget') },
    { id: 'rate_limit',           pass: grepR(dir,'checkRateLimit') || grepR(dir,'rateLimit') },
    { id: 'no_hardcoded_keys',    pass: !(grepRE(dir,"process\\.env\\.[A-Z_]+ \\|\\| ['\"]sk-") || grepRE(dir,"process\\.env\\.[A-Z_]+ \\|\\| ['\"]gsk_")) },
    { id: 'no_env_committed',     pass: (() => { try { const r = execFileSync('git',['ls-files','.env'],{cwd:dir,encoding:'utf8',stdio:['pipe','pipe','pipe']}); return r.trim().length === 0 } catch { return true } })() },
    { id: 'package_json',         pass: fileExists(dir,'package.json') },
    { id: 'app_router',           pass: fs.existsSync(appDir) },
    { id: 'app_layout',           pass: isAppRoot('layout.tsx') },
    { id: 'no_fake_press',        pass: !['CNN','Forbes','Guardian','WIRED','TechCrunch'].some(p => { try { return fs.readFileSync(path.join(appDir,'page.tsx'),'utf8').includes(p) } catch { return false } }) },
    { id: 'no_landing_auth_wall', pass: !appContains('page.tsx',"redirect('/login')") && !appContains('page.tsx','redirect("/login")') },
    { id: 'ai_fallback',          pass: grepR(dir,'GROQ_API_KEY') || fileExists(dir,'lib/ai.ts') || fileExists(dir,'src/lib/ai.ts') },
    { id: 'keyword_title',        pass: (() => { try { return fs.readFileSync(path.join(appDir,'layout.tsx'),'utf8').includes('title:') } catch { return false } })() },
    { id: 'analytics',            pass: (() => { try { const l = fs.readFileSync(path.join(appDir,'layout.tsx'),'utf8'); return l.includes('31.97.56.148')||l.includes('googletagmanager')||l.includes('plausible')||l.includes('posthog') } catch { return false } })() },
    { id: 'freemium_gate',        pass: !appContains('(app)/layout.tsx',"redirect('/login')") && !fileContains(dir,'middleware.ts',"redirect('/login')") },
  ]
  return checks
}

function severity(fails: string[]): string {
  if (fails.includes('dir_exists') || fails.includes('sitemap') || fails.includes('robots')) return 'critical'
  if (fails.length >= 4) return 'critical'
  if (fails.length >= 3 || fails.includes('chatbot') || fails.includes('ai_fallback')) return 'high'
  if (fails.length >= 2) return 'medium'
  if (fails.length === 1) return 'low'
  return 'pass'
}

// ── Insert task to TaskFlow board ─────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function upsertTask(sql: any, project: string, url: string, score: string, fails: string[], notes: string) {
  const sev = severity(fails)
  const groupId = GROUPS[sev as keyof typeof GROUPS] ?? GROUPS.medium
  const emoji = sev === 'critical' ? '🔴' : sev === 'high' ? '🟠' : sev === 'medium' ? '🟡' : sev === 'low' ? '🔵' : '✅'
  const title = `${emoji} ${project} — ${score} | fails: ${fails.length === 0 ? 'none' : fails.join(', ')}`

  // Delete old qa-bot task for this project on this board
  await sql`DELETE FROM tasks WHERE board_id = ${BOARD_ID} AND created_by = 'qa-bot' AND title ILIKE ${'%' + project + ' —%'}`

  const posRows = await sql`SELECT COALESCE(MAX(position),0) as pos FROM tasks WHERE group_id = ${groupId}` as { pos: number }[]
  const [{ pos }] = posRows
  const [task] = await sql`
    INSERT INTO tasks (group_id, board_id, title, position, created_by)
    VALUES (${groupId}, ${BOARD_ID}, ${title}, ${Number(pos) + 1000}, 'qa-bot')
    RETURNING id
  `
  const cells = [
    { colId: COLS.project,   value: project },
    { colId: COLS.url,       value: url },
    { colId: COLS.issueType, value: fails.length === 0 ? 'Audit Required' : 'Multiple Issues' },
    { colId: COLS.severity,  value: sev },
    { colId: COLS.notes,     value: notes },
  ]
  for (const c of cells) {
    await sql`INSERT INTO cell_values (task_id, column_id, value) VALUES (${task.id}, ${c.colId}, ${JSON.stringify(c.value)}) ON CONFLICT (task_id, column_id) DO UPDATE SET value = EXCLUDED.value`
  }
  return { taskId: task.id, severity: sev, title }
}

// ── Project URL map ───────────────────────────────────────────────────────

const PROJECT_URLS: Record<string, string> = {
  kwizzo: 'https://kwizzo.app', speakiq: 'https://speakiq.app', resumevault: 'https://resumevault.app',
  draftcal: 'https://draftcal.app', trackwealth: 'https://trackwealth.app', roamplan: 'https://roamplan.app',
  worldtrends: 'https://worldtrends.today', myvitals: 'https://myvitals.app', aicoachlab: 'https://aicoachlab.app',
  neuralos: 'https://neuralagent.app', pixelforge: 'https://arcadeforge.app', agenttrace: 'https://agentlogs.app',
  agencyos: 'https://agencyos.app', 'ai-jobs-portal': 'https://aijobsportal.app',
  'ai-resume-screener': 'https://ai-resume-screener.vercel.app', 'ai-social-content': 'https://ai-social-content.vercel.app',
  'ai-toolkit': 'https://aitoolkit.app', anylocal: 'https://anylocal.app', billslash: 'https://billslash.app',
  bookingcall: 'https://bookingcall.app', campaignforge: 'https://campaignforge.app',
  clawdbotai: 'https://clawdbotai.tech', 'clipforge-ai': 'https://clipforge.ai',
  complybuddy: 'https://complybuddy.app', firstline: 'https://firstline.so', homecanvas: 'https://homecanvas.app',
  hub: 'https://ai-products-hub.vercel.app', 'idea-agent': 'https://idea-agent.vercel.app',
  invoicemint: 'https://invoicemint.cloud', mandirates: 'https://mandirates.app',
  meetscribe: 'https://meetscribe.app', nammatamil: 'https://nammatamil.live',
  'outreach-crm': 'https://outreach-crm-olive.vercel.app', parceliq: 'https://parceliq.app',
  pdfideas: 'https://pdfideas.vercel.app', photorestore: 'https://photorestore.app',
  playsmart: 'https://playsmart.app', protoforge: 'https://protofast.app',
  quicktech: 'https://quicktech.app', quizbites: 'https://quizbites.app',
  quizbytesdaily: 'https://quizbytes.dev', replydesk: 'https://replydesk.app',
  rideflow: 'https://rideflow.app', tutiq: 'https://tutiq.app', vidrush: 'https://vidrush.app',
  voicejournal: 'https://voicejournal.app', weekendai: 'https://weekendai.app',
  'yt-portal': 'https://yt-portal.vercel.app', zerostaff: 'https://zerostaff.app',
}

// ── Fix notes generator ───────────────────────────────────────────────────

function buildNotes(project: string, fails: string[]): string {
  if (fails.length === 0) return 'AUTO: All 20 checks pass.\nAUDIT NEEDED §21-§30: unique layout, unique colors, chatbot works, live demo, mobile PWA, upgrade scope, promo code, feedback DB, no-login triage.'
  const fixes: Record<string, string> = {
    sitemap:              'FIX: Create app/sitemap.ts listing all routes.',
    robots:               'FIX: Create public/robots.txt with Allow:/ + Sitemap URL.',
    og_png:               'FIX: Generate public/og.png 1200×630 with project name + tagline.',
    metadataBase:         'FIX: Add metadataBase: new URL("https://domain.app") to layout.tsx export const metadata.',
    json_ld:              'FIX: Add <script type="application/ld+json"> WebSite schema to layout.tsx.',
    no_fake_stats:        'FIX: Remove fabricated numbers/ratings from page.tsx hero section.',
    chatbot:              'FIX: Copy FloatingChatWrapper.tsx from kwizzo/components/, add topic-scoped system prompt, import in layout.tsx.',
    feedback:             'FIX: Copy FeedbackWidget.tsx from kwizzo/components/, add app/api/feedback/route.ts, render at bottom of page.tsx.',
    rate_limit:           'FIX: Add checkRateLimit(ip, 10) to every app/api/ route that calls an LLM.',
    no_hardcoded_keys:    'FIX: Remove hardcoded API key fallbacks — use empty string, never real key as default.',
    no_env_committed:     'FIX: Run git rm --cached .env && echo .env >> .gitignore && git commit.',
    ai_fallback:          'FIX: Copy lib/ai.ts from ai-platform-template/lib/ai.ts. Update imports.',
    keyword_title:        'FIX: Add keyword-rich title in layout.tsx metadata: "Brand — Category Descriptor".',
    analytics:            'FIX: Add VPS tracker script or Plausible snippet to app/layout.tsx.',
    freemium_gate:        'FIX: Remove auth redirect from middleware.ts or (app)/layout.tsx. Gate only save/export routes.',
    no_fake_press:        'FIX: Remove CNN/Forbes/Guardian press logos unless actually featured.',
    no_landing_auth_wall: 'FIX: Landing page must not redirect to /login. Move auth check to (app) routes only.',
  }
  const lines = [`AUTO SCORE: ${20 - fails.length}/20 | FAILS: ${fails.join(', ')}`]
  for (const f of fails) lines.push(fixes[f] ?? `FIX ${f}: check manually.`)
  lines.push('AUDIT NEEDED §21-§30: unique layout, unique colors, chatbot works, live demo, mobile PWA, upgrade scope, promo code, feedback DB, no-login triage.')
  return lines.join('\n')
}

// ── POST handler ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-audit-secret') ?? ''
  if (secret !== (process.env.AUDIT_TRIGGER_SECRET ?? '')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const requestedProjects: string[] = body.projects?.length ? body.projects : ALL_PROJECTS
  const projects = requestedProjects.filter(p => ALL_PROJECTS.includes(p))

  const sql = neon(process.env.DATABASE_URL!)

  // Stream SSE so Hub can show real-time progress
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      send({ type: 'start', total: projects.length, projects })

      let passed = 0, failed = 0
      for (const project of projects) {
        try {
          const checks = runChecklist(project)
          const fails = checks.filter(c => !c.pass).map(c => c.id)
          const score = `${checks.length - fails.length}/${checks.length}`
          const url = PROJECT_URLS[project] ?? ''
          const notes = buildNotes(project, fails)

          const { taskId, severity: sev, title } = await upsertTask(sql, project, url, score, fails, notes)

          if (fails.length === 0) passed++; else failed++
          send({ type: 'progress', project, score, fails, severity: sev, taskId, title })
        } catch (err) {
          send({ type: 'error', project, error: String(err) })
        }
      }

      send({ type: 'complete', passed, failed, total: projects.length })
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

// GET — returns current audit status for all projects
export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-audit-secret') ?? ''
  if (secret !== (process.env.AUDIT_TRIGGER_SECRET ?? '')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const sql = neon(process.env.DATABASE_URL!)
  const tasks = await sql`
    SELECT t.id, t.title, t.group_id, t.created_at,
      (SELECT value FROM cell_values WHERE task_id = t.id AND column_id = '67691843-97c2-4306-98e4-253a1eadf76a' LIMIT 1) as project,
      (SELECT value FROM cell_values WHERE task_id = t.id AND column_id = '7872927a-85c9-4857-9112-4718767e412e' LIMIT 1) as severity
    FROM tasks t
    WHERE t.board_id = ${BOARD_ID} AND t.created_by = 'qa-bot'
    ORDER BY t.created_at DESC
  `
  return NextResponse.json({ tasks, total: tasks.length })
}
