/**
 * Adds 4 new detail columns to "Portfolio Redesign Planning" board,
 * then populates rich proposal content for all 33 project cards.
 *
 * New columns: Proposal, Skills, Files to Touch, Success Criteria
 *
 * Run: node --env-file=.env.local scripts/redesign-enrich-cards.mjs
 */
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

const BOARD_ID = 'd2590531-8c6b-4991-a068-73ca01175ad0';

// ── Step 1: add 4 new columns ─────────────────────────────────────────────────
const newCols = [
  { name: 'Proposal',          type: 'text', pos: 11 },
  { name: 'Skills',            type: 'text', pos: 12 },
  { name: 'Files to Touch',    type: 'text', pos: 13 },
  { name: 'Success Criteria',  type: 'text', pos: 14 },
];

const colIds = {};
for (const c of newCols) {
  const existing = await sql`SELECT id FROM columns WHERE board_id=${BOARD_ID} AND name=${c.name}`;
  if (existing.length) {
    colIds[c.name] = existing[0].id;
    console.log(`col exists → ${c.name}: ${existing[0].id}`);
  } else {
    const [row] = await sql`
      INSERT INTO columns (board_id, name, type, config, position)
      VALUES (${BOARD_ID}, ${c.name}, ${c.type}, ${JSON.stringify({})}, ${c.pos})
      RETURNING id
    `;
    colIds[c.name] = row.id;
    console.log(`col created → ${c.name}: ${row.id}`);
  }
}

// ── Step 2: rich proposal data per project ────────────────────────────────────
// Format for each project:
//   proposal: full markdown brief (why + what + how)
//   skills: ordered skill list
//   files: which files to touch
//   success: verifiable criteria (Playwright-checkable)

const enrichments = [

  // ── P0 ──────────────────────────────────────────────────────────────────────
  {
    name: 'quizbites — redesign plan',
    proposal: `## Why
Yellow-tint theme applied but hardcoded dark hex values remain in HeroClient.tsx. Right panel shows static placeholder — no animated demo. Collision with tutiq (#f0f9ff) fixed at CSS level but components still use old blue accent.

## What
Replace static right panel with live QuizDemoPanel. Wire yellow-gold accent (#ca8a04) to all interactive elements. Rewrite hero copy to be outcome-first.

## How
1. HeroClient.tsx — replace decorative blob/static panel with QuizDemoPanel component
2. QuizDemoPanel: topic input typewriter ("Black holes" cycles) → 3 quiz cards slide in (stagger 80ms each) → user option flashes green → score ring ticks +10 → new topic after 3.5s
3. globals.css already has --accent: #ca8a04 — wire to btn, ring, active states
4. Copy: headline "Type a topic. Get a quiz. Learn it." / CTA "Try a quiz — free"
5. No auth gate on quiz generation (§T — core action free)`,
    skills: `/animate (card-flip + stagger entry)
/transitions-dev (card-resize pattern for quiz card expand)
/copywriting (headline + CTA)
/marketing-psychology (immediate value, no friction)
/taste-skill (quality gate before push)
/fixing-accessibility (contrast check gold on white)`,
    files: `quizbites/app/components/HeroClient.tsx — replace static panel
quizbites/app/components/QuizDemoPanel.tsx — NEW animated component
quizbites/app/globals.css — already updated ✓ (verify accent wired)
quizbites/app/page.tsx — verify no auth gate on quiz route`,
    success: `- [ ] Right panel shows cycling quiz demo (not static)
- [ ] Quiz cards animate in with stagger on load
- [ ] Accent color #ca8a04 visible on CTA button + score ring
- [ ] Hero H1 ≤8 words, outcome-first
- [ ] No login prompt before first quiz
- [ ] Playwright 375px: demo strip visible (4-card snap scroll, lg:hidden)
- [ ] npm run build → exit 0`
  },

  {
    name: 'invoicemint — redesign plan',
    proposal: `## Why
Landing page is static. Right panel shows no product demo. Finance/billing category needs green-tint professional feel (not the dark aurora that was there before). Build fails due to Stripe lazy-init issue.

## What
5-act animated invoice lifecycle demo. Fix build. Apply green-tint finance theme fully.

## How
1. InvoiceDemoLoop component: 5-act, 9s loop
   - Act 1 (0-1.5s): Project card "Website Redesign — £2,400" appears
   - Act 2 (1.5-3s): "Generate Invoice" button pulse + click animation
   - Act 3 (3-5s): Invoice fields type one-by-one (client, amount, due date)
   - Act 4 (5-6.5s): Sent ✓ badge slides in, then +7d → "OVERDUE" badge flips in
   - Act 5 (6.5-9s): AI chaser message types → "Payment received £2,400" confetti burst
2. Fix Stripe import: wrap in dynamic() or move to client-only lazy load
3. Theme: --background #f0fdf4, --accent #059669 wired to all components`,
    skills: `/animate (Framer Motion stagger, confetti burst)
/gsap-timeline (precise 9s act sequencing)
/copywriting (headline: "Invoice sent. Payment chased. You did nothing.")
/marketing-psychology (loss aversion — "stop chasing invoices manually")
/taste-skill (before push)`,
    files: `invoicemint/app/components/InvoiceDemoLoop.tsx — NEW 5-act component
invoicemint/app/components/HeroClient.tsx — integrate InvoiceDemoLoop
invoicemint/app/globals.css — verify #f0fdf4 + #059669 wired
invoicemint/app/layout.tsx — fix Stripe import (dynamic or lazy)`,
    success: `- [ ] 5-act invoice demo loops correctly (9s, no glitch)
- [ ] "Payment received" confetti fires on Act 5
- [ ] npm run build → exit 0 (Stripe no longer breaks build)
- [ ] Green-tint #f0fdf4 bg visible in Playwright 1280px screenshot
- [ ] No auth gate before generating first invoice
- [ ] H1 headline outcome-first, ≤8 words`
  },

  {
    name: 'aicoachlab — redesign plan',
    proposal: `## Why
Orange-tint theme applied at CSS level but component files still reference old blue (#2563eb / --violet). Right panel is decorative. Category is career/coaching (not health) — orange is correct.

## What
Replace static panel with InterviewDemoPanel. Wire orange accent to components. Copy: "practice → hired" outcome.

## How
1. InterviewDemoPanel: 6s cycle
   - AI question types: "Tell me about a time you failed..."
   - Candidate response bar fills (typing indicator)
   - "Evaluating..." shimmer overlay 1.5s
   - Feedback card slides up: Score ring 7.2/10, 3 improvement bullets
   - Next question after 1s pause
2. Replace all var(--violet) refs in components with var(--accent)
3. Score ring: SVG circle stroke-dasharray animated via Framer Motion spring`,
    skills: `/animate (score ring spring, card slide-up, shimmer)
/transitions-dev (panel slide pattern)
/copywriting ("Practice interviews until you nail them.")
/marketing-psychology (fear of failure → safe practice environment)`,
    files: `aicoachlab/app/components/HeroClient.tsx — integrate InterviewDemoPanel
aicoachlab/app/components/InterviewDemoPanel.tsx — NEW
aicoachlab/app/components/ScoreRing.tsx — NEW SVG ring component
aicoachlab/app/globals.css — --violet alias → --accent: #ea580c ✓`,
    success: `- [ ] InterviewDemoPanel loops 6s cycle without stutter
- [ ] Score ring animates spring physics (stiffness:80 damping:20)
- [ ] No --violet hex blue visible in rendered UI
- [ ] Orange accent (#ea580c) on CTA, score ring, highlights
- [ ] H1 outcome-first ≤8 words
- [ ] Playwright 375px: demo collapses to snap-scroll strip`
  },

  {
    name: 'replydesk — redesign plan',
    proposal: `## Why
Landing page is essentially empty Next.js scaffold. Indigo theme applied to globals.css but no actual landing page exists. Product: AI-powered customer support reply drafter.

## What
Build landing page from scratch with split hero + TicketDemoPanel.

## How
1. app/page.tsx: split hero, lg:grid-cols-2
   - Left: headline "Draft perfect support replies in 4 seconds" + subhead + CTA + 3 stat pills
   - Right: TicketDemoPanel
2. TicketDemoPanel: 6s loop
   - Raw ticket appears left pane: "Hi, my order #4521 hasn't arrived..."
   - "Drafting..." shimmer 1.5s
   - AI reply types word-by-word right pane: empathetic, solution-focused
   - Tone badge appears: "Empathetic ✓"
   - Edit + Send buttons fade in with scale(0.95→1)
3. Stats row: "4 sec avg reply" / "87% CSAT" / "Zero copy-paste"
4. Steps: 1. Connect helpdesk → 2. AI drafts → 3. Review + send`,
    skills: `/design-html (canvas generates initial split layout)
/animate (ticket typing, shimmer, badge fade-in)
/transitions-dev (text-swap pattern for before/after reply)
/copywriting (headline + tone badge copy)
/21st-registry (check for support UI components)`,
    files: `replydesk/app/page.tsx — full landing build
replydesk/app/components/TicketDemoPanel.tsx — NEW
replydesk/app/components/NavBar.tsx — branded "Reply•Desk" logo
replydesk/app/globals.css — indigo theme already set ✓`,
    success: `- [ ] Landing page renders (was previously blank)
- [ ] TicketDemoPanel: before ticket visible, reply types in ≤3s
- [ ] "Drafting..." shimmer shows between ticket + reply
- [ ] Tone badge appears after reply completes
- [ ] Stats row shows 3 real-feeling product numbers
- [ ] Playwright 1280px: both panels visible above fold
- [ ] npm run build → exit 0`
  },

  // ── P1 ──────────────────────────────────────────────────────────────────────
  {
    name: 'tutiq — redesign plan',
    proposal: `## Why
Sky-blue theme correct, no collision. But right panel is static decorative illustration. Hero copy is generic. SEO metadata missing metadataBase.

## What
Add TutorDemoPanel + fix SEO + keep sky-blue theme.

## How
1. TutorDemoPanel: 5s cycle
   - Student input: "Explain photosynthesis simply"
   - Tutor card appears: explanation in 3 bullets + analogy
   - Comprehension check: "Which molecule absorbs light?" — 3 options
   - Student clicks → ✓ Correct! badge bounces in
   - XP bar fills +15 pts
2. app/layout.tsx: add metadataBase, keyword title "AI Tutor — Learn Anything in 60 Seconds"
3. sitemap.ts: verify exists`,
    skills: `/animate (card appear, XP bar fill, ✓ bounce)
/transitions-dev (card-resize for answer expansion)
/seo-audit (metadataBase, OG, JSON-LD)
/fixing-metadata (title pattern)`,
    files: `tutiq/app/components/HeroClient.tsx — integrate TutorDemoPanel
tutiq/app/components/TutorDemoPanel.tsx — NEW
tutiq/app/layout.tsx — metadataBase + SEO
tutiq/app/sitemap.ts — verify exists`,
    success: `- [ ] TutorDemoPanel shows tutor card + comprehension check cycling
- [ ] XP bar animates fill on correct answer
- [ ] metadataBase set in layout.tsx
- [ ] OG title includes keyword "AI Tutor"
- [ ] Playwright 375px: no overflow, demo strip visible`
  },

  {
    name: 'speakiq — redesign plan',
    proposal: `## Why
Violet-tint bg (#fdf4ff) applied, collision with tutiq fixed. But components still reference sky-blue vars. Right panel has no audio/waveform demo. Language learning category needs Duolingo-style engagement hooks.

## What
WaveformDemoPanel + wire purple accent + gamified feel.

## How
1. WaveformDemoPanel: 5s loop
   - Mic button pulses (ring expand animation, 1.2s ease)
   - 5 waveform bars animate up/down (FFT simulation)
   - Transcript types: "Je voudrais un café, s'il vous plaît"
   - Accent score badge slides in: 8.4/10
   - Pronunciation tip card: "Stress on 'plaît' — try again"
   - Repeat icon pulses → loop
2. Replace sky-blue hex refs in components → var(--accent) #9333ea
3. Font: add Nunito (Duolingo-style playful weight)`,
    skills: `/animate (waveform bars, mic pulse-ring, score badge)
/design-motion-principles (waveform physics — continuous not discrete)
/copywriting ("Speak any language like you grew up in it.")
/fixing-accessibility (purple contrast check on white)`,
    files: `speakiq/src/app/components/HeroClient.tsx — integrate WaveformPanel
speakiq/src/app/components/WaveformDemoPanel.tsx — NEW
speakiq/src/app/globals.css — already violet-tint ✓, remove sky refs
speakiq/src/app/layout.tsx — add Nunito font`,
    success: `- [ ] Waveform bars animate (5 bars, independent timing)
- [ ] Mic pulse-ring visible and smooth
- [ ] Accent score badge appears after transcript types
- [ ] No sky-blue (#0284c7) remaining in rendered UI
- [ ] Playwright 375px: hero + mic button above fold
- [ ] npm run build → exit 0`
  },

  {
    name: 'resumevault — redesign plan',
    proposal: `## Why
Dark violet professional theme set (#0c0f1a + #7c3aed). Alias vars added. But landing page shows no live product demo — just static dark sections. ATS resume builder category = high-stakes, needs immediate value demonstration.

## What
ATS score ring demo + dark terminal feel + professional copy.

## How
1. ATSDemoPanel: 6s loop (dark bg, code-style)
   - Resume skeleton loads line-by-line (20 lines, 40ms/line)
   - ATS scan overlay: "Scanning for Google SWE..."
   - Score ring fills 0→91% (SVG stroke-dashoffset, spring physics)
   - 3 badges appear: "Keywords ✓" / "Format ✓" / "ATS-ready ✓"
   - Download button pulses with violet glow
2. Copy: "Resume that beats ATS in 90 seconds."
3. Trust signal: "Works with Google, Meta, Amazon ATS" (no fake numbers)`,
    skills: `/animate (ring fill spring, skeleton loader, badge stagger)
/gsap-timeline (precise scan sequence)
/copywriting (ATS anxiety → instant relief)
/marketing-psychology (social proof via company names not fake stats)`,
    files: `resumevault/src/app/components/HeroClient.tsx — integrate ATSDemoPanel
resumevault/src/app/components/ATSDemoPanel.tsx — NEW
resumevault/src/app/components/ScoreRing.tsx — NEW
resumevault/src/app/globals.css — --accent aliases already added ✓`,
    success: `- [ ] Score ring fills 0→91% with spring physics (not linear)
- [ ] Skeleton lines load sequentially (not all at once)
- [ ] 3 badges appear with stagger after scan completes
- [ ] Dark bg #0c0f1a visible in Playwright screenshot
- [ ] No fake "10k users" stats anywhere
- [ ] npm run build → exit 0`
  },

  {
    name: 'draftcal — redesign plan',
    proposal: `## Why
Amber theme applied at CSS. Right panel: calendar grid exists but content is static placeholder text. Content calendar tool needs to SHOW the calendar filling with AI-generated posts.

## What
CalendarDemoPanel: animated content filling a month calendar.

## How
1. CalendarDemoPanel: 6s loop
   - Empty Oct calendar grid renders
   - "Generate October content" button glows → click pulse
   - Post cards populate slots with typing: "Monday: Twitter thread on...", "Wed: LinkedIn article..."
   - One card expands via card-resize pattern showing full draft preview
   - Schedule button glows amber → "Scheduled ✓"
2. Wire amber accent (#d97706) to calendar day highlights, CTA, slot cards
3. Copy: "One click fills your content calendar for a month."`,
    skills: `/animate (calendar populate stagger, card expand)
/transitions-dev (card-resize for draft preview expand)
/copywriting (headline + CTA "Generate my calendar")
/gsap-timeline (calendar fill sequence timing)`,
    files: `draftcal/src/app/components/HeroClient.tsx — integrate CalendarDemoPanel
draftcal/src/app/components/CalendarDemoPanel.tsx — NEW
draftcal/src/app/globals.css — amber theme ✓ (verify components use var(--accent) not hardcoded hex)`,
    success: `- [ ] Calendar slots populate with stagger animation
- [ ] One card expands on click/auto to show draft
- [ ] Amber accent visible on CTA and calendar highlights
- [ ] Hero H1 ≤8 words
- [ ] Playwright 375px: calendar collapses to 4-card strip (lg:hidden)
- [ ] npm run build → exit 0`
  },

  {
    name: 'trackwealth — redesign plan',
    proposal: `## Why
Dark navy + gold theme applied. Was previously light theme with conflicting classes. Components still mix old light/dark vars. Finance/wealth category needs premium dashboard feel — like Bloomberg terminal but accessible.

## What
MetricCountUpDemo + dark terminal style fintech hero.

## How
1. WealthDemoPanel: 5s loop
   - 3 metric cards count up simultaneously:
     - Portfolio: £12,400 → £18,900 (1.8s, easeOut)
     - ROI: 14.2% → 22.1%
     - Risk: LOW → MED (color swap, not number)
   - Sparkline chart draws below (SVG path animation, drawSVG)
   - AI insight card types: "Tech overweight by 18% — consider rebalancing"
2. Clean up mixed light/dark classes in HeroClient.tsx
3. JetBrains Mono for metric numbers`,
    skills: `/animate (count-up spring, card stagger)
/d3-visualization (sparkline SVG path draw)
/gsap-core (drawSVG for sparkline)
/copywriting ("Watch your wealth compound. Track every pound.")
/marketing-psychology (progress visualization = motivation hook)`,
    files: `trackwealth/src/app/components/HeroClient.tsx — remove mixed light/dark, integrate WealthDemoPanel
trackwealth/src/app/components/WealthDemoPanel.tsx — NEW
trackwealth/src/app/globals.css — dark navy theme ✓ (remove leftover light refs)`,
    success: `- [ ] 3 metric cards count up simultaneously
- [ ] Sparkline draws after count-up completes
- [ ] AI insight card types after sparkline
- [ ] No light-mode hex values in dark sections
- [ ] JetBrains Mono on metric numbers
- [ ] Playwright 1280px: all 3 metrics visible above fold`
  },

  {
    name: 'myvitals — redesign plan',
    proposal: `## Why
Teal-tint bg (#f0fdfa) correct. But --accent CSS var missing from globals.css — components use hardcoded teal hex. Right panel has static health screenshot.

## What
HealthScoreRing demo + wire teal accent properly.

## How
1. HealthScorePanel: continuous (no pause between loops)
   - Health score ring: 0→87% fill, spring(stiffness:80, damping:20)
   - 3 metric cards count up: Steps 8,240 / Sleep 7.3h / Mood ★★★★
   - AI insight card types: "Walk 1,200 more steps to close your ring"
   - Ring pulses teal glow when 87% reached
2. Add --accent: #0d9488 to globals.css (currently missing)
3. Wire to: CTA buttons, ring color, card borders`,
    skills: `/animate (ring spring fill, metric count-up, insight typewriter)
/fixing-accessibility (teal on white: verify 4.5:1 contrast)
/taste-skill (quality check: health UI should feel calm, not clinical)`,
    files: `myvitals/app/components/HeroClient.tsx — integrate HealthScorePanel
myvitals/app/components/HealthScorePanel.tsx — NEW
myvitals/app/globals.css — ADD --accent: #0d9488 (missing)`,
    success: `- [ ] Score ring fills with spring physics
- [ ] 3 metrics count up in parallel
- [ ] --accent var defined and visible on CTA
- [ ] Teal contrast ≥4.5:1 on #f0fdfa bg
- [ ] Playwright 375px: ring visible above fold
- [ ] npm run build → exit 0`
  },

  {
    name: 'voicejournal — redesign plan',
    proposal: `## Why
Lavender bg (#f5f0ff) + purple accent (#8b5cf6) applied. Body bg was hardcoded #f8fafc (overriding CSS var). Scrollbar/glass/navbar refs still used teal. All fixed in globals.css but components may still have old teal.

## What
WaveformDemoPanel (purple version, different from speakiq's violet) + verify no teal leakage.

## How
1. VoiceJournalDemoPanel: 5s loop
   - Mic button pulses purple (ring expand, 1s ease-out)
   - 6 waveform bars animate (softer motion than speakiq — journal = calm)
   - Transcript types: "Feeling overwhelmed today, but grateful for..."
   - Mood auto-detected badge slides in: "😌 Calm · Reflective"
   - Entry saved card: "Journal entry — June 17" with purple check
2. Grep all component .tsx files for hardcoded teal (#0d9488, rgba(13,148))
3. Wire --accent #8b5cf6 to all components via CSS vars`,
    skills: `/animate (waveform bars — softer easing than speakiq, mood badge)
/design-motion-principles (calm journal feel vs energetic language learning)
/copywriting ("Speak your thoughts. AI journals for you.")`,
    files: `voicejournal/app/components/HeroClient.tsx — integrate VoiceJournalDemoPanel
voicejournal/app/components/VoiceJournalDemoPanel.tsx — NEW
voicejournal/app/globals.css — teal → purple already done ✓ (verify body bg uses CSS var not hardcoded)`,
    success: `- [ ] Waveform bars animate (softer, 0.4s easing — not sharp)
- [ ] Mood badge appears: emoji + mood word
- [ ] No #0d9488 or teal refs in rendered components
- [ ] Lavender #f5f0ff bg in Playwright screenshot
- [ ] Entry saved card visible at end of loop
- [ ] npm run build → exit 0`
  },

  {
    name: 'pdfideas — redesign plan',
    proposal: `## Why
Bg was #fdf4ff purple-tint (banned per §Z3). Changed to #fafafe blue-white. Indigo accent (#6366f1). Right panel shows no PDF → ideas transformation demo. Productivity SaaS category.

## What
PDFUploadToIdeasDemo + indigo theme fully wired.

## How
1. PDFIdeasDemoPanel: 5s loop
   - PDF file card drops in (drag-style, slight bounce)
   - Processing shimmer: "Extracting insights..." 1.2s
   - 5 idea cards appear one-by-one (stagger 120ms):
     - 💡 "Build a subscription tier for X"
     - 💡 "Write a comparison guide to Y"
     - 💡 "Create a video series on Z"
     - (2 more)
   - User hovers card 3 → card expands with more detail (card-resize)
   - "Explore all 47 ideas →" CTA pulses indigo
2. Wire --accent: #6366f1 to buttons, card borders, active states`,
    skills: `/animate (drop+bounce, shimmer, stagger cards)
/transitions-dev (card-resize for idea expansion on hover)
/copywriting ("Drop a PDF. Get 50 ideas in 10 seconds.")
/21st-registry (check for file-drop zone component)`,
    files: `pdfideas/app/components/HeroClient.tsx — integrate PDFIdeasDemoPanel
pdfideas/app/components/PDFIdeasDemoPanel.tsx — NEW
pdfideas/app/globals.css — bg already fixed to #fafafe, verify indigo accent wired`,
    success: `- [ ] PDF card drops in with bounce (not slide)
- [ ] 5 idea cards stagger in (120ms between each)
- [ ] Card expand on hover/auto works (card-resize pattern)
- [ ] No purple-tint bg (#fdf4ff) remaining
- [ ] Indigo #6366f1 on CTA button visible
- [ ] Playwright 375px: pdf drop + 4 ideas visible above fold`
  },

  {
    name: 'roamplan — redesign plan',
    proposal: `## Why
Green-tint travel theme assigned. Landing currently has generic hero with no itinerary demo. Travel category: visitor wants to imagine the trip — show the product generating one.

## What
ItineraryDemoPanel + full-width centered hero variant (different from split — differentiates from other projects).

## How
1. Layout: centered hero (not split) — full-width search bar, itinerary flies in below
2. ItineraryDemoPanel: 5s loop
   - Search bar types: "Tokyo · 5 days · Budget £1,200"
   - "Planning..." spinner 1s
   - 5 day cards fly up with stagger (translateY 40px → 0, opacity 0→1, 80ms delay each)
   - Map pin animation right (CSS only, no library)
   - Total cost badge slides in: "Est. £847 total"
3. Differentiation from invoicemint: full-width not split, day-cards not invoice fields`,
    skills: `/animate (search typewriter, day card stagger fly-up)
/transitions-dev (slide-up stagger pattern)
/design-html (centered full-width hero — different from split pattern)
/copywriting ("Plan your perfect trip in 30 seconds.")`,
    files: `roamplan/app/components/HeroClient.tsx — rebuild as centered hero
roamplan/app/components/ItineraryDemoPanel.tsx — NEW
roamplan/app/globals.css — verify green-tint #f0fdf4 + #059669`,
    success: `- [ ] Full-width centered hero (NOT split lg:grid-cols-2)
- [ ] Search bar typewriter effect visible
- [ ] 5 day cards fly up with stagger (not simultaneous)
- [ ] Cost badge appears after cards complete
- [ ] Playwright 375px: search bar + first 2 day cards above fold`
  },

  {
    name: 'worldtrends — redesign plan',
    proposal: `## Why
Light theme (#f9fafb + red #dc2626) assigned. Previously had dark aurora blobs (removed). But right panel is static — no live trending demo. News/trends: product IS the trending content, show it live.

## What
Marquee trending ticker + topic expansion demo.

## How
1. Hero layout: centered (full-width trending ticker as hero)
2. TrendingMarquee: infinite scroll of topic pills ("AI chips shortage", "UK election", "heatwave records"...) — CSS marquee animation, pause-on-hover
3. Below marquee: click any topic → article cards appear with slide-down stagger
4. AI summary types below: 3-sentence synthesis
5. Breaking news badge: "🔴 LIVE" pulse animation on hot topics`,
    skills: `/animate (marquee CSS, article card stagger, AI summary typewriter)
/gsap-core (marquee with GSAP for smooth infinite scroll)
/seo-audit (News schema JSON-LD for Google News eligibility)
/fixing-metadata (NewsArticle structured data)`,
    files: `worldtrends/app/components/HeroClient.tsx — rebuild as centered marquee hero
worldtrends/app/components/TrendingMarquee.tsx — NEW
worldtrends/app/globals.css — light theme already fixed ✓
worldtrends/app/layout.tsx — add NewsArticle JSON-LD`,
    success: `- [ ] Marquee scrolls continuously (no pause/jump)
- [ ] Pause-on-hover works
- [ ] Article cards appear on topic click
- [ ] AI summary types after cards render
- [ ] Red accent #dc2626 on "LIVE" badge and CTA
- [ ] NewsArticle JSON-LD in page source`
  },

  {
    name: 'agenttrace — redesign plan',
    proposal: `## Why
Cyan (#22d3ee) accent assigned but CSS vars not added to globals.css. Dark terminal theme (#0c111a) is correct for dev tools. No animated demo — just static dashboard screenshot.

## What
Add CSS vars + LogStreamDemoPanel (real-time agent log simulation).

## How
1. Add to globals.css:
   --accent: #22d3ee
   --accent-2: #06b6d4
   --accent-dim: rgba(34,211,238,0.12)
2. LogStreamDemoPanel: terminal-style, 400ms per log line
   - Lines stream in with fade: "[12:04:32] agent:scraper → fetched 142 items ✓"
   - One line flashes red: "[12:04:41] agent:parser → ERROR: null response"
   - Span tree visualization expands below (collapsible)
   - "Resolved ✓" green badge after 2s
   - Total time badge: "Pipeline: 4.2s"
3. JetBrains Mono font for all log text`,
    skills: `/animate (log line stream, error flash, span tree expand)
/gsap-timeline (precise 400ms/line timing)
/transitions-dev (tree expand pattern)
/fixing-accessibility (cyan on dark: must be ≥4.5:1)`,
    files: `agenttrace/apps/dashboard/app/components/HeroClient.tsx — integrate LogStreamPanel
agenttrace/apps/dashboard/app/components/LogStreamDemoPanel.tsx — NEW
agenttrace/apps/dashboard/app/globals.css — ADD cyan accent vars`,
    success: `- [ ] CSS vars --accent #22d3ee present in globals.css
- [ ] Log lines stream at 400ms interval
- [ ] Error line flashes red
- [ ] "Resolved ✓" badge appears
- [ ] JetBrains Mono on log text
- [ ] Playwright 1280px: terminal panel fills right column
- [ ] Build from apps/dashboard dir → exit 0`
  },

  {
    name: 'neuralos — redesign plan',
    proposal: `## Why
Bg was #060612 — too close to zerostaff (#0b1120) per collision check. Also had aurora mesh blobs (banned). Fix: change bg to #080d1a (distinct enough from zerostaff's #0b1120 — different saturation).

## What
Fix bg collision + build AgentGraphDemo.

## How
1. globals.css: change --background #060612 → #080d1a
2. Remove any remaining radial-gradient aurora blobs from globals.css + HeroClient.tsx
3. AgentGraphDemoPanel: 5s loop
   - Neural network graph animates: 5 nodes connect with SVG lines (draw in 600ms each)
   - Task appears: "Research competitors for kwizzo"
   - 3 agents activate in parallel (bars fill simultaneously)
   - Results merge → "Done in 2.3s" badge
   - Graph glows indigo pulse
4. Wire --accent: #6366f1 to all interactive elements`,
    skills: `/animate (SVG node connections, parallel bars, merge pulse)
/threejs (optional: if CSS SVG feels flat — use Three.js node graph instead)
/copywriting ("Orchestrate AI agents. Ship 10x faster.")`,
    files: `neuralos/app/page.tsx — check for hardcoded bg colors
neuralos/app/globals.css — #060612 → #080d1a, remove aurora blobs
neuralos/app/components/AgentGraphDemoPanel.tsx — NEW`,
    success: `- [ ] No #060612 hex in codebase (was collision with zerostaff)
- [ ] No radial-gradient aurora blobs in globals.css
- [ ] Node graph connects with SVG line animations
- [ ] 3 parallel agent bars fill simultaneously
- [ ] Indigo #6366f1 on graph nodes + CTA
- [ ] Playwright: dark bg looks distinct from zerostaff`
  },

  // ── P2 (condensed but still full proposals) ──────────────────────────────────
  {
    name: 'flighttracker — redesign plan',
    proposal: `Deployment broken (flightbrain.app returns error). Fix deployment first, then apply travel green theme + flight search demo. Demo: search input "LHR→JFK" → results list → card expands with price history sparkline → "Best time to book: Tuesday" badge.`,
    skills: `/animate /d3-visualization (price sparkline) /copywriting /seo-audit`,
    files: `flighttracker/app/globals.css — verify green-tint #f0fdf4 + #059669
flighttracker/app/components/FlightSearchDemo.tsx — NEW
flighttracker/.vercel/project.json — verify correct account linkage`,
    success: `- [ ] flightbrain.app returns 200
- [ ] Flight search demo panel renders
- [ ] Price sparkline animates on card expand`
  },

  {
    name: 'billslash — redesign plan',
    proposal: `Before/after bill reduction demo. Before £89/mo → After £54/mo with number-pop animation. Saved £420/yr badge bursts in. "AI negotiated this" sub-label. Green-tint finance (different shade from invoicemint — lighter bg #f0fdf4 same but accent #10b981 vs #059669 darker).`,
    skills: `/transitions-dev (number-pop pattern) /animate /copywriting ("Cut your bills in half. AI negotiates for you.")`,
    files: `billslash/app/components/BillReductionDemo.tsx — NEW
billslash/app/globals.css — #f0fdf4 + #10b981`,
    success: `- [ ] Before/after number transition smooth (not jump)
- [ ] Saved badge bursts in (scale from 0.5 → 1.05 → 1)
- [ ] npm run build → exit 0`
  },

  {
    name: 'mandirates — redesign plan',
    proposal: `Live Indian commodity prices. API key expired (data.gov.in). Manual step: get new key from data.gov.in, update VERCEL env. Once live: commodity card sparklines. Food/local orange-tint warm theme. Price cards: Tomato ₹28/kg, Onion ₹22/kg with live sparkline each.`,
    skills: `/d3-visualization (price sparklines) /animate (card stagger)`,
    files: `mandirates/app/globals.css — warm-white + orange accent
mandirates/app/components/CommodityCard.tsx — add sparkline
mandirates/.env — update DATA_GOV_API_KEY (manual step first)`,
    success: `- [ ] API returns real prices (not 11 hardcoded fallbacks)
- [ ] Sparklines render on each card
- [ ] ₹ prices formatted correctly`
  },

  {
    name: 'bookingcall — redesign plan',
    proposal: `AI phone → calendar booking demo. Animation: phone icon rings → transcript types → slot selected → calendar invite card pops in. Productivity blue theme (#ffffff + #2563eb). icon-swap pattern: phone icon morphs to calendar icon on booking.`,
    skills: `/animate /transitions-dev (icon-swap pattern) /copywriting ("AI answers your calls. Books appointments automatically.")`,
    files: `bookingcall/app/components/BookingCallDemo.tsx — NEW
bookingcall/app/globals.css — white + blue`,
    success: `- [ ] Phone ring animation → transcript types
- [ ] Icon swap phone→calendar on booking
- [ ] Calendar invite card slides in`
  },

  {
    name: 'pixelforge — redesign plan',
    proposal: `Pixel art game creator. Near-black (#0e0e16) + violet (#7c3aed). Demo: pixel canvas renders grid → tiles appear block-by-block → character sprite walks → "Export to Unity" pulses. Retro terminal feel. Pixel font (Press Start 2P) for h1.`,
    skills: `/animate (pixel tile reveal, sprite walk CSS) /copywriting`,
    files: `pixelforge/app/components/PixelCanvasDemo.tsx — NEW
pixelforge/app/globals.css — near-black + violet
pixelforge/app/layout.tsx — add Press Start 2P font`,
    success: `- [ ] Pixel tiles reveal row-by-row
- [ ] Character sprite has walk cycle (CSS animation)
- [ ] Press Start 2P font on hero h1`
  },

  {
    name: 'clipforge — redesign plan',
    proposal: `DNS broken: Namecheap A record → 192.64.119.101 (wrong) → must change to 76.76.21.21. Manual DNS step first. Then: fuchsia media theme (#0a0a0f + #e879f9). Demo: waveform scrubs → AI highlight detected (flash) → clip auto-trimmed → captions type over frame → Export button glows.`,
    skills: `/animate /gsap-timeline (waveform scrub)`,
    files: `clipforge/app/globals.css — near-black + fuchsia
clipforge/app/components/ClipHighlightDemo.tsx — NEW`,
    success: `- [ ] clipforge.ai DNS resolves (after manual fix)
- [ ] Waveform highlight flash animation
- [ ] Captions type over video frame`
  },

  {
    name: 'yt-portal — redesign plan',
    proposal: `YouTube summary tool. Red-on-black media theme (#0a0a0f + #f87171). Different from clipforge fuchsia. Demo: YouTube URL pastes → thumbnail appears → summary types → key moments list slides down → transcript download button. Inline on landing, no auth.`,
    skills: `/animate (thumbnail appear, summary typewriter) /transitions-dev (slide-down list)`,
    files: `yt-portal/app/globals.css — #0a0a0f + #f87171
yt-portal/app/components/YTSummaryDemo.tsx — NEW`,
    success: `- [ ] Thumbnail + summary visible without login
- [ ] Key moments list slides down with stagger
- [ ] Download CTA gated (export = auth), not summary`
  },

  {
    name: 'aijobsportal — redesign plan',
    proposal: `AI job matching. Indigo-2 (#f8f9ff + #4338ca — distinct from replydesk #4f46e5 by darker shade). Demo: search input "Senior React Developer London" → 3 job cards appear with match % badge → one expands showing AI fit analysis → Apply button.`,
    skills: `/animate /transitions-dev (card-resize) /seo-audit (JobPosting JSON-LD)`,
    files: `aijobsportal/app/globals.css — #f8f9ff + #4338ca
aijobsportal/app/components/JobMatchDemo.tsx — NEW
aijobsportal/app/layout.tsx — JobPosting JSON-LD`,
    success: `- [ ] 3 job cards appear with stagger + match % badge
- [ ] Card expand shows AI fit breakdown
- [ ] JobPosting JSON-LD in page source`
  },

  {
    name: 'ai-resume-screener — redesign plan',
    proposal: `Bulk resume screener. Dark violet-2 (#0c0f1a + #818cf8 — lighter indigo vs resumevault #7c3aed). Demo: 3 resume uploads animate → scan shimmer → 4 score rings fill in stagger (Skills/Experience/Culture/ATS) → ranked list appears → top candidate highlighted green.`,
    skills: `/animate (ring stagger fill, ranked list appear)`,
    files: `ai-resume-screener/app/globals.css — #0c0f1a + #818cf8
ai-resume-screener/app/components/ScreenerDemo.tsx — NEW`,
    success: `- [ ] 4 score rings fill with stagger (not simultaneous)
- [ ] Ranked candidate list appears after rings
- [ ] Top candidate highlighted
- [ ] Bulk upload gated, single upload free`
  },

  {
    name: 'protoforge — redesign plan',
    proposal: `UI prototyping tool. Dev tools dark theme (#080d1a + #6366f1 indigo — same bg as neuralos but different demo panel = OK differentiation). Demo: code snippet types left → live preview renders right in real time (debounced 300ms). Split screen. Inline code editor on landing.`,
    skills: `/animate (typewriter code + live preview reveal) /design-html (split-screen layout)`,
    files: `protoforge/app/globals.css — #080d1a + #6366f1
protoforge/app/components/LivePreviewDemo.tsx — NEW`,
    success: `- [ ] Code typewriter left panel
- [ ] Preview renders after 300ms debounce
- [ ] Inline editor works without login`
  },

  {
    name: 'idea-agent — redesign plan',
    proposal: `Business idea generator. Light #f9fafb + violet-3 #7c3aed (different usage from resumevault dark — here it's on white, not dark bg). Demo: topic "remote work tools" → spinner 1s → 6 idea cards appear in 2×3 grid with scale stagger → click one → full validation brief expands.`,
    skills: `/animate (grid stagger scale-in) /transitions-dev (brief expand)`,
    files: `idea-agent/app/globals.css — #f9fafb + #7c3aed
idea-agent/app/components/IdeaGridDemo.tsx — NEW`,
    success: `- [ ] 6 cards appear in grid with scale stagger (not fade only)
- [ ] Click/auto expand shows validation brief
- [ ] Generator runs without login`
  },

  {
    name: 'ai-toolkit — redesign plan',
    proposal: `AI tool directory. Sky-blue on dark (#0f172a + #38bdf8 — navy not near-black, differentiated). Manual: GoDaddy DNS A record → 76.76.21.21. Demo: search input → tool cards filter animated → category chips highlight → one tool expands.`,
    skills: `/animate (filter animation, card appear) /seo-audit`,
    files: `ai-toolkit/app/globals.css — #0f172a + #38bdf8`,
    success: `- [ ] aitoolkit.app resolves (after DNS fix)
- [ ] Filter animation smooth (not jump)
- [ ] Tool cards appear with stagger`
  },

  {
    name: 'clawdbotai — redesign plan',
    proposal: `Coding AI assistant. Warm white (#fff9f5 + #f97316 orange). Different from anylocal: coding product not local discovery. Demo: user types "Build a login form" → typing indicator → code block appears with syntax highlighting → copy button pulses.`,
    skills: `/animate (typing indicator, code appear) /transitions-dev (text-swap)`,
    files: `clawdbotai/app/globals.css — #fff9f5 + #f97316
clawdbotai/app/components/CodingChatDemo.tsx — NEW`,
    success: `- [ ] Typing indicator appears before code
- [ ] Code block has syntax highlighting
- [ ] Copy button pulses after code renders`
  },

  {
    name: 'firstline — redesign plan',
    proposal: `Cold email opening line generator. Fix ECONNREFUSED first (registrar check). Sky-blue SaaS (#f8fafc + #0ea5e9). Demo: LinkedIn URL input → AI analyses profile → 3 opening line variations type out in carousel → copy button per line.`,
    skills: `/animate (typewriter, carousel) /copywriting`,
    files: `firstline/app/globals.css — #f8fafc + #0ea5e9
firstline/app/components/OpeningLineDemo.tsx — NEW`,
    success: `- [ ] firstline.so resolves (after manual fix)
- [ ] 3 opening line variants in carousel
- [ ] Copy button per variant`
  },

  {
    name: 'ai-social-content — redesign plan',
    proposal: `Multi-platform social content generator. Fuchsia-pink (#fdf4ff + #c026d3 — distinct from voicejournal #8b5cf6 by hue and saturation). Demo: topic input → platform tabs (Twitter/LinkedIn/Instagram) switch → different content variants type for each → copy button.`,
    skills: `/animate /transitions-dev (tab-swap pattern)`,
    files: `ai-social-content/app/globals.css — #fdf4ff + #c026d3
ai-social-content/app/components/PlatformContentDemo.tsx — NEW`,
    success: `- [ ] Platform tab switch animates content swap
- [ ] Content types for each platform (not same copy)
- [ ] Core generation free (no auth gate)`
  },

  {
    name: 'homecanvas — redesign plan',
    proposal: `AI interior design. Ivory + warm stone (#fffdf7 + #78716c). Demo: room style selector pills (Modern/Scandi/Boho) → interior render appears via Ken Burns zoom → furniture swaps on style change. Generate hero room images via /higgsfield-generate nano_banana_2.`,
    skills: `/higgsfield-generate (generate room renders for hero)
/animate (Ken Burns zoom, furniture swap)
/image-gen (OG image from room render)`,
    files: `homecanvas/app/globals.css — #fffdf7 + #78716c
homecanvas/app/components/RoomStyleDemo.tsx — NEW`,
    success: `- [ ] 3 style pills → Ken Burns transition between renders
- [ ] Hero image is AI-generated room (not stock)
- [ ] Style selector works without auth`
  },

  {
    name: 'anylocal — redesign plan',
    proposal: `Local business discovery. Warm-white (#fffbf5 + #ea580c orange — same as aicoachlab bg but aicoachlab is #fff7ed, anylocal is #fffbf5 — different enough). Demo: location input "Birmingham" → business cards appear with stagger (cafe, salon, gym) + rating + distance → one expands with hours + CTA.`,
    skills: `/animate (card stagger appear) /transitions-dev (card-resize expand)`,
    files: `anylocal/app/globals.css — verify #fffbf5 + #ea580c
anylocal/app/components/BusinessListDemo.tsx — NEW`,
    success: `- [ ] Business cards appear with stagger
- [ ] One card expands with hours + call CTA
- [ ] Location search works without auth`
  },

];

// ── Step 3: find tasks and upsert rich cells ──────────────────────────────────
let updated = 0;
let notFound = 0;

for (const e of enrichments) {
  const tasks = await sql`SELECT id FROM tasks WHERE board_id=${BOARD_ID} AND title=${e.name}`;
  if (!tasks.length) {
    console.warn(`⚠ task not found: "${e.name}"`);
    notFound++;
    continue;
  }
  const taskId = tasks[0].id;
  const cells = [
    [colIds['Proposal'],         e.proposal],
    [colIds['Skills'],           e.skills],
    [colIds['Files to Touch'],   e.files],
    [colIds['Success Criteria'], e.success],
  ];
  for (const [colId, value] of cells) {
    if (!value || !colId) continue;
    await sql`
      INSERT INTO cell_values (task_id, column_id, value)
      VALUES (${taskId}, ${colId}, ${JSON.stringify(value)})
      ON CONFLICT (task_id, column_id) DO UPDATE SET value = EXCLUDED.value
    `;
  }
  console.log(`✓ enriched: ${e.name}`);
  updated++;
}

console.log(`\nDone — ${updated} cards enriched, ${notFound} not found.`);
