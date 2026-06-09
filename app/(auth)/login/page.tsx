'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await signIn('resend', { email, redirectTo: '/app', redirect: false })
      setSent(true)
    } catch {
      toast.error('Failed to send magic link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4" style={{ background: '#0a0a0f' }}>
      <div className="glow-blob w-96 h-96 top-0 left-1/4" style={{ background: '#6366f1' }} />
      <div className="glow-blob w-64 h-64 bottom-0 right-1/4" style={{ background: '#8b5cf6' }} />

      <div className="relative z-10 w-full max-w-sm fade-up">
        <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-sm" style={{ color: '#64748b' }}>Sign in with a magic link — no password needed</p>
          </div>

          {sent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">✉️</div>
              <p className="text-white font-medium mb-2">Check your email</p>
              <p className="text-sm" style={{ color: '#64748b' }}>Magic link sent to <strong className="text-white">{email}</strong></p>
              <Button variant="ghost" className="mt-4 text-sm" onClick={() => setSent(false)}>
                Use different email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white/80 text-sm mb-1.5 block">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              <Button
                type="submit"
                className="w-full font-semibold"
                style={{ background: '#6366f1', color: 'white' }}
                disabled={loading}
              >
                {loading ? 'Sending…' : 'Send magic link'}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm" style={{ color: '#64748b' }}>
            No account?{' '}
            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
