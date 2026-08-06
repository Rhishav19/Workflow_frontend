-- Fix: pgcrypto's crypt()/gen_salt() live in the `extensions` schema on
-- Supabase, not `public`. The three functions below pinned search_path to
-- just `public`, so Postgres couldn't find them — causing:
--   "function gen_salt(unknown) does not exist"
--
-- Run this in the Supabase SQL editor. It replaces the same three
-- functions with an added `extensions` schema on the search_path;
-- everything else about them (signatures, logic) is unchanged.

create or replace function verify_login(p_email text, p_password text)
returns table(email text, name text, must_change_password boolean)
language plpgsql
security definer
set search_path = public, extensions
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
set search_path = public, extensions
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
set search_path = public, extensions
as $$
begin
  update accounts
  set password = crypt(p_new_password, gen_salt('bf')),
      must_change_password = false
  where email = lower(trim(p_email));
end;
$$;