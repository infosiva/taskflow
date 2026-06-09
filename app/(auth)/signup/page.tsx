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
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', background: '#f8fafc' }}>
      {/* Logo */}
      <Link href="/" style={{ marginBottom: 32, fontWeight: 900, fontSize: 20, letterSpacing: '-0.03em', color: '#0f172a', textDecoration: 'none' }}>
        Task<span style={{ color: '#0ea5e9' }}>Flow</span>
      </Link>

      <div style={{ width: '100%', maxWidth: 380, background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,.06)', padding: '36px 32px' }}>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Check your inbox</h2>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
              Magic link sent to <strong style={{ color: '#0f172a' }}>{email}</strong>.<br />Click it to create your workspace.
            </p>
            <button
              onClick={() => setSent(false)}
              style={{ marginTop: 20, fontSize: 13, color: '#0ea5e9', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 28, textAlign: 'center' }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 6 }}>Get started free</h1>
              <p style={{ fontSize: 13, color: '#64748b' }}>5 boards · 5 members · 20 AI calls — forever free</p>
            </div>

            {/* Try demo first nudge */}
            <div style={{ marginBottom: 20, padding: '10px 14px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16 }}>🎯</span>
              <span style={{ fontSize: 12.5, color: '#0369a1' }}>
                Want to try first?{' '}
                <Link href="/demo" style={{ fontWeight: 700, color: '#0ea5e9', textDecoration: 'none' }}>Open the live demo →</Link>
                {' '}No login needed.
              </span>
            </div>

            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <Label htmlFor="email" style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Work email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{ fontSize: 14, borderColor: '#e2e8f0', borderRadius: 8 }}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                style={{ background: '#0ea5e9', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px 0', borderRadius: 8, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 150ms ease, transform 100ms ease', width: '100%' }}
                onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
                onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {loading ? 'Sending…' : 'Start free — no credit card'}
              </Button>
              <p style={{ fontSize: 11.5, textAlign: 'center', color: '#94a3b8' }}>
                By signing up you agree to our Terms and Privacy Policy
              </p>
            </form>
          </>
        )}

        <p style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: '#64748b' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#0ea5e9', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
