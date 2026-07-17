create table if not exists tasks (
  id text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  project_id text references projects(id) on delete set null,
  title text not null,
  priority text default 'Medium' check (priority in ('Low', 'Medium', 'High')),
  assignee text,
  due_date text,
  status text not null default 'To Do'
    check (status in ('To Do', 'In Progress', 'Review', 'Done')),
  submission jsonb,
  created_at timestamptz not null default now()
);