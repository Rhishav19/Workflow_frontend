create table if not exists workspaces (
  id text primary key,
  name text not null,
  created_by text not null,
  created_at timestamptz not null default now()
);
insert into workspaces (id, name, created_by)
values ('ws-demo', 'Demo Company', 'alex.rivera@workflow.com')
on conflict (id) do nothing;