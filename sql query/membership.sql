create table if not exists memberships (
  id bigint generated always as identity primary key,
  email text not null,
  workspace_id text not null references workspaces(id) on delete cascade,
  role text not null check (role in ('Admin', 'Manager', 'Employee')),
  created_at timestamptz not null default now(),
  unique (email, workspace_id)
);
insert into memberships (email, workspace_id, role)
values
  ('alex.rivera@workflow.com', 'ws-demo', 'Admin'),
  ('sarah.chen@workflow.com', 'ws-demo', 'Manager'),
  ('new.employee@workflow.com', 'ws-demo', 'Employee')
on conflict (email, workspace_id) do update
  set role = excluded.role;