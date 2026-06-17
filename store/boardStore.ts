import { create } from 'zustand'
import type { Task, Group, Column, CellValue } from '@/lib/types'

interface BoardState {
  tasks: Task[]
  groups: Group[]
  columns: Column[]
  cellValues: Record<string, Record<string, CellValue>>
  loading: boolean
  pollingTimer: ReturnType<typeof setInterval> | null

  fetchBoard: (boardId: string) => Promise<void>
  startPolling: (boardId: string) => void
  stopPolling: () => void

  addTask: (groupId: string, boardId: string, title: string) => Promise<Task>
  updateTaskTitle: (taskId: string, title: string) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  moveTask: (taskId: string, newGroupId: string, newPosition: number) => Promise<void>

  addGroup: (boardId: string, name: string, color: string) => Promise<void>
  updateGroup: (groupId: string, data: Partial<Group>) => Promise<void>

  addColumn: (boardId: string, col: Partial<Column>) => Promise<void>
  updateColumn: (columnId: string, data: Partial<Column>) => Promise<void>
  deleteColumn: (columnId: string) => Promise<void>

  setCellValue: (taskId: string, columnId: string, value: unknown) => Promise<void>
}

export const useBoardStore = create<BoardState>((set, get) => ({
  tasks: [],
  groups: [],
  columns: [],
  cellValues: {},
  loading: false,
  pollingTimer: null,

  fetchBoard: async (boardId) => {
    set({ loading: true })
    const res = await fetch(`/api/boards/${boardId}/data`)
    if (!res.ok) { set({ loading: false }); return }
    const data = await res.json()

    // Drizzle returns camelCase; UI types expect snake_case — remap here
    const tasks: Task[] = (data.tasks ?? []).map((t: Record<string, unknown>) => ({
      id: t.id, group_id: t.groupId ?? t.group_id, board_id: t.boardId ?? t.board_id,
      title: t.title, position: t.position, created_by: t.createdBy ?? t.created_by ?? '',
      created_at: t.createdAt ?? t.created_at ?? '',
    }))
    const groups: Group[] = (data.groups ?? []).map((g: Record<string, unknown>) => ({
      id: g.id, board_id: g.boardId ?? g.board_id, name: g.name, color: g.color, position: g.position,
    }))
    const columns: Column[] = (data.columns ?? []).map((c: Record<string, unknown>) => ({
      id: c.id, board_id: c.boardId ?? c.board_id, name: c.name, type: c.type,
      config: c.config, position: c.position,
    }))

    const cellMap: Record<string, Record<string, CellValue>> = {}
    for (const cell of (data.cells ?? []) as Record<string, unknown>[]) {
      const tid = (cell.taskId ?? cell.task_id) as string
      const cid = (cell.columnId ?? cell.column_id) as string
      if (!cellMap[tid]) cellMap[tid] = {}
      cellMap[tid][cid] = { id: cell.id as string, task_id: tid, column_id: cid, value: cell.value, updated_at: cell.updatedAt as string }
    }
    set({ groups, tasks, columns, cellValues: cellMap, loading: false })
  },

  startPolling: (boardId) => {
    const { pollingTimer, fetchBoard } = get()
    if (pollingTimer) return
    const timer = setInterval(() => fetchBoard(boardId), 8000)
    set({ pollingTimer: timer })
  },

  stopPolling: () => {
    const { pollingTimer } = get()
    if (pollingTimer) clearInterval(pollingTimer)
    set({ pollingTimer: null })
  },

  addTask: async (groupId, boardId, title) => {
    const { tasks } = get()
    const maxPos = tasks.filter(t => t.group_id === groupId).reduce((m, t) => Math.max(m, t.position), -1)
    const res = await fetch(`/api/boards/${boardId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupId, title, position: maxPos + 1 }),
    })
    if (!res.ok) throw new Error(await res.text())
    const task: Task = await res.json()
    set(s => ({ tasks: [...s.tasks, task] }))
    return task
  },

  updateTaskTitle: async (taskId, title) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    set(s => ({ tasks: s.tasks.map(t => t.id === taskId ? { ...t, title } : t) }))
  },

  deleteTask: async (taskId) => {
    await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
    set(s => ({ tasks: s.tasks.filter(t => t.id !== taskId) }))
  },

  moveTask: async (taskId, newGroupId, newPosition) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupId: newGroupId, position: newPosition }),
    })
    set(s => ({ tasks: s.tasks.map(t => t.id === taskId ? { ...t, group_id: newGroupId, position: newPosition } : t) }))
  },

  addGroup: async (boardId, name, color) => {
    const { groups } = get()
    const maxPos = groups.reduce((m, g) => Math.max(m, g.position), -1)
    const res = await fetch(`/api/boards/${boardId}/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color, position: maxPos + 1 }),
    })
    if (!res.ok) throw new Error(await res.text())
    const group: Group = await res.json()
    set(s => ({ groups: [...s.groups, group] }))
  },

  updateGroup: async (groupId, data) => {
    // optimistic — no dedicated PATCH route needed for now
    set(s => ({ groups: s.groups.map(g => g.id === groupId ? { ...g, ...data } : g) }))
  },

  addColumn: async (boardId, col) => {
    const { columns } = get()
    const maxPos = columns.reduce((m, c) => Math.max(m, c.position), -1)
    const res = await fetch(`/api/boards/${boardId}/columns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...col, position: maxPos + 1 }),
    })
    if (!res.ok) throw new Error(await res.text())
    const column: Column = await res.json()
    set(s => ({ columns: [...s.columns, column] }))
  },

  updateColumn: async (columnId, data) => {
    set(s => ({ columns: s.columns.map(c => c.id === columnId ? { ...c, ...data } : c) }))
  },

  deleteColumn: async (columnId) => {
    set(s => ({ columns: s.columns.filter(c => c.id !== columnId) }))
  },

  setCellValue: async (taskId, columnId, value) => {
    await fetch(`/api/tasks/${taskId}/cell`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ columnId, value }),
    })
    set(s => ({
      cellValues: {
        ...s.cellValues,
        [taskId]: {
          ...s.cellValues[taskId],
          [columnId]: { task_id: taskId, column_id: columnId, value } as CellValue,
        },
      },
    }))
  },
}))
