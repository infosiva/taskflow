// Run: npx tsx scripts/seed-audits.ts
// Seeds completed portfolio project audits into the TaskFlow DB via the API

const BASE_URL = process.env.TASKFLOW_URL || 'http://localhost:3000'
const API_KEY = process.env.AGENT_API_KEY || ''

if (!API_KEY) {
  console.error('AGENT_API_KEY env var required')
  process.exit(1)
}

const audits = [
  {
    project: 'speakiq',
    pattern: 'dark-teal',
    fakeDataFound: true,
    fakeDataDetails: ['Hardcoded "10,000+ learners" stat', 'Fabricated testimonial names'],
    topFixes: [
      'Remove hardcoded stats — use real counters or feature pills',
      'Remove http://31.97.56.148:3098/t.js tracker script',
      'Add floating chatbot (Groq Llama 3.3)',
      'Add feedback section (DB-backed)',
      'Wire sitemap.ts + robots.txt',
    ],
    layoutDirections: [
      { title: 'Conversation Sim', description: 'Animated AI conversation panel cycling through speaking prompts' },
      { title: 'Pronunciation Waveform', description: 'Live audio waveform on right panel, pulses as demo plays' },
    ],
    chatbotPresent: false,
    feedbackPresent: false,
    sitemapPresent: false,
    robotsPresent: false,
    ogImagePresent: true,
    httpTrackerFound: true,
  },
  {
    project: 'resumevault',
    pattern: 'dark-indigo',
    fakeDataFound: true,
    fakeDataDetails: ['Fake "500+ resumes reviewed" counter', 'Fabricated recruiter quotes'],
    topFixes: [
      'Remove http://31.97.56.148:3098/t.js tracker',
      'Replace fake stats with feature benefit pills',
      'Add chatbot scoped to resume advice',
      'Add feedback section',
      'Fix OG image to .png (not SVG)',
    ],
    layoutDirections: [
      { title: 'Resume Builder Preview', description: 'Live resume card on right cycling through sections as user scrolls' },
      { title: 'Score Meter', description: 'Animated score dial going from 45 → 92 in demo' },
    ],
    chatbotPresent: false,
    feedbackPresent: false,
    sitemapPresent: true,
    robotsPresent: true,
    ogImagePresent: false,
    httpTrackerFound: true,
  },
  {
    project: 'quizbites',
    pattern: 'dark-purple',
    fakeDataFound: true,
    fakeDataDetails: ['Hardcoded "1M+ quizzes taken" on hero', '"Featured in TechCrunch" badge (unverified)'],
    topFixes: [
      'Remove http://31.97.56.148:3098/t.js tracker',
      'Remove unverified press logos',
      'Remove fake play counts',
      'Add feedback section',
      'Animate quiz card flip on right panel',
    ],
    layoutDirections: [
      { title: 'Quiz Card Flipper', description: 'Right panel shows question card flipping to reveal answer on loop' },
      { title: 'Category Exploder', description: 'Grid of subject tiles that expand on hover showing sample Q' },
    ],
    chatbotPresent: false,
    feedbackPresent: false,
    sitemapPresent: true,
    robotsPresent: true,
    ogImagePresent: true,
    httpTrackerFound: true,
  },
  {
    project: 'myvitals',
    pattern: 'health-white',
    fakeDataFound: true,
    fakeDataDetails: ['Fake "4.9/5 stars" rating', 'Fabricated "Dr. Smith" testimonial'],
    topFixes: [
      'Remove http://31.97.56.148:3098/t.js tracker',
      'Remove fabricated medical testimonials',
      'Use #f8fafc white bg + teal accent (health category)',
      'Add chatbot for health Q&A (gated)',
      'Add feedback section',
    ],
    layoutDirections: [
      { title: 'Vitals Dashboard', description: 'Right panel shows animated health metrics (BP, HR, glucose) updating live' },
      { title: 'Trend Chart', description: 'Minimal sparkline chart on right animating upward trend' },
    ],
    chatbotPresent: false,
    feedbackPresent: false,
    sitemapPresent: false,
    robotsPresent: false,
    ogImagePresent: false,
    httpTrackerFound: true,
  },
  {
    project: 'worldtrends',
    pattern: 'dark-cyan',
    fakeDataFound: false,
    fakeDataDetails: [],
    topFixes: [
      'Remove http://31.97.56.148:3098/t.js tracker',
      'Add chatbot for trend Q&A',
      'Add feedback section',
      'Wire JSON-LD WebSite schema',
    ],
    layoutDirections: [
      { title: 'Live Ticker', description: 'Right panel shows trending topic cards scrolling in vertically' },
      { title: 'Globe Pulse', description: '3D globe with pulsing hotspots for current trends' },
    ],
    chatbotPresent: false,
    feedbackPresent: false,
    sitemapPresent: true,
    robotsPresent: true,
    ogImagePresent: true,
    httpTrackerFound: true,
  },
  {
    project: 'draftcal',
    pattern: 'productivity-white',
    fakeDataFound: true,
    fakeDataDetails: ['Fake "50+ templates" count'],
    topFixes: [
      'Remove http://31.97.56.148:3098/t.js tracker',
      'Evaluate merge with ai-social-content (near-identical problem space)',
      'Remove fake template count',
      'Add chatbot for content Q&A',
      'Add feedback section',
    ],
    consolidationNote: 'MERGE CANDIDATE: draftcal + ai-social-content solve nearly identical problem. Consider merging into single product with calendar view + platform picker.',
    layoutDirections: [
      { title: 'Calendar Grid', description: 'Animated content calendar right panel with posts populating by day' },
      { title: 'Platform Switcher', description: 'Post preview panel cycling through Twitter/LinkedIn/IG formats' },
    ],
    chatbotPresent: false,
    feedbackPresent: false,
    sitemapPresent: true,
    robotsPresent: true,
    ogImagePresent: true,
    httpTrackerFound: true,
  },
  {
    project: 'trackwealth',
    pattern: 'fintech-navy',
    fakeDataFound: true,
    fakeDataDetails: ['Fabricated portfolio return percentages on hero'],
    topFixes: [
      'Remove http://31.97.56.148:3098/t.js tracker',
      'Remove fake portfolio numbers',
      'Use #0b1120 dark navy + #10b981 emerald (fintech palette)',
      'Animated portfolio chart on right panel',
      'Add feedback section',
    ],
    layoutDirections: [
      { title: 'Portfolio Line Chart', description: 'Animated wealth curve on right, smooth upward trend' },
      { title: 'Asset Breakdown', description: 'Donut chart animating in from center showing allocation' },
    ],
    chatbotPresent: false,
    feedbackPresent: false,
    sitemapPresent: true,
    robotsPresent: true,
    ogImagePresent: true,
    httpTrackerFound: true,
  },
  {
    project: 'roamplan',
    pattern: 'travel-green',
    fakeDataFound: true,
    fakeDataDetails: ['Fake "100+ destinations" counter', 'Hardcoded 4.8 rating'],
    topFixes: [
      'Remove http://31.97.56.148:3098/t.js tracker',
      'Remove fake stats',
      'Use #f0fdf4 green-tint bg + #059669 green accent (travel palette)',
      'Add itinerary animation demo on right',
      'Add feedback section',
    ],
    layoutDirections: [
      { title: 'Itinerary Builder', description: 'Day-by-day plan populating on right as if AI is typing it live' },
      { title: 'Map Preview', description: 'Minimal map with route pins dropping sequentially' },
    ],
    chatbotPresent: false,
    feedbackPresent: false,
    sitemapPresent: true,
    robotsPresent: true,
    ogImagePresent: true,
    httpTrackerFound: true,
  },
  {
    project: 'ai-social-content',
    pattern: 'creative-violet',
    fakeDataFound: true,
    fakeDataDetails: ['Fake engagement metrics on example posts'],
    topFixes: [
      'Evaluate merge with draftcal',
      'Remove fake engagement numbers',
      'Use #fafafa bg + #7c3aed violet (creative palette)',
      'Animated post-generation demo',
      'Add feedback section',
    ],
    consolidationNote: 'MERGE CANDIDATE: Near-identical scope to draftcal. If not merging, differentiate on platform-native voice (tone AI vs calendar planning).',
    layoutDirections: [
      { title: 'Content Generator', description: 'Live typing animation generating a post for each platform in sequence' },
      { title: 'Platform Preview Stack', description: 'Stacked phone mockups for Twitter/LinkedIn/IG updating simultaneously' },
    ],
    chatbotPresent: false,
    feedbackPresent: false,
    sitemapPresent: false,
    robotsPresent: false,
    ogImagePresent: false,
    httpTrackerFound: false,
  },
  {
    project: 'complybuddy',
    pattern: 'productivity-white',
    fakeDataFound: false,
    fakeDataDetails: [],
    topFixes: [
      'Add animated compliance checklist demo on right panel',
      'Add chatbot scoped to compliance Q&A',
      'Add feedback section',
      'Wire JSON-LD schema',
    ],
    layoutDirections: [
      { title: 'Compliance Checklist', description: 'Right panel shows checkboxes auto-checking as AI scans document' },
      { title: 'Risk Score', description: 'Risk meter animating from red to green as fixes are applied' },
    ],
    chatbotPresent: false,
    feedbackPresent: false,
    sitemapPresent: true,
    robotsPresent: true,
    ogImagePresent: true,
    httpTrackerFound: false,
  },
  {
    project: 'billslash',
    pattern: 'fintech-navy',
    fakeDataFound: true,
    fakeDataDetails: ['Hardcoded "Save up to 40%" claim without source'],
    topFixes: [
      'Remove unsubstantiated savings claim',
      'Use fintech palette (#0b1120 + #10b981)',
      'Animated bill reduction visualization on right',
      'Add chatbot for bill Q&A',
      'Add feedback + sitemap',
    ],
    layoutDirections: [
      { title: 'Bill Slasher', description: 'Right panel animates a bill total counting down after AI optimization' },
      { title: 'Subscription Grid', description: 'Grid of service cards with cost badges, some strike-through as AI removes' },
    ],
    chatbotPresent: false,
    feedbackPresent: false,
    sitemapPresent: false,
    robotsPresent: false,
    ogImagePresent: false,
    httpTrackerFound: false,
  },
  {
    project: 'neuralos',
    pattern: 'dark-purple',
    fakeDataFound: false,
    fakeDataDetails: [],
    topFixes: [
      'Differentiate palette from quizbites (both dark-purple)',
      'Add chatbot scoped to OS/agent Q&A',
      'Add feedback section',
      'Verify sitemap + robots',
    ],
    layoutDirections: [
      { title: 'Agent Terminal', description: 'Right panel shows agent task queue processing in real-time (matrix-style)' },
      { title: 'OS Dashboard', description: 'Minimal OS-style window with running agent processes listed' },
    ],
    chatbotPresent: false,
    feedbackPresent: false,
    sitemapPresent: true,
    robotsPresent: true,
    ogImagePresent: true,
    httpTrackerFound: false,
  },
  {
    project: 'quicktech',
    pattern: 'productivity-white',
    fakeDataFound: true,
    fakeDataDetails: ['Fake "1000+ issues resolved" counter'],
    topFixes: [
      'Remove fake issue count',
      'Differentiate from complybuddy (both productivity-white)',
      'Add animated tech support chat on right panel',
      'Add feedback section',
    ],
    layoutDirections: [
      { title: 'Support Chat', description: 'Right panel shows AI support chat auto-resolving a sample tech issue' },
      { title: 'Issue Tracker', description: 'Kanban-style mini board with issue cards moving from Open → Resolved' },
    ],
    chatbotPresent: false,
    feedbackPresent: false,
    sitemapPresent: false,
    robotsPresent: false,
    ogImagePresent: false,
    httpTrackerFound: false,
  },
  {
    project: 'pixelforge',
    pattern: 'gaming-navy',
    fakeDataFound: false,
    fakeDataDetails: [],
    topFixes: [
      'Ensure #0f0f23 deep navy + #f59e0b amber (gaming palette)',
      'Add chatbot scoped to game asset Q&A',
      'Add feedback section',
      'Wire OG image',
    ],
    layoutDirections: [
      { title: 'Asset Generator', description: 'Right panel cycles through AI-generated pixel art sprites on loop' },
      { title: 'Phaser Preview', description: 'Mini Phaser game demo running in right panel' },
    ],
    chatbotPresent: false,
    feedbackPresent: false,
    sitemapPresent: true,
    robotsPresent: true,
    ogImagePresent: false,
    httpTrackerFound: false,
  },
  {
    project: 'kwizzo',
    pattern: 'gaming-navy',
    fakeDataFound: true,
    fakeDataDetails: ['Fake "500+ quizzes played tonight" live counter'],
    topFixes: [
      'Remove fake live counter (show real if available, else remove)',
      'Differentiate from pixelforge (both gaming-navy)',
      'Add feedback section',
      'Chatbot for quiz host help',
    ],
    layoutDirections: [
      { title: 'Live Quiz Panel', description: 'Right panel shows quiz podium with scores updating live' },
      { title: 'Question Card', description: 'Multiple choice card with countdown timer ticking' },
    ],
    chatbotPresent: false,
    feedbackPresent: false,
    sitemapPresent: true,
    robotsPresent: true,
    ogImagePresent: true,
    httpTrackerFound: false,
  },
  {
    project: 'taskflow',
    pattern: 'dark-teal',
    fakeDataFound: false,
    fakeDataDetails: [],
    topFixes: [
      'Wire per-project agent boards — each portfolio project posts activity here',
      'Add feedback section (DB-backed, no auth)',
      'Wire reportToTaskFlow into all AI routes',
    ],
    layoutDirections: [
      { title: 'Agent Ops Dashboard', description: 'Live feed of all portfolio agent runs with status + cost' },
      { title: 'Migration Import Flow', description: 'Jira/Trello/GitHub → TaskFlow in < 2 min' },
    ],
    chatbotPresent: true,
    feedbackPresent: false,
    sitemapPresent: true,
    robotsPresent: true,
    ogImagePresent: true,
    httpTrackerFound: false,
  },
]

async function seed() {
  let ok = 0
  let fail = 0

  for (const audit of audits) {
    try {
      const res = await fetch(`${BASE_URL}/api/agent/audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(audit),
      })
      if (res.ok) {
        const d = await res.json()
        console.log(`✓ ${audit.project} — ${d.created ? 'created' : 'updated'}`)
        ok++
      } else {
        const d = await res.text()
        console.error(`✗ ${audit.project} — ${res.status}: ${d}`)
        fail++
      }
    } catch (err) {
      console.error(`✗ ${audit.project} — network error:`, err)
      fail++
    }
  }

  console.log(`\nDone: ${ok} ok, ${fail} failed`)
}

seed()
