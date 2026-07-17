-- Re-creates every RLS policy this app needs, dropping first so it's
-- safe to run even if some already exist and others don't.

drop policy if exists "anon all workspaces" on workspaces;
create policy "anon all workspaces" on workspaces for all to anon using (true) with check (true);

drop policy if exists "anon all memberships" on memberships;
create policy "anon all memberships" on memberships for all to anon using (true) with check (true);

drop policy if exists "anon all projects" on projects;
create policy "anon all projects" on projects for all to anon using (true) with check (true);

drop policy if exists "anon all tasks" on tasks;
create policy "anon all tasks" on tasks for all to anon using (true) with check (true);

drop policy if exists "Allow anon read accounts" on accounts;
drop policy if exists "Allow anon insert accounts" on accounts;
drop policy if exists "Allow anon update accounts" on accounts;
drop policy if exists "anon all accounts" on accounts;
create policy "anon all accounts" on accounts for all to anon using (true) with check (true);

-- Verify every table now has at least one policy:
select tablename, count(*) as policy_count
from pg_policies
where tablename in ('workspaces', 'memberships', 'projects', 'tasks', 'accounts')
group by tablename;