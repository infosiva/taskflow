'use client'
import { useState } from 'react'
import type { TextValue } from '@/lib/types'

interface Props {
  value: TextValue | null
  onSave: (v: TextValue) => void
  readOnly?: boolean
}

export default function TextCell({ value, onSave, readOnly }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value?.text || '')

  if (readOnly) return <span style={{ fontSize: 13, color: '#94a3b8' }}>{value?.text || '—'}</span>

  if (editing) return (
    <input
      value={draft}
      autoFocus
      onChange={e => setDraft(e.target.value)}
      onBlur={() => { onSave({ text: draft }); setEditing(false) }}
      onKeyDown={e => { if (e.key === 'Enter') { onSave({ text: draft }); setEditing(false) } if (e.key === 'Escape') setEditing(false) }}
      style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #6366f1', color: '#f1f5f9', fontSize: 13, outline: 'none', width: '100%', padding: '2px 0' }}
    />
  )

  return (
    <span
      onClick={() => setEditing(true)}
      style={{ fontSize: 13, color: value?.text ? '#f1f5f9' : '#475569', cursor: 'text', display: 'block', minWidth: 60 }}
    >
      {value?.text || 'Add text…'}
    </span>
  )
}
