create table if not exists spending_entries (
  id text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  project_id text references projects(id) on delete set null,
  department text,
  category text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  spent_at date not null default current_date,
  note text,
  created_at timestamptz not null default now()
);

alter table spending_entries enable row level security;

drop policy if exists "anon all spending_entries" on spending_entries;
create policy "anon all spending_entries" on spending_entries for all to anon using (true) with check (true);

insert into spending_entries (id, workspace_id, project_id, department, category, amount, spent_at, note)
values
  ('spend-seed-1', 'ws-demo', null, 'Product', 'Software', 2400.00, current_date - interval '24 days', 'Design and planning tools'),
  ('spend-seed-2', 'ws-demo', null, 'Engineering', 'Infrastructure', 3900.00, current_date - interval '18 days', 'Hosting and database usage'),
  ('spend-seed-3', 'ws-demo', null, 'Growth', 'Campaigns', 1800.00, current_date - interval '12 days', 'Launch campaign experiments'),
  ('spend-seed-4', 'ws-demo', null, 'Operations', 'Contractors', 3200.00, current_date - interval '7 days', 'Implementation support'),
  ('spend-seed-5', 'ws-demo', null, 'Product', 'Research', 950.00, current_date - interval '3 days', 'Customer interview incentives')
on conflict (id) do nothing;
