import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { boards, groups, tasks, columns, cellValues } from '@/db/schema'
import { parseJiraXml, parseJiraCsv } from '@/lib/parsers/jira'
import { parseTrelloJson } from '@/lib/parsers/trello'
import { fetchGithubIssues } from '@/lib/parsers/github'
import type { ParsedTask } from '@/lib/parsers/jira'
import { auth } from '@/auth'

export const runtime = 'nodejs'

// POST /api/migrate
// body: FormData with `source`, optional `file` (File), optional `ghRepo`, optional `ghToken`, optional `action`
// action=parse → return ParsedTask[] preview (no DB writes)
// action=import → create board + insert tasks into user's workspace
export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const source = formData.get('source') as string
  const action = (formData.get('action') as string) || 'parse'
  const file = formData.get('file') as File | null
  const ghRepo = formData.get('ghRepo') as string | null
  const ghToken = formData.get('ghToken') as string | null
  const workspaceId = formData.get('workspaceId') as string | null

  let parsed: ParsedTask[] = []

  try {
    if (source === 'github') {
      if (!ghRepo) return NextResponse.json({ error: 'ghRepo required' }, { status: 400 })
      parsed = await fetchGithubIssues(ghRepo, ghToken ?? undefined)
    } else if (file) {
      const text = await file.text()
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (source === 'jira') {
        parsed = ext === 'csv' ? parseJiraCsv(text) : parseJiraXml(text)
      } else if (source === 'trello') {
        parsed = parseTrelloJson(text)
      } else if (source === 'linear') {
        parsed = ext === 'json' ? parseTrelloJson(text) : parseJiraCsv(text)
      } else if (source === 'asana' || source === 'notion') {
        parsed = parseJiraCsv(text)
      } else {
        return NextResponse.json({ error: 'unsupported source' }, { status: 400 })
      }
    } else {
      return NextResponse.json({ error: 'file or ghRepo required' }, { status: 400 })
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'parse error'
    return NextResponse.json({ error: msg }, { status: 422 })
  }

  if (action === 'parse') {
    return NextResponse.json({ tasks: parsed, count: parsed.length })
  }

  // action === 'import' — requires auth + workspaceId
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'sign in required to import' }, { status: 401 })
  }
  if (!workspaceId) {
    return NextResponse.json({ error: 'workspaceId required' }, { status: 400 })
  }

  const userId = session.user.id
  const boardName = `${source.charAt(0).toUpperCase() + source.slice(1)} Import`

  // Create board
  const [board] = await db.insert(boards).values({
    workspaceId,
    name: boardName,
    icon: '📦',
    color: '#14b8a6',
  }).returning()

  // Create default columns
  const cols = await db.insert(columns).values([
    { boardId: board.id, name: 'Status', type: 'status', position: 0 },
    { boardId: board.id, name: 'Priority', type: 'priority', position: 1 },
    { boardId: board.id, name: 'Assignee', type: 'person', position: 2 },
    { boardId: board.id, name: 'Due Date', type: 'due_date', position: 3 },
  ]).returning()

  const statusCol = cols[0]
  const priorityCol = cols[1]
  const assigneeCol = cols[2]
  const dueDateCol = cols[3]

  // Create status groups
  const statusNames = ['Todo', 'In Progress', 'Done']
  const groupColors: Record<string, string> = {
    'Todo': '#6366f1',
    'In Progress': '#14b8a6',
    'Done': '#34d399',
  }
  const createdGroups = await db.insert(groups).values(
    statusNames.map((name, i) => ({
      boardId: board.id,
      name,
      color: groupColors[name],
      position: i,
    }))
  ).returning()

  const groupMap: Record<string, string> = {}
  for (const g of createdGroups) groupMap[g.name] = g.id

  // Insert tasks + cell values
  for (let i = 0; i < parsed.length; i++) {
    const t = parsed[i]
    const groupId = groupMap[t.status] ?? groupMap['Todo']

    const [task] = await db.insert(tasks).values({
      groupId,
      boardId: board.id,
      title: t.title,
      position: i,
      createdBy: userId,
    }).returning()

    const cellRows: { taskId: string; columnId: string; value: unknown }[] = [
      { taskId: task.id, columnId: statusCol.id, value: t.status },
      { taskId: task.id, columnId: priorityCol.id, value: t.priority },
    ]
    if (t.assignee) cellRows.push({ taskId: task.id, columnId: assigneeCol.id, value: t.assignee })
    if (t.dueDate) cellRows.push({ taskId: task.id, columnId: dueDateCol.id, value: t.dueDate })

    await db.insert(cellValues).values(cellRows)
  }

  return NextResponse.json({
    boardId: board.id,
    boardName: board.name,
    imported: parsed.length,
  })
}
