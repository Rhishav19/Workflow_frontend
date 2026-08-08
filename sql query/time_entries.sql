create table if not exists time_entries (
  id text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  task_id text references tasks(id) on delete set null,
  project_id text references projects(id) on delete set null,
  user_email text not null,
  user_name text,
  start_time timestamptz not null default now(),
  end_time timestamptz,
  duration_seconds integer,
  created_at timestamptz not null default now()
);

alter table time_entries enable row level security;

drop policy if exists "anon all time_entries" on time_entries;
create policy "anon all time_entries" on time_entries for all to anon using (true) with check (true);