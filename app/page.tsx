import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TaskFlow — AI-Native Project Tracker for Modern Teams',
  description: 'Replace Jira with an AI-native tracker. Custom fields, Kanban, Calendar, smart assignment — all included free. No per-seat AI tax.',
}

const FEATURES = [
  { icon: '⚡', title: 'AI assign & subtasks', desc: 'One click — AI suggests who owns it and breaks it into steps' },
  { icon: '🧩', title: 'Custom column engine', desc: 'Status, priority, due date, dropdown, tags — zero migrations' },
  { icon: '📋', title: 'Table + Kanban + Calendar', desc: 'Four views per board. Switch in one click' },
  { icon: '🔒', title: 'Free tier includes AI', desc: '20 AI calls/month, 5 boards, 5 members — no credit card' },
]

const STEPS = [
  { n: '1', title: 'Create workspace', desc: 'Name your team. Invite members.' },
  { n: '2', title: 'Add a board', desc: 'Set columns that match your workflow.' },
  { n: '3', title: 'Add tasks', desc: 'Drag, inline-edit, assign in seconds.' },
  { n: '4', title: 'Let AI help', desc: 'Subtasks, summaries, risk flags — built in.' },
]

export default function LandingPage() {
  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#f1f5f9' }}>
      {/* Glow blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '30%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.03em' }}>Task<span style={{ color: '#6366f1' }}>Flow</span></span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/login" style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'none' }}>Sign in</Link>
          <Link href="/signup" style={{ fontSize: 13, color: '#fff', background: '#6366f1', padding: '8px 18px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>Get started free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 840, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, color: '#818cf8', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, padding: '4px 14px', marginBottom: 24, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
          AI included — no extra charge
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 20px' }}>
          Project tracking with<br /><span style={{ color: '#6366f1' }}>AI built in</span>
        </h1>
        <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.6, maxWidth: 560, margin: '0 auto 36px' }}>
          Custom fields, smart assignment, subtask generation, risk flags — all free. Not a bolt-on. Built in from day one.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' as const }}>
          <Link href="/signup" style={{ fontSize: 15, fontWeight: 700, color: '#fff', background: '#6366f1', padding: '14px 28px', borderRadius: 10, textDecoration: 'none', display: 'inline-block' }}>
            Start free — no card needed
          </Link>
          <Link href="/login" style={{ fontSize: 15, fontWeight: 600, color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 28px', borderRadius: 10, textDecoration: 'none', display: 'inline-block' }}>
            Sign in
          </Link>
        </div>
        <p style={{ marginTop: 16, fontSize: 12, color: '#475569' }}>Free: 5 boards · 5 members · 20 AI calls/month</p>
      </section>

      {/* Steps */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 880, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {STEPS.map(s => (
            <div key={s.n} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 18px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#a5b4fc', marginBottom: 12 }}>{s.n}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 880, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, marginBottom: 36, letterSpacing: '-0.02em' }}>Everything you need, nothing you don&apos;t</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '24px 20px' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, padding: '48px 32px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Ready to replace Jira?</h2>
          <p style={{ color: '#94a3b8', marginBottom: 24, fontSize: 15 }}>Set up in 2 minutes. No migrations. No per-seat AI fees.</p>
          <Link href="/signup" style={{ fontSize: 15, fontWeight: 700, color: '#fff', background: '#6366f1', padding: '14px 32px', borderRadius: 10, textDecoration: 'none', display: 'inline-block' }}>
            Create your workspace
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', color: '#334155', fontSize: 12 }}>
        © 2026 TaskFlow · Built with AI in Britain
      </footer>
    </div>
  )
}
