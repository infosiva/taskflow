'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import FeedbackWidget from '@/components/FeedbackWidget'

const TASKS_TODO = [
  { id: 't1', title: 'Design system v2', assignee: 'Sara', priority: 'High', due: 'Today' },
  { id: 't2', title: 'Mobile onboarding', assignee: 'You', priority: 'High', due: 'Jun 12' },
]
const TASKS_DOING = [
  { id: 't3', title: 'API rate limiting', assignee: 'Kai', priority: 'Medium', due: 'Jun 10' },
  { id: 't4', title: 'Fix auth edge case', assignee: 'Sara', priority: 'High', due: 'Jun 9' },
]
const TASKS_DONE = [
  { id: 't5', title: 'Write release notes', assignee: 'Mo', priority: 'Low', due: 'Jun 6' },
]

const PRIORITY_COLOR: Record<string, string> = { High: '#f87171', Medium: '#fb923c', Low: '#64748b' }
const ASSIGNEE_BG: Record<string, string> = {
  Sara: 'rgba(99,102,241,0.18)', Kai: 'rgba(245,158,11,0.18)', You: 'rgba(20,184,166,0.18)', Mo: 'rgba(167,139,250,0.18)',
}
const ASSIGNEE_FG: Record<string, string> = {
  Sara: '#a5b4fc', Kai: '#fcd34d', You: '#5eead4', Mo: '#c4b5fd',
}

const AI_COMMANDS = [
  'Auto-assign "API rate limiting" → Kai (3 open tasks)',
  'Risk flag: 2 tickets overdue before standup',
  'Sprint summary: 5 done · 3 blocked · ETA on track',
]

const GAP_ITEMS = [
  { icon: '⚡', label: 'AI auto-assign', desc: 'Assigns by load + history. Zero guessing.', tag: 'Free tier' },
  { icon: '🚨', label: 'Risk flag before standup', desc: 'Surfaces blockers 1h before your daily.', tag: 'Unique' },
  { icon: '📊', label: 'Sprint summary in 2s', desc: 'One line. Done / blocked / at-risk.', tag: 'Free tier' },
  { icon: '🤖', label: 'Agent activity feed', desc: 'Bots post deploy status to your board.', tag: 'New' },
  { icon: '⬛', label: 'Compact 28px density', desc: 'See 3x more tasks. Jira veterans: this.', tag: 'Now' },
  { icon: '🚀', label: 'No-login demo', desc: 'Touch the board before any account.', tag: 'Try it' },
]

export default function LandingPage() {
  const [ready, setReady] = useState(false)
  const [compact, setCompact] = useState(false)
  const [aiText, setAiText] = useState('')
  const [aiIdx, setAiIdx] = useState(0)
  const [dragging, setDragging] = useState<string | null>(null)
  const [doneTasks, setDoneTasks] = useState(TASKS_DONE)
  const [todoTasks, setTodoTasks] = useState(TASKS_TODO)
  const [doingTasks, setDoingTasks] = useState(TASKS_DOING)
  const aiRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const cmd = AI_COMMANDS[aiIdx % AI_COMMANDS.length]
    let i = 0
    setAiText('')
    const type = () => {
      if (i < cmd.length) {
        setAiText(cmd.slice(0, i + 1))
        i++
        aiRef.current = setTimeout(type, 35)
      }
    }
    const start = setTimeout(type, 500)
    const cycle = setTimeout(() => { setAiIdx(p => p + 1) }, 5800)
    return () => {
      clearTimeout(start); clearTimeout(cycle)
      if (aiRef.current) clearTimeout(aiRef.current)
    }
  }, [aiIdx])

  const rowH = compact ? 28 : 38
  const textSz = compact ? 11 : 12.5

  const renderTask = (task: typeof TASKS_TODO[0]) => (
    <div
      key={task.id}
      draggable
      onDragStart={() => setDragging(task.id)}
      onDragEnd={() => setDragging(null)}
      style={{
        height: rowH, display: 'flex', alignItems: 'center', gap: 6,
        padding: compact ? '0 8px' : '0 10px',
        borderRadius: 6,
        background: dragging === task.id ? 'rgba(20,184,166,0.12)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${dragging === task.id ? 'rgba(20,184,166,0.40)' : 'rgba(255,255,255,0.08)'}`,
        marginBottom: compact ? 3 : 5, cursor: 'grab',
        transform: dragging === task.id ? 'scale(1.02) rotate(1deg)' : 'none',
        boxShadow: dragging === task.id ? '0 4px 16px rgba(20,184,166,0.18)' : 'none',
        transition: 'transform 100ms cubic-bezier(0.23,1,0.32,1),box-shadow 100ms cubic-bezier(0.23,1,0.32,1)',
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: PRIORITY_COLOR[task.priority], flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: textSz, fontWeight: 500, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</span>
      <span style={{ fontSize: textSz - 1, fontWeight: 600, padding: '1px 5px', borderRadius: 3, background: ASSIGNEE_BG[task.assignee] || 'rgba(255,255,255,0.08)', color: ASSIGNEE_FG[task.assignee] || 'rgba(255,255,255,0.5)', flexShrink: 0 }}>{task.assignee}</span>
      {!compact && <span style={{ fontSize: 10.5, color: task.due === 'Today' ? '#f87171' : 'rgba(255,255,255,0.28)', fontWeight: task.due === 'Today' ? 600 : 400, flexShrink: 0 }}>{task.due}</span>}
    </div>
  )

  const dropToCol = (col: 'todo' | 'doing' | 'done') => {
    if (!dragging) return
    const allTasks = [...todoTasks, ...doingTasks, ...doneTasks]
    const task = allTasks.find(t => t.id === dragging)
    if (!task) return
    const remove = (arr: typeof TASKS_TODO) => arr.filter(t => t.id !== dragging)
    setTodoTasks(remove(todoTasks)); setDoingTasks(remove(doingTasks)); setDoneTasks(remove(doneTasks))
    if (col === 'todo') setTodoTasks(p => [...remove(p), task])
    if (col === 'doing') setDoingTasks(p => [...remove(p), task])
    if (col === 'done') setDoneTasks(p => [...remove(p), task])
    setDragging(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0b', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        .tf-cta-main{display:inline-flex;align-items:center;gap:8px;background:#14b8a6;color:#fff;padding:13px 24px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:-.01em;transition:transform 160ms cubic-bezier(0.23,1,0.32,1),box-shadow 160ms cubic-bezier(0.23,1,0.32,1),opacity 160ms ease}
        .tf-cta-main:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(20,184,166,.35);opacity:.92}
        .tf-cta-main:active{transform:scale(.97);box-shadow:none}
        .tf-cta-ghost{display:inline-flex;align-items:center;gap:6px;color:rgba(255,255,255,0.65);padding:13px 20px;border-radius:8px;font-size:14px;font-weight:500;text-decoration:none;border:1px solid rgba(255,255,255,0.12);transition:background 120ms ease,border-color 120ms ease,transform 160ms cubic-bezier(0.23,1,0.32,1)}
        .tf-cta-ghost:hover{background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.22)}
        .tf-cta-ghost:active{transform:scale(.97)}
        .tf-pill{display:inline-flex;align-items:center;gap:5px;background:rgba(20,184,166,0.10);border:1px solid rgba(20,184,166,0.25);border-radius:20px;padding:4px 11px;font-size:11.5px;font-weight:600;color:#5eead4;letter-spacing:.04em}
        .tf-density-btn{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.10);border-radius:6px;padding:4px 10px;font-size:11px;font-weight:600;color:rgba(255,255,255,0.45);cursor:pointer;transition:background 100ms ease,border-color 100ms ease,transform 100ms ease}
        .tf-density-btn:hover{background:rgba(255,255,255,0.10);border-color:rgba(255,255,255,0.20)}
        .tf-density-btn:active{transform:scale(.97)}
        .tf-gap-card{padding:16px;border-radius:10px;border:1px solid rgba(255,255,255,0.07);transition:border-color 150ms ease,box-shadow 150ms ease,transform 200ms cubic-bezier(0.23,1,0.32,1);cursor:default;background:rgba(255,255,255,0.025)}
        .tf-gap-card:hover{border-color:rgba(20,184,166,0.25);box-shadow:0 2px 24px rgba(20,184,166,0.08);transform:translateY(-2px)}
        @keyframes tf-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes tf-fade{from{opacity:0}to{opacity:1}}
        @keyframes tf-col-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes tf-blink{0%,100%{opacity:1}50%{opacity:0}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
        @media(max-width:960px){.tf-grid{grid-template-columns:1fr!important}.tf-demo-panel{display:none!important}.tf-mobile-strip{display:flex!important}}
        @media(max-width:640px){
          .tf-nav{padding:0 16px!important}
          .tf-hero-section{padding:28px 20px 36px!important}
          .tf-gap-section{padding:0 20px 40px!important}
          .tf-bottom-cta{padding:40px 20px!important}
          .tf-mobile-strip{padding:0 20px 28px!important}
          .tf-nav-demo-btn{font-size:12px!important;padding:6px 10px!important}
          .tf-nav-demo-btn .tf-btn-long{display:none!important}
          .tf-nav-demo-btn .tf-btn-short{display:inline!important}
          .tf-gap-grid{grid-template-columns:repeat(2,1fr)!important}
        }
        @media(max-width:480px){
          .tf-hero-h1{font-size:32px!important}
          .tf-gap-grid{grid-template-columns:1fr!important}
        }
      `}</style>

      {/* Gradient mesh */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '55%', height: '65%', background: 'radial-gradient(ellipse at 30% 30%, rgba(20,184,166,0.18) 0%, rgba(6,182,212,0.07) 45%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '55%', height: '65%', background: 'radial-gradient(ellipse at 70% 70%, rgba(245,158,11,0.14) 0%, rgba(234,88,12,0.06) 45%, transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.038) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
      </div>

      {/* Nav — no dead links */}
      <nav className="tf-nav" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,10,11,0.80)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 32px', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: ready ? 'tf-fade 200ms ease-out both' : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, position: 'relative', zIndex: 1 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="3" y="3" width="5" height="18" rx="1.5" fill="rgba(20,184,166,0.7)" />
              <rect x="10" y="3" width="5" height="13" rx="1.5" fill="rgba(20,184,166,0.45)" />
              <rect x="17" y="3" width="5" height="9" rx="1.5" fill="rgba(20,184,166,0.25)" />
            </svg>
            <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: '-0.03em', color: '#fff' }}>Task<span style={{ color: '#14b8a6' }}>Flow</span></span>
          </Link>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <a href="#why" style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.42)', textDecoration: 'none', padding: '4px 8px', borderRadius: 5, transition: 'color 120ms ease' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.82)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.42)')}>
              Why TaskFlow
            </a>
            <Link href="/migrate" style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.42)', textDecoration: 'none', padding: '4px 8px', borderRadius: 5, transition: 'color 120ms ease' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.82)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.42)')}>
              Migrate
            </Link>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <Link href="/login" style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.42)', textDecoration: 'none', padding: '6px 12px', transition: 'color 120ms ease' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.42)')}>
            Log in
          </Link>
          <Link href="/demo" className="tf-cta-main tf-nav-demo-btn" style={{ padding: '7px 15px', fontSize: 13 }}>
            <span className="tf-btn-long">Try demo — no login</span>
            <span className="tf-btn-short" style={{ display: 'none' }}>Demo</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </nav>

      {/* Hero — compact, above fold */}
      <section className="tf-hero-section" style={{ maxWidth: 1240, margin: '0 auto', padding: '44px 32px 52px', position: 'relative', zIndex: 1 }}>
        <div className="tf-grid" style={{ display: 'grid', gridTemplateColumns: '42% 58%', gap: 48, alignItems: 'start', animation: ready ? 'tf-up 360ms cubic-bezier(0.23,1,0.32,1) 40ms both' : 'none' }}>

          {/* Left */}
          <div style={{ paddingTop: 4 }}>
            <div className="tf-pill" style={{ marginBottom: 16 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#14b8a6', display: 'inline-block' }} />
              REPLACE JIRA. FREE FOREVER.
            </div>

            <h1 className="tf-hero-h1" style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.07, letterSpacing: '-0.04em', color: '#fff', marginBottom: 14 }}>
              Sprint board with<br />
              <span style={{ color: '#14b8a6' }}>AI that acts.</span>
            </h1>

            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6, maxWidth: 380, marginBottom: 24, fontWeight: 400 }}>
              Jira without the bloat. Linear without the price. AI auto-assigns, risk-flags before standups, and summarises sprints — free.
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
              <Link href="/demo" className="tf-cta-main">
                Try live demo
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link href="/signup" className="tf-cta-ghost">Create free workspace</Link>
            </div>
            <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.25)' }}>Free forever · 5 boards · 5 members · 20 AI calls/month</p>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 24, marginTop: 28, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              {[
                { v: '4', l: 'Views' },
                { v: '8', l: 'Column types' },
                { v: '< 4 min', l: 'First sprint' },
                { v: '20', l: 'Free AI/mo' },
              ].map(s => (
                <div key={s.l}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#14b8a6', letterSpacing: '-0.03em' }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* How it works — inline, compact */}
            <div style={{ marginTop: 28, display: 'flex', gap: 0, alignItems: 'center' }}>
              {[
                { n: '1', l: 'Try demo' },
                { n: '2', l: 'Create workspace' },
                { n: '3', l: 'Import or start' },
                { n: '4', l: 'AI triages' },
              ].map((step, i) => (
                <div key={step.n} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#14b8a6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>{step.n}</div>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 600, whiteSpace: 'nowrap' }}>{step.l}</span>
                  </div>
                  {i < 3 && <div style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.10)', margin: '-10px 4px 0' }} />}
                </div>
              ))}
            </div>
          </div>

          {/* Right: live kanban demo */}
          <div className="tf-demo-panel" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 14, boxShadow: '0 4px 40px rgba(0,0,0,0.40)', overflow: 'hidden', animation: ready ? 'tf-up 380ms cubic-bezier(0.23,1,0.32,1) 80ms both' : 'none' }}>
            <div style={{ padding: '9px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', gap: 5 }}>
                {['rgba(248,113,113,0.7)', 'rgba(251,191,36,0.7)', 'rgba(52,211,153,0.7)'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
              </div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)', fontWeight: 500, flex: 1 }}>Sprint 4 · Engineering</span>
              <button className="tf-density-btn" onClick={() => setCompact(p => !p)} title="Toggle compact rows">
                {compact ? '≡ Normal' : '≡ Compact'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, padding: 10, minHeight: 240 }}>
              {(
                [
                  { label: 'Todo', accent: 'rgba(255,255,255,0.30)', tasks: todoTasks, col: 'todo' as const },
                  { label: 'In Progress', accent: '#14b8a6', tasks: doingTasks, col: 'doing' as const },
                  { label: 'Done', accent: '#34d399', tasks: doneTasks, col: 'done' as const },
                ] as const
              ).map(({ label, accent, tasks, col }, ci) => (
                <div
                  key={col}
                  style={{ flex: 1, minWidth: 0, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: compact ? '8px 8px 6px' : '10px 10px 8px', transition: 'background 150ms ease' }}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => dropToCol(col)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: compact ? 6 : 8 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: accent }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '.04em', textTransform: 'uppercase' }}>{label}</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '1px 6px', marginLeft: 'auto' }}>{tasks.length}</span>
                  </div>
                  <div style={{ animation: ready ? `tf-col-in 320ms cubic-bezier(0.23,1,0.32,1) ${100 + ci * 80}ms both` : 'none' }}>
                    {tasks.map(renderTask)}
                  </div>
                </div>
              ))}
            </div>

            {/* AI command bar */}
            <div style={{ margin: '0 10px 10px', background: 'rgba(20,184,166,0.07)', border: '1px solid rgba(20,184,166,0.20)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 22, height: 22, borderRadius: 5, background: 'linear-gradient(135deg,#14b8a6,#0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 500, color: '#5eead4', flex: 1, minHeight: 14 }}>
                {aiText}
                <span style={{ animation: 'tf-blink 1s step-end infinite', borderLeft: '1.5px solid #14b8a6', marginLeft: 1 }}>&nbsp;</span>
              </span>
              <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.25)', fontWeight: 500, flexShrink: 0 }}>AI ·</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile feature strip */}
      <div className="tf-mobile-strip" style={{ display: 'none', overflowX: 'auto', gap: 10, padding: '0 16px 28px', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', position: 'relative', zIndex: 1 }}>
        {[
          { icon: '⚡', label: 'AI auto-assign', sub: 'Context-aware. Zero guessing.' },
          { icon: '🚨', label: 'Risk flags', sub: 'Surfaces blockers before standup' },
          { icon: '⬛', label: 'Compact mode', sub: '28px rows. 3x more on screen.' },
          { icon: '📊', label: '4 views', sub: 'Kanban · Table · Calendar · Dash' },
        ].map((card) => (
          <div key={card.label} style={{ flexShrink: 0, scrollSnapAlign: 'start', width: 156, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 22, marginBottom: 8, lineHeight: 1 }}>{card.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 4 }}>{card.label}</div>
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.38)', lineHeight: 1.5 }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Why TaskFlow — competitor gap section */}
      <section id="why" className="tf-gap-section" style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px 60px', position: 'relative', zIndex: 1, animation: ready ? 'tf-up 360ms cubic-bezier(0.23,1,0.32,1) 140ms both' : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 6 }}>WHY TASKFLOW</p>
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.025em', color: '#fff' }}>
              What Jira, Linear & Monday <span style={{ color: '#f87171' }}>don&apos;t</span> do
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.25)', color: '#5eead4' }}>Free tier</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', color: '#c4b5fd' }}>AI-native</span>
          </div>
        </div>

        <div className="tf-gap-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {GAP_ITEMS.map(item => (
            <div key={item.label} className="tf-gap-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)', color: '#5eead4', letterSpacing: '.03em' }}>{item.tag}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: 5, letterSpacing: '-0.01em' }}>{item.label}</div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.36)', lineHeight: 1.55 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Migrate CTA */}
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.80)' }}>Already on Jira or Trello? </span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.40)' }}>Import your board in under 2 minutes.</span>
          </div>
          <Link href="/migrate" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(20,184,166,0.10)', border: '1px solid rgba(20,184,166,0.25)', borderRadius: 7, padding: '7px 14px', fontSize: 12.5, fontWeight: 700, color: '#14b8a6', textDecoration: 'none', transition: 'background 120ms ease', whiteSpace: 'nowrap' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(20,184,166,0.18)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(20,184,166,0.10)')}>
            Migrate now →
          </Link>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '52px 32px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: 4, textAlign: 'center' }}>Simple pricing. AI included free.</h2>
          <p style={{ textAlign: 'center', fontSize: 13.5, color: 'rgba(255,255,255,0.35)', marginBottom: 32 }}>No surprise charges for AI. No per-seat tax on basic features.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {[
              {
                name: 'Free', price: '$0', period: 'forever',
                color: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.08)',
                badge: null,
                features: ['3 boards', '20 AI calls / month', 'Kanban + Table views', 'Jira / Trello import', '1 workspace'],
                cta: 'Start free', href: '/signup',
              },
              {
                name: 'Pro', price: '$9', period: '/ month',
                color: 'rgba(20,184,166,0.08)', border: 'rgba(20,184,166,0.30)',
                badge: 'Most popular',
                features: ['Unlimited boards', '200 AI calls / month', 'All 4 views', 'Timeline + Calendar', 'Priority support'],
                cta: 'Get Pro', href: '/signup?plan=pro',
              },
              {
                name: 'Team', price: '$19', period: '/ month',
                color: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.30)',
                badge: null,
                features: ['Everything in Pro', 'Unlimited AI calls', '5 workspaces', 'Agent Ops dashboard', 'Custom integrations'],
                cta: 'Get Team', href: '/signup?plan=team',
              },
            ].map(plan => (
              <div key={plan.name} style={{ background: plan.color, border: `1px solid ${plan.border}`, borderRadius: 12, padding: '22px 20px', position: 'relative', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {plan.badge && (
                  <span style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#14b8a6', color: '#000', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>{plan.badge}</span>
                )}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{plan.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>{plan.price}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{plan.period}</span>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.70)' }}>
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M3 8l3.5 3.5L13 4" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} style={{ display: 'block', textAlign: 'center', padding: '10px 0', borderRadius: 7, fontSize: 13, fontWeight: 700, color: plan.name === 'Free' ? 'rgba(255,255,255,0.65)' : '#000', background: plan.name === 'Free' ? 'rgba(255,255,255,0.08)' : '#14b8a6', textDecoration: 'none', marginTop: 'auto', transition: 'opacity 120ms ease' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.20)' }}>All plans include unlimited team members on the free tier. Upgrade for more AI + boards.</p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '48px 32px', textAlign: 'center', position: 'relative', zIndex: 1, animation: ready ? 'tf-fade 380ms ease-out 220ms both' : 'none' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: 8 }}>First sprint in under 4 minutes.</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', marginBottom: 24, fontSize: 15 }}>Touch the board before signing up. That&apos;s the deal.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/demo" className="tf-cta-main" style={{ fontSize: 15, padding: '13px 26px' }}>
            Launch live demo
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
          <Link href="/signup" className="tf-cta-ghost" style={{ fontSize: 15, padding: '13px 20px' }}>Create free workspace</Link>
        </div>
        <p style={{ marginTop: 12, fontSize: 11.5, color: 'rgba(255,255,255,0.20)' }}>No credit card. No account needed to try.</p>
      </section>

      <FeedbackWidget />

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, position: 'relative', zIndex: 1 }}>
        <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }}>Task<span style={{ color: '#14b8a6' }}>Flow</span></span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.20)' }}>© 2026 · Built with AI in Britain</span>
        <div style={{ display: 'flex', gap: 18 }}>
          {['Privacy', 'Terms'].map(l => <a key={l} href={`/${l.toLowerCase()}`} style={{ fontSize: 12, color: 'rgba(255,255,255,0.20)', textDecoration: 'none' }}>{l}</a>)}
        </div>
      </footer>
    </div>
  )
}
