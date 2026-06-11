'use client'
import { useEffect, useState, useCallback } from 'react'

type AgentRun = {
  id: string
  project: string
  agentName: string
  status: 'running' | 'completed' | 'failed' | 'paused'
  message: string
  details: Record<string, unknown>
  durationMs: number | null
  tokenCost: number | null
  createdAt: string
}

type ProjectAudit = {
  id: string
  project: string
  pattern: string | null
  fakeDataFound: boolean
  fakeDataDetails: string[]
  topFixes: string[]
  layoutDirections: { title: string; description: string }[]
  consolidationNote: string | null
  chatbotPresent: boolean
  feedbackPresent: boolean
  sitemapPresent: boolean
  robotsPresent: boolean
  ogImagePresent: boolean
  httpTrackerFound: boolean
  auditedAt: string
}

const STATUS_COLOR: Record<string, string> = {
  running: '#f59e0b',
  completed: '#10b981',
  failed: '#ef4444',
  paused: '#6366f1',
}

const STATUS_DOT: Record<string, string> = {
  running: '●',
  completed: '●',
  failed: '●',
  paused: '●',
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function AuditCard({ audit }: { audit: ProjectAudit }) {
  const [open, setOpen] = useState(false)
  const critical = audit.fakeDataFound || audit.httpTrackerFound || !audit.feedbackPresent
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${critical ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 10,
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'background 200ms',
      }}
      onClick={() => setOpen(o => !o)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 14 }}>{audit.project}</span>
            {audit.pattern && (
              <span style={{ fontSize: 11, color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '2px 7px', borderRadius: 4 }}>
                {audit.pattern}
              </span>
            )}
            {critical && (
              <span style={{ fontSize: 11, color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '2px 7px', borderRadius: 4, fontWeight: 600 }}>
                ISSUES
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
            {[
              { label: 'Chatbot', ok: audit.chatbotPresent },
              { label: 'Feedback', ok: audit.feedbackPresent },
              { label: 'Sitemap', ok: audit.sitemapPresent },
              { label: 'Robots', ok: audit.robotsPresent },
              { label: 'OG img', ok: audit.ogImagePresent },
              { label: 'HTTP ⚠', ok: !audit.httpTrackerFound },
            ].map(({ label, ok }) => (
              <span key={label} style={{ color: ok ? '#10b981' : '#ef4444' }}>
                {ok ? '✓' : '✗'} {label}
              </span>
            ))}
          </div>
        </div>
        <span style={{ color: '#475569', fontSize: 12 }}>{timeAgo(audit.auditedAt)}</span>
      </div>

      {open && (
        <div style={{ marginTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
          {audit.fakeDataFound && audit.fakeDataDetails.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#ef4444', marginBottom: 6 }}>Fake data found:</div>
              {(audit.fakeDataDetails as string[]).map((d, i) => (
                <div key={i} style={{ fontSize: 12, color: '#94a3b8', paddingLeft: 12, marginBottom: 3 }}>• {d}</div>
              ))}
            </div>
          )}
          {audit.topFixes.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b', marginBottom: 6 }}>Priority fixes:</div>
              {(audit.topFixes as string[]).map((f, i) => (
                <div key={i} style={{ fontSize: 12, color: '#94a3b8', paddingLeft: 12, marginBottom: 3 }}>
                  {i + 1}. {f}
                </div>
              ))}
            </div>
          )}
          {audit.consolidationNote && (
            <div style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', marginBottom: 8 }}>
              {audit.consolidationNote}
            </div>
          )}
          {audit.layoutDirections.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#14b8a6', marginBottom: 6 }}>Layout directions:</div>
              {(audit.layoutDirections as { title: string; description: string }[]).map((d, i) => (
                <div key={i} style={{ fontSize: 12, color: '#94a3b8', paddingLeft: 12, marginBottom: 4 }}>
                  <strong style={{ color: '#cbd5e1' }}>{d.title}</strong> — {d.description}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function RunCard({ run }: { run: AgentRun }) {
  const color = STATUS_COLOR[run.status] ?? '#94a3b8'
  return (
    <div style={{
      display: 'flex',
      gap: 12,
      padding: '10px 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      alignItems: 'flex-start',
    }}>
      <span style={{ color, fontSize: 10, marginTop: 3, flexShrink: 0 }}>{STATUS_DOT[run.status]}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {run.project} · {run.agentName}
          </span>
          <span style={{ fontSize: 11, color: '#475569', flexShrink: 0 }}>{timeAgo(run.createdAt)}</span>
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {run.message}
        </div>
        {run.durationMs != null && (
          <div style={{ fontSize: 11, color: '#475569', marginTop: 3 }}>
            {(run.durationMs / 1000).toFixed(1)}s
            {run.tokenCost != null && ` · ${run.tokenCost.toFixed(0)} tokens`}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AgentOpsPage() {
  const [runs, setRuns] = useState<AgentRun[]>([])
  const [audits, setAudits] = useState<ProjectAudit[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [tab, setTab] = useState<'audits' | 'live'>('audits')

  const apiKey = process.env.NEXT_PUBLIC_AGENT_API_KEY ?? ''

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const headers = { Authorization: `Bearer ${apiKey}` }
      const [runsRes, auditsRes] = await Promise.all([
        fetch('/api/agent/activity?limit=100', { headers }),
        fetch('/api/agent/audit', { headers }),
      ])
      if (runsRes.ok) {
        const d = await runsRes.json()
        setRuns(d.runs ?? [])
      }
      if (auditsRes.ok) {
        const d = await auditsRes.json()
        setAudits(d.audits ?? [])
      }
    } finally {
      setLoading(false)
    }
  }, [apiKey])

  useEffect(() => { load() }, [load])

  // poll every 30s for live updates
  useEffect(() => {
    const id = setInterval(load, 30000)
    return () => clearInterval(id)
  }, [load])

  const projects = Array.from(new Set(runs.map(r => r.project))).sort()
  const filteredRuns = filter === 'all' ? runs : runs.filter(r => r.project === filter)

  const stats = {
    total: runs.length,
    completed: runs.filter(r => r.status === 'completed').length,
    failed: runs.filter(r => r.status === 'failed').length,
    running: runs.filter(r => r.status === 'running').length,
    auditsTotal: audits.length,
    auditsCritical: audits.filter(a => a.fakeDataFound || a.httpTrackerFound || !a.feedbackPresent).length,
  }

  return (
    <div style={{ padding: '24px', maxWidth: 1100, margin: '0 auto', color: '#e2e8f0' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>
          Agent Ops
        </h1>
        <p style={{ fontSize: 14, color: '#64748b' }}>
          Portfolio project audits + live agent activity feed
        </p>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Runs', value: stats.total, color: '#f1f5f9' },
          { label: 'Completed', value: stats.completed, color: '#10b981' },
          { label: 'Failed', value: stats.failed, color: '#ef4444' },
          { label: 'Running', value: stats.running, color: '#f59e0b' },
          { label: 'Audited', value: stats.auditsTotal, color: '#14b8a6' },
          { label: 'Critical', value: stats.auditsCritical, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 8,
            padding: '12px 14px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 0 }}>
        {(['audits', 'live'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 16px',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${tab === t ? '#14b8a6' : 'transparent'}`,
              color: tab === t ? '#14b8a6' : '#64748b',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'color 150ms, border-color 150ms',
            }}
          >
            {t === 'audits' ? `Audits (${stats.auditsTotal})` : `Live Feed (${stats.total})`}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={load}
            style={{
              padding: '6px 14px',
              background: loading ? 'rgba(20,184,166,0.1)' : 'rgba(20,184,166,0.15)',
              border: '1px solid rgba(20,184,166,0.3)',
              borderRadius: 6,
              color: '#14b8a6',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 150ms',
            }}
          >
            {loading ? '...' : '↺ Refresh'}
          </button>
        </div>
      </div>

      {/* Content */}
      {tab === 'audits' ? (
        <div>
          {audits.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#475569' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No audits yet</div>
              <div style={{ fontSize: 13 }}>Audits are seeded by running the portfolio audit script</div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {audits.map(a => <AuditCard key={a.id} audit={a} />)}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16 }}>
          {/* Project filter sidebar */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              Projects
            </div>
            <button
              onClick={() => setFilter('all')}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '7px 10px',
                background: filter === 'all' ? 'rgba(20,184,166,0.1)' : 'none',
                border: 'none', borderRadius: 6,
                color: filter === 'all' ? '#14b8a6' : '#94a3b8',
                fontSize: 13, cursor: 'pointer', marginBottom: 2,
              }}
            >
              All ({runs.length})
            </button>
            {projects.map(p => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '7px 10px',
                  background: filter === p ? 'rgba(20,184,166,0.1)' : 'none',
                  border: 'none', borderRadius: 6,
                  color: filter === p ? '#14b8a6' : '#94a3b8',
                  fontSize: 12, cursor: 'pointer', marginBottom: 2,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}
              >
                {p} ({runs.filter(r => r.project === p).length})
              </button>
            ))}
          </div>

          {/* Feed */}
          <div>
            {filteredRuns.length === 0 && !loading && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#475569' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📡</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No agent activity yet</div>
                <div style={{ fontSize: 13 }}>
                  Call <code style={{ color: '#14b8a6' }}>POST /api/agent/activity</code> with{' '}
                  <code style={{ color: '#14b8a6' }}>Authorization: Bearer {'<AGENT_API_KEY>'}</code>
                </div>
              </div>
            )}
            {filteredRuns.map(r => <RunCard key={r.id} run={r} />)}
          </div>
        </div>
      )}
    </div>
  )
}
