'use client'
import { useState } from 'react'

interface Props {
  workspaceId: string
  currentPlan: 'free' | 'pro' | 'team'
  onClose: () => void
}

const PLANS = [
  {
    key: 'pro' as const,
    name: 'Pro',
    price: '£8',
    period: '/user/mo',
    color: '#6366f1',
    features: ['Unlimited boards', '20 members', 'Unlimited AI/mo', 'Calendar view', 'Priority support', 'Custom fields'],
  },
  {
    key: 'team' as const,
    name: 'Team',
    price: '£14',
    period: '/user/mo',
    color: '#8b5cf6',
    features: ['Everything in Pro', 'Unlimited members', 'Dashboard analytics', 'Advanced AI (GPT-4)', 'SSO / SAML', 'Audit logs'],
  },
]

export default function UpgradeModal({ workspaceId, currentPlan, onClose }: Props) {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleUpgrade(plan: 'pro' | 'team') {
    setLoading(plan)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId, plan }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  async function handlePortal() {
    setLoading('portal')
    try {
      const res = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      alert('Failed to open billing portal.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '32px 36px', maxWidth: 640, width: '90vw', boxShadow: '0 25px 80px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Upgrade your workspace</h2>
            <p style={{ fontSize: 13, color: '#64748b', margin: '6px 0 0' }}>Current plan: <span style={{ color: '#a5b4fc', textTransform: 'capitalize' }}>{currentPlan}</span></p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {PLANS.map(plan => {
            const isCurrent = currentPlan === plan.key
            return (
              <div
                key={plan.key}
                style={{
                  background: `${plan.color}0d`,
                  border: `1px solid ${plan.color}33`,
                  borderRadius: 12, padding: '20px 22px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>{plan.name}</span>
                  {isCurrent && <span style={{ fontSize: 10, background: plan.color, color: '#fff', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>CURRENT</span>}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: plan.color }}>{plan.price}</span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: plan.color }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleUpgrade(plan.key)}
                  disabled={isCurrent || !!loading}
                  style={{
                    width: '100%', padding: '10px 0', borderRadius: 8, border: 'none',
                    background: isCurrent ? 'rgba(255,255,255,0.06)' : plan.color,
                    color: isCurrent ? '#475569' : '#fff',
                    fontWeight: 600, fontSize: 13, cursor: isCurrent ? 'default' : 'pointer',
                    opacity: loading && loading !== plan.key ? 0.5 : 1,
                    transition: 'opacity 150ms, transform 100ms',
                  }}
                  onMouseDown={e => { if (!isCurrent) (e.currentTarget.style.transform = 'scale(0.97)') }}
                  onMouseUp={e => { (e.currentTarget.style.transform = 'scale(1)') }}
                >
                  {loading === plan.key ? 'Redirecting…' : isCurrent ? 'Current plan' : `Upgrade to ${plan.name}`}
                </button>
              </div>
            )
          })}
        </div>

        {currentPlan !== 'free' && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handlePortal}
              disabled={!!loading}
              style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 20px', color: '#64748b', fontSize: 13, cursor: 'pointer' }}
            >
              {loading === 'portal' ? 'Opening portal…' : 'Manage subscription →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
