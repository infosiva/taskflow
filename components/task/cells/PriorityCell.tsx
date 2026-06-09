'use client'
import { useState } from 'react'
import type { PriorityValue } from '@/lib/types'

const PRIORITIES: { level: PriorityValue['level']; label: string; color: string; icon: string }[] = [
  { level: 'critical', label: 'Critical', color: '#ef4444', icon: '🔴' },
  { level: 'high',     label: 'High',     color: '#f97316', icon: '🟠' },
  { level: 'medium',   label: 'Medium',   color: '#f59e0b', icon: '🟡' },
  { level: 'low',      label: 'Low',      color: '#6366f1', icon: '🔵' },
  { level: 'none',     label: 'None',     color: '#475569', icon: '⚪' },
]

interface Props {
  value: PriorityValue | null
  onSave: (v: PriorityValue) => void
  readOnly?: boolean
}

export default function PriorityCell({ value, onSave, readOnly }: Props) {
  const [open, setOpen] = useState(false)
  const current = PRIORITIES.find(p => p.level === value?.level) || PRIORITIES[4]

  if (readOnly) return <span style={{ fontSize: 12 }}>{current.icon} {current.label}</span>

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: current.color, padding: '2px 6px' }}
      >
        {current.icon} {current.label}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, zIndex: 50, minWidth: 140, marginTop: 4,
          background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
          padding: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          {PRIORITIES.map(p => (
            <button
              key={p.level}
              onClick={() => { onSave({ level: p.level }); setOpen(false) }}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '7px 10px',
                borderRadius: 6, fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', color: p.color,
              }}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
