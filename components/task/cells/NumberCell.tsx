'use client'
import { useState } from 'react'
import type { NumberValue } from '@/lib/types'

interface Props {
  value: NumberValue | null
  column: { config: unknown }
  onSave: (v: NumberValue) => void
  readOnly?: boolean
}

export default function NumberCell({ value, column, onSave, readOnly }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(value?.value ?? ''))
  const unit = (column.config as { unit?: string })?.unit || ''

  if (readOnly) return <span style={{ fontSize: 13, color: '#94a3b8' }}>{value?.value != null ? `${unit}${value.value}` : '—'}</span>

  if (editing) return (
    <input
      type="number"
      value={draft}
      autoFocus
      onChange={e => setDraft(e.target.value)}
      onBlur={() => { onSave({ value: Number(draft), unit }); setEditing(false) }}
      onKeyDown={e => { if (e.key === 'Enter') { onSave({ value: Number(draft), unit }); setEditing(false) } }}
      style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #6366f1', color: '#f1f5f9', fontSize: 13, outline: 'none', width: 80, padding: '2px 0' }}
    />
  )

  return (
    <span
      onClick={() => setEditing(true)}
      style={{ fontSize: 13, color: value?.value != null ? '#f1f5f9' : '#475569', cursor: 'text' }}
    >
      {value?.value != null ? `${unit}${value.value}` : '+ Number'}
    </span>
  )
}
