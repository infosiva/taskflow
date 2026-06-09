'use client'
import { useState } from 'react'
import type { Column, StatusValue } from '@/lib/types'

interface Props {
  value: StatusValue | null
  column: Column
  onSave: (v: StatusValue) => void
  readOnly?: boolean
}

const DEFAULT_OPTIONS = [
  { label: 'To do', color: '#64748b' },
  { label: 'In progress', color: '#f59e0b' },
  { label: 'Done', color: '#10b981' },
  { label: 'Blocked', color: '#ef4444' },
]

export default function StatusCell({ value, column, onSave, readOnly }: Props) {
  const [open, setOpen] = useState(false)
  const options = (column.config as { options?: { label: string; color: string }[] })?.options || DEFAULT_OPTIONS
  const current = value || { label: '', color: '#64748b' }

  if (readOnly) return (
    <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500, background: current.color + '22', color: current.color }}>
      {current.label || '—'}
    </span>
  )

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '3px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none',
          background: current.color + '22', color: current.color,
          minWidth: 80, textAlign: 'center',
          transform: 'scale(1)', transition: 'transform 100ms',
        }}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {current.label || '—'}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, zIndex: 50, minWidth: 160, marginTop: 4,
          background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
          padding: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          {options.map(opt => (
            <button
              key={opt.label}
              onClick={() => { onSave(opt); setOpen(false) }}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: 6,
                fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', color: opt.color,
              }}
            >
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: opt.color, marginRight: 8 }} />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
