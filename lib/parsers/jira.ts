export type ParsedTask = {
  title: string
  status: string
  priority: string
  assignee?: string
  dueDate?: string
  description?: string
}

export function parseJiraXml(xml: string): ParsedTask[] {
  const tasks: ParsedTask[] = []
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
  for (const [, body] of items) {
    const title = extractTag(body, 'summary') || extractTag(body, 'title') || ''
    if (!title) continue
    tasks.push({
      title,
      status: normaliseStatus(extractTag(body, 'status') ?? ''),
      priority: normalisePriority(extractTag(body, 'priority') ?? ''),
      assignee: extractTag(body, 'assignee') ?? undefined,
      dueDate: extractTag(body, 'due') ?? undefined,
      description: stripHtml(extractTag(body, 'description') ?? '').slice(0, 500) || undefined,
    })
  }
  return tasks
}

export function parseJiraCsv(csv: string): ParsedTask[] {
  const lines = csv.trim().split('\n')
  if (lines.length < 2) return []
  const headers = parseCSVRow(lines[0]).map(h => h.toLowerCase().trim())
  const idx = (names: string[]) => names.map(n => headers.indexOf(n)).find(i => i >= 0) ?? -1
  const summaryIdx = idx(['summary', 'title', 'issue title', 'name'])
  const statusIdx = idx(['status', 'issue status'])
  const priorityIdx = idx(['priority'])
  const assigneeIdx = idx(['assignee', 'assigned to'])
  const dueDateIdx = idx(['due date', 'duedate', 'due'])
  if (summaryIdx < 0) return []
  return lines.slice(1).map(line => {
    const cols = parseCSVRow(line)
    return {
      title: cols[summaryIdx] ?? '',
      status: normaliseStatus(cols[statusIdx] ?? ''),
      priority: normalisePriority(cols[priorityIdx] ?? ''),
      assignee: assigneeIdx >= 0 ? cols[assigneeIdx] || undefined : undefined,
      dueDate: dueDateIdx >= 0 ? cols[dueDateIdx] || undefined : undefined,
    }
  }).filter(t => t.title.length > 0)
}

function extractTag(xml: string, tag: string): string | null {
  const m = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i'))
    || xml.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, 'i'))
  return m?.[1]?.trim() || null
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim()
}

function normaliseStatus(s: string): string {
  const l = s.toLowerCase()
  if (l.includes('done') || l.includes('closed') || l.includes('resolved')) return 'Done'
  if (l.includes('progress') || l.includes('active') || l.includes('open')) return 'In Progress'
  return 'Todo'
}

function normalisePriority(s: string): string {
  const l = s.toLowerCase()
  if (l.includes('critical') || l.includes('blocker') || l.includes('high')) return 'High'
  if (l.includes('medium') || l.includes('normal') || l.includes('major')) return 'Medium'
  if (l.includes('low') || l.includes('minor') || l.includes('trivial')) return 'Low'
  return 'Medium'
}

function parseCSVRow(row: string): string[] {
  const result: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < row.length; i++) {
    const c = row[i]
    if (c === '"') {
      if (inQuotes && row[i + 1] === '"') { cur += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim())
      cur = ''
    } else {
      cur += c
    }
  }
  result.push(cur.trim())
  return result
}
