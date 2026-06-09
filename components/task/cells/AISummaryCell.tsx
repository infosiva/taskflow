'use client'
import { useState } from 'react'
import type { AISummaryValue } from '@/lib/types'

interface Props {
  value: AISummaryValue | null
  taskId: string
  boardId: string
  onSave: (v: AISummaryValue) => void
}

export default function AISummaryCell({ value, taskId, boardId, onSave }: Props) {
  const [loading, setLoading] = useState(false)

  async function generate() {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, boardId }),
      })
      const data = await res.json()
      if (data.summary) onSave({ generated: data.summary, model: data.model || 'llama-3', generated_at: new Date().toISOString() })
    } catch {}
    setLoading(false)
  }

  if (value?.generated) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 11, color: '#94a3b8', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        ✨ {value.generated}
      </span>
      <button onClick={generate} style={{ fontSize: 10, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}>↻</button>
    </div>
  )

  return (
    <button
      onClick={generate}
      disabled={loading}
      style={{ fontSize: 11, color: loading ? '#475569' : '#6366f1', background: 'none', border: 'none', cursor: loading ? 'default' : 'pointer' }}
    >
      {loading ? '✨ Generating…' : '✨ AI Summary'}
    </button>
  )
}
