create table if not exists members (
  id text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  name text not null,
  initials text,
  email text not null,
  department text,
  role text check (role in ('Manager', 'Employee')),
  status text not null default 'Active'
    check (status in ('Active', 'Away', 'Offline')),
  joined_date text,       -- stored pre-formatted (e.g. "Just now"), like dueDate elsewhere
  created_at timestamptz not null default now()
);

alter table members enable row level security;

drop policy if exists "anon all members" on members;
create policy "anon all members" on members for all to anon using (true) with check (true);
insert into members (id, workspace_id, name, initials, email, department, role, status, joined_date)
values
  ('mem-seed-1', 'ws-demo', 'Alex Rivera', 'AR', 'alex.rivera@workflow.com', 'Management', 'Manager', 'Active', 'Jan 2026'),
  ('mem-seed-2', 'ws-demo', 'Sarah Chen', 'SC', 'sarah.chen@workflow.com', 'Product', 'Manager', 'Active', 'Jan 2026')
on conflict (id) do nothing;
