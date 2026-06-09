-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- Workspaces
create table workspaces (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  owner_id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free','pro','team')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now()
);

-- Boards
create table boards (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null,
  icon text not null default '📋',
  color text not null default '#6366f1',
  description text,
  created_at timestamptz not null default now()
);
create index boards_workspace_idx on boards(workspace_id);

-- Groups (columns in kanban, sections in table)
create table groups (
  id uuid primary key default uuid_generate_v4(),
  board_id uuid not null references boards(id) on delete cascade,
  name text not null,
  color text not null default '#6366f1',
  position float not null default 0
);
create index groups_board_idx on groups(board_id);

-- Tasks
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid not null references groups(id) on delete cascade,
  board_id uuid not null references boards(id) on delete cascade,
  title text not null,
  position float not null default 0,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
create index tasks_group_idx on tasks(group_id);
create index tasks_board_idx on tasks(board_id);

-- Custom columns (the engine)
create table columns (
  id uuid primary key default uuid_generate_v4(),
  board_id uuid not null references boards(id) on delete cascade,
  name text not null,
  type text not null check (type in ('status','priority','due_date','person','text','number','checkbox','dropdown','tags','ai_summary')),
  config jsonb not null default '{}',
  position float not null default 0
);
create index columns_board_idx on columns(board_id);

-- Cell values (JSONB — zero-migration custom fields)
create table cell_values (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid not null references tasks(id) on delete cascade,
  column_id uuid not null references columns(id) on delete cascade,
  value jsonb not null default 'null',
  updated_at timestamptz not null default now(),
  unique (task_id, column_id)
);
create index cell_values_task_idx on cell_values(task_id);
create index cell_values_column_idx on cell_values(column_id);

-- Comments
create table comments (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid not null references tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  body text not null,
  created_at timestamptz not null default now()
);
create index comments_task_idx on comments(task_id);

-- Workspace members
create table members (
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member','viewer')),
  primary key (workspace_id, user_id)
);
create index members_user_idx on members(user_id);

-- Activity log
create table activity_log (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid references tasks(id) on delete cascade,
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  action text not null,
  diff jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index activity_log_task_idx on activity_log(task_id);
create index activity_log_workspace_idx on activity_log(workspace_id);

-- RLS helper function
create or replace function is_workspace_member(wid uuid)
returns boolean language sql security definer as $$
  select exists(
    select 1 from members
    where workspace_id = wid and user_id = auth.uid()
  );
$$;

-- Enable RLS
alter table workspaces enable row level security;
alter table boards enable row level security;
alter table groups enable row level security;
alter table tasks enable row level security;
alter table columns enable row level security;
alter table cell_values enable row level security;
alter table comments enable row level security;
alter table members enable row level security;
alter table activity_log enable row level security;

-- RLS policies: workspaces
create policy "member can view workspace" on workspaces
  for select using (is_workspace_member(id) or owner_id = auth.uid());
create policy "owner can update workspace" on workspaces
  for update using (owner_id = auth.uid());
create policy "user can create workspace" on workspaces
  for insert with check (owner_id = auth.uid());

-- RLS policies: members
create policy "member can view members" on members
  for select using (is_workspace_member(workspace_id));
create policy "admin can manage members" on members
  for all using (
    exists(select 1 from members m2
      where m2.workspace_id = workspace_id
        and m2.user_id = auth.uid()
        and m2.role in ('owner','admin'))
  );
create policy "insert own membership" on members
  for insert with check (user_id = auth.uid());

-- RLS policies: boards
create policy "member can view boards" on boards
  for select using (is_workspace_member(workspace_id));
create policy "member can create boards" on boards
  for insert with check (is_workspace_member(workspace_id));
create policy "member can update boards" on boards
  for update using (is_workspace_member(workspace_id));
create policy "admin can delete boards" on boards
  for delete using (
    exists(select 1 from members m
      where m.workspace_id = boards.workspace_id
        and m.user_id = auth.uid()
        and m.role in ('owner','admin'))
  );

-- RLS policies: groups, tasks, columns, cell_values, comments, activity_log
-- All tied to board -> workspace membership
create policy "member can view groups" on groups
  for select using (exists(select 1 from boards b where b.id = board_id and is_workspace_member(b.workspace_id)));
create policy "member can manage groups" on groups
  for all using (exists(select 1 from boards b where b.id = board_id and is_workspace_member(b.workspace_id)));

create policy "member can view tasks" on tasks
  for select using (exists(select 1 from boards b where b.id = board_id and is_workspace_member(b.workspace_id)));
create policy "member can manage tasks" on tasks
  for all using (exists(select 1 from boards b where b.id = board_id and is_workspace_member(b.workspace_id)));

create policy "member can view columns" on columns
  for select using (exists(select 1 from boards b where b.id = board_id and is_workspace_member(b.workspace_id)));
create policy "member can manage columns" on columns
  for all using (exists(select 1 from boards b where b.id = board_id and is_workspace_member(b.workspace_id)));

create policy "member can view cell_values" on cell_values
  for select using (exists(
    select 1 from tasks t join boards b on b.id = t.board_id
    where t.id = task_id and is_workspace_member(b.workspace_id)
  ));
create policy "member can manage cell_values" on cell_values
  for all using (exists(
    select 1 from tasks t join boards b on b.id = t.board_id
    where t.id = task_id and is_workspace_member(b.workspace_id)
  ));

create policy "member can view comments" on comments
  for select using (exists(
    select 1 from tasks t join boards b on b.id = t.board_id
    where t.id = task_id and is_workspace_member(b.workspace_id)
  ));
create policy "member can add comments" on comments
  for insert with check (user_id = auth.uid() and exists(
    select 1 from tasks t join boards b on b.id = t.board_id
    where t.id = task_id and is_workspace_member(b.workspace_id)
  ));

create policy "member can view activity" on activity_log
  for select using (is_workspace_member(workspace_id));
create policy "member can add activity" on activity_log
  for insert with check (user_id = auth.uid() and is_workspace_member(workspace_id));

-- Realtime subscriptions (enable for live board updates)
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table cell_values;
alter publication supabase_realtime add table columns;
alter publication supabase_realtime add table groups;
alter publication supabase_realtime add table comments;
