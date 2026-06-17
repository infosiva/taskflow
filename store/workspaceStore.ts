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
    const raw = res.ok ? await res.json() : []
    // Drizzle returns camelCase; Workspace type uses snake_case — remap
    const data: Workspace[] = raw.map((w: Record<string, unknown>) => ({
      id: w.id, name: w.name, slug: w.slug, plan: w.plan,
      owner_id: w.ownerId ?? w.owner_id,
      stripe_customer_id: w.stripeCustomerId ?? w.stripe_customer_id ?? null,
      stripe_subscription_id: w.stripeSubscriptionId ?? w.stripe_subscription_id ?? null,
      created_at: w.createdAt ?? w.created_at ?? '',
    }))
    set({ workspaces: data, activeWorkspace: data[0] ?? null, loading: false })
  },

  fetchBoards: async (workspaceId) => {
    const res = await fetch(`/api/workspaces/${workspaceId}/boards`)
    const raw = res.ok ? await res.json() : []
    // Drizzle returns camelCase; Board type uses snake_case — remap
    const data: Board[] = raw.map((b: Record<string, unknown>) => ({
      id: b.id, workspace_id: b.workspaceId ?? b.workspace_id,
      name: b.name, icon: b.icon, color: b.color,
      description: b.description, created_at: b.createdAt ?? b.created_at,
    }))
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
