'use client'
import { useState } from 'react'
import type { DueDateValue } from '@/lib/types'

interface Props {
  value: DueDateValue | null
  onSave: (v: DueDateValue) => void
  readOnly?: boolean
}

function isOverdue(date: string) {
  return new Date(date) < new Date() && date !== ''
}

export default function DueDateCell({ value, onSave, readOnly }: Props) {
  const [editing, setEditing] = useState(false)
  const overdue = value?.date ? isOverdue(value.date) : false

  if (readOnly) return (
    <span style={{ fontSize: 12, color: overdue ? '#ef4444' : '#94a3b8' }}>
      {value?.date ? new Date(value.date).toLocaleDateString() : '—'}
    </span>
  )

  if (editing) return (
    <input
      type="date"
      defaultValue={value?.date || ''}
      autoFocus
      onBlur={e => { onSave({ date: e.target.value }); setEditing(false) }}
      style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '2px 6px', color: '#f1f5f9', fontSize: 12 }}
    />
  )

  return (
    <button
      onClick={() => setEditing(true)}
      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: overdue ? '#ef4444' : '#94a3b8', padding: '2px 4px' }}
    >
      {value?.date ? new Date(value.date).toLocaleDateString() : '+ Date'}
    </button>
  )
}
