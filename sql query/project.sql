create table if not exists projects (
  id text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  name text not null,
  description text,
  department text,
  status text not null default 'Planning'
    check (status in ('Planning', 'On Track', 'At Risk', 'Completed')),
  progress int not null default 0,
  due_date text,
  team jsonb not null default '[]',
  team_overflow int not null default 0,
  created_at timestamptz not null default now()
);
