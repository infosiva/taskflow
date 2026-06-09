export type PlanTier = 'free' | 'pro' | 'team'
export type MemberRole = 'owner' | 'admin' | 'member' | 'viewer'
export type ColumnType =
  | 'status' | 'priority' | 'due_date' | 'person'
  | 'text' | 'number' | 'checkbox' | 'dropdown' | 'tags' | 'ai_summary'

export interface Workspace {
  id: string
  name: string
  slug: string
  owner_id: string
  plan: PlanTier
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
}

export interface Board {
  id: string
  workspace_id: string
  name: string
  icon: string
  color: string
  description: string | null
  created_at: string
}

export interface Group {
  id: string
  board_id: string
  name: string
  color: string
  position: number
}

export interface Task {
  id: string
  group_id: string
  board_id: string
  title: string
  position: number
  created_by: string
  created_at: string
}

export interface Column {
  id: string
  board_id: string
  name: string
  type: ColumnType
  config: Record<string, unknown>
  position: number
}

export interface CellValue {
  id: string
  task_id: string
  column_id: string
  value: unknown
  updated_at: string
}

export interface Comment {
  id: string
  task_id: string
  user_id: string
  body: string
  created_at: string
  user?: { email: string; raw_user_meta_data: { name?: string; avatar_url?: string } }
}

export interface Member {
  workspace_id: string
  user_id: string
  role: MemberRole
  user?: { email: string; raw_user_meta_data: { name?: string; avatar_url?: string } }
}

export interface ActivityLog {
  id: string
  task_id: string
  user_id: string
  action: string
  diff: Record<string, unknown>
  created_at: string
}

// Cell value JSONB shapes per column type
export interface StatusValue { label: string; color: string }
export interface PriorityValue { level: 'critical' | 'high' | 'medium' | 'low' | 'none' }
export interface DueDateValue { date: string; time?: string }
export interface PersonValue { user_id: string; name: string; avatar?: string }
export interface TextValue { text: string }
export interface NumberValue { value: number; unit?: string }
export interface CheckboxValue { checked: boolean }
export interface DropdownValue { option: string }
export interface TagsValue { tags: string[] }
export interface AISummaryValue { generated: string; model: string; generated_at: string }

// Column config shapes
export interface StatusConfig { options: { label: string; color: string }[] }
export interface NumberConfig { unit?: string; min?: number; max?: number }
export interface DropdownConfig { options: string[] }
export interface TagsConfig { options: string[] }
