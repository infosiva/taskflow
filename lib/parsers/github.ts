import type { ParsedTask } from './jira'

type GHIssue = {
  title: string
  state: string
  body?: string | null
  labels: { name: string }[]
  assignees: { login: string }[]
  due_on?: string | null
  milestone?: { due_on?: string | null } | null
}

export async function fetchGithubIssues(repoUrl: string, token?: string): Promise<ParsedTask[]> {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/?#]+)/)
  if (!match) throw new Error('Invalid GitHub repo URL')
  const [, owner, repo] = match
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=100`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`)
  const issues: GHIssue[] = await res.json()
  return issues
    .filter(i => !('pull_request' in i))
    .map(i => ({
      title: i.title,
      status: i.state === 'closed' ? 'Done' : 'Todo',
      priority: extractPriorityFromLabels(i.labels.map(l => l.name)),
      assignee: i.assignees.map(a => a.login).join(', ') || undefined,
      dueDate: i.milestone?.due_on ? i.milestone.due_on.split('T')[0] : undefined,
      description: i.body?.slice(0, 500) || undefined,
    }))
}

function extractPriorityFromLabels(labels: string[]): string {
  for (const l of labels) {
    const lower = l.toLowerCase()
    if (lower.includes('p0') || lower.includes('critical') || lower.includes('urgent') || lower.includes('high')) return 'High'
    if (lower.includes('p2') || lower.includes('low')) return 'Low'
    if (lower.includes('p1') || lower.includes('medium') || lower.includes('normal')) return 'Medium'
  }
  return 'Medium'
}
