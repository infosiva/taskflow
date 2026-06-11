'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [focused, setFocused] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await signIn('resend', { email, redirectTo: '/onboarding', redirect: false })
      setSent(true)
    } catch {
      toast.error('Failed to send magic link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @media (min-width: 1024px) { .auth-left { display: flex !important; } .auth-mobile-logo { display: none !important; } }
        input[type=email]::placeholder { color: rgba(255,255,255,0.22); }
        input[type=email]:-webkit-autofill { -webkit-box-shadow: 0 0 0 100px #111113 inset !important; -webkit-text-fill-color: #fff !important; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
      `}</style>

      <div style={{ minHeight: '100dvh', display: 'flex', background: '#0a0a0b', position: 'relative', overflow: 'hidden', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>

        {/* Gradient mesh */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-15%', left: '-8%', width: '60%', height: '70%', background: 'radial-gradient(ellipse at 30% 30%, rgba(20,184,166,0.30) 0%, rgba(6,182,212,0.10) 45%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '-15%', right: '-8%', width: '60%', height: '70%', background: 'radial-gradient(ellipse at 70% 70%, rgba(245,158,11,0.22) 0%, rgba(234,88,12,0.09) 45%, transparent 70%)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        </div>

        {/* Left panel — social proof */}
        <div className="auth-left" style={{ display: 'none', position: 'relative', zIndex: 1, flexDirection: 'column', justifyContent: 'center', padding: '64px 56px', width: '44%', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/" style={{ textDecoration: 'none', marginBottom: 52, display: 'inline-block' }}>
            <span style={{ fontWeight: 900, fontSize: 22, letterSpacing: '-0.04em', color: '#fff' }}>
              Task<span style={{ color: '#14b8a6' }}>Flow</span>
            </span>
          </Link>
          <h1 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#fff', margin: '0 0 20px', maxWidth: 340 }}>
            Your team&apos;s clarity<br />starts <span style={{ color: '#14b8a6' }}>right here.</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.40)', lineHeight: 1.65, maxWidth: 300, margin: '0 0 40px' }}>
            Free to start. No credit card. Your first board is live in under a minute.
          </p>

          {/* Free tier highlight */}
          <div style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.18)', borderRadius: 12, padding: '20px 22px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: '#14b8a6', marginBottom: 14, textTransform: 'uppercase' }}>Free forever includes</div>
            {['5 boards, unlimited tasks', '5 team members', '20 AI summaries / month', 'Drag-and-drop kanban'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10L11.5 4" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.50)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — form */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', position: 'relative', zIndex: 1 }}>

          {/* Mobile logo */}
          <Link href="/" className="auth-mobile-logo" style={{ textDecoration: 'none', marginBottom: 36, display: 'block' }}>
            <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-0.04em', color: '#fff' }}>
              Task<span style={{ color: '#14b8a6' }}>Flow</span>
            </span>
          </Link>

          <div style={{ width: '100%', maxWidth: 400 }}>
            <div style={{ marginBottom: 28, textAlign: 'center' }}>
              <h2 style={{ fontSize: 27, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 8px' }}>
                Create your workspace
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)', margin: 0 }}>
                5 boards · 5 members · 20 AI calls — forever free
              </p>
            </div>

            {/* Demo nudge */}
            <div style={{ marginBottom: 20, padding: '11px 14px', background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.18)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 15 }}>🎯</span>
              <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)' }}>
                Want to explore first?{' '}
                <Link href="/demo" style={{ fontWeight: 700, color: '#14b8a6', textDecoration: 'none' }}>Open live demo →</Link>
                {' '}No login needed.
              </span>
            </div>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 28px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }}>
                <div style={{ fontSize: 44, marginBottom: 16 }}>📬</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Check your inbox</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.42)', lineHeight: 1.65, margin: 0 }}>
                  Magic link sent to <strong style={{ color: '#14b8a6' }}>{email}</strong>.<br />Click it to create your workspace.
                </p>
                <button onClick={() => setSent(false)} style={{ marginTop: 22, fontSize: 13, color: '#14b8a6', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                  Use a different email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <Label htmlFor="email" style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)', display: 'block', marginBottom: 8 }}>Work email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    required
                    style={{
                      fontSize: 14, background: 'rgba(255,255,255,0.06)', color: '#fff',
                      border: `1px solid ${focused ? 'rgba(20,184,166,0.55)' : 'rgba(255,255,255,0.11)'}`,
                      borderRadius: 10, padding: '12px 14px', width: '100%',
                      transition: 'border-color 150ms ease', outline: 'none',
                    }}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: '#14b8a6', color: '#fff', fontWeight: 700, fontSize: 14,
                    padding: '12px 0', borderRadius: 10, border: 'none', width: '100%',
                    cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                    transition: 'background 150ms cubic-bezier(0.23,1,0.32,1), transform 100ms ease',
                  }}
                  onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
                  onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {loading ? 'Sending…' : 'Start free — no credit card'}
                </Button>
                <p style={{ fontSize: 11.5, textAlign: 'center', color: 'rgba(255,255,255,0.28)', margin: 0 }}>
                  By signing up you agree to our Terms and Privacy Policy
                </p>
              </form>
            )}

            <p style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.32)' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#14b8a6', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
