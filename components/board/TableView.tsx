'use client'
import { useBoardStore } from '@/store/boardStore'
import CellRenderer from '@/components/task/cells/CellRenderer'

const CELL = { padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, verticalAlign: 'middle' as const, minWidth: 120 }
const HEADER = { padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.06em', userSelect: 'none' as const }

interface Props {
  boardId: string
  onAddTask: (groupId: string) => void
  onAddGroup: () => void
}

export default function TableView({ boardId, onAddTask, onAddGroup }: Props) {
  const { groups, tasks, columns, cellValues, setCellValue, updateTaskTitle } = useBoardStore()

  return (
    <div style={{ padding: '0 0 40px' }}>
      {groups.map(group => {
        const groupTasks = tasks.filter(t => t.group_id === group.id)
        return (
          <div key={group.id} style={{ marginBottom: 32 }}>
            {/* Group header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px',
              borderLeft: `3px solid ${group.color || '#6366f1'}`,
              background: 'rgba(255,255,255,0.02)',
            }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>{group.name}</span>
              <span style={{ fontSize: 11, color: '#475569', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 10 }}>{groupTasks.length}</span>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                <thead>
                  <tr>
                    <th style={{ ...HEADER, width: 40, paddingLeft: 24 }}>#</th>
                    <th style={{ ...HEADER, minWidth: 240 }}>Task</th>
                    {columns.map(col => (
                      <th key={col.id} style={HEADER}>{col.name}</th>
                    ))}
                    <th style={HEADER} />
                  </tr>
                </thead>
                <tbody>
                  {groupTasks.map((task, idx) => (
                    <tr
                      key={task.id}
                      style={{ transition: 'background 100ms' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ ...CELL, paddingLeft: 24, color: '#475569', width: 40 }}>{idx + 1}</td>
                      <td style={{ ...CELL, minWidth: 240 }}>
                        <TaskTitleCell
                          title={task.title}
                          onSave={title => updateTaskTitle(task.id, title)}
                        />
                      </td>
                      {columns.map(col => (
                        <td key={col.id} style={CELL}>
                          <CellRenderer
                            column={col}
                            cellValue={cellValues[task.id]?.[col.id]}
                            taskId={task.id}
                            boardId={boardId}
                            onSave={value => setCellValue(task.id, col.id, value)}
                          />
                        </td>
                      ))}
                      <td style={CELL} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add task */}
            <button
              onClick={() => onAddTask(group.id)}
              style={{
                marginLeft: 24, marginTop: 4, fontSize: 13, color: '#6366f1', background: 'none', border: 'none',
                cursor: 'pointer', padding: '6px 0', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              + Add task
            </button>
          </div>
        )
      })}

      <button
        onClick={onAddGroup}
        style={{
          marginLeft: 24, marginTop: 8, fontSize: 13, color: '#475569', background: 'none',
          border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 6, cursor: 'pointer', padding: '8px 16px',
        }}
      >
        + Add group
      </button>
    </div>
  )
}

function TaskTitleCell({ title, onSave }: { title: string; onSave: (t: string) => void }) {
  return (
    <span
      contentEditable
      suppressContentEditableWarning
      onBlur={e => {
        const t = e.currentTarget.textContent?.trim() || ''
        if (t && t !== title) onSave(t)
      }}
      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur() } }}
      style={{ display: 'block', color: '#f1f5f9', outline: 'none', minWidth: 160, fontWeight: 500 }}
    >
      {title}
    </span>
  )
}
