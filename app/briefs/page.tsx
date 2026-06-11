'use client'
import { useEffect, useState } from 'react'

type Competitor = { name: string; weakness: string; threat: string }
type Move = { n: number; title: string; desc: string }
type Step = { n: number; label: string; done: boolean }

type Brief = {
  id: string
  project: string
  category: string
  currentBg: string | null
  currentPattern: string | null
  competitors: Competitor[]
  gap: string | null
  recommendedHeadline: string | null
  recommendedSubheadline: string | null
  strategicMoves: Move[]
  newBg: string | null
  newAccent: string | null
  heroLayout: string | null
  sectionsNeeded: string[]
  steps: Step[]
  status: 'pending_review' | 'approved' | 'in_progress' | 'done' | 'rejected'
  approvedAt: string | null
  doneAt: string | null
  createdAt: string
  updatedAt: string
}

const STATUS_LABEL: Record<string, string> = {
  pending_review: 'Pending Review',
  approved: 'Approved',
  in_progress: 'In Progress',
  done: 'Done',
  rejected: 'Rejected',
}
const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  pending_review: { bg: 'rgba(217,119,6,0.1)', text: '#d97706' },
  approved:       { bg: 'rgba(37,99,235,0.1)', text: '#2563eb' },
  in_progress:    { bg: 'rgba(20,184,166,0.1)', text: '#0d9488' },
  done:           { bg: 'rgba(22,163,74,0.1)',  text: '#16a34a' },
  rejected:       { bg: 'rgba(220,38,38,0.1)',  text: '#dc2626' },
}
const THREAT_COLOR: Record<string, { bg: string; text: string }> = {
  Opportunity: { bg: 'rgba(22,163,74,0.1)',   text: '#16a34a' },
  High:        { bg: 'rgba(220,38,38,0.1)',   text: '#dc2626' },
  Medium:      { bg: 'rgba(217,119,6,0.1)',   text: '#d97706' },
  Low:         { bg: 'rgba(148,163,184,0.12)', text: '#64748b' },
}

const API_KEY = process.env.NEXT_PUBLIC_AGENT_API_KEY ?? ''

export default function BriefsPage() {
  const [briefs, setBriefs] = useState<Brief[]>([])
  const [selected, setSelected] = useState<Brief | null>(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/agent/brief', { headers: { authorization: `Bearer ${API_KEY}` } })
      const data = await res.json()
      setBriefs(data.briefs ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const act = async (project: string, status: string) => {
    setActing(true)
    await fetch('/api/agent/brief', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${API_KEY}` },
      body: JSON.stringify({ project, status }),
    })
    await load()
    setSelected(prev => prev?.project === project ? { ...prev, status: status as Brief['status'] } : prev)
    setActing(false)
  }

  const pending = briefs.filter(b => b.status === 'pending_review')
  const rest    = briefs.filter(b => b.status !== 'pending_review')

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>

      {/* Header */}
      <div style={{ background: '#0f172a', color: '#fff', padding: '14px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 18, fontWeight: 900 }}>Task<span style={{ color: '#14b8a6' }}>Flow</span></span>
            <span style={{ fontSize: 13, color: '#64748b', background: '#1e293b', padding: '3px 10px', borderRadius: 999 }}>Project Briefs</span>
          </div>
          <button
            onClick={load}
            style={{ background: '#1e293b', color: '#94a3b8', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
          >Refresh</button>
        </div>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { label: 'Total', value: briefs.length, color: '#94a3b8' },
            { label: 'Pending', value: briefs.filter(b => b.status === 'pending_review').length, color: '#fb923c' },
            { label: 'Approved', value: briefs.filter(b => b.status === 'approved').length, color: '#34d399' },
            { label: 'Done', value: briefs.filter(b => b.status === 'done').length, color: '#14b8a6' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: s.color, letterSpacing: '-0.03em' }}>{s.value}</span>
              <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 61px)' }}>

        {/* Sidebar — project list */}
        <div style={{ width: 240, borderRight: '1px solid #e2e8f0', background: '#fff', overflowY: 'auto', flexShrink: 0 }}>
          {loading && <div style={{ padding: 24, color: '#94a3b8', fontSize: 13 }}>Loading...</div>}

          {pending.length > 0 && (
            <div>
              <div style={{ padding: '12px 16px 6px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Needs Review ({pending.length})
              </div>
              {pending.map(b => (
                <SidebarItem key={b.id} brief={b} selected={selected?.project === b.project} onClick={() => setSelected(b)} />
              ))}
            </div>
          )}

          {rest.length > 0 && (
            <div>
              <div style={{ padding: '12px 16px 6px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Other ({rest.length})
              </div>
              {rest.map(b => (
                <SidebarItem key={b.id} brief={b} selected={selected?.project === b.project} onClick={() => setSelected(b)} />
              ))}
            </div>
          )}

          {!loading && briefs.length === 0 && (
            <div style={{ padding: 24, color: '#94a3b8', fontSize: 13 }}>
              No briefs yet. Spawn research agents to populate.
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
          {!selected ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontSize: 14 }}>
              Select a project to review its brief
            </div>
          ) : (
            <BriefDetail brief={selected} onAct={act} acting={acting} />
          )}
        </div>

      </div>
    </div>
  )
}

function SidebarItem({ brief, selected, onClick }: { brief: Brief; selected: boolean; onClick: () => void }) {
  const sc = STATUS_COLOR[brief.status]
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left', padding: '10px 16px', border: 'none', cursor: 'pointer',
        background: selected ? '#f0f9ff' : 'transparent',
        borderLeft: selected ? '3px solid #2563eb' : '3px solid transparent',
        transition: 'background 120ms',
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{brief.project}</div>
      <div style={{ marginTop: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 8px', borderRadius: 999, background: sc.bg, color: sc.text }}>
          {STATUS_LABEL[brief.status]}
        </span>
      </div>
    </button>
  )
}

function BriefDetail({ brief, onAct, acting }: { brief: Brief; onAct: (p: string, s: string) => void; acting: boolean }) {
  const sc = STATUS_COLOR[brief.status]

  return (
    <div style={{ maxWidth: 760 }}>

      {/* Title + status */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.5px' }}>{brief.project}</h1>
          <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 999, background: sc.bg, color: sc.text }}>
              {STATUS_LABEL[brief.status]}
            </span>
            {brief.currentPattern && (
              <span style={{ fontSize: 12, color: '#dc2626', background: 'rgba(220,38,38,0.08)', padding: '2px 10px', borderRadius: 999, fontWeight: 600 }}>
                {brief.currentPattern}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        {brief.status === 'pending_review' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              disabled={acting}
              onClick={() => onAct(brief.project, 'approved')}
              style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: acting ? 0.6 : 1 }}
            >Approve</button>
            <button
              disabled={acting}
              onClick={() => onAct(brief.project, 'rejected')}
              style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: acting ? 0.6 : 1 }}
            >Reject</button>
          </div>
        )}
        {brief.status === 'approved' && (
          <button
            disabled={acting}
            onClick={() => onAct(brief.project, 'in_progress')}
            style={{ background: '#0d9488', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: acting ? 0.6 : 1 }}
          >Start Work</button>
        )}
      </div>

      {/* Headline recommendation */}
      {brief.recommendedHeadline && (
        <div style={{ background: '#fff', border: '2px solid #2563eb', borderRadius: 12, padding: '16px 20px', marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Recommended headline</div>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.3px' }}>{brief.recommendedHeadline}</div>
          {brief.recommendedSubheadline && <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{brief.recommendedSubheadline}</div>}
        </div>
      )}

      {/* Gap callout */}
      {brief.gap && (
        <div style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 24 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Gap: </span>
          <span style={{ fontSize: 13 }}>{brief.gap}</span>
        </div>
      )}

      {/* Design direction */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px', marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Design direction</div>
        <div style={{ display: 'grid', gap: 10 }}>
          {[
            { label: 'Current bg', value: brief.currentBg },
            { label: 'New bg', value: brief.newBg },
            { label: 'New accent', value: brief.newAccent },
            { label: 'Hero layout', value: brief.heroLayout },
          ].map(row => row.value && (
            <div key={row.label} style={{ display: 'flex', gap: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', minWidth: 100 }}>{row.label}</span>
              <span style={{ fontSize: 13 }}>{row.value}</span>
            </div>
          ))}
          {brief.sectionsNeeded.length > 0 && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', minWidth: 100, paddingTop: 2 }}>Sections</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {brief.sectionsNeeded.map(s => (
                  <span key={s} style={{ fontSize: 12, background: '#f1f5f9', color: '#475569', padding: '2px 10px', borderRadius: 6 }}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Competitors */}
      {brief.competitors.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', fontSize: 13, fontWeight: 700 }}>Competitor landscape</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: 12 }}>Competitor</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: 12 }}>Weakness</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: 12 }}>Threat</th>
              </tr>
            </thead>
            <tbody>
              {brief.competitors.map((c, i) => {
                const tc = THREAT_COLOR[c.threat] ?? THREAT_COLOR.Low
                return (
                  <tr key={c.name} style={{ borderTop: i > 0 ? '1px solid #f1f5f9' : 'none' }}>
                    <td style={{ padding: '10px 16px', fontWeight: 600 }}>{c.name}</td>
                    <td style={{ padding: '10px 16px', color: '#475569' }}>{c.weakness}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: tc.bg, color: tc.text }}>{c.threat}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Strategic moves */}
      {brief.strategicMoves.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Strategic moves</div>
          <div style={{ display: 'grid', gap: 12 }}>
            {brief.strategicMoves.map(m => (
              <div key={m.n} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 12 }}>
                <div style={{ width: 28, height: 28, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#2563eb', flexShrink: 0 }}>{m.n}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{m.title}</div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10-step checklist */}
      {brief.steps.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Implementation checklist</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {brief.steps.map(s => (
              <div key={s.n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${s.done ? '#16a34a' : '#cbd5e1'}`,
                  background: s.done ? '#16a34a' : 'transparent', flexShrink: 0, marginTop: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {s.done && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}
                </div>
                <span style={{ fontSize: 13, color: s.done ? '#94a3b8' : '#0f172a', textDecoration: s.done ? 'line-through' : 'none' }}>
                  <strong>{s.n}.</strong> {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
