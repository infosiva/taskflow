/**
 * Bulk insert redesign planning cards for all 33 portfolio projects.
 * Research-driven: each card has category, unique theme, layout type,
 * animated demo spec, hero headline, and top 3 changes.
 *
 * Run: node --env-file=.env.local scripts/bulk-redesign-plan.mjs
 */
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

const BOARD_ID = 'd2590531-8c6b-4991-a068-73ca01175ad0';
const GROUPS = {
  p0: 'ccd2799e-3847-40df-af9c-062c377ce780',
  p1: '853e53af-801f-450f-92a9-4bebadf2b896',
  p2: '9a93a58c-df1d-4948-afe3-562d481a8091',
};
const COLS = {
  project:  '30b47e30-0671-49d5-b770-fb2622806691',
  url:      'f3716177-16a6-4d22-9eea-544f1fc5a5fe',
  category: 'b2975ba4-9fa7-4394-9002-8a0e8387c317',
  bg:       '8c23839d-f303-49c0-9a66-0a320008c89a',
  accent:   'f36cf76f-3455-40a6-99be-7fe21cdfc07c',
  layout:   '2a4e7369-1e58-4dd5-a47e-26c518f461df',
  demo:     'e018d723-02a4-429a-9cc1-767a0f2ed160',
  headline: 'bc11c525-024d-4615-bb68-a821135a6744',
  changes:  '94fa36e0-ddea-4356-ad82-59da609399fa',
  priority: '50ce7eba-cb68-4a25-b196-3dbd6a46dc74',
};

// Skills available for each change type:
// Design: /design-shotgun /design-html /ui-ux-pro-max /21st-registry /emil-design-eng /animate /transitions-dev
// Copy: /copywriting /marketing-psychology /taste-skill
// Research: /deep-research /perplexity-research /customer-research
// SEO: /seo-audit /fixing-metadata /fixing-accessibility
// Image: /fal-generate /image-gen
// Motion: /gsap-core /gsap-scrolltrigger /design-motion-principles /fixing-motion-performance

const projects = [
  // ── P0: ACTIVE COLLISIONS + MISSING CONTENT (fix this week) ──────────────────
  {
    project: 'quizbites', url: 'https://quizbites.app', priority: 'p0',
    category: 'Education/Quiz', bg: '#fefce8', accent: '#ca8a04',
    layout: 'Split (hero + demo panel)',
    demo: 'Topic input typewriter "Black holes" → 3 quiz cards slide in → correct option flashes green → score ticks up → new topic cycles. 3.5s per cycle. Skills: /animate /transitions-dev',
    headline: 'Type a topic. Get a quiz. Learn it.',
    changes: '1. Build animated QuizDemoPanel component (/animate + /transitions-dev card-flip pattern) | 2. Yellow-tint theme already done — wire --accent to all components | 3. Hero copy rewrite via /copywriting + /marketing-psychology'
  },
  {
    project: 'invoicemint', url: 'https://invoicemint.cloud', priority: 'p0',
    category: 'Finance/Billing', bg: '#f0fdf4', accent: '#059669',
    layout: 'Split (hero + demo panel)',
    demo: '5-act loop: project card → Generate Invoice click → fields type one-by-one → Sent ✓ badge → +7d Overdue → AI chaser types → Payment received £2,400 confetti. 9s loop. Skills: /animate /gsap-timeline',
    headline: 'Invoice sent. Payment chased. You did nothing.',
    changes: '1. Build 5-act animated InvoiceDemoLoop (/animate + /gsap-timeline) | 2. Green-tint theme + emerald accent applied | 3. Hero headline + CTA rewrite (/copywriting) | 4. Remove Stripe guard on build via lazy init'
  },
  {
    project: 'aicoachlab', url: 'https://aicoachlab.app', priority: 'p0',
    category: 'Health/Wellness', bg: '#fff7ed', accent: '#ea580c',
    layout: 'Split (hero + demo panel)',
    demo: 'AI question appears typewriter → candidate types answer → "Evaluating..." shimmer 1.5s → Feedback card slides in with score ring + 3 improvement tips. 6s cycle. Skills: /animate /transitions-dev panel pattern',
    headline: 'Practice interviews until you nail them.',
    changes: '1. Build animated InterviewDemoPanel (/animate) | 2. Orange-tint theme wired to components | 3. Hero copy: outcome-first not feature-first (/copywriting + /marketing-psychology)'
  },
  {
    project: 'replydesk', url: 'https://replydesk.app', priority: 'p0',
    category: 'Productivity/SaaS', bg: '#f8f9ff', accent: '#4f46e5',
    layout: 'Split (hero + demo panel)',
    demo: 'Raw ticket arrives left pane → "Drafting..." shimmer 1.5s → AI reply types word-by-word right pane → Tone badge (Empathetic) appears → Edit + Send buttons fade in. 6s loop. Skills: /animate /transitions-dev text-swap pattern',
    headline: 'Draft perfect support replies in 4 seconds.',
    changes: '1. Build TicketDemoPanel with before/after animation (/animate + /transitions-dev) | 2. Indigo theme applied to components | 3. Landing page hero + CTA (/design-html canvas + /copywriting)'
  },
  // ── P1: THEME ASSIGNED BUT LAYOUT/DEMO MISSING ──────────────────────────────
  {
    project: 'tutiq', url: 'https://tutiq.app', priority: 'p1',
    category: 'Education/Quiz', bg: '#f0f9ff', accent: '#0284c7',
    layout: 'Split (hero + demo panel)',
    demo: 'Student types subject "Algebra" → AI tutor card appears with explanation → comprehension check question → student selects → ✓ Correct! → Next concept. 5s cycle. Skills: /animate /transitions-dev card pattern',
    headline: 'Your AI tutor explains anything in 60 seconds.',
    changes: '1. Build TutorDemoPanel animated (/animate) | 2. Verify sky-blue accent wired throughout | 3. SEO: metadataBase + keyword title (/seo-audit /fixing-metadata)'
  },
  {
    project: 'speakiq', url: 'https://speakiq.app', priority: 'p1',
    category: 'Education/Quiz', bg: '#fdf4ff', accent: '#9333ea',
    layout: 'Split (hero + demo panel)',
    demo: 'Mic button pulses → waveform bars animate → transcript types in real time → accent score badge appears → pronunciation tip card slides in. 5s loop. Skills: /animate /design-motion-principles waveform',
    headline: 'Speak any language like you grew up in it.',
    changes: '1. Violet-tint theme collision fix done ✓ — now wire accent to components | 2. Build waveform + transcript demo (/animate) | 3. Hero redesign via /design-html canvas'
  },
  {
    project: 'resumevault', url: 'https://resumevault.app', priority: 'p1',
    category: 'AI Infra', bg: '#0c0f1a', accent: '#7c3aed',
    layout: 'Dark terminal',
    demo: 'Resume fields populate line-by-line (name, experience, skills) → ATS score ring fills 0→91% → "Optimised for Google" badge → Download button pulses. 6s loop. Skills: /animate ring fill + /gsap-scrolltrigger for sections',
    headline: 'Resume that beats ATS in 90 seconds.',
    changes: '1. Build ATS score ring animation (/animate Framer Motion spring) | 2. --accent #7c3aed alias added ✓ — wire to CTA buttons | 3. Hero copy outcome-first (/copywriting)'
  },
  {
    project: 'draftcal', url: 'https://draftcal.app', priority: 'p1',
    category: 'Productivity/SaaS', bg: '#fffbf5', accent: '#d97706',
    layout: 'Split (hero + demo panel)',
    demo: 'Calendar grid appears → "Generate October content" click → post cards populate slots with typing animation → one card expands showing full draft → Schedule button glows. 6s loop. Skills: /animate /transitions-dev card-resize pattern',
    headline: 'One click fills your content calendar for a month.',
    changes: '1. Build CalendarDemoPanel (/animate + /transitions-dev) | 2. Amber theme wired ✓ — update button + card styles | 3. Mobile snap-scroll demo strip (4 cards lg:hidden)'
  },
  {
    project: 'trackwealth', url: 'https://trackwealth.app', priority: 'p1',
    category: 'Finance/Billing', bg: '#0b1420', accent: '#f59e0b',
    layout: 'Dark terminal',
    demo: 'Portfolio dashboard: 3 metric cards count up (£12,400 → £18,900 / ROI 14.2% → 22.1% / Risk LOW→MED) → Sparkline chart draws → AI insight card types "Rebalance tech exposure". 5s loop. Skills: /animate count-up + /d3-visualization sparkline',
    headline: 'Watch your wealth compound. Track every pound.',
    changes: '1. Dark navy theme wired ✓ — now build metric count-up demo (/animate + /d3-visualization) | 2. Nav logo: Track•Wealth in gold | 3. Hero copy: outcome numbers (/marketing-psychology anchoring)'
  },
  {
    project: 'myvitals', url: 'https://myvitals.app', priority: 'p1',
    category: 'Health/Wellness', bg: '#f0fdfa', accent: '#0d9488',
    layout: 'Split (hero + demo panel)',
    demo: 'Health score ring fills 0→87% → 3 metric cards count up (Steps 8,240 / Sleep 7.3h / Mood ★★★★) → AI insight slides in "Walk 1,200 more steps today". Framer Motion spring({ stiffness:80, damping:20 }). Skills: /animate',
    headline: 'Know your health score in 60 seconds a day.',
    changes: '1. Build HealthScoreRing animated component (/animate spring physics) | 2. Teal theme + accent wired ✓ | 3. /taste-skill quality check before push'
  },
  {
    project: 'voicejournal', url: 'https://voicejournal.vercel.app', priority: 'p1',
    category: 'Health/Wellness', bg: '#f5f0ff', accent: '#8b5cf6',
    layout: 'Split (hero + demo panel)',
    demo: 'Mic button pulses purple → waveform bars animate → transcript types → mood auto-detected badge (😌 Calm) → journal entry saved card. 5s loop. Skills: /animate /design-motion-principles pulse-ring',
    headline: 'Speak your thoughts. AI journaling.',
    changes: '1. Purple accent fully wired to components ✓ | 2. Build WaveformDemoPanel (/animate pulse-ring) | 3. CTA copy rewrite (/copywriting emotional trigger)'
  },
  {
    project: 'pdfideas', url: 'https://pdfideas.vercel.app', priority: 'p1',
    category: 'Productivity/SaaS', bg: '#fafafe', accent: '#6366f1',
    layout: 'Split (hero + demo panel)',
    demo: 'PDF drops in → processing shimmer → idea cards appear one-by-one (5 cards with lightbulb icons) → user clicks "Explore" on one → full insight expands. 5s loop. Skills: /animate /transitions-dev card-resize',
    headline: 'Drop a PDF. Get 50 ideas in 10 seconds.',
    changes: '1. Indigo theme wired ✓ | 2. Build PDFIdeaCardDemo animated (/animate + /transitions-dev) | 3. Nav: PDF•Ideas logo with indigo accent'
  },
  {
    project: 'roamplan', url: 'https://roamplan.app', priority: 'p1',
    category: 'Travel/Local', bg: '#f0fdf4', accent: '#059669',
    layout: 'Split (hero + demo panel)',
    demo: 'Search box: "Tokyo 5 days" types → itinerary cards fly in (Day 1, Day 2, Day 3...) → map pin animation → total cost badge. 5s loop. Skills: /animate /transitions-dev slide-up stagger',
    headline: 'Plan your perfect trip in 30 seconds.',
    changes: '1. Build ItineraryDemoPanel with stagger (/animate + /transitions-dev) | 2. Verify green-tint theme | 3. Full-width centered hero variant (not split)'
  },
  {
    project: 'worldtrends', url: 'https://worldtrends.today', priority: 'p1',
    category: 'News/Trends', bg: '#f9fafb', accent: '#dc2626',
    layout: 'Centered hero',
    demo: 'Ticker tape of trending topics scrolls → Click topic → article cards appear → AI summary types below. Marquee + fade-in cards. Skills: /animate /gsap-scrolltrigger marquee',
    headline: 'What the world is talking about, right now.',
    changes: '1. Red accent wired to components | 2. Build live marquee trends demo (/animate /gsap-core) | 3. SEO: News schema JSON-LD (/fixing-metadata)'
  },
  {
    project: 'agenttrace', url: 'https://agentlogs.app', priority: 'p1',
    category: 'Dev Tools', bg: '#0c111a', accent: '#22d3ee',
    layout: 'Dark terminal',
    demo: 'Terminal panel: log lines stream in (timestamp + agent name + status) → span tree visualization → one error flashes red → "Resolved ✓" green. 400ms per log line. Skills: /animate typewriter + /gsap-timeline',
    headline: 'Debug AI agents in production. In real time.',
    changes: '1. Build LogStreamDemo component (/animate + /gsap-timeline) | 2. Cyan accent CSS vars added | 3. JetBrains Mono font for code/terminal elements'
  },
  {
    project: 'neuralos', url: 'https://neuralagent.app', priority: 'p1',
    category: 'AI Infra', bg: '#080d1a', accent: '#6366f1',
    layout: 'Dark terminal',
    demo: 'Neural agent graph animates (nodes connect) → task assigned → agents execute in parallel (3 bars fill) → result aggregated → "Done in 2.3s". Skills: /animate /threejs node graph or CSS grid',
    headline: 'Orchestrate AI agents. Ship faster.',
    changes: '1. Fix bg collision with zerostaff (use #080d1a vs #0b1120) | 2. Build AgentGraphDemo (/animate or /threejs) | 3. Indigo alias wired'
  },
  // ── P2: NEEDS RESEARCH + FULL REDESIGN (next wave) ──────────────────────────
  {
    project: 'flighttracker', url: 'https://flightbrain.app', priority: 'p2',
    category: 'Travel/Local', bg: '#f0fdf4', accent: '#059669',
    layout: 'Split (hero + demo panel)',
    demo: 'Flight search input → live results list → flight card expands with price history chart + "Book now" CTA. Skills: /animate /d3-visualization price chart',
    headline: 'Track any flight. Know when to book.',
    changes: '1. Rebuild broken deployment (site down) | 2. Green-tint travel theme | 3. Flight price chart demo (/d3-visualization)'
  },
  {
    project: 'billslash', url: 'https://billslash.app', priority: 'p2',
    category: 'Finance/Billing', bg: '#f0fdf4', accent: '#10b981',
    layout: 'Split (hero + demo panel)',
    demo: 'Upload bill → AI reads amount → "Negotiating..." shimmer → Before £89/mo → After £54/mo → Saved £420/yr badge. Skills: /animate /transitions-dev number-pop pattern',
    headline: 'Cut your bills in half. AI negotiates for you.',
    changes: '1. Before/after number animation (/transitions-dev number-pop) | 2. Emerald theme unique (not clashing with invoicemint — different bg lightness) | 3. Upload zone inline on hero'
  },
  {
    project: 'mandirates', url: 'https://mandirates.app', priority: 'p2',
    category: 'News/Trends', bg: '#fffbf5', accent: '#ea580c',
    layout: 'Centered hero',
    demo: 'Commodity cards: Tomato ₹28/kg → Onion ₹22/kg → Potato ₹18/kg with sparkline each. Update badge "Live prices". Skills: /animate /d3-visualization sparklines',
    headline: 'Live mandi prices for every farmer in India.',
    changes: '1. Renew data.gov.in API key (manual) | 2. Food/local orange theme | 3. Commodity price sparkline cards (/d3-visualization)'
  },
  {
    project: 'bookingcall', url: 'https://bookingcall.app', priority: 'p2',
    category: 'Productivity/SaaS', bg: '#ffffff', accent: '#2563eb',
    layout: 'Split (hero + demo panel)',
    demo: 'Phone rings animation → AI answers → transcript types → appointment slot selected → calendar invite sent badge. Skills: /animate /transitions-dev icon-swap phone→calendar',
    headline: 'AI answers your calls and books appointments.',
    changes: '1. Blue productivity theme | 2. Phone→calendar animation demo (/animate + /transitions-dev icon-swap) | 3. Social proof: types of businesses served'
  },
  {
    project: 'pixelforge', url: 'https://arcadeforge.app', priority: 'p2',
    category: 'Gaming', bg: '#0e0e16', accent: '#7c3aed',
    layout: 'Dark terminal',
    demo: 'Pixel art canvas loads → tiles render one-by-one → character sprite animates → "Export to Unity" button pulses. Skills: /animate /threejs canvas or CSS pixel grid',
    headline: 'Create pixel art games without coding.',
    changes: '1. Near-black + violet gaming theme | 2. Pixel canvas animation demo (/animate + CSS pixel grid) | 3. /image-gen for og.png hero image'
  },
  {
    project: 'clipforge', url: 'https://clipforge.ai', priority: 'p2',
    category: 'Media/Creative', bg: '#0a0a0f', accent: '#e879f9',
    layout: 'Dark terminal',
    demo: 'Video waveform scrubs → AI detects highlight moments (flash) → clip auto-trimmed → captions type over frame → Export button. Skills: /animate /gsap-timeline waveform',
    headline: 'AI finds your best moments. Auto-clips them.',
    changes: '1. Fix DNS: Namecheap A record 192.64.119.101 → 76.76.21.21 (manual) | 2. Fuchsia media theme | 3. Waveform clip demo (/animate /gsap-timeline)'
  },
  {
    project: 'yt-portal', url: 'https://yt-portal.vercel.app', priority: 'p2',
    category: 'Media/Creative', bg: '#0a0a0f', accent: '#f87171',
    layout: 'Centered hero',
    demo: 'YouTube URL input → thumbnail appears → AI summary types → key moments list → transcript download button. Skills: /animate /transitions-dev slide-up stagger',
    headline: 'Summarise any YouTube video in 10 seconds.',
    changes: '1. Red-on-black media theme (different from clipforge fuchsia) | 2. Video analysis demo (/animate) | 3. Fix broken deployment'
  },
  {
    project: 'aijobsportal', url: 'https://www.aijobsportal.app', priority: 'p2',
    category: 'AI Infra', bg: '#f8f9ff', accent: '#4338ca',
    layout: 'Split (hero + demo panel)',
    demo: 'Job search input → 3 matched job cards appear with match % badge → one expands showing AI fit analysis → Apply button. Skills: /animate /transitions-dev card-resize',
    headline: 'AI matches you to jobs before you even apply.',
    changes: '1. Indigo-2 theme (darker than replydesk #4f46e5) | 2. Job match card demo (/animate) | 3. SEO: JobPosting schema (/fixing-metadata)'
  },
  {
    project: 'ai-resume-screener', url: 'https://ai-resume-screener.vercel.app', priority: 'p2',
    category: 'AI Infra', bg: '#0c0f1a', accent: '#818cf8',
    layout: 'Dark terminal',
    demo: 'Resume upload → AI scan shimmer → score rings for 4 criteria fill → ranked candidates list appears → top candidate highlighted. Skills: /animate ring fill stagger',
    headline: 'Screen 100 resumes in 60 seconds. AI does it.',
    changes: '1. Dark violet-2 theme (lighter indigo vs resumevault) | 2. Candidate ranking animation (/animate stagger rings) | 3. Bulk upload CTA gated (freemium pattern)'
  },
  {
    project: 'protoforge', url: 'https://protofast.app', priority: 'p2',
    category: 'Dev Tools', bg: '#080d1a', accent: '#6366f1',
    layout: 'Dark terminal',
    demo: 'Code snippet types in left panel → live preview renders right panel in real time → "Export ZIP" button pulses. Skills: /animate typewriter + CSS split-screen',
    headline: 'Prototype any UI in 60 seconds. No Figma needed.',
    changes: '1. Dev tools dark theme (same bg as neuralos — differentiate with demo content not bg) | 2. Code typewriter + live preview demo (/animate) | 3. Inline code editor on landing (zero auth for core action)'
  },
  {
    project: 'idea-agent', url: 'https://idea-agent.vercel.app', priority: 'p2',
    category: 'Productivity/SaaS', bg: '#f9fafb', accent: '#7c3aed',
    layout: 'Centered hero',
    demo: 'Topic input "remote work tools" → spinning thinking → 6 idea cards appear in grid, each with icon + one-liner. Skills: /animate /transitions-dev scale-in stagger',
    headline: 'Get 20 validated business ideas in 30 seconds.',
    changes: '1. Light violet-3 theme (different from resumevault dark + speakiq violet-tint) | 2. Idea card grid animation (/animate stagger) | 3. Inline generator on landing'
  },
  {
    project: 'ai-toolkit', url: 'https://aitoolkit.app', priority: 'p2',
    category: 'Dev Tools', bg: '#0f172a', accent: '#38bdf8',
    layout: 'Centered hero',
    demo: 'Tool search input → category chips filter → tool cards filter animated → one tool expands with demo. Skills: /animate /transitions-dev filter animation',
    headline: 'Every AI tool worth using. Searchable.',
    changes: '1. GoDaddy DNS: Add A record → 76.76.21.21 (manual) | 2. Sky blue on dark theme | 3. Tool filter animation demo (/animate)'
  },
  {
    project: 'clawdbotai', url: 'https://clawdbotai.tech', priority: 'p2',
    category: 'Productivity/SaaS', bg: '#fff9f5', accent: '#f97316',
    layout: 'Split (hero + demo panel)',
    demo: 'Chat window: user types → typing dots → AI reply with code block + syntax highlight → copy button. Skills: /animate /transitions-dev text-swap',
    headline: 'Your coding AI. No ChatGPT tab needed.',
    changes: '1. Warm orange SaaS theme | 2. Live chat demo on landing (/animate typing) | 3. Branded claw logo mark'
  },
  {
    project: 'firstline', url: 'https://firstline.so', priority: 'p2',
    category: 'Productivity/SaaS', bg: '#f8fafc', accent: '#0ea5e9',
    layout: 'Split (hero + demo panel)',
    demo: 'LinkedIn profile URL input → AI analyses → personalised opening line types out → 3 variations carousel. Skills: /animate /transitions-dev text-swap',
    headline: 'Write cold emails that actually get replies.',
    changes: '1. Fix ECONNREFUSED — check domain renewal (manual) | 2. Sky-blue SaaS theme | 3. Opening line generator demo on landing'
  },
  {
    project: 'ai-social-content', url: 'https://ai-social-content.vercel.app', priority: 'p2',
    category: 'Productivity/SaaS', bg: '#fdf4ff', accent: '#c026d3',
    layout: 'Split (hero + demo panel)',
    demo: 'Topic input → platform tabs (Twitter/LinkedIn/Instagram) → content variations type out per platform → copy button. Skills: /animate /transitions-dev tab swap',
    headline: 'One idea. Posts for every platform in seconds.',
    changes: '1. Fuchsia-pink social theme | 2. Platform-switching content demo (/animate /transitions-dev) | 3. Fix wrong Bolt.new deployment'
  },
  {
    project: 'homecanvas', url: 'https://homecanvas.vercel.app', priority: 'p2',
    category: 'Travel/Local', bg: '#fffdf7', accent: '#78716c',
    layout: 'Split (hero + demo panel)',
    demo: 'Room style selector (Modern/Scandi/Boho) → interior render appears via Ken Burns zoom → furniture swaps animate. Skills: /higgsfield-generate for hero images + /animate Ken Burns CSS',
    headline: 'Redesign any room with AI in 10 seconds.',
    changes: '1. Ivory + warm stone theme | 2. Generate hero room renders via /higgsfield-generate nano_banana_2 | 3. Style-swap animation on right panel'
  },
  {
    project: 'anylocal', url: 'https://anylocal.app', priority: 'p2',
    category: 'Travel/Local', bg: '#fffbf5', accent: '#ea580c',
    layout: 'Split (hero + demo panel)',
    demo: 'Location search "Birmingham" → local business cards appear (cafe, salon, gym) with rating + distance → one card expands with CTA. Skills: /animate /transitions-dev card-resize',
    headline: 'Find the best local businesses near you.',
    changes: '1. Warm-white + orange local theme | 2. Business card listing animation (/animate stagger) | 3. Map pin CSS animation on right panel'
  },
];

async function insertCard(p) {
  const groupId = GROUPS[p.priority];
  const title = `${p.project} — redesign plan`;
  const [{ pos }] = await sql`SELECT COALESCE(MAX(position), 0) as pos FROM tasks WHERE group_id = ${groupId}`;
  const [task] = await sql`
    INSERT INTO tasks (group_id, board_id, title, position, created_by)
    VALUES (${groupId}, ${BOARD_ID}, ${title}, ${Number(pos) + 1000}, 'design-bot')
    RETURNING id
  `;
  const cellData = [
    [COLS.project, p.project],
    [COLS.url, p.url],
    [COLS.category, p.category],
    [COLS.bg, p.bg],
    [COLS.accent, p.accent],
    [COLS.layout, p.layout],
    [COLS.demo, p.demo],
    [COLS.headline, p.headline],
    [COLS.changes, p.changes],
    [COLS.priority, p.priority.toUpperCase()],
  ];
  for (const [colId, value] of cellData) {
    if (!value) continue;
    await sql`
      INSERT INTO cell_values (task_id, column_id, value)
      VALUES (${task.id}, ${colId}, ${JSON.stringify(value)})
      ON CONFLICT (task_id, column_id) DO UPDATE SET value = EXCLUDED.value
    `;
  }
  console.log(`✓ [${p.priority.toUpperCase()}] ${p.project}`);
}

// Insert sequentially to avoid position conflicts
for (const p of projects) {
  await insertCard(p);
}
console.log(`\nDone — ${projects.length} redesign cards created.`);
console.log('Board: https://ai-products-hub.vercel.app (TaskFlow → Portfolio Redesign Planning)');
