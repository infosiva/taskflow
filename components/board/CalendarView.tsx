'use client'
import { useBoardStore } from '@/store/boardStore'
import { useState } from 'react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const STATUS_COLORS: Record<string, string> = {
  'To do': '#64748b',
  'In progress': '#f59e0b',
  'Done': '#10b981',
  'Blocked': '#ef4444',
}

interface Props { boardId: string }

export default function CalendarView({ boardId: _ }: Props) {
  const { tasks, columns, cellValues, groups } = useBoardStore()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const dueDateCol = columns.find(c => c.type === 'due_date')
  const statusCol = columns.find(c => c.type === 'status')

  function getTaskDate(taskId: string): Date | null {
    if (!dueDateCol) return null
    const cell = cellValues[taskId]?.[dueDateCol.id]
    if (!cell?.value) return null
    const d = new Date(cell.value as string)
    return isNaN(d.getTime()) ? null : d
  }

  function getStatus(taskId: string): string {
    if (!statusCol) return 'To do'
    const cell = cellValues[taskId]?.[statusCol.id]
    return (cell?.value as { label?: string })?.label || 'To do'
  }

  function getGroupName(taskId: string): string {
    const task = tasks.find(t => t.id === taskId)
    return groups.find(g => g.id === task?.group_id)?.name || ''
  }

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const tasksByDay: Record<number, typeof tasks> = {}
  for (const task of tasks) {
    const d = getTaskDate(task.id)
    if (d && d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!tasksByDay[day]) tasksByDay[day] = []
      tasksByDay[day].push(task)
    }
  }

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  return (
    <div style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <button
          onClick={prevMonth}
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 12px', color: '#94a3b8', cursor: 'pointer', fontSize: 16 }}
        >‹</button>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: 0, minWidth: 200, textAlign: 'center' }}>
          {MONTHS[month]} {year}
        </h2>
        <button
          onClick={nextMonth}
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 12px', color: '#94a3b8', cursor: 'pointer', fontSize: 16 }}
        >›</button>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: '#64748b' }}>
          {Object.values(tasksByDay).flat().length} task{Object.values(tasksByDay).flat().length !== 1 ? 's' : ''} this month
        </div>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, marginBottom: 1 }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#475569', padding: '6px 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
        {cells.map((day, i) => {
          const dayTasks = day ? (tasksByDay[day] || []) : []
          return (
            <div
              key={i}
              style={{
                background: day ? 'rgba(255,255,255,0.02)' : 'transparent',
                borderRight: i % 7 !== 6 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                borderBottom: i < cells.length - 7 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                padding: '8px',
                minHeight: 90,
              }}
            >
              {day && (
                <>
                  <div style={{
                    fontSize: 13, fontWeight: isToday(day) ? 700 : 400,
                    color: isToday(day) ? '#fff' : '#94a3b8',
                    background: isToday(day) ? '#6366f1' : 'transparent',
                    width: 24, height: 24, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 4,
                  }}>{day}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {dayTasks.slice(0, 3).map(task => {
                      const status = getStatus(task.id)
                      const color = STATUS_COLORS[status] || '#6366f1'
                      return (
                        <div
                          key={task.id}
                          title={`${task.title} · ${getGroupName(task.id)} · ${status}`}
                          style={{
                            fontSize: 11, color: '#e2e8f0', borderRadius: 4,
                            padding: '2px 6px', overflow: 'hidden', whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis', background: `${color}22`,
                            borderLeft: `2px solid ${color}`,
                            cursor: 'default',
                          }}
                        >{task.title}</div>
                      )
                    })}
                    {dayTasks.length > 3 && (
                      <div style={{ fontSize: 10, color: '#475569', paddingLeft: 6 }}>+{dayTasks.length - 3} more</div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      {!dueDateCol && (
        <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, color: '#a5b4fc', fontSize: 13 }}>
          Add a <strong>Due Date</strong> column to your board to see tasks on the calendar.
        </div>
      )}
    </div>
  )
}
