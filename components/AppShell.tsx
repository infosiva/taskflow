'use client'
import { useEffect, useState } from 'react'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_STYLE = {
  width: 220,
  minHeight: '100dvh',
  background: 'rgba(255,255,255,0.02)',
  borderRight: '1px solid rgba(255,255,255,0.06)',
  display: 'flex' as const,
  flexDirection: 'column' as const,
  padding: '16px 12px',
  flexShrink: 0,
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { workspaces, boards, fetchWorkspaces, fetchBoards, activeWorkspace, setActiveWorkspace, createWorkspace } = useWorkspaceStore()
  const { data: session } = useSession()
  const userId = session?.user?.id ?? null

  useEffect(() => {
    if (userId) fetchWorkspaces()
  }, [userId, fetchWorkspaces])

  useEffect(() => {
    if (activeWorkspace?.id) fetchBoards(activeWorkspace.id)
  }, [activeWorkspace?.id, fetchBoards])

  const wsBoards = boards.filter(b => b.workspace_id === activeWorkspace?.id)

  async function handleNewBoard() {
    if (!activeWorkspace?.id) return
    const name = prompt('Board name?')
    if (!name) return
    await useWorkspaceStore.getState().createBoard(activeWorkspace.id, { name })
    fetchBoards(activeWorkspace.id)
  }

  async function handleSignOut() {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: '#0a0a0f' }}>
      {/* Sidebar */}
      <nav style={NAV_STYLE}>
        {/* Brand */}
        <div style={{ marginBottom: 20 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#6366f1', letterSpacing: '-0.5px' }}>
            TaskFlow
          </span>
        </div>

        {/* Workspace picker */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Workspace</p>
          <select
            value={activeWorkspace?.id || ''}
            onChange={e => {
              const ws = workspaces.find(w => w.id === e.target.value)
              if (ws) setActiveWorkspace(ws)
            }}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6, padding: '6px 8px', color: '#f1f5f9', fontSize: 13, cursor: 'pointer'
            }}
          >
            {workspaces.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
          <button
            onClick={() => { const n = prompt('Workspace name?'); if (n) createWorkspace(n).then(() => fetchWorkspaces()) }}
            style={{ marginTop: 6, fontSize: 11, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            + New workspace
          </button>
        </div>

        {/* Boards */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <p style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Boards</p>
            <button onClick={handleNewBoard} style={{ fontSize: 16, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>+</button>
          </div>
          {wsBoards.map(board => {
            const href = `/${activeWorkspace?.slug}/board/${board.id}`
            const active = pathname.startsWith(href)
            return (
              <Link key={board.id} href={href} style={{
                display: 'block', padding: '7px 10px', borderRadius: 6, fontSize: 13,
                color: active ? '#f1f5f9' : '#94a3b8',
                background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                textDecoration: 'none', marginBottom: 2,
                transition: 'background 150ms',
              }}>
                {board.icon || '📋'} {board.name}
              </Link>
            )
          })}
          {wsBoards.length === 0 && (
            <p style={{ fontSize: 12, color: '#475569', padding: '8px 10px' }}>No boards yet</p>
          )}
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
          <p style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{userId?.slice(0, 8)}…</p>
          <button onClick={handleSignOut} style={{ fontSize: 12, color: '#475569', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
            Sign out
          </button>
        </div>
      </nav>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
