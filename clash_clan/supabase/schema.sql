create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  username text,
  role text not null default 'admin' check (role in ('owner', 'admin')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'revoked')),
  clash_tag text unique,
  nickname text,
  clash_name text,
  townhall_level integer check (townhall_level is null or townhall_level between 1 and 18),
  access_requested_at timestamptz not null default now(),
  last_login_at timestamptz,
  revoked_reason text,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references auth.users(id)
);

alter table public.profiles drop column if exists password;
alter table public.profiles drop column if exists registration_note;
alter table public.profiles add column if not exists nickname text;
alter table public.profiles drop column if exists exp_level;
alter table public.profiles drop column if exists trophies;
alter table public.profiles drop column if exists best_trophies;
alter table public.profiles drop column if exists clan_tag;
alter table public.profiles drop column if exists clan_name;
alter table public.profiles drop column if exists clan_badge_url;
alter table public.profiles drop column if exists war_preference;
update public.profiles
set role = 'admin'
where role not in ('owner', 'admin');
alter table public.profiles alter column role set default 'admin';
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('owner', 'admin'));

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

insert into public.app_settings (key, value)
values ('registration_open', '{"enabled": true}'::jsonb)
on conflict (key) do nothing;

insert into public.app_settings (key, value)
values ('clan_rules', jsonb_build_object('content', '', 'version', 'default-rules'))
on conflict (key) do nothing;

drop table if exists public.clans cascade;

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  player_tag text unique not null,
  town_hall_level integer not null check (town_hall_level between 1 and 18),
  role text not null check (role in ('leader', 'coLeader', 'member')),
  war_ready boolean not null default true,
  clan_key text not null check (clan_key in ('ukraine', 'raybojniki')),
  account_type text not null default 'main' check (account_type in ('main', 'twink')),
  main_player_id uuid references public.players(id) on delete set null,
  home_clan_key text not null default 'ukraine' check (home_clan_key in ('ukraine', 'raybojniki')),
  current_clan_key text not null default 'ukraine' check (current_clan_key in ('ukraine', 'raybojniki')),
  joined_home_clan_at date,
  home_clan_timer_paused boolean not null default false,
  home_clan_timer_paused_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.players add column if not exists player_tag text;
alter table public.players add column if not exists role text;
alter table public.players add column if not exists war_ready boolean not null default true;
alter table public.players add column if not exists clan_key text;
alter table public.players add column if not exists account_type text not null default 'main';
alter table public.players add column if not exists main_player_id uuid references public.players(id) on delete set null;
alter table public.players add column if not exists home_clan_key text;
alter table public.players add column if not exists current_clan_key text;
alter table public.players add column if not exists joined_home_clan_at date;
alter table public.players add column if not exists home_clan_timer_paused boolean not null default false;
alter table public.players add column if not exists home_clan_timer_paused_at timestamptz;
alter table public.players add column if not exists updated_at timestamptz not null default now();
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'players' and column_name = 'tag') then
    execute 'update public.players set player_tag = upper(coalesce(player_tag, tag)) where player_tag is null';
  end if;
end $$;
update public.players set role = 'member' where role is null;
update public.players set war_ready = true where war_ready is null;
update public.players set clan_key = 'ukraine' where clan_key is null;
update public.players set account_type = 'main' where account_type is null or account_type not in ('main', 'twink');
update public.players set main_player_id = null where account_type = 'main';
update public.players set current_clan_key = coalesce(current_clan_key, clan_key, 'ukraine');
update public.players set home_clan_key = coalesce(home_clan_key, current_clan_key, clan_key, 'ukraine');
update public.players
set home_clan_timer_paused = (home_clan_key <> current_clan_key),
    home_clan_timer_paused_at = case
      when home_clan_key <> current_clan_key then coalesce(home_clan_timer_paused_at, now())
      else null
    end;
alter table public.players drop column if exists clan_id cascade;
alter table public.players drop column if exists tag cascade;
alter table public.players drop column if exists war_preference cascade;
alter table public.players alter column player_tag set not null;
alter table public.players alter column role set not null;
alter table public.players alter column war_ready set default true;
alter table public.players alter column war_ready set not null;
alter table public.players alter column clan_key set not null;
alter table public.players alter column account_type set default 'main';
alter table public.players alter column account_type set not null;
alter table public.players alter column home_clan_key set default 'ukraine';
alter table public.players alter column home_clan_key set not null;
alter table public.players alter column current_clan_key set default 'ukraine';
alter table public.players alter column current_clan_key set not null;
alter table public.players alter column home_clan_timer_paused set default false;
alter table public.players alter column home_clan_timer_paused set not null;
alter table public.players drop constraint if exists players_role_check;
alter table public.players add constraint players_role_check check (role in ('leader', 'coLeader', 'member'));
alter table public.players drop constraint if exists players_clan_key_check;
alter table public.players add constraint players_clan_key_check check (clan_key in ('ukraine', 'raybojniki'));
alter table public.players drop constraint if exists players_account_type_check;
alter table public.players add constraint players_account_type_check check (account_type in ('main', 'twink'));
alter table public.players drop constraint if exists players_account_main_link_check;
alter table public.players add constraint players_account_main_link_check check (
  (account_type = 'main' and main_player_id is null)
  or
  (account_type = 'twink' and main_player_id is not null and main_player_id <> id)
);
alter table public.players drop constraint if exists players_home_clan_key_check;
alter table public.players add constraint players_home_clan_key_check check (home_clan_key in ('ukraine', 'raybojniki'));
alter table public.players drop constraint if exists players_current_clan_key_check;
alter table public.players add constraint players_current_clan_key_check check (current_clan_key in ('ukraine', 'raybojniki'));
create unique index if not exists players_player_tag_unique_idx on public.players (player_tag);

create table if not exists public.blacklist (
  id uuid primary key default gen_random_uuid(),
  player_tag text not null unique,
  nickname text not null,
  town_hall_level integer not null default 1 check (town_hall_level between 1 and 18),
  reason text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.blacklist add column if not exists player_tag text;
alter table public.blacklist add column if not exists reason text;
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'blacklist' and column_name = 'tag') then
    execute 'update public.blacklist set player_tag = upper(coalesce(player_tag, tag)) where player_tag is null';
  end if;
end $$;
alter table public.blacklist drop column if exists tag cascade;
alter table public.blacklist alter column player_tag set not null;
create unique index if not exists blacklist_player_tag_unique_idx on public.blacklist (player_tag);

create or replace function public.is_owner()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'owner'
      and status = 'approved'
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('owner', 'admin')
      and status = 'approved'
  );
$$;

create or replace function public.is_approved_manager()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and status = 'approved'
      and role in ('owner', 'admin')
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_townhall text;
begin
  raw_townhall := new.raw_user_meta_data->>'townhall_level';

  insert into public.profiles (
    id,
    email,
    username,
    nickname,
    clash_tag,
    clash_name,
    townhall_level,
    role,
    status,
    access_requested_at
  )
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data->>'username', ''),
    nullif(new.raw_user_meta_data->>'nickname', ''),
    nullif(new.raw_user_meta_data->>'clash_tag', ''),
    nullif(new.raw_user_meta_data->>'nickname', ''),
    case when raw_townhall ~ '^[0-9]+$' then raw_townhall::int else null end,
    'admin',
    'pending',
    now()
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create or replace function public.update_own_last_login()
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
  set last_login_at = now()
  where id = auth.uid();
$$;

create or replace function public.approve_profile_as_admin(profile_id uuid)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_profile public.profiles;
begin
  if not public.is_owner() then
    raise exception 'Only owner can approve users';
  end if;

  update public.profiles
  set role = 'admin',
      status = 'approved',
      revoked_reason = null,
      approved_at = now(),
      approved_by = auth.uid()
  where id = profile_id
    and id <> auth.uid()
    and role <> 'owner'
  returning * into updated_profile;

  if updated_profile.id is null then
    raise exception 'Profile cannot be approved';
  end if;

  return updated_profile;
end;
$$;

create or replace function public.reject_profile(profile_id uuid)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_profile public.profiles;
begin
  if not public.is_owner() then
    raise exception 'Only owner can reject users';
  end if;

  update public.profiles
  set status = 'rejected',
      approved_at = null,
      approved_by = null
  where id = profile_id
    and id <> auth.uid()
    and role <> 'owner'
  returning * into updated_profile;

  if updated_profile.id is null then
    raise exception 'Profile cannot be rejected';
  end if;

  return updated_profile;
end;
$$;

create or replace function public.revoke_profile(profile_id uuid, reason text default null)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_profile public.profiles;
begin
  if not public.is_owner() then
    raise exception 'Only owner can revoke users';
  end if;

  update public.profiles
  set status = 'revoked',
      approved_at = null,
      approved_by = null,
      revoked_reason = reason
  where id = profile_id
    and id <> auth.uid()
    and role <> 'owner'
  returning * into updated_profile;

  if updated_profile.id is null then
    raise exception 'Profile cannot be revoked';
  end if;

  return updated_profile;
end;
$$;

create or replace function public.delete_profile(profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_owner() then
    raise exception 'Only owner can delete profiles';
  end if;

  delete from public.profiles
  where id = profile_id
    and id <> auth.uid()
    and role <> 'owner';

  if not found then
    raise exception 'Profile cannot be deleted';
  end if;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.app_settings enable row level security;
alter table public.players enable row level security;
alter table public.blacklist enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (id = auth.uid());

drop policy if exists "Admins can read profiles" on public.profiles;
drop policy if exists "Owners can read profiles" on public.profiles;
create policy "Owners can read profiles"
  on public.profiles for select
  using (public.is_owner());

drop policy if exists "Admins can update profiles" on public.profiles;
drop policy if exists "Owners can update profiles" on public.profiles;
create policy "Owners can update profiles"
  on public.profiles for update
  using (public.is_owner() and role <> 'owner' and id <> auth.uid())
  with check (public.is_owner() and role <> 'owner' and id <> auth.uid());

drop policy if exists "Owners and admins can delete profiles" on public.profiles;
drop policy if exists "Owners can delete profiles" on public.profiles;
create policy "Owners can delete profiles"
  on public.profiles for delete
  using (public.is_owner() and role <> 'owner' and id <> auth.uid());

drop policy if exists "Public can read registration settings" on public.app_settings;
create policy "Public can read registration settings"
  on public.app_settings for select
  using (key in ('registration_open', 'clan_rules'));

drop policy if exists "Admins can manage settings" on public.app_settings;
drop policy if exists "Owners can manage settings" on public.app_settings;
create policy "Owners can manage settings"
  on public.app_settings for all
  using (public.is_owner())
  with check (public.is_owner());

drop policy if exists "Public can read players" on public.players;
create policy "Public can read players"
  on public.players for select
  using (true);

drop policy if exists "Approved members can manage players" on public.players;
drop policy if exists "Approved managers can manage players" on public.players;
create policy "Approved managers can manage players"
  on public.players for all
  using (public.is_approved_manager())
  with check (public.is_approved_manager());

drop policy if exists "Public can read blacklist" on public.blacklist;
create policy "Public can read blacklist"
  on public.blacklist for select
  using (true);

drop policy if exists "Approved members can manage blacklist" on public.blacklist;
drop policy if exists "Approved managers can manage blacklist" on public.blacklist;
create policy "Approved managers can manage blacklist"
  on public.blacklist for all
  using (public.is_approved_manager())
  with check (public.is_approved_manager());

drop function if exists public.is_approved_member();

create index if not exists profiles_status_idx on public.profiles (status);
create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_clash_tag_idx on public.profiles (clash_tag);
create index if not exists players_clan_key_idx on public.players (clan_key);
create index if not exists players_home_clan_key_idx on public.players (home_clan_key);
create index if not exists players_current_clan_key_idx on public.players (current_clan_key);
create index if not exists players_main_player_id_idx on public.players (main_player_id);
create index if not exists players_player_tag_idx on public.players (player_tag);
create index if not exists blacklist_player_tag_idx on public.blacklist (player_tag);

-- First owner setup:
-- 1. Register through the website with varpman3310@gmail.com.
-- 2. Open Supabase SQL Editor and run:
--
-- update public.profiles
-- set role = 'owner',
--     status = 'approved',
--     approved_at = now(),
--     approved_by = id
-- where email = 'varpman3310@gmail.com';
--
-- 3. Reload the website.
-- 4. Verify:
--
-- select email, role, status, clash_tag, clash_name
-- from public.profiles;
