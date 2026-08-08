create table if not exists tasks (
  id text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  project_id text references projects(id) on delete set null,
  title text not null,
  description text,
  priority text default 'Medium' check (priority in ('Low', 'Medium', 'High')),
  assignee text,
  due_date text,
  status text not null default 'To Do'
    check (status in ('To Do', 'In Progress', 'Review', 'Done')),
  submission jsonb,
  created_at timestamptz not null default now()
);
-- Migration: run this separately if the tasks table already exists in your Supabase project
alter table tasks add column if not exists description text;