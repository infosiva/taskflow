'use client'
import type { Column, CellValue } from '@/lib/types'
import StatusCell from './StatusCell'
import PriorityCell from './PriorityCell'
import DueDateCell from './DueDateCell'
import TextCell from './TextCell'
import NumberCell from './NumberCell'
import CheckboxCell from './CheckboxCell'
import DropdownCell from './DropdownCell'
import TagsCell from './TagsCell'
import PersonCell from './PersonCell'
import AISummaryCell from './AISummaryCell'

interface Props {
  column: Column
  cellValue: CellValue | undefined
  taskId: string
  boardId: string
  onSave: (value: unknown) => void
  readOnly?: boolean
}

export default function CellRenderer({ column, cellValue, taskId, boardId, onSave, readOnly }: Props) {
  const v = cellValue?.value as Record<string, unknown> | null ?? null

  switch (column.type) {
    case 'status':
      return <StatusCell value={v as never} column={column} onSave={onSave as never} readOnly={readOnly} />
    case 'priority':
      return <PriorityCell value={v as never} onSave={onSave as never} readOnly={readOnly} />
    case 'due_date':
      return <DueDateCell value={v as never} onSave={onSave as never} readOnly={readOnly} />
    case 'text':
      return <TextCell value={v as never} onSave={onSave as never} readOnly={readOnly} />
    case 'number':
      return <NumberCell value={v as never} column={column} onSave={onSave as never} readOnly={readOnly} />
    case 'checkbox':
      return <CheckboxCell value={v as never} onSave={onSave as never} readOnly={readOnly} />
    case 'dropdown':
      return <DropdownCell value={v as never} column={column} onSave={onSave as never} readOnly={readOnly} />
    case 'tags':
      return <TagsCell value={v as never} column={column} onSave={onSave as never} readOnly={readOnly} />
    case 'person':
      return <PersonCell value={v as never} readOnly={readOnly} />
    case 'ai_summary':
      return <AISummaryCell value={v as never} taskId={taskId} boardId={boardId} onSave={onSave as never} />
    default:
      return <span style={{ color: '#475569', fontSize: 12 }}>—</span>
  }
}
