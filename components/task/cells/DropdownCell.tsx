'use client'
import { useState } from 'react'
import type { DropdownValue } from '@/lib/types'

interface Props {
  value: DropdownValue | null
  column: { config: unknown }
  onSave: (v: DropdownValue) => void
  readOnly?: boolean
}

export default function DropdownCell({ value, column, onSave, readOnly }: Props) {
  const [open, setOpen] = useState(false)
  const options = (column.config as { options?: string[] })?.options || []

  if (readOnly) return <span style={{ fontSize: 13, color: '#94a3b8' }}>{value?.option || '—'}</span>

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '3px 8px', fontSize: 12, color: '#f1f5f9', cursor: 'pointer' }}
      >
        {value?.option || '— Select —'}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, zIndex: 50, minWidth: 140, marginTop: 4,
          background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onSave({ option: opt }); setOpen(false) }}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: 6, fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', color: '#f1f5f9' }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
