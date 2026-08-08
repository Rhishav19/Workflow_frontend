-- ============================================================
-- Security hardening for the `accounts` table.
--
-- Problem being fixed: accounts.password was stored in plaintext,
-- and RLS policies let ANY anon client (i.e. anyone with the public
-- Supabase key, which ships in the browser bundle) select, insert,
-- and update the table directly. That means passwords could be read
-- or overwritten by anyone, no login required.
--
-- Fix: hash passwords with bcrypt (pgcrypto), move all reads/writes
-- behind three SECURITY DEFINER functions that never return the
-- password column, and remove direct anon table access entirely.
--
-- Run this ONCE, in order, top to bottom, in the Supabase SQL editor.
-- ============================================================

-- 1. Enable bcrypt support
create extension if not exists pgcrypto;

-- 2. One-time migration of existing plaintext passwords to bcrypt hashes.
--    Safe to run once; the where clause skips rows that are already
--    hashed (bcrypt hashes start with $2a$/$2b$/$2y$), so re-running
--    this statement by accident is harmless.
update accounts
set password = crypt(password, gen_salt('bf'))
where password !~ '^\$2[aby]\$';

-- 3. Server-side auth functions. These run with elevated privilege
--    (security definer) but only ever return email/name/must_change_password —
--    never the password hash — so they're safe to expose to anon.

create or replace function verify_login(p_email text, p_password text)
returns table(email text, name text, must_change_password boolean)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select a.email, a.name, a.must_change_password
  from accounts a
  where a.email = lower(trim(p_email))
    and a.password = crypt(p_password, a.password);
end;
$$;

create or replace function register_account(
  p_email text,
  p_name text,
  p_password text,
  p_must_change boolean default false
)
returns table(email text, name text, must_change_password boolean)
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from accounts a where a.email = lower(trim(p_email))) then
    raise exception 'account_exists';
  end if;

  insert into accounts (email, name, password, must_change_password)
  values (lower(trim(p_email)), p_name, crypt(p_password, gen_salt('bf')), p_must_change);

  return query select lower(trim(p_email)), p_name, p_must_change;
end;
$$;

create or replace function change_password(p_email text, p_new_password text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update accounts
  set password = crypt(p_new_password, gen_salt('bf')),
      must_change_password = false
  where email = lower(trim(p_email));
end;
$$;

-- 4. Remove the wide-open policies. RLS stays enabled with no anon
--    policies left on the table itself = deny by default. All access
--    now goes exclusively through the three functions above.
drop policy if exists "Allow anon read accounts" on accounts;
drop policy if exists "Allow anon insert accounts" on accounts;
drop policy if exists "Allow anon update accounts" on accounts;

-- 5. Let anon call the functions (the functions are the safe gate now,
--    not the table).
grant execute on function verify_login(text, text) to anon;
grant execute on function register_account(text, text, text, boolean) to anon;
grant execute on function change_password(text, text) to anon;