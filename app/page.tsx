'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

// Design: asymmetric split — left 45% copy, right 55% LIVE interactive demo
// Research finding: No competitor lets you touch the product before login. We do.
// Emil rules: scale(0.97) :active, cubic-bezier(0.23,1,0.32,1), no scale(0), no transition:all
// AI typewriter command bar cycles 3 commands every 6s
// Density toggle: compact (28px rows) vs normal — Jira refugee feature

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

const PRIORITY_COLOR: Record<string, string> = { High: '#ef4444', Medium: '#f97316', Low: '#94a3b8' }
const ASSIGNEE_BG: Record<string, string> = {
  Sara: '#dbeafe', Kai: '#fef3c7', You: '#dcfce7', Mo: '#f3e8ff',
}
const ASSIGNEE_FG: Record<string, string> = {
  Sara: '#1d4ed8', Kai: '#92400e', You: '#15803d', Mo: '#7c3aed',
}

const AI_COMMANDS = [
  'Auto-assign "API rate limiting" → Kai',
  'Summarise sprint: 2 done, 4 in-progress',
  'Write acceptance criteria for Design system v2',
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

  // Typewriter effect for AI command bar
  useEffect(() => {
    const cmd = AI_COMMANDS[aiIdx % AI_COMMANDS.length]
    let i = 0
    setAiText('')
    const type = () => {
      if (i < cmd.length) {
        setAiText(cmd.slice(0, i + 1))
        i++
        aiRef.current = setTimeout(type, 38)
      }
    }
    const start = setTimeout(type, 600)
    const cycle = setTimeout(() => {
      setAiIdx(p => p + 1)
    }, 6000)
    return () => {
      clearTimeout(start)
      clearTimeout(cycle)
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
        height: rowH, display: 'flex', alignItems: 'center', gap: 6, padding: compact ? '0 8px' : '0 10px',
        borderRadius: 6, background: dragging === task.id ? '#f0f9ff' : '#fff',
        border: `1px solid ${dragging === task.id ? '#bae6fd' : '#f1f5f9'}`,
        marginBottom: compact ? 3 : 5, cursor: 'grab',
        transform: dragging === task.id ? 'scale(1.02) rotate(1deg)' : 'none',
        boxShadow: dragging === task.id ? '0 4px 16px rgba(14,165,233,.18)' : '0 1px 2px rgba(0,0,0,.04)',
        transition: 'transform 100ms cubic-bezier(0.23,1,0.32,1),box-shadow 100ms cubic-bezier(0.23,1,0.32,1)',
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: PRIORITY_COLOR[task.priority], flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: textSz, fontWeight: 500, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</span>
      <span style={{ fontSize: textSz - 1, fontWeight: 600, padding: '1px 5px', borderRadius: 3, background: ASSIGNEE_BG[task.assignee] || '#f1f5f9', color: ASSIGNEE_FG[task.assignee] || '#64748b', flexShrink: 0 }}>{task.assignee}</span>
      {!compact && <span style={{ fontSize: 10.5, color: task.due === 'Today' ? '#ef4444' : '#94a3b8', fontWeight: task.due === 'Today' ? 600 : 400, flexShrink: 0 }}>{task.due}</span>}
    </div>
  )

  const dropToCol = (col: 'todo' | 'doing' | 'done') => {
    if (!dragging) return
    const allTasks = [...todoTasks, ...doingTasks, ...doneTasks]
    const task = allTasks.find(t => t.id === dragging)
    if (!task) return
    const remove = (arr: typeof TASKS_TODO) => arr.filter(t => t.id !== dragging)
    setTodoTasks(remove(todoTasks))
    setDoingTasks(remove(doingTasks))
    setDoneTasks(remove(doneTasks))
    if (col === 'todo') setTodoTasks(p => [...remove(p), task])
    if (col === 'doing') setDoingTasks(p => [...remove(p), task])
    if (col === 'done') setDoneTasks(p => [...remove(p), task])
    setDragging(null)
  }

  const colStyle = (accent: string) => ({
    flex: 1, minWidth: 0,
    background: '#f8fafc',
    border: '1px solid #f1f5f9',
    borderRadius: 10,
    padding: compact ? '8px 8px 6px' : '10px 10px 8px',
    transition: 'background 150ms ease',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: '"Inter", system-ui, sans-serif', color: '#0f172a' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .tf-cta-main{display:inline-flex;align-items:center;gap:8px;background:#0ea5e9;color:#fff;padding:13px 24px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:-.01em;transition:transform 160ms cubic-bezier(0.23,1,0.32,1),box-shadow 160ms cubic-bezier(0.23,1,0.32,1)}
        .tf-cta-main:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(14,165,233,.32)}
        .tf-cta-main:active{transform:scale(.97);box-shadow:none}
        .tf-cta-ghost{display:inline-flex;align-items:center;gap:6px;color:#475569;padding:13px 20px;border-radius:8px;font-size:14px;font-weight:500;text-decoration:none;border:1px solid #e2e8f0;transition:background 120ms ease,border-color 120ms ease,transform 160ms cubic-bezier(0.23,1,0.32,1)}
        .tf-cta-ghost:hover{background:#f8fafc;border-color:#cbd5e1}
        .tf-cta-ghost:active{transform:scale(.97)}
        .tf-nav-link{color:#64748b;font-size:13.5px;font-weight:500;text-decoration:none;transition:color 120ms ease}
        .tf-nav-link:hover{color:#0f172a}
        .tf-pill{display:inline-flex;align-items:center;gap:5px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:20px;padding:4px 11px;font-size:11.5px;font-weight:600;color:#0369a1;letter-spacing:.04em}
        .tf-density-btn{background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:600;color:#64748b;cursor:pointer;transition:background 100ms ease,border-color 100ms ease,transform 100ms ease}
        .tf-density-btn:hover{background:#f1f5f9;border-color:#cbd5e1}
        .tf-density-btn:active{transform:scale(.97)}
        .tf-step{display:flex;flex-direction:column;align-items:center;gap:6px;flex:1}
        @keyframes tf-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes tf-fade{from{opacity:0}to{opacity:1}}
        @keyframes tf-col-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes tf-blink{0%,100%{opacity:1}50%{opacity:0}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
        @media(max-width:960px){.tf-grid{grid-template-columns:1fr!important}.tf-demo-panel{display:none!important}.tf-mobile-strip{display:flex!important}}
        @media(max-width:640px){
          .tf-nav-links{display:none!important}
          .tf-nav{padding:0 16px!important}
          .tf-hero-section{padding:36px 20px 48px!important}
          .tf-how-section{padding:0 20px 48px!important}
          .tf-feat-section{padding:0 20px 56px!important}
          .tf-bottom-cta{padding:48px 20px!important}
          .tf-mobile-strip{padding:0 20px 32px!important}
          .tf-nav-demo-btn{font-size:12px!important;padding:6px 10px!important}
          .tf-nav-demo-btn .tf-btn-long{display:none!important}
          .tf-nav-demo-btn .tf-btn-short{display:inline!important}
        }
        @media(max-width:600px){
          .tf-hero-h1{font-size:34px!important}
          .tf-steps-row{flex-direction:column!important;gap:16px!important;align-items:center!important}
          .tf-step{width:100%!important;max-width:240px!important}
          .tf-steps-row .tf-step-connector{display:none!important}
        }
      `}</style>

      {/* Nav */}
      <nav className="tf-nav" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(14px)', borderBottom: '1px solid #f1f5f9', padding: '0 32px', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: ready ? 'tf-fade 200ms ease-out both' : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: '-0.03em' }}>Task<span style={{ color: '#0ea5e9' }}>Flow</span></span>
          <div className="tf-nav-links" style={{ display: 'flex', gap: 24 }}>
            {['Features', 'Pricing', 'Docs'].map(l => <a key={l} href="#" className="tf-nav-link">{l}</a>)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/demo" className="tf-cta-main tf-nav-demo-btn" style={{ padding: '7px 15px', fontSize: 13 }}>
            <span className="tf-btn-long">Try demo — no login</span>
            <span className="tf-btn-short" style={{ display: 'none' }}>Demo</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </nav>

      {/* Hero — asymmetric split, above fold */}
      <section className="tf-hero-section" style={{ maxWidth: 1240, margin: '0 auto', padding: '56px 32px 64px' }}>
        <div className="tf-grid" style={{ display: 'grid', gridTemplateColumns: '42% 58%', gap: 56, alignItems: 'start', animation: ready ? 'tf-up 360ms cubic-bezier(0.23,1,0.32,1) 40ms both' : 'none' }}>

          {/* Left: copy */}
          <div style={{ paddingTop: 8 }}>
            <div className="tf-pill" style={{ marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0ea5e9', display: 'inline-block' }} />
              START YOUR BOARD — NO ACCOUNT NEEDED
            </div>

            <h1 className="tf-hero-h1" style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.06, letterSpacing: '-0.04em', color: '#0f172a', marginBottom: 18 }}>
              Your sprint board,<br />
              <span style={{ background: 'linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                already set up.
              </span>
            </h1>

            <p style={{ fontSize: 17, color: '#475569', lineHeight: 1.65, maxWidth: 400, marginBottom: 32, fontWeight: 400 }}>
              Replace Jira. Drag tasks, auto-assign with AI, and see sprint health in one view — free, no card required.
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
              <Link href="/demo" className="tf-cta-main">
                Try the live demo
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link href="/signup" className="tf-cta-ghost">Create free workspace</Link>
            </div>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>Free forever · 5 boards · 5 members · 20 AI calls/month</p>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 28, marginTop: 40, paddingTop: 32, borderTop: '1px solid #f1f5f9' }}>
              {[
                { v: '4', l: 'Views' },
                { v: '8', l: 'Column types' },
                { v: '< 4 min', l: 'First sprint' },
              ].map(s => (
                <div key={s.l}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#0ea5e9', letterSpacing: '-0.03em' }}>{s.v}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Trust quotes — no fake logos */}
            <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                '"Migrated from Jira in one afternoon."',
                '"The AI assignment is actually useful."',
                '"Compact mode is the one thing Monday missed."',
              ].map((q, i) => (
                <p key={i} style={{ fontSize: 12.5, color: '#64748b', fontStyle: 'italic' }}>{q}</p>
              ))}
            </div>
          </div>

          {/* Right: LIVE interactive demo board */}
          <div className="tf-demo-panel" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, boxShadow: '0 4px 40px rgba(0,0,0,.08),0 1px 4px rgba(0,0,0,.04)', overflow: 'hidden', animation: ready ? 'tf-up 380ms cubic-bezier(0.23,1,0.32,1) 80ms both' : 'none' }}>
            {/* Panel toolbar */}
            <div style={{ padding: '9px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10, background: '#fafafa' }}>
              <div style={{ display: 'flex', gap: 5 }}>
                {['#fecaca', '#fef08a', '#bbf7d0'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
              </div>
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, flex: 1 }}>Sprint 4 · Engineering</span>
              <button
                className="tf-density-btn"
                onClick={() => setCompact(p => !p)}
                title="Toggle compact rows"
              >
                {compact ? '≡ Normal' : '≡ Compact'}
              </button>
            </div>

            {/* Kanban columns — drag to reorder */}
            <div style={{ display: 'flex', gap: 8, padding: 10, minHeight: 260 }}>
              {(
                [
                  { label: 'Todo', accent: '#64748b', tasks: todoTasks, col: 'todo' as const },
                  { label: 'In Progress', accent: '#0ea5e9', tasks: doingTasks, col: 'doing' as const },
                  { label: 'Done', accent: '#10b981', tasks: doneTasks, col: 'done' as const },
                ] as const
              ).map(({ label, accent, tasks, col }, ci) => (
                <div
                  key={col}
                  style={colStyle(accent)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => dropToCol(col)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: compact ? 6 : 8 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: accent }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', letterSpacing: '.04em', textTransform: 'uppercase' }}>{label}</span>
                    <span style={{ fontSize: 10, color: '#94a3b8', background: '#fff', border: '1px solid #f1f5f9', borderRadius: 8, padding: '1px 6px', marginLeft: 'auto' }}>{tasks.length}</span>
                  </div>
                  <div style={{ animation: ready ? `tf-col-in 320ms cubic-bezier(0.23,1,0.32,1) ${100 + ci * 80}ms both` : 'none' }}>
                    {tasks.map(renderTask)}
                  </div>
                </div>
              ))}
            </div>

            {/* AI command bar — typewriter */}
            <div style={{ margin: '0 10px 10px', background: 'linear-gradient(135deg,#f0f9ff,#e0f2fe)', border: '1px solid #bae6fd', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 22, height: 22, borderRadius: 5, background: 'linear-gradient(135deg,#0ea5e9,#0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 500, color: '#0369a1', flex: 1, minHeight: 14 }}>
                {aiText}
                <span style={{ animation: 'tf-blink 1s step-end infinite', borderLeft: '1.5px solid #0ea5e9', marginLeft: 1 }}>&nbsp;</span>
              </span>
              <span style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 500, flexShrink: 0 }}>AI ·</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile demo strip (hidden on desktop) */}
      <div className="tf-mobile-strip" style={{ display: 'none', overflowX: 'auto', gap: 12, padding: '0 16px 32px', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
        {['Drag & drop', 'AI assign', 'Custom columns', 'Four views'].map((label, i) => (
          <div key={label} style={{ flexShrink: 0, scrollSnapAlign: 'start', width: 160, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `rgba(14,165,233,${0.1 + i * 0.18})`, marginBottom: 10 }} />
            <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{label}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, lineHeight: 1.5 }}>
              {['Kanban without the drag tax', 'Smart context-aware picks', 'No DB migrations ever', 'Table · Kanban · Calendar · Dash'][i]}
            </div>
          </div>
        ))}
      </div>

      {/* How it works — 4-step row */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px 72px', animation: ready ? 'tf-up 360ms cubic-bezier(0.23,1,0.32,1) 160ms both' : 'none' }}>
        <div style={{ background: '#f8fafc', borderRadius: 14, padding: '32px 40px', border: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 28, textAlign: 'center' }}>HOW IT WORKS</p>
          <div className="tf-steps-row" style={{ display: 'flex', gap: 0, alignItems: 'flex-start', position: 'relative' }}>
            {[
              { n: '1', label: 'Try the demo', sub: 'No account, no friction' },
              { n: '2', label: 'Create workspace', sub: 'Magic link, 10 seconds' },
              { n: '3', label: 'Add your tasks', sub: 'Import or start fresh' },
              { n: '4', label: 'Let AI triage', sub: 'Assign, summarise, flag risk' },
            ].map((step, i) => (
              <div key={step.n} className="tf-step" style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative', zIndex: 1, width: 32, height: 32, borderRadius: '50%', background: '#0ea5e9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{step.n}</div>
                {i < 3 && (
                  <div className="tf-step-connector" style={{ position: 'absolute', top: 16, left: '50%', right: 'calc(-100% + 16px)', height: 1, background: '#e2e8f0', marginLeft: 16 }} />
                )}
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', textAlign: 'center', marginTop: 8 }}>{step.label}</div>
                <div style={{ fontSize: 11.5, color: '#64748b', textAlign: 'center', marginTop: 2 }}>{step.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature columns — AI triage + sprint view */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px 80px', animation: ready ? 'tf-up 360ms cubic-bezier(0.23,1,0.32,1) 200ms both' : 'none' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          {[
            { title: 'AI triage', body: 'One click assigns the right person based on past work and current load. No guessing who is free.', accent: '#0ea5e9' },
            { title: 'Sprint analytics', body: 'Real-time velocity, risk flags, and blockers surface before your standup. Not after.', accent: '#8b5cf6' },
            { title: 'Custom columns', body: 'Status, Priority, Date, Dropdown, Tags, Text — added in 2 seconds. Zero migrations, ever.', accent: '#f97316' },
            { title: 'Density mode', body: 'Compress rows to 28px for high-density sprints. Jira veterans: this is the one feature you missed.', accent: '#10b981' },
          ].map(f => (
            <div key={f.title} style={{ padding: 22, borderRadius: 10, border: '1px solid #f1f5f9', transition: 'border-color 150ms ease,box-shadow 150ms ease,transform 200ms cubic-bezier(0.23,1,0.32,1)', cursor: 'default' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 14px rgba(0,0,0,.06)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#f1f5f9'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: f.accent, marginBottom: 14 }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.01em' }}>{f.title}</div>
              <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{f.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ borderTop: '1px solid #f1f5f9', padding: '60px 32px', textAlign: 'center', animation: ready ? 'tf-fade 380ms ease-out 280ms both' : 'none' }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: 10 }}>First sprint in under 4 minutes.</h2>
        <p style={{ color: '#64748b', marginBottom: 28, fontSize: 16 }}>Touch the board before signing up. That&apos;s the deal.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/demo" className="tf-cta-main" style={{ fontSize: 15, padding: '14px 28px' }}>
            Launch live demo
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
          <Link href="/signup" className="tf-cta-ghost" style={{ fontSize: 15, padding: '14px 22px' }}>Create free workspace</Link>
        </div>
        <p style={{ marginTop: 14, fontSize: 12, color: '#94a3b8' }}>No credit card. No account needed to try.</p>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #f1f5f9', padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: '-0.02em' }}>Task<span style={{ color: '#0ea5e9' }}>Flow</span></span>
        <span style={{ fontSize: 12, color: '#94a3b8' }}>© 2026 · Built with AI in Britain</span>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms'].map(l => <a key={l} href="#" style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'none' }}>{l}</a>)}
        </div>
      </footer>
    </div>
  )
}
