'use client'
import { useBoardStore } from '@/store/boardStore'

const STATUS_COLORS: Record<string, string> = {
  'To do': '#64748b',
  'In progress': '#f59e0b',
  'Done': '#10b981',
  'Blocked': '#ef4444',
}

interface Props { boardId: string }

export default function KanbanView({ boardId: _ }: Props) {
  const { tasks, groups, columns, cellValues } = useBoardStore()

  const statusCol = columns.find(c => c.type === 'status')
  const statusOptions = (statusCol?.config as { options?: { label: string; color: string }[] })?.options || [
    { label: 'To do', color: '#64748b' },
    { label: 'In progress', color: '#f59e0b' },
    { label: 'Done', color: '#10b981' },
  ]

  function getStatus(taskId: string): string {
    if (!statusCol) return 'To do'
    const cell = cellValues[taskId]?.[statusCol.id]
    return (cell?.value as { label?: string })?.label || 'To do'
  }

  return (
    <div style={{ display: 'flex', gap: 16, padding: '24px', overflowX: 'auto', height: '100%' }}>
      {statusOptions.map(opt => {
        const columnTasks = tasks.filter(t => getStatus(t.id) === opt.label)
        return (
          <div key={opt.label} style={{ minWidth: 260, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: opt.color, display: 'inline-block' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{opt.label}</span>
              <span style={{ fontSize: 11, color: '#475569', background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 8 }}>{columnTasks.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {columnTasks.map(task => (
                <div
                  key={task.id}
                  style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 10, padding: '12px 14px',
                    transition: 'border-color 150ms, transform 150ms',
                    cursor: 'grab',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
                >
                  <p style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 500, margin: 0 }}>{task.title}</p>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    {groups.find(g => g.id === task.group_id) && (
                      <span style={{ fontSize: 10, color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 4 }}>
                        {groups.find(g => g.id === task.group_id)?.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {columnTasks.length === 0 && (
                <div style={{ height: 80, border: '1px dashed rgba(255,255,255,0.06)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 12, color: '#334155' }}>Drop here</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
