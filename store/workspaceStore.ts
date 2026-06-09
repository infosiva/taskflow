import { create } from 'zustand'
import type { Workspace, Board, Member } from '@/lib/types'

interface WorkspaceState {
  workspaces: Workspace[]
  activeWorkspace: Workspace | null
  boards: Board[]
  members: Member[]
  loading: boolean
  setActiveWorkspace: (w: Workspace) => void
  fetchWorkspaces: () => Promise<void>
  fetchBoards: (workspaceId: string) => Promise<void>
  fetchMembers: (workspaceId: string) => Promise<void>
  createWorkspace: (name: string) => Promise<Workspace>
  createBoard: (workspaceId: string, data: Partial<Board>) => Promise<Board>
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  activeWorkspace: null,
  boards: [],
  members: [],
  loading: false,

  setActiveWorkspace: (w) => set({ activeWorkspace: w }),

  fetchWorkspaces: async () => {
    set({ loading: true })
    const res = await fetch('/api/workspaces')
    const data = res.ok ? await res.json() : []
    set({ workspaces: data, loading: false })
  },

  fetchBoards: async (workspaceId) => {
    const res = await fetch(`/api/workspaces/${workspaceId}/boards`)
    const data = res.ok ? await res.json() : []
    set({ boards: data })
  },

  fetchMembers: async (workspaceId) => {
    const res = await fetch(`/api/workspaces/${workspaceId}/members`)
    const data = res.ok ? await res.json() : []
    set({ members: data as Member[] })
  },

  createWorkspace: async (name) => {
    const res = await fetch('/api/workspaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (!res.ok) throw new Error(await res.text())
    const ws: Workspace = await res.json()
    set(s => ({ workspaces: [...s.workspaces, ws] }))
    return ws
  },

  createBoard: async (workspaceId, boardData) => {
    const res = await fetch(`/api/workspaces/${workspaceId}/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(boardData),
    })
    if (!res.ok) throw new Error(await res.text())
    const board: Board = await res.json()
    set(s => ({ boards: [...s.boards, board] }))
    return board
  },
}))
