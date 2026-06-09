'use client'
import type { CheckboxValue } from '@/lib/types'

interface Props {
  value: CheckboxValue | null
  onSave: (v: CheckboxValue) => void
  readOnly?: boolean
}

export default function CheckboxCell({ value, onSave, readOnly }: Props) {
  const checked = value?.checked ?? false
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={e => !readOnly && onSave({ checked: e.target.checked })}
      readOnly={readOnly}
      style={{ width: 16, height: 16, cursor: readOnly ? 'default' : 'pointer', accentColor: '#6366f1' }}
    />
  )
}
