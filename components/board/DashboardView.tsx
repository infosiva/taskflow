'use client'
import { useBoardStore } from '@/store/boardStore'

const STATUS_COLORS: Record<string, string> = {
  'To do': '#64748b',
  'In progress': '#f59e0b',
  'Done': '#10b981',
  'Blocked': '#ef4444',
}

const PRIORITY_COLORS: Record<string, string> = {
  'Critical': '#ef4444',
  'High': '#f97316',
  'Medium': '#f59e0b',
  'Low': '#10b981',
}

interface Props { boardId: string }

export default function DashboardView({ boardId: _ }: Props) {
  const { tasks, groups, columns, cellValues } = useBoardStore()

  const statusCol = columns.find(c => c.type === 'status')
  const priorityCol = columns.find(c => c.type === 'priority')
  const dueDateCol = columns.find(c => c.type === 'due_date')

  function getStatus(taskId: string): string {
    if (!statusCol) return 'No status'
    const cell = cellValues[taskId]?.[statusCol.id]
    return (cell?.value as { label?: string })?.label || 'To do'
  }

  function getPriority(taskId: string): string {
    if (!priorityCol) return 'None'
    const cell = cellValues[taskId]?.[priorityCol.id]
    return (cell?.value as { label?: string })?.label || 'None'
  }

  function getDueDate(taskId: string): Date | null {
    if (!dueDateCol) return null
    const cell = cellValues[taskId]?.[dueDateCol.id]
    if (!cell?.value) return null
    const d = new Date(cell.value as string)
    return isNaN(d.getTime()) ? null : d
  }

  // Status breakdown
  const statusCounts: Record<string, number> = {}
  for (const task of tasks) {
    const s = getStatus(task.id)
    statusCounts[s] = (statusCounts[s] || 0) + 1
  }

  // Priority breakdown
  const priorityCounts: Record<string, number> = {}
  for (const task of tasks) {
    const p = getPriority(task.id)
    if (p !== 'None') priorityCounts[p] = (priorityCounts[p] || 0) + 1
  }

  // Group breakdown
  const groupCounts = groups.map(g => ({
    name: g.name,
    color: g.color,
    total: tasks.filter(t => t.group_id === g.id).length,
    done: tasks.filter(t => t.group_id === g.id && getStatus(t.id) === 'Done').length,
  }))

  // Overdue
  const now = new Date()
  const overdue = tasks.filter(t => {
    const d = getDueDate(t.id)
    return d && d < now && getStatus(t.id) !== 'Done'
  })

  // Due soon (next 7 days)
  const soon = tasks.filter(t => {
    const d = getDueDate(t.id)
    if (!d) return false
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 7 && getStatus(t.id) !== 'Done'
  })

  const completionRate = tasks.length > 0
    ? Math.round((statusCounts['Done'] || 0) / tasks.length * 100)
    : 0

  const CARD = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: '20px 24px',
  } as const

  return (
    <div style={{ padding: 24, overflowY: 'auto', height: '100%' }}>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Tasks', value: tasks.length, color: '#6366f1' },
          { label: 'Completed', value: statusCounts['Done'] || 0, color: '#10b981' },
          { label: 'Overdue', value: overdue.length, color: '#ef4444' },
          { label: 'Due Soon', value: soon.length, color: '#f59e0b' },
        ].map(kpi => (
          <div key={kpi.label} style={{ ...CARD, textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Status breakdown */}
        <div style={CARD}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>By Status</h3>
          {Object.entries(statusCounts).length === 0 && (
            <p style={{ color: '#475569', fontSize: 13 }}>No tasks yet</p>
          )}
          {Object.entries(statusCounts).map(([status, count]) => {
            const pct = tasks.length > 0 ? Math.round(count / tasks.length * 100) : 0
            const color = STATUS_COLORS[status] || '#6366f1'
            return (
              <div key={status} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
                    {status}
                  </span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{count} ({pct}%)</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 400ms ease' }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Completion rate + Priority */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Completion */}
          <div style={{ ...CARD, textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 12px' }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="#10b981" strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionRate / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  style={{ transition: 'stroke-dashoffset 600ms ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#10b981' }}>
                {completionRate}%
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Completion Rate</div>
          </div>

          {/* Priority */}
          {Object.entries(priorityCounts).length > 0 && (
            <div style={CARD}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>By Priority</h3>
              {Object.entries(priorityCounts).map(([priority, count]) => (
                <div key={priority} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                  <span style={{ fontSize: 13, color: PRIORITY_COLORS[priority] || '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: PRIORITY_COLORS[priority] || '#94a3b8', display: 'inline-block' }} />
                    {priority}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Group breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={CARD}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Groups</h3>
          {groupCounts.length === 0 && <p style={{ color: '#475569', fontSize: 13 }}>No groups yet</p>}
          {groupCounts.map(g => {
            const pct = g.total > 0 ? Math.round(g.done / g.total * 100) : 0
            return (
              <div key={g.name} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: g.color, display: 'inline-block' }} />
                    {g.name}
                  </span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{g.done}/{g.total}</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: g.color, borderRadius: 3, transition: 'width 400ms ease' }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Overdue list */}
        <div style={CARD}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Overdue {overdue.length > 0 && <span style={{ color: '#ef4444', marginLeft: 4 }}>{overdue.length}</span>}
          </h3>
          {overdue.length === 0 && <p style={{ color: '#475569', fontSize: 13 }}>No overdue tasks 🎉</p>}
          {overdue.slice(0, 6).map(task => {
            const d = getDueDate(task.id)!
            const daysAgo = Math.ceil((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
            return (
              <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 13, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{task.title}</span>
                <span style={{ fontSize: 11, color: '#ef4444', whiteSpace: 'nowrap' }}>{daysAgo}d overdue</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
