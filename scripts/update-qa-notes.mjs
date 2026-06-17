import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const BOARD_ID = 'eb9b84b8-a900-4279-b126-bc8878a68402';
const NOTES_COL_ID = '31e875c9-a800-4d3e-a1df-280007b5ddab';
const SEVERITY_COL_ID = '7872927a-85c9-4857-9112-4718767e412e';

// Get all tasks
const tasks = await sql`SELECT id, title FROM tasks WHERE board_id = ${BOARD_ID}`;
const byKey = {};
tasks.forEach(t => {
  // key = word after emoji (e.g. "🔴 hub" -> "hub", "🟡 agencyos" -> "agencyos")
  const parts = t.title.split(' ');
  const key = parts[1] || parts[0];
  byKey[key] = t.id;
});

// Browser audit findings per project
const findings = {
  // WAVE 0 — DNS/deploy broken
  'complybuddy':      { severity: '🔴 CRITICAL', notes: 'DNS dead (dig returns empty). Site unreachable. Fix: point complybuddy.app to Vercel in registrar. Also fix metadataBase in code (wrong: complyscan.app → complybuddy.app). Wave 0 priority.' },
  'zerostaff':        { severity: '🔴 CRITICAL', notes: 'DNS dead. Site unreachable. Fix: registrar DNS → Vercel. Add app/not-found.tsx. Rename package.json name from zerostaff-tmp. Wave 0 priority.' },
  'replydesk':        { severity: '🔴 CRITICAL', notes: 'DNS dead. metadataBase wrong (switchboard-ai.vercel.app). Missing og.png, FeedbackWidget, privacy page. Fix: DNS + metadataBase + og.png + feedback + /privacy. Wave 0.' },
  'speakiq':          { severity: '🔴 CRITICAL', notes: 'HTTP 404 DEPLOYMENT_NOT_FOUND. Domain on infosiva account — needs relink + redeploy. Wave 0 priority.' },
  'mandirates':       { severity: '🔴 CRITICAL', notes: 'DEPLOYMENT_NOT_FOUND. Fix: vswitch sivaprakasam && vlink, then redeploy. Also missing feedback, rate_limit. Wave 0.' },
  'firstline':        { severity: '🔴 CRITICAL', notes: 'ECONNREFUSED — not deployed. Check registrar renewal, deploy/link to Vercel. Also missing json_ld, feedback, analytics. Wave 0.' },
  'yt-portal':        { severity: '🔴 CRITICAL', notes: 'Stale Vercel deployment — 404 DEPLOYMENT_NOT_FOUND. Fix: cd yt-portal && vercel --prod. Also fix metadataBase URL, add AdSense meta, add rate limit. Wave 0.' },
  'parceliq':         { severity: '🔴 CRITICAL', notes: 'DNS → AWS IPs (SSL fail). Remove AWS A records, point parceliq.app → 76.76.21.21 (Vercel). Then add rate limit to /api/compare. Wave 0.' },
  'rideflow':         { severity: '🔴 CRITICAL', notes: 'Domain parked by GoDaddy — rideflow.app redirects to GoDaddy lander. Reclaim domain: check registrar ownership, renew if expired, reconnect to Vercel. Also missing FeedbackWidget, rate limit. Wave 0.' },
  'meetscribe':       { severity: '🔴 CRITICAL', notes: 'Cloudflare 521 (origin not responding). Fix: CF dashboard → SSL mode → Full (not Full Strict). Vercel origin meetscribe.vercel.app is healthy. Also add FeedbackWidget, rate limit. Wave 0.' },
  'homecanvas':       { severity: '🔴 CRITICAL', notes: 'Cloudflare 403 WAF blocking. Fix: CF Security → disable Under Attack Mode / WAF rule. Also add FeedbackWidget, rate limit. package.json name = agencyos (rename). Wave 0.' },
  'voicejournal':     { severity: '🔴 CRITICAL', notes: 'ECONNREFUSED — not deployed. Redeploy to Vercel. Also missing feedback, rate_limit. Wave 0.' },
  'clipforge-ai':     { severity: '🔴 CRITICAL', notes: 'Timeout on all requests — DNS/deploy failure. Check registrar + redeploy. Wave 0.' },
  'photorestore':     { severity: '🔴 CRITICAL', notes: 'ECONNREFUSED (HTTP 000). Domain not connected. Check DNS + Vercel link. Also missing og_png, chatbot, feedback, rate_limit, ai_fallback. Wave 0.' },

  // WAVE 1 — live but product broken
  'quicktech':        { severity: '🔴 CRITICAL', notes: 'Bare login at / — no landing page for visitors. Fix: build app/page.tsx hero, move auth to /login. Also missing chatbot, feedback, rate_limit. Wave 1.' },
  'playsmart':        { severity: '🔴 CRITICAL', notes: 'Blank HTML shell, no SSR content. Fix: add SSR landing page, meta tags. Missing feedback, rate_limit, analytics. Wave 1.' },
  'myvitals':         { severity: '🔴 CRITICAL', notes: '100% auth-gated. /today 404. Fix: add zero-auth demo on /, fix /today route. Wave 1.' },
  'invoicemint':      { severity: '🔴 CRITICAL', notes: 'Serving wrong project — DealFlow codebase at invoicemint.cloud. Fix: redeploy correct codebase. Also missing feedback, rate_limit. Wave 1.' },
  'quizbytesdaily':   { severity: '🔴 CRITICAL', notes: 'No quizzes found — DB empty. Fix: seed question bank (50+ questions). Also purple bg (#faf5ff → #f0f9ff). Missing rate_limit. Wave 1.' },
  'idea-agent':       { severity: '🔴 CRITICAL', notes: 'Chinese-only UI, no English nav/branding. Fix: build proper English landing page with full UI. Missing rate_limit. Wave 1.' },
  'ai-social-content':{ severity: '🔴 CRITICAL', notes: 'Wrong project deployed — serving "Amazing Channel" (Bolt.new shell). Fix: redeploy correct ai-social-content codebase. Wave 1.' },
  'agencyos':         { severity: '🔴 CRITICAL', notes: 'Empty page, site appears down. Fix: check build + deploy. Also missing feedback. Wave 1.' },
  'ai-resume-screener':{ severity: '🔴 CRITICAL', notes: 'Empty page / broken render. Fix: fix build errors + redeploy. Missing feedback, rate_limit. Wave 1.' },
  'hub':              { severity: '🔴 CRITICAL', notes: 'Missing og.png, FeedbackWidget, rate_limit on AI routes, ai_fallback cascade. Also Hub itself was 404 earlier — verify deployment live. Wave 2.' },

  // WAVE 2 — live, high severity
  'pdfideas':         { severity: '🟠 HIGH', notes: '§Z3 VIOLATION: bg #1e1b2e is dark purple (banned). Fix: globals.css --background → #f8fafc, keep fuchsia accent. Also missing rate_limit on /api/generate and /api/chat. Wave 2.' },
  'tutiq':            { severity: '🟠 HIGH', notes: 'Footer has expired Vercel preview URLs (404). No chatbot. Fix: replace preview URLs with production domains, add FloatingChatWrapper. Wave 2.' },
  'trackwealth':      { severity: '🟠 HIGH', notes: '/privacy /terms /about all return 404. Fix: create 3 pages. Wave 2.' },
  'roamplan':         { severity: '🟠 HIGH', notes: '/privacy /terms 404. No chatbot. No FeedbackWidget. Fix: create pages + add chatbot + add FeedbackWidget. Wave 2.' },
  'draftcal':         { severity: '🟠 HIGH', notes: '/privacy 404. Dead footer link. Fix: create /privacy page, fix dead link. Wave 2.' },
  'aicoachlab':       { severity: '🟠 HIGH', notes: 'Near-empty HTML shell, broken SSR nav. Fix: add proper nav/footer, fix SSR. Wave 2.' },
  'neuralos':         { severity: '🟠 HIGH', notes: '/privacy /terms 404. No zero-auth demo. Fix: create pages, add inline demo. Wave 2.' },
  'protoforge':       { severity: '🟠 HIGH', notes: '/browse 404 (dead nav link). No footer. Fix: remove /browse nav link, add footer with privacy/terms. Missing feedback, rate_limit. Wave 2.' },
  'agenttrace':       { severity: '🟠 HIGH', notes: '/features 404 (dead nav link). No chatbot. Fix: remove dead nav link, add FloatingChatWrapper. Wave 2.' },
  'ai-jobs-portal':   { severity: '🟠 HIGH', notes: 'Placeholder stats ("..."). Core action gated. Fix: remove placeholder stats, add zero-auth browse. Missing feedback, rate_limit, ai_fallback. Wave 2.' },
  'outreach-crm':     { severity: '🟠 HIGH', notes: 'No navbar, no footer, no chatbot, no FeedbackWidget. Fix: add nav + footer + FloatingChatWrapper + FeedbackWidget. Missing sitemap, robots, json_ld. Wave 2.' },
  'billslash':        { severity: '🟠 HIGH', notes: 'No chatbot. No rate_limit. No inline landing demo. Fix: add FloatingChatWrapper + rate limit on all AI routes + add demo section. Wave 2.' },

  // WAVE 3 — universal fixes (already have some auto-checklist notes, supplement)
  'nammatamil':       { severity: '🟡 MEDIUM', notes: 'Missing og.png (public/ empty of images). Missing sitemap.ts. No rate limit on chatbot route. No AdSense meta. Fix: generate og.png 1200x630, add sitemap.ts, add AdSense meta, add rate limit. Wave 3.' },
  'clawdbotai':       { severity: '🟡 MEDIUM', notes: 'No rate limit on /api/chat. AdSense uses old script embed (missing meta tag). Fix: add checkRateLimit(ip, 10) to /api/chat, replace script with <meta name="google-adsense-account">. Wave 3.' },
  'quizbites':        { severity: '🟡 MEDIUM', notes: 'Chatbot missing (FloatingChatWrapper not in layout). Fix: add FloatingChatWrapper with quiz-scoped system prompt. Wave 3.' },
  'pixelforge':       { severity: '🟡 MEDIUM', notes: 'No chatbot. Missing OG meta, JSON-LD. Fix: add chatbot FAB, og.png, JSON-LD to layout. Wave 3.' },
  'resumevault':      { severity: '🟡 MEDIUM', notes: 'Missing FeedbackWidget. No rate limit on AI routes. Fix: add FeedbackWidget + rate limit. Wave 3.' },
  'worldtrends':      { severity: '🟡 MEDIUM', notes: 'Missing FeedbackWidget. No rate limit. Fix: add both. Wave 3.' },
  'bookingcall':      { severity: '🟡 MEDIUM', notes: 'Missing FeedbackWidget. No rate limit. Fix: add both. Wave 3.' },
  'kwizzo':           { severity: '🟡 MEDIUM', notes: 'Mobile: blank white area above fold (hero content below viewport). Fix: adjust hero padding/min-height for 375px. Wave 3.' },
  'weekendai':        { severity: '🟡 MEDIUM', notes: 'Missing FeedbackWidget, rate_limit. Fix: add both. Wave 3.' },
  'anylocal':         { severity: '🟡 MEDIUM', notes: 'Missing FeedbackWidget. Fix: add FeedbackWidget. Wave 3.' },
  'campaignforge':    { severity: '🟡 MEDIUM', notes: 'Missing FeedbackWidget. Fix: add FeedbackWidget. Wave 3.' },
  'vidrush':          { severity: '🟡 MEDIUM', notes: 'Missing FeedbackWidget. Fix: add FeedbackWidget. Wave 3.' },
  'ai-toolkit':       { severity: '🟡 MEDIUM', notes: 'Missing FeedbackWidget, rate_limit. Fix: add both. Wave 3.' },
};

let updated = 0;
for (const [key, { severity, notes }] of Object.entries(findings)) {
  const taskId = byKey[key];
  if (!taskId) { console.log('NOT FOUND:', key); continue; }

  // Upsert Notes
  await sql`
    INSERT INTO cell_values (id, task_id, column_id, value, updated_at)
    VALUES (gen_random_uuid(), ${taskId}, ${NOTES_COL_ID}, ${notes}, NOW())
    ON CONFLICT (task_id, column_id) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
  `;

  // Upsert Severity
  await sql`
    INSERT INTO cell_values (id, task_id, column_id, value, updated_at)
    VALUES (gen_random_uuid(), ${taskId}, ${SEVERITY_COL_ID}, ${severity}, NOW())
    ON CONFLICT (task_id, column_id) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
  `;

  // Move critical wave 0+1 items to Critical group
  if (severity === '🔴 CRITICAL') {
    const critGroup = await sql`SELECT id FROM groups WHERE board_id = ${BOARD_ID} AND name LIKE '%Critical%' LIMIT 1`;
    if (critGroup.length) {
      await sql`UPDATE tasks SET group_id = ${critGroup[0].id} WHERE id = ${taskId}`;
    }
  }

  updated++;
  process.stdout.write('.');
}

console.log('\nUpdated:', updated, 'tasks');
