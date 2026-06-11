'use client'
import { useState } from 'react'
import Link from 'next/link'

type Source = 'jira' | 'trello' | 'linear' | 'github' | 'asana' | 'notion'

const SOURCES: { id: Source; name: string; ext: string; desc: string; accent: string; icon: string }[] = [
  { id: 'jira', name: 'Jira', ext: 'XML or CSV', desc: 'Export via Jira → Issues → Export', accent: '#2684ff', icon: 'J' },
  { id: 'trello', name: 'Trello', ext: 'JSON', desc: 'Board → Show Menu → More → Export JSON', accent: '#0052cc', icon: 'T' },
  { id: 'linear', name: 'Linear', ext: 'JSON or CSV', desc: 'Settings → Workspace → Export', accent: '#5e6ad2', icon: 'L' },
  { id: 'github', name: 'GitHub Issues', ext: 'Repo URL', desc: 'Paste your repo URL — we pull via API', accent: '#e8eaea', icon: 'G' },
  { id: 'asana', name: 'Asana', ext: 'CSV', desc: 'My Tasks → Export → CSV', accent: '#f06a6a', icon: 'A' },
  { id: 'notion', name: 'Notion', ext: 'CSV or Markdown', desc: 'Page → ⋯ → Export → Markdown & CSV', accent: '#e8e8e8', icon: 'N' },
]

type ParsedTask = { title: string; status: string; priority: string; assignee?: string; dueDate?: string }

const STATUS_COLOR: Record<string, string> = {
  'Todo': 'rgba(255,255,255,0.30)',
  'In Progress': '#14b8a6',
  'Done': '#34d399',
}
const PRIORITY_COLOR: Record<string, string> = { High: '#f87171', Medium: '#fb923c', Low: '#64748b' }

export default function MigratePage() {
  const [selected, setSelected] = useState<Source | null>(null)
  const [step, setStep] = useState<'pick' | 'upload' | 'preview' | 'done'>('pick')
  const [ghRepo, setGhRepo] = useState('')
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [parsedTasks, setParsedTasks] = useState<ParsedTask[]>([])
  const [parseError, setParseError] = useState<string | null>(null)
  const [importedCount, setImportedCount] = useState(0)

  const source = SOURCES.find(s => s.id === selected)

  const runParse = async (f?: File, repoUrl?: string) => {
    setParsing(true)
    setParseError(null)
    const fd = new FormData()
    fd.append('source', selected!)
    fd.append('action', 'parse')
    if (f) fd.append('file', f)
    if (repoUrl) fd.append('ghRepo', repoUrl)
    try {
      const res = await fetch('/api/migrate', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { setParseError(data.error || 'parse failed'); return }
      setParsedTasks(data.tasks)
      setStep('preview')
    } catch {
      setParseError('Network error — try again')
    } finally {
      setParsing(false)
    }
  }

  const handleFile = (f: File) => {
    setFile(f)
    runParse(f)
  }

  const handleFetchGithub = () => runParse(undefined, ghRepo)

  const handleImport = async () => {
    setImporting(true)
    const fd = new FormData()
    fd.append('source', selected!)
    fd.append('action', 'import')
    if (file) fd.append('file', file)
    if (ghRepo) fd.append('ghRepo', ghRepo)
    try {
      const res = await fetch('/api/migrate', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/login?next=/migrate'
          return
        }
        setParseError(data.error || 'import failed')
        setImporting(false)
        return
      }
      setImportedCount(data.imported)
      setStep('done')
    } catch {
      setParseError('Network error — try again')
      setImporting(false)
    }
  }

  const reset = () => { setSelected(null); setStep('pick'); setFile(null); setGhRepo(''); setParsedTasks([]); setParseError(null) }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0b', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        .mg-source-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:18px 16px;cursor:pointer;transition:border-color 150ms ease,box-shadow 150ms ease,transform 200ms cubic-bezier(0.23,1,0.32,1);display:flex;align-items:center;gap:14px}
        .mg-source-card:hover{border-color:rgba(20,184,166,0.35);box-shadow:0 2px 16px rgba(20,184,166,0.10);transform:translateY(-2px)}
        .mg-source-card.active{border-color:rgba(20,184,166,0.60);box-shadow:0 2px 20px rgba(20,184,166,0.18)}
        .mg-btn{display:inline-flex;align-items:center;gap:8px;background:#14b8a6;color:#fff;padding:11px 22px;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;border:none;transition:transform 160ms cubic-bezier(0.23,1,0.32,1),opacity 160ms ease;letter-spacing:-.01em}
        .mg-btn:hover{opacity:.92}
        .mg-btn:active{transform:scale(.97)}
        .mg-btn-ghost{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:11px 18px;font-size:13.5px;font-weight:500;color:rgba(255,255,255,0.55);cursor:pointer;transition:background 120ms ease}
        .mg-btn-ghost:hover{background:rgba(255,255,255,0.10)}
        .mg-drop{border:2px dashed rgba(255,255,255,0.12);border-radius:12px;padding:48px 28px;text-align:center;transition:border-color 150ms ease,background 150ms ease;cursor:pointer}
        .mg-drop.over,.mg-drop:hover{border-color:rgba(20,184,166,0.45);background:rgba(20,184,166,0.04)}
        @keyframes mg-up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
      `}</style>

      {/* Mesh */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '55%', height: '65%', background: 'radial-gradient(ellipse at 30% 30%, rgba(20,184,166,0.16) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '55%', height: '65%', background: 'radial-gradient(ellipse at 70% 70%, rgba(245,158,11,0.12) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.033) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
      </div>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,10,11,0.80)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 32px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontWeight: 900, fontSize: 15, letterSpacing: '-0.03em', color: '#fff', textDecoration: 'none' }}>
          Task<span style={{ color: '#14b8a6' }}>Flow</span>
        </Link>
        <Link href="/signup" style={{ fontSize: 13, fontWeight: 600, color: '#14b8a6', textDecoration: 'none', padding: '6px 14px', border: '1px solid rgba(20,184,166,0.30)', borderRadius: 7, transition: 'background 120ms ease' }}>
          Get free workspace →
        </Link>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '52px 24px 80px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 44, animation: 'mg-up 340ms cubic-bezier(0.23,1,0.32,1) both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(20,184,166,0.10)', border: '1px solid rgba(20,184,166,0.22)', borderRadius: 20, padding: '4px 12px', fontSize: 11.5, fontWeight: 600, color: '#5eead4', letterSpacing: '.04em', marginBottom: 18 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#14b8a6', display: 'inline-block' }} />
            MIGRATE IN MINUTES — NOT DAYS
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', marginBottom: 12 }}>
            Bring your team&apos;s work with you.
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.42)', lineHeight: 1.65, maxWidth: 500, margin: '0 auto' }}>
            Import from Jira, Trello, Linear, GitHub Issues, Asana, or Notion. Tasks, statuses, and assignees carry over — no manual re-entry.
          </p>
        </div>

        {/* Step 1 — pick source */}
        {step === 'pick' && (
          <div style={{ animation: 'mg-up 350ms cubic-bezier(0.23,1,0.32,1) 40ms both' }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 16 }}>Choose your current tool</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12, marginBottom: 32 }}>
              {SOURCES.map(s => (
                <div
                  key={s.id}
                  className={`mg-source-card${selected === s.id ? ' active' : ''}`}
                  onClick={() => setSelected(s.id)}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: s.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#0a0a0b', flexShrink: 0 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{s.name}</div>
                    <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.35)' }}>{s.ext}</div>
                  </div>
                  {selected === s.id && (
                    <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: '#14b8a6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selected && source && (
              <div style={{ animation: 'mg-up 200ms cubic-bezier(0.23,1,0.32,1) both', background: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.20)', borderRadius: 10, padding: '16px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}><strong style={{ color: '#5eead4' }}>{source.name}:</strong> {source.desc}</span>
              </div>
            )}

            {selected && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className="mg-btn" onClick={() => setStep('upload')}>
                  Continue with {source?.name}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2 — upload */}
        {step === 'upload' && source && (
          <div style={{ animation: 'mg-up 280ms cubic-bezier(0.23,1,0.32,1) both' }}>
            <button className="mg-btn-ghost" onClick={() => setStep('pick')} style={{ marginBottom: 28, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              Back
            </button>

            {source.id === 'github' ? (
              <div>
                <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>Paste your public GitHub repo URL. We&apos;ll pull open issues via the GitHub API.</p>
                <input
                  type="url"
                  placeholder="https://github.com/org/repo"
                  value={ghRepo}
                  onChange={e => setGhRepo(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#fff', outline: 'none', marginBottom: 16, fontFamily: 'inherit' }}
                />
                <button className="mg-btn" disabled={!ghRepo || parsing} onClick={handleFetchGithub}>
                  {parsing ? 'Fetching…' : 'Fetch issues'}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              </div>
            ) : (
              <div
                className={`mg-drop${dragging ? ' over' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
                onClick={() => document.getElementById('mg-file-input')?.click()}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(20,184,166,0.10)', border: '1px solid rgba(20,184,166,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="1.8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.70)', marginBottom: 6 }}>
                  Drop your {source.name} {source.ext} here
                </p>
                <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.30)' }}>or click to browse</p>
              </div>
            )}
            <input id="mg-file-input" type="file" accept=".csv,.json,.xml" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
            {parsing && (
              <p style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: '#14b8a6' }}>Parsing file…</p>
            )}
            {parseError && (
              <div style={{ marginTop: 14, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f87171' }}>
                {parseError}
              </div>
            )}
          </div>
        )}

        {/* Step 3 — preview */}
        {step === 'preview' && (
          <div style={{ animation: 'mg-up 280ms cubic-bezier(0.23,1,0.32,1) both' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                  {file ? file.name : 'Fetched issues'} → TaskFlow
                </h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{parsedTasks.length} tasks detected — review before import</p>
              </div>
              <button className="mg-btn-ghost" onClick={reset}>Start over</button>
            </div>

            {parseError && (
              <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#f87171' }}>
                {parseError}
              </div>
            )}

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden', marginBottom: 28, maxHeight: 360, overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '.05em', position: 'sticky', top: 0, background: '#0d0d0e' }}>
                <span>Task</span><span>Status</span><span>Priority</span>
              </div>
              {parsedTasks.map((t, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px', padding: '11px 16px', borderBottom: i < parsedTasks.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
                  <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.80)', fontWeight: 500 }}>{t.title}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: STATUS_COLOR[t.status] ?? 'rgba(255,255,255,0.30)' }}>{t.status}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: PRIORITY_COLOR[t.priority] ?? '#64748b' }}>{t.priority}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="mg-btn" disabled={importing || parsedTasks.length === 0} onClick={handleImport}>
                {importing ? 'Importing…' : `Import ${parsedTasks.length} tasks to TaskFlow`}
                {!importing && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>}
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — done */}
        {step === 'done' && (
          <div style={{ animation: 'mg-up 280ms cubic-bezier(0.23,1,0.32,1) both', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 10 }}>All {importedCount} tasks imported.</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.40)', marginBottom: 32 }}>Your board is ready. Invite your team and start your next sprint.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/signup" className="mg-btn" style={{ textDecoration: 'none' }}>
                Create workspace to save
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <button className="mg-btn-ghost" onClick={reset}>Import another</button>
            </div>
          </div>
        )}

        {/* Callout — always visible at bottom */}
        {step === 'pick' && (
          <div style={{ marginTop: 52, padding: '28px 32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 20 }}>
            {[
              { v: '< 2 min', l: 'Average import time' },
              { v: '100%', l: 'Task data preserved' },
              { v: 'Free', l: 'No limit on import size' },
            ].map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#14b8a6', letterSpacing: '-0.03em' }}>{s.v}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)', marginTop: 3 }}>{s.l}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
