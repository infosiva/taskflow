import type { ParsedTask } from './jira'

type TrelloCard = {
  name?: string
  desc?: string
  closed?: boolean
  due?: string | null
  idMembers?: string[]
  idList?: string
  labels?: { name: string; color: string }[]
}

type TrelloList = { id: string; name: string; closed: boolean }
type TrelloMember = { id: string; fullName?: string; username: string }

type TrelloExport = {
  cards?: TrelloCard[]
  lists?: TrelloList[]
  members?: TrelloMember[]
}

export function parseTrelloJson(raw: string): ParsedTask[] {
  let data: TrelloExport
  try { data = JSON.parse(raw) } catch { return [] }
  const lists = new Map<string, string>()
  for (const l of data.lists ?? []) {
    if (!l.closed) lists.set(l.id, l.name)
  }
  const members = new Map<string, string>()
  for (const m of data.members ?? []) {
    members.set(m.id, m.fullName || m.username)
  }
  const tasks: ParsedTask[] = []
  for (const card of data.cards ?? []) {
    if (card.closed) continue
    const title = card.name?.trim()
    if (!title) continue
    const listName = lists.get(card.idList ?? '') ?? ''
    const status = normaliseListToStatus(listName)
    const priority = extractPriorityFromLabels(card.labels ?? [])
    const assignee = card.idMembers?.map(id => members.get(id)).filter(Boolean).join(', ') || undefined
    tasks.push({
      title,
      status,
      priority,
      assignee,
      dueDate: card.due ? card.due.split('T')[0] : undefined,
      description: card.desc?.slice(0, 500) || undefined,
    })
  }
  return tasks
}

function normaliseListToStatus(listName: string): string {
  const l = listName.toLowerCase()
  if (l.includes('done') || l.includes('complete') || l.includes('shipped') || l.includes('closed')) return 'Done'
  if (l.includes('doing') || l.includes('progress') || l.includes('active') || l.includes('review')) return 'In Progress'
  return 'Todo'
}

function extractPriorityFromLabels(labels: { name: string; color: string }[]): string {
  for (const label of labels) {
    const n = label.name.toLowerCase()
    if (n.includes('high') || n.includes('critical') || n.includes('urgent')) return 'High'
    if (n.includes('medium') || n.includes('normal')) return 'Medium'
    if (n.includes('low')) return 'Low'
    if (label.color === 'red') return 'High'
    if (label.color === 'yellow' || label.color === 'orange') return 'Medium'
    if (label.color === 'blue' || label.color === 'green') return 'Low'
  }
  return 'Medium'
}
