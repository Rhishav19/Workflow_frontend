create table if not exists accounts (
  email text primary key,
  name text not null,
  password text not null,
  must_change_password boolean not null default true,
  created_at timestamptz not null default now()
);

insert into accounts (email, name, password, must_change_password)
values
  ('alex.rivera@workflow.com', 'Alex Rivera', 'Workflow123', false),
  ('sarah.chen@workflow.com', 'Sarah Chen', 'Workflow123', false),
  ('new.employee@workflow.com', 'New Employee', 'Temp4821', true)
on conflict (email) do nothing;

alter table accounts enable row level security;

create policy "Allow anon read accounts"
  on accounts for select
  to anon
  using (true);

create policy "Allow anon insert accounts"
  on accounts for insert
  to anon
  with check (true);

create policy "Allow anon update accounts"
  on accounts for update
  to anon
  using (true);
