'use client'
import type { PersonValue } from '@/lib/types'

interface Props {
  value: PersonValue | null
  readOnly?: boolean
}

export default function PersonCell({ value }: Props) {
  if (!value?.name) return <span style={{ fontSize: 12, color: '#475569' }}>—</span>
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {value.avatar ? (
        <img src={value.avatar} alt={value.name} style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'white', fontWeight: 700 }}>
          {value.name[0].toUpperCase()}
        </div>
      )}
      <span style={{ fontSize: 12, color: '#f1f5f9' }}>{value.name}</span>
    </div>
  )
}
