'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const RATINGS = [
  { value: 'love', emoji: '❤️', label: 'Love it' },
  { value: 'meh', emoji: '😐', label: 'Meh' },
  { value: 'broken', emoji: '🐛', label: 'Broken' },
] as const

export default function FeedbackWidget() {
  const pathname = usePathname()
  const [rating, setRating] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!rating || loading) return
    setLoading(true)
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, message, page: pathname }),
      })
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '1.5rem', color: '#14b8a6', fontSize: '0.875rem' }}>
        Thanks for the feedback!
      </div>
    )
  }

  return (
    <section style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '2.5rem 1.5rem',
      maxWidth: 480,
      margin: '0 auto',
    }}>
      <p style={{ color: '#a1a1aa', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>
        How&apos;s TaskFlow working for you?
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1rem' }}>
        {RATINGS.map(r => (
          <button
            key={r.value}
            onClick={() => setRating(r.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 8,
              border: `1px solid ${rating === r.value ? '#14b8a6' : 'rgba(255,255,255,0.1)'}`,
              background: rating === r.value ? 'rgba(20,184,166,0.15)' : 'transparent',
              color: rating === r.value ? '#14b8a6' : '#a1a1aa',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'border-color 150ms, background 150ms, color 150ms',
            }}
          >
            {r.emoji} {r.label}
          </button>
        ))}
      </div>
      {rating && (
        <>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Tell us more (optional)"
            rows={2}
            maxLength={500}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: '0.75rem',
              color: '#e4e4e7',
              fontSize: '0.875rem',
              resize: 'none',
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: '0.75rem',
            }}
          />
          <button
            onClick={submit}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.6rem',
              borderRadius: 8,
              border: 'none',
              background: '#14b8a6',
              color: '#0a0a0b',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 150ms',
            }}
          >
            {loading ? 'Sending…' : 'Send feedback'}
          </button>
        </>
      )}
    </section>
  )
}
