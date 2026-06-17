import { neon } from '@neondatabase/serverless'

const BOARD_NAME = 'Portfolio Redesign Planning'

const PRIORITY_COLOR: Record<string, string> = {
  P0: '#ef4444',
  P1: '#f97316',
  P2: '#f59e0b',
}

const COL_ORDER = [
  'Priority', 'Category', 'BG Hex', 'Accent Hex', 'Layout',
  'Hero Headline', 'Demo Panel', 'Top 3 Changes',
  'Proposal', 'Skills', 'Files to Touch', 'Success Criteria',
]

async function getData() {
  const sql = neon(process.env.DATABASE_URL!)

  const tasks = await sql`
    SELECT
      t.id, t.title,
      g.name  AS grp,
      g.color AS grp_color
    FROM tasks t
    JOIN groups  g ON t.group_id = g.id
    JOIN boards  b ON t.board_id  = b.id
    WHERE b.name = ${BOARD_NAME}
    ORDER BY g.position, t.position
  `

  const cells = await sql`
    SELECT cv.task_id, c.name AS col, cv.value
    FROM cell_values cv
    JOIN columns c ON c.id = cv.column_id
    JOIN tasks   t ON t.id  = cv.task_id
    JOIN boards  b ON b.id  = t.board_id
    WHERE b.name = ${BOARD_NAME}
  `

  const cellMap: Record<string, Record<string, string>> = {}
  for (const c of cells) {
    if (!cellMap[c.task_id]) cellMap[c.task_id] = {}
    const raw = typeof c.value === 'string' ? c.value : JSON.stringify(c.value)
    cellMap[c.task_id][c.col] = raw.replace(/^"|"$/g, '')
  }

  return tasks.map((t: any) => ({ ...t, cells: cellMap[t.id] ?? {} }))
}

export default async function AdminRedesignPage() {
  const tasks = await getData()

  const groups: Record<string, typeof tasks> = {}
  for (const t of tasks) {
    if (!groups[t.grp]) groups[t.grp] = []
    groups[t.grp].push(t)
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#0f0f0f', minHeight: '100vh', color: '#e5e7eb', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>
            TaskFlow Admin · No login required · localhost only
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: '#f9fafb' }}>
            🎨 Portfolio Redesign Planning
          </h1>
          <div style={{ marginTop: 8, color: '#9ca3af', fontSize: 14 }}>
            {tasks.length} cards · {Object.keys(groups).length} groups
          </div>
        </div>

        {/* Group legend */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
          {Object.keys(groups).map(g => (
            <div key={g} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: groups[g][0].grp_color, display: 'inline-block' }} />
              {g} ({groups[g].length})
            </div>
          ))}
        </div>

        {/* Cards per group */}
        {Object.entries(groups).map(([grp, cards]) => (
          <section key={grp} style={{ marginBottom: 48 }}>
            <div style={{
              fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase',
              color: cards[0].grp_color, borderBottom: `1px solid ${cards[0].grp_color}33`,
              paddingBottom: 8, marginBottom: 20
            }}>
              {grp} — {cards.length} projects
            </div>

            <div style={{ display: 'grid', gap: 20 }}>
              {cards.map(card => {
                const priority = card.cells['Priority'] ?? ''
                const project  = card.cells['Project']  ?? card.title
                const url      = card.cells['URL']      ?? ''
                const bg       = card.cells['BG Hex']   ?? ''
                const accent   = card.cells['Accent Hex'] ?? ''
                const headline = card.cells['Hero Headline'] ?? ''

                return (
                  <details key={card.id} style={{
                    background: '#1a1a1a', border: '1px solid #2a2a2a',
                    borderRadius: 10, overflow: 'hidden',
                  }}>
                    {/* Summary row — always visible */}
                    <summary style={{
                      padding: '14px 18px', cursor: 'pointer', listStyle: 'none',
                      display: 'flex', alignItems: 'center', gap: 12,
                      userSelect: 'none',
                    }}>
                      {/* Priority badge */}
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '2px 8px',
                        borderRadius: 4, background: PRIORITY_COLOR[priority] ?? '#4b5563',
                        color: '#fff', flexShrink: 0,
                      }}>{priority || '—'}</span>

                      {/* Color swatches */}
                      {bg && (
                        <span title={`BG: ${bg}`} style={{
                          width: 14, height: 14, borderRadius: 3,
                          background: bg, border: '1px solid #333', flexShrink: 0,
                        }} />
                      )}
                      {accent && (
                        <span title={`Accent: ${accent}`} style={{
                          width: 14, height: 14, borderRadius: 3,
                          background: accent, border: '1px solid #333', flexShrink: 0,
                        }} />
                      )}

                      {/* Project name */}
                      <span style={{ fontWeight: 600, fontSize: 15, color: '#f9fafb', flex: 1 }}>
                        {project}
                      </span>

                      {/* Headline */}
                      <span style={{ color: '#9ca3af', fontSize: 13, flex: 2, fontStyle: 'italic' }}>
                        {headline}
                      </span>

                      {/* URL */}
                      {url && (
                        <a href={url} target="_blank" rel="noopener"
                          style={{ color: '#6366f1', fontSize: 12, textDecoration: 'none', flexShrink: 0 }}>
                          ↗ live
                        </a>
                      )}

                      <span style={{ color: '#4b5563', fontSize: 12, flexShrink: 0 }}>▼</span>
                    </summary>

                    {/* Detail panel */}
                    <div style={{ padding: '0 18px 20px', borderTop: '1px solid #2a2a2a' }}>

                      {/* Quick meta row */}
                      <div style={{ display: 'flex', gap: 24, padding: '12px 0', flexWrap: 'wrap' }}>
                        {[
                          ['Category',  card.cells['Category']],
                          ['Layout',    card.cells['Layout']],
                          ['BG',        bg],
                          ['Accent',    accent],
                        ].filter(([,v]) => v).map(([label, value]) => (
                          <div key={label as string} style={{ fontSize: 12 }}>
                            <span style={{ color: '#6b7280', marginRight: 4 }}>{label}:</span>
                            <span style={{ color: '#d1d5db', fontWeight: 500 }}>{value as string}</span>
                          </div>
                        ))}
                      </div>

                      {/* Rich text fields */}
                      {COL_ORDER.filter(name => !['Priority','Category','BG Hex','Accent Hex','Layout','Hero Headline'].includes(name))
                        .map(colName => {
                          const val = card.cells[colName]
                          if (!val) return null
                          return (
                            <div key={colName} style={{ marginTop: 16 }}>
                              <div style={{
                                fontSize: 11, fontWeight: 600, letterSpacing: 1,
                                textTransform: 'uppercase', color: '#6b7280', marginBottom: 6,
                              }}>{colName}</div>
                              <pre style={{
                                margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                                fontSize: 13, lineHeight: 1.7, color: '#d1d5db',
                                background: '#111', padding: '10px 14px', borderRadius: 6,
                                border: '1px solid #222',
                              }}>{val}</pre>
                            </div>
                          )
                        })}
                    </div>
                  </details>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
