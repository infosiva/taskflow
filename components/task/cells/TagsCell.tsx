'use client'
import { useState } from 'react'
import type { TagsValue } from '@/lib/types'

interface Props {
  value: TagsValue | null
  column: { config: unknown }
  onSave: (v: TagsValue) => void
  readOnly?: boolean
}

const TAG_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

export default function TagsCell({ value, column, onSave, readOnly }: Props) {
  const [open, setOpen] = useState(false)
  const options = (column.config as { options?: string[] })?.options || []
  const selected = value?.tags || []

  function toggle(tag: string) {
    const next = selected.includes(tag) ? selected.filter(t => t !== tag) : [...selected, tag]
    onSave({ tags: next })
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, position: 'relative' }}>
      {selected.map((tag, i) => (
        <span key={tag} style={{ padding: '2px 7px', borderRadius: 10, fontSize: 11, fontWeight: 500, background: TAG_COLORS[i % TAG_COLORS.length] + '22', color: TAG_COLORS[i % TAG_COLORS.length] }}>
          {tag}
        </span>
      ))}
      {!readOnly && (
        <>
          <button onClick={() => setOpen(o => !o)} style={{ fontSize: 11, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}>
            {selected.length ? '…' : '+ Tag'}
          </button>
          {open && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, zIndex: 50, minWidth: 140, marginTop: 4,
              background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}>
              {options.map(opt => (
                <button
                  key={opt}
                  onClick={() => toggle(opt)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left',
                    padding: '7px 10px', borderRadius: 6, fontSize: 13, background: 'none', border: 'none', cursor: 'pointer',
                    color: selected.includes(opt) ? '#6366f1' : '#f1f5f9',
                  }}
                >
                  <span style={{ width: 12, height: 12, borderRadius: 2, border: '1px solid #6366f1', background: selected.includes(opt) ? '#6366f1' : 'transparent', display: 'inline-block' }} />
                  {opt}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
