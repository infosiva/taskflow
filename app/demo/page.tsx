'use client'
import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'

// Demo page — fully interactive, no auth, no DB, sandboxed with mock data
// Research finding: no competitor lets users touch the product before sign-in
// This is the entire differentiator — make it feel 100% real
// Emil rules: spring drag, stagger columns, typewriter AI bar

type Priority = 'High' | 'Medium' | 'Low'
type Status = 'Todo' | 'In Progress' | 'In Review' | 'Done'

interface DemoTask {
  id: string
  title: string
  assignee: string
  priority: Priority
  due: string
  status: Status
  tags: string[]
}

const INITIAL_TASKS: DemoTask[] = [
  { id: 't1', title: 'Design system v2 — new token set', assignee: 'Sara', priority: 'High', due: 'Today', status: 'In Progress', tags: ['Design'] },
  { id: 't2', title: 'Mobile onboarding flow redesign', assignee: 'You', priority: 'High', due: 'Jun 12', status: 'Todo', tags: ['Mobile', 'Design'] },
  { id: 't3', title: 'API rate limiting + throttle headers', assignee: 'Kai', priority: 'Medium', due: 'Jun 10', status: 'In Progress', tags: ['Backend'] },
  { id: 't4', title: 'Fix auth edge case on Safari iOS', assignee: 'Sara', priority: 'High', due: 'Jun 9', status: 'In Review', tags: ['Bug'] },
  { id: 't5', title: 'Write Q2 release notes', assignee: 'Mo', priority: 'Low', due: 'Jun 6', status: 'Done', tags: ['Docs'] },
  { id: 't6', title: 'Analytics dashboard v1', assignee: 'Kai', priority: 'Medium', due: 'Jun 15', status: 'Todo', tags: ['Frontend'] },
  { id: 't7', title: 'E2E tests for checkout flow', assignee: 'You', priority: 'High', due: 'Jun 11', status: 'Todo', tags: ['Testing'] },
  { id: 't8', title: 'Stripe webhook retry logic', assignee: 'Kai', priority: 'Medium', due: 'Jun 13', status: 'In Progress', tags: ['Backend'] },
]

const AI_ACTIONS = [
  { id: 'a1', label: 'Auto-assign open tasks', desc: 'Assigns based on recent work + current load' },
  { id: 'a2', label: 'Sprint summary', desc: '2 done · 3 in progress · 2 blocked' },
  { id: 'a3', label: 'Flag risk', desc: '"API rate limiting" — no test coverage yet' },
  { id: 'a4', label: 'Write subtasks', desc: 'Break down "Mobile onboarding" into 5 steps' },
]

const AI_STREAMS = [
  'Analysing task distribution across team members…',
  'Kai has 2 active tasks — medium load. Sara has 1 high-priority in review.',
  'Suggested: assign "Analytics dashboard v1" → Kai (matches backend+frontend skills)',
  'Suggested: assign "E2E tests" → Mo (light load, QA background)',
  'All tasks balanced. Highest risk: "Fix auth edge case" — due Jun 9 still In Review.',
]

const COL_META: { status: Status; accent: string; bg: string }[] = [
  { status: 'Todo', accent: '#64748b', bg: '#f8fafc' },
  { status: 'In Progress', accent: '#0ea5e9', bg: '#f0f9ff' },
  { status: 'In Review', accent: '#f59e0b', bg: '#fffbeb' },
  { status: 'Done', accent: '#10b981', bg: '#f0fdf4' },
]

const PRIORITY_COLOR: Record<Priority, string> = { High: '#ef4444', Medium: '#f97316', Low: '#94a3b8' }
const ASSIGNEE_BG: Record<string, string> = { Sara: '#dbeafe', Kai: '#fef3c7', You: '#dcfce7', Mo: '#f3e8ff' }
const ASSIGNEE_FG: Record<string, string> = { Sara: '#1d4ed8', Kai: '#92400e', You: '#15803d', Mo: '#7c3aed' }
const TAG_COLOR: Record<string, [string, string]> = {
  Design: ['#ede9fe', '#6d28d9'],
  Mobile: ['#fce7f3', '#be185d'],
  Backend: ['#fef3c7', '#92400e'],
  Frontend: ['#dbeafe', '#1d4ed8'],
  Bug: ['#fee2e2', '#b91c1c'],
  Docs: ['#f1f5f9', '#475569'],
  Testing: ['#d1fae5', '#065f46'],
}

export default function DemoPage() {
  const [tasks, setTasks] = useState<DemoTask[]>(INITIAL_TASKS)
  const [ready, setReady] = useState(false)
  const [view, setView] = useState<'kanban' | 'table'>('kanban')
  const [compact, setCompact] = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverCol, setDragOverCol] = useState<Status | null>(null)
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [aiRunning, setAiRunning] = useState(false)
  const [aiStreamIdx, setAiStreamIdx] = useState(0)
  const [aiOutput, setAiOutput] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [addingCol, setAddingCol] = useState<Status | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [signupBanner, setSignupBanner] = useState(false)
  const aiStreamRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const aiOutputRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setTimeout(() => setReady(true), 80) }, [])

  // show signup banner after 90s to soft-nudge
  useEffect(() => {
    const t = setTimeout(() => setSignupBanner(true), 90000)
    return () => clearTimeout(t)
  }, [])

  const tasksByStatus = useCallback((status: Status) =>
    tasks.filter(t => t.status === status), [tasks])

  const moveTask = (id: string, newStatus: Status) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t))
  }

  const addTask = (status: Status) => {
    if (!newTaskTitle.trim()) return
    const newTask: DemoTask = {
      id: `t${Date.now()}`,
      title: newTaskTitle.trim(),
      assignee: 'You',
      priority: 'Medium',
      due: 'TBD',
      status,
      tags: [],
    }
    setTasks(prev => [...prev, newTask])
    setNewTaskTitle('')
    setAddingCol(null)
  }

  const startEdit = (task: DemoTask) => {
    setEditingId(task.id)
    setEditTitle(task.title)
  }

  const commitEdit = () => {
    if (editTitle.trim()) {
      setTasks(prev => prev.map(t => t.id === editingId ? { ...t, title: editTitle.trim() } : t))
    }
    setEditingId(null)
  }

  const runAI = () => {
    setAiRunning(true)
    setAiOutput([])
    setAiStreamIdx(0)
    let i = 0
    aiStreamRef.current = setInterval(() => {
      if (i < AI_STREAMS.length) {
        setAiOutput(prev => [...prev, AI_STREAMS[i]])
        i++
        if (aiOutputRef.current) {
          aiOutputRef.current.scrollTop = aiOutputRef.current.scrollHeight
        }
      } else {
        if (aiStreamRef.current) clearInterval(aiStreamRef.current)
        setAiRunning(false)
      }
    }, 700)
  }

  useEffect(() => () => { if (aiStreamRef.current) clearInterval(aiStreamRef.current) }, [])

  const rowH = compact ? 30 : 42

  const TaskCard = ({ task, col }: { task: DemoTask; col: typeof COL_META[number] }) => (
    <div
      key={task.id}
      draggable
      onDragStart={() => setDraggingId(task.id)}
      onDragEnd={() => { setDraggingId(null); setDragOverCol(null) }}
      style={{
        background: '#fff',
        border: `1px solid ${draggingId === task.id ? col.accent + '44' : '#f1f5f9'}`,
        borderRadius: 8,
        padding: compact ? '7px 10px' : '10px 12px',
        marginBottom: compact ? 4 : 6,
        cursor: 'grab',
        boxShadow: draggingId === task.id
          ? `0 8px 24px rgba(0,0,0,.12), 0 0 0 2px ${col.accent}33`
          : '0 1px 3px rgba(0,0,0,.04)',
        transform: draggingId === task.id ? 'scale(1.02) rotate(0.8deg)' : 'none',
        opacity: draggingId === task.id ? 0.9 : 1,
        transition: 'transform 120ms cubic-bezier(0.23,1,0.32,1),box-shadow 120ms cubic-bezier(0.23,1,0.32,1)',
        userSelect: 'none',
      }}
      onDoubleClick={() => startEdit(task)}
    >
      {editingId === task.id ? (
        <input
          autoFocus
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingId(null) }}
          style={{ width: '100%', border: 'none', outline: 'none', fontSize: 13, fontWeight: 500, color: '#0f172a', background: 'transparent' }}
        />
      ) : (
        <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a', lineHeight: 1.4, marginBottom: compact ? 4 : 7 }}>
          {task.title}
        </div>
      )}
      {!compact && task.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 7 }}>
          {task.tags.map(tag => {
            const [bg, fg] = TAG_COLOR[tag] || ['#f1f5f9', '#64748b']
            return <span key={tag} style={{ fontSize: 10.5, fontWeight: 600, padding: '1px 6px', borderRadius: 4, background: bg, color: fg }}>{tag}</span>
          })}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: PRIORITY_COLOR[task.priority], flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: task.due === 'Today' ? '#ef4444' : '#94a3b8', fontWeight: task.due === 'Today' ? 600 : 400, flex: 1 }}>{task.due}</span>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 6px', borderRadius: 4, background: ASSIGNEE_BG[task.assignee] || '#f1f5f9', color: ASSIGNEE_FG[task.assignee] || '#64748b' }}>{task.assignee}</span>
      </div>
    </div>
  )

  const TableRow = ({ task }: { task: DemoTask }) => (
    <tr style={{ borderBottom: '1px solid #f8fafc', transition: 'background 80ms ease' }}
      onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <td style={{ padding: compact ? '7px 12px' : '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: PRIORITY_COLOR[task.priority], flexShrink: 0 }} />
        {editingId === task.id ? (
          <input autoFocus value={editTitle} onChange={e => setEditTitle(e.target.value)}
            onBlur={commitEdit} onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingId(null) }}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, fontWeight: 500, color: '#0f172a', background: 'transparent' }} />
        ) : (
          <span style={{ fontSize: 13, fontWeight: 500, color: '#0f172a', cursor: 'pointer' }} onDoubleClick={() => startEdit(task)}>{task.title}</span>
        )}
      </td>
      <td style={{ padding: compact ? '7px 12px' : '10px 12px', fontSize: 12 }}>
        <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11.5, fontWeight: 600,
          background: COL_META.find(c => c.status === task.status)?.bg || '#f1f5f9',
          color: COL_META.find(c => c.status === task.status)?.accent || '#64748b' }}>{task.status}</span>
      </td>
      <td style={{ padding: compact ? '7px 12px' : '10px 12px' }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: ASSIGNEE_BG[task.assignee] || '#f1f5f9', color: ASSIGNEE_FG[task.assignee] || '#64748b' }}>{task.assignee}</span>
      </td>
      <td style={{ padding: compact ? '7px 12px' : '10px 12px', fontSize: 12, color: task.due === 'Today' ? '#ef4444' : '#94a3b8', fontWeight: task.due === 'Today' ? 600 : 400 }}>{task.due}</td>
    </tr>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '"Inter", system-ui, sans-serif', color: '#0f172a' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box}
        .demo-btn{display:inline-flex;align-items:center;gap:6px;padding:6px 13px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;border:none;transition:background 100ms ease,transform 160ms cubic-bezier(0.23,1,0.32,1),box-shadow 160ms cubic-bezier(0.23,1,0.32,1)}
        .demo-btn:active{transform:scale(.97)}
        .demo-btn-primary{background:#0ea5e9;color:#fff}
        .demo-btn-primary:hover{background:#0284c7}
        .demo-btn-ghost{background:#fff;color:#475569;border:1px solid #e2e8f0}
        .demo-btn-ghost:hover{background:#f8fafc}
        .demo-btn-danger{background:#fef2f2;color:#b91c1c;border:1px solid #fecaca}
        .demo-view-btn{background:transparent;border:none;color:#64748b;font-size:12px;font-weight:600;padding:4px 10px;border-radius:5px;cursor:pointer;transition:background 80ms ease,color 80ms ease,transform 100ms ease}
        .demo-view-btn:active{transform:scale(.95)}
        .demo-view-btn.active{background:#f1f5f9;color:#0f172a}
        .add-task-row{display:flex;gap:6px;padding:4px 0 6px}
        input.add-task-input{flex:1;padding:6px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:12.5px;font-family:inherit;outline:none;transition:border-color 120ms ease}
        input.add-task-input:focus{border-color:#0ea5e9}
        @keyframes demo-up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes demo-col{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes demo-slide-in{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
        @media(max-width:768px){.kanban-cols{flex-direction:column!important}.demo-header-right{gap:6px!important}}
      `}</style>

      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ fontWeight: 900, fontSize: 15, textDecoration: 'none', color: '#0f172a', letterSpacing: '-0.03em' }}>
            Task<span style={{ color: '#0ea5e9' }}>Flow</span>
          </Link>
          <div style={{ height: 18, width: 1, background: '#f1f5f9' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Engineering Sprint 4</span>
          <span style={{ fontSize: 11.5, background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: 20, padding: '2px 9px', fontWeight: 600 }}>DEMO</span>
        </div>
        <div className="demo-header-right" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', background: '#f8fafc', borderRadius: 7, padding: 2, gap: 1 }}>
            <button className={`demo-view-btn${view === 'kanban' ? ' active' : ''}`} onClick={() => setView('kanban')}>Kanban</button>
            <button className={`demo-view-btn${view === 'table' ? ' active' : ''}`} onClick={() => setView('table')}>Table</button>
          </div>
          <button className="demo-btn demo-btn-ghost" style={{ fontSize: 11.5 }} onClick={() => setCompact(p => !p)}>
            {compact ? '≡ Normal' : '≡ Compact'}
          </button>
          <button className="demo-btn demo-btn-primary" onClick={() => setAiPanelOpen(p => !p)}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            AI actions
          </button>
          <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#0f172a', color: '#fff', padding: '6px 13px', borderRadius: 7, fontSize: 12.5, fontWeight: 700, textDecoration: 'none' }}>
            Save workspace
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </header>

      {/* Board */}
      <main style={{ display: 'flex', height: 'calc(100vh - 52px)', overflow: 'hidden', position: 'relative' }}>
        {/* Main board area */}
        <div style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
          {view === 'kanban' ? (
            <div className="kanban-cols" style={{ display: 'flex', gap: 12, minHeight: 'calc(100vh - 120px)', alignItems: 'flex-start', animation: ready ? 'demo-up 280ms cubic-bezier(0.23,1,0.32,1) both' : 'none' }}>
              {COL_META.map(({ status, accent, bg }, ci) => (
                <div
                  key={status}
                  style={{
                    flex: '1 1 0',
                    minWidth: 200,
                    background: dragOverCol === status ? bg : '#f1f5f9',
                    border: `1px solid ${dragOverCol === status ? accent + '44' : '#e2e8f0'}`,
                    borderRadius: 10,
                    padding: '10px 10px 8px',
                    transition: 'background 120ms ease,border-color 120ms ease',
                    animation: ready ? `demo-col 280ms cubic-bezier(0.23,1,0.32,1) ${60 + ci * 60}ms both` : 'none',
                  }}
                  onDragOver={e => { e.preventDefault(); setDragOverCol(status) }}
                  onDragLeave={() => setDragOverCol(null)}
                  onDrop={() => {
                    if (draggingId) moveTask(draggingId, status)
                    setDragOverCol(null)
                  }}
                >
                  {/* Column header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: accent }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', letterSpacing: '.05em', textTransform: 'uppercase', flex: 1 }}>{status}</span>
                    <span style={{ fontSize: 10.5, color: '#94a3b8', background: '#fff', border: '1px solid #f1f5f9', borderRadius: 8, padding: '1px 7px', minWidth: 20, textAlign: 'center' }}>
                      {tasksByStatus(status).length}
                    </span>
                  </div>

                  {/* Tasks */}
                  <div style={{ minHeight: 80 }}>
                    {tasksByStatus(status).map(task => (
                      <TaskCard key={task.id} task={task} col={COL_META.find(c => c.status === status)!} />
                    ))}
                  </div>

                  {/* Add task */}
                  {addingCol === status ? (
                    <div className="add-task-row">
                      <input
                        className="add-task-input"
                        autoFocus
                        placeholder="Task title…"
                        value={newTaskTitle}
                        onChange={e => setNewTaskTitle(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') addTask(status); if (e.key === 'Escape') { setAddingCol(null); setNewTaskTitle('') } }}
                      />
                      <button className="demo-btn demo-btn-primary" onClick={() => addTask(status)}>Add</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingCol(status)}
                      style={{ width: '100%', background: 'transparent', border: '1px dashed #e2e8f0', borderRadius: 6, padding: '6px', fontSize: 11.5, color: '#94a3b8', cursor: 'pointer', transition: 'border-color 120ms,color 120ms', marginTop: 2 }}
                      onMouseEnter={e => { (e.currentTarget.style.borderColor = '#0ea5e9'); (e.currentTarget.style.color = '#0ea5e9') }}
                      onMouseLeave={e => { (e.currentTarget.style.borderColor = '#e2e8f0'); (e.currentTarget.style.color = '#94a3b8') }}
                    >
                      + Add task
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Table view */
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', animation: ready ? 'demo-up 280ms cubic-bezier(0.23,1,0.32,1) both' : 'none' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fafafa', borderBottom: '1px solid #f1f5f9' }}>
                    {['Task', 'Status', 'Assignee', 'Due'].map(h => (
                      <th key={h} style={{ padding: compact ? '8px 12px' : '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '.06em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => <TableRow key={task.id} task={task} />)}
                  <tr>
                    <td colSpan={4} style={{ padding: '8px 12px' }}>
                      {addingCol === 'Todo' ? (
                        <div className="add-task-row">
                          <input className="add-task-input" autoFocus placeholder="Task title…"
                            value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') addTask('Todo'); if (e.key === 'Escape') { setAddingCol(null); setNewTaskTitle('') } }} />
                          <button className="demo-btn demo-btn-primary" onClick={() => addTask('Todo')}>Add</button>
                        </div>
                      ) : (
                        <button onClick={() => setAddingCol('Todo')}
                          style={{ background: 'transparent', border: 'none', fontSize: 12.5, color: '#94a3b8', cursor: 'pointer', fontFamily: 'inherit', padding: '2px 0' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#0ea5e9')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
                        >
                          + Add task
                        </button>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Demo tip */}
          <div style={{ marginTop: 16, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '9px 14px', display: 'flex', gap: 10, alignItems: 'center', animation: ready ? 'demo-up 280ms cubic-bezier(0.23,1,0.32,1) 200ms both' : 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
            <span style={{ fontSize: 12.5, color: '#0369a1', fontWeight: 500 }}>
              Live demo — drag tasks between columns · double-click to edit · click &quot;+ Add task&quot; to create · try AI actions
            </span>
            <Link href="/signup" style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: '#0ea5e9', textDecoration: 'none', flexShrink: 0 }}>
              Save this →
            </Link>
          </div>
        </div>

        {/* AI panel — slides in from right */}
        {aiPanelOpen && (
          <div style={{ width: 300, background: '#fff', borderLeft: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', animation: 'demo-slide-in 220ms cubic-bezier(0.23,1,0.32,1) both' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg,#0ea5e9,#0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, flex: 1 }}>AI actions</span>
              <button onClick={() => setAiPanelOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, borderRadius: 5, transition: 'background 80ms', display: 'flex' }} onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>

            <div style={{ padding: '12px 12px 8px', flex: 1, overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                {AI_ACTIONS.map(action => (
                  <button
                    key={action.id}
                    className="demo-btn demo-btn-ghost"
                    style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 12px', gap: 3, textAlign: 'left' }}
                    onClick={runAI}
                    disabled={aiRunning}
                  >
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: '#0f172a' }}>{action.label}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>{action.desc}</span>
                  </button>
                ))}
              </div>

              {aiOutput.length > 0 && (
                <div style={{ background: '#fafafa', border: '1px solid #f1f5f9', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8', letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 8 }}>Output</div>
                  <div ref={aiOutputRef} style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {aiOutput.map((line, i) => (
                      <div key={i} style={{ fontSize: 12, color: '#475569', lineHeight: 1.5, animation: `demo-up 200ms cubic-bezier(0.23,1,0.32,1) both` }}>
                        {i === aiOutput.length - 1 && aiRunning
                          ? <>{line}<span style={{ animation: 'blink 1s step-end infinite', borderLeft: '1.5px solid #0ea5e9', marginLeft: 1 }}>&nbsp;</span></>
                          : line}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '10px 12px', borderTop: '1px solid #f1f5f9', background: '#fafafa' }}>
              <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', lineHeight: 1.5 }}>
                Demo AI uses sample data. <Link href="/signup" style={{ color: '#0ea5e9', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link> to use on real boards.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Soft signup banner — appears after 90s */}
      {signupBanner && (
        <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', background: '#0f172a', color: '#fff', borderRadius: 10, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 8px 32px rgba(0,0,0,.24)', animation: 'demo-up 280ms cubic-bezier(0.23,1,0.32,1) both', zIndex: 999 }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>Like what you see? Save this workspace for free.</span>
          <Link href="/signup" style={{ background: '#0ea5e9', color: '#fff', padding: '7px 14px', borderRadius: 7, fontSize: 12.5, fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>Create free account</Link>
          <button onClick={() => setSignupBanner(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
      )}
    </div>
  )
}
