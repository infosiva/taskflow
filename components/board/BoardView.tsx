'use client'
import { useEffect, useState } from 'react'
import { useBoardStore } from '@/store/boardStore'
import TableView from './TableView'
import KanbanView from './KanbanView'
import CalendarView from './CalendarView'
import DashboardView from './DashboardView'

type View = 'table' | 'kanban' | 'calendar' | 'dashboard'

interface Props {
  boardId: string
  boardName: string
  boardIcon: string | null
}

const TAB_STYLE = (active: boolean) => ({
  padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer',
  background: active ? 'rgba(99,102,241,0.2)' : 'none',
  color: active ? '#a5b4fc' : '#64748b',
  border: 'none', transition: 'all 150ms',
})

export default function BoardView({ boardId, boardName, boardIcon }: Props) {
  const [view, setView] = useState<View>('table')
  const { fetchBoard, startPolling, stopPolling, groups, tasks, columns, addTask, addGroup } = useBoardStore()

  useEffect(() => {
    fetchBoard(boardId)
    startPolling(boardId)
    return () => stopPolling()
  }, [boardId, fetchBoard, startPolling, stopPolling])

  async function handleAddTask(groupId: string) {
    const title = prompt('Task name?')
    if (!title) return
    await addTask(groupId, boardId, title)
  }

  async function handleAddGroup() {
    const name = prompt('Group name?')
    if (!name) return
    await addGroup(boardId, name, '#94a3b8')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <span style={{ fontSize: 20 }}>{boardIcon || '📋'}</span>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{boardName}</h1>
        <div style={{ marginLeft: 16, display: 'flex', gap: 4 }}>
          {(['table', 'kanban', 'calendar', 'dashboard'] as View[]).map(v => (
            <button key={v} onClick={() => setView(v)} style={TAB_STYLE(view === v)}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* View */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {view === 'table' && <TableView boardId={boardId} onAddTask={handleAddTask} onAddGroup={handleAddGroup} />}
        {view === 'kanban' && <KanbanView boardId={boardId} />}
        {view === 'calendar' && <CalendarView boardId={boardId} />}
        {view === 'dashboard' && <DashboardView boardId={boardId} />}
      </div>
    </div>
  )
}
