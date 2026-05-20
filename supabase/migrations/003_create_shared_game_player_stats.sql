create extension if not exists pgcrypto;

drop table if exists public.minesweeper_leaderboard cascade;
drop table if exists public.brick_breaker_leaderboard cascade;
drop table if exists public.neon_flow_leaderboard cascade;
drop table if exists public.player_global_stats cascade;
drop table if exists public.game_results cascade;
drop table if exists public.game_players cascade;

drop function if exists public.set_updated_at() cascade;
drop function if exists public.refresh_game_stats_tables() cascade;
drop function if exists public.refresh_game_stats_after_result_change() cascade;

create table public.game_players (
  id uuid primary key default gen_random_uuid(),
  nickname text not null unique check (length(trim(nickname)) between 2 and 24),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.game_results (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.game_players(id) on delete cascade,
  game_key text not null,
  difficulty text,
  duration_seconds integer,
  score integer,
  combo integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),

  constraint game_results_game_key_check check (
    game_key in ('minesweeper', 'brick_breaker', 'neon_flow')
  ),
  constraint game_results_difficulty_check check (
    (game_key = 'minesweeper' and difficulty in ('easy', 'medium', 'hard'))
    or (game_key = 'brick_breaker' and difficulty is null)
    or (game_key = 'neon_flow' and difficulty in ('easy', 'medium', 'hard', 'expert'))
  ),
  constraint game_results_required_values_check check (
    (game_key = 'minesweeper' and duration_seconds is not null and score is null and combo is null)
    or (game_key = 'brick_breaker' and score is not null and combo is not null and duration_seconds is null)
    or (game_key = 'neon_flow' and score is not null and duration_seconds is not null and combo is null)
  ),
  constraint game_results_duration_check check (duration_seconds is null or duration_seconds >= 0),
  constraint game_results_score_check check (score is null or score >= 0),
  constraint game_results_combo_check check (combo is null or combo >= 0),
  constraint game_results_metadata_check check (jsonb_typeof(metadata) = 'object')
);

create table public.minesweeper_leaderboard (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.game_players(id) on delete cascade,
  nickname text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  best_seconds integer not null,
  games_played integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (player_id, difficulty)
);

create table public.brick_breaker_leaderboard (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.game_players(id) on delete cascade,
  nickname text not null,
  best_score integer not null default 0,
  best_combo integer not null default 0,
  games_played integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (player_id)
);

create table public.neon_flow_leaderboard (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.game_players(id) on delete cascade,
  nickname text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard', 'expert')),
  best_score integer not null default 0,
  best_time_seconds integer,
  best_moves integer not null default 0,
  games_played integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (player_id, difficulty)
);

create table public.player_global_stats (
  id uuid primary key references public.game_players(id) on delete cascade,
  nickname text not null,
  total_games_played integer not null default 0,
  minesweeper_games_played integer not null default 0,
  minesweeper_easy_best_seconds integer,
  minesweeper_medium_best_seconds integer,
  minesweeper_hard_best_seconds integer,
  brick_breaker_games_played integer not null default 0,
  brick_breaker_best_score integer not null default 0,
  brick_breaker_best_combo integer not null default 0,
  neon_flow_games_played integer not null default 0,
  neon_flow_best_score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists game_players_nickname_idx on public.game_players (nickname);
create index if not exists game_results_player_idx on public.game_results (player_id);
create index if not exists game_results_game_key_idx on public.game_results (game_key);
create index if not exists game_results_created_idx on public.game_results (created_at desc);
create index if not exists game_results_minesweeper_idx on public.game_results (difficulty, duration_seconds asc, created_at asc) where game_key = 'minesweeper';
create index if not exists game_results_brick_breaker_idx on public.game_results (score desc, combo desc, created_at asc) where game_key = 'brick_breaker';
create index if not exists game_results_neon_flow_idx on public.game_results (difficulty, score desc, duration_seconds asc, created_at asc) where game_key = 'neon_flow';
create index if not exists minesweeper_leaderboard_sort_idx on public.minesweeper_leaderboard (difficulty, best_seconds asc);
create index if not exists brick_breaker_leaderboard_sort_idx on public.brick_breaker_leaderboard (best_score desc, best_combo desc);
create index if not exists neon_flow_leaderboard_sort_idx on public.neon_flow_leaderboard (difficulty, best_score desc, best_time_seconds asc);
create index if not exists player_global_stats_total_idx on public.player_global_stats (total_games_played desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_game_players_updated_at
before update on public.game_players
for each row
execute function public.set_updated_at();

create or replace function public.refresh_game_stats_tables()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  truncate table public.minesweeper_leaderboard;

  insert into public.minesweeper_leaderboard (
    player_id,
    nickname,
    difficulty,
    best_seconds,
    games_played,
    created_at,
    updated_at
  )
  select distinct on (gp.id, gr.difficulty)
    gp.id,
    gp.nickname,
    gr.difficulty,
    gr.duration_seconds,
    count(*) over (partition by gp.id, gr.difficulty)::integer,
    gr.created_at,
    now()
  from public.game_results gr
  join public.game_players gp on gp.id = gr.player_id
  where
    gr.game_key = 'minesweeper'
    and gr.duration_seconds is not null
    and gr.difficulty in ('easy', 'medium', 'hard')
  order by
    gp.id,
    gr.difficulty,
    gr.duration_seconds asc,
    gr.created_at asc;

  truncate table public.brick_breaker_leaderboard;

  insert into public.brick_breaker_leaderboard (
    player_id,
    nickname,
    best_score,
    best_combo,
    games_played,
    created_at,
    updated_at
  )
  select distinct on (gp.id)
    gp.id,
    gp.nickname,
    gr.score,
    gr.combo,
    count(*) over (partition by gp.id)::integer,
    gr.created_at,
    now()
  from public.game_results gr
  join public.game_players gp on gp.id = gr.player_id
  where
    gr.game_key = 'brick_breaker'
    and gr.score is not null
    and gr.combo is not null
  order by
    gp.id,
    gr.score desc,
    gr.combo desc,
    gr.created_at asc;

  truncate table public.neon_flow_leaderboard;

  insert into public.neon_flow_leaderboard (
    player_id,
    nickname,
    difficulty,
    best_score,
    best_time_seconds,
    best_moves,
    games_played,
    created_at,
    updated_at
  )
  select distinct on (gp.id, gr.difficulty)
    gp.id,
    gp.nickname,
    gr.difficulty,
    gr.score,
    gr.duration_seconds,
    coalesce((gr.metadata ->> 'moves')::integer, 0),
    count(*) over (partition by gp.id, gr.difficulty)::integer,
    gr.created_at,
    now()
  from public.game_results gr
  join public.game_players gp on gp.id = gr.player_id
  where
    gr.game_key = 'neon_flow'
    and gr.score is not null
    and gr.duration_seconds is not null
    and gr.difficulty in ('easy', 'medium', 'hard', 'expert')
    and (
      not (gr.metadata ? 'moves')
      or (gr.metadata ->> 'moves') ~ '^[0-9]+$'
    )
  order by
    gp.id,
    gr.difficulty,
    gr.score desc,
    gr.duration_seconds asc,
    coalesce((gr.metadata ->> 'moves')::integer, 0) asc,
    gr.created_at asc;

  truncate table public.player_global_stats;

  insert into public.player_global_stats (
    id,
    nickname,
    total_games_played,
    minesweeper_games_played,
    minesweeper_easy_best_seconds,
    minesweeper_medium_best_seconds,
    minesweeper_hard_best_seconds,
    brick_breaker_games_played,
    brick_breaker_best_score,
    brick_breaker_best_combo,
    neon_flow_games_played,
    neon_flow_best_score,
    created_at,
    updated_at
  )
  select
    gp.id,
    gp.nickname,
    count(gr.id)::integer,
    count(gr.id) filter (where gr.game_key = 'minesweeper')::integer,
    min(gr.duration_seconds) filter (where gr.game_key = 'minesweeper' and gr.difficulty = 'easy'),
    min(gr.duration_seconds) filter (where gr.game_key = 'minesweeper' and gr.difficulty = 'medium'),
    min(gr.duration_seconds) filter (where gr.game_key = 'minesweeper' and gr.difficulty = 'hard'),
    count(gr.id) filter (where gr.game_key = 'brick_breaker')::integer,
    coalesce(max(gr.score) filter (where gr.game_key = 'brick_breaker'), 0),
    coalesce(max(gr.combo) filter (where gr.game_key = 'brick_breaker'), 0),
    count(gr.id) filter (where gr.game_key = 'neon_flow')::integer,
    coalesce(max(gr.score) filter (where gr.game_key = 'neon_flow'), 0),
    gp.created_at,
    now()
  from public.game_players gp
  left join public.game_results gr on gr.player_id = gp.id
  group by
    gp.id,
    gp.nickname,
    gp.created_at;
end;
$$;

create or replace function public.refresh_game_stats_after_result_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.refresh_game_stats_tables();
  return null;
end;
$$;

create trigger refresh_game_stats_after_insert
after insert on public.game_results
for each statement
execute function public.refresh_game_stats_after_result_change();

create trigger refresh_game_stats_after_update
after update on public.game_results
for each statement
execute function public.refresh_game_stats_after_result_change();

create trigger refresh_game_stats_after_delete
after delete on public.game_results
for each statement
execute function public.refresh_game_stats_after_result_change();

alter table public.game_players enable row level security;
alter table public.game_results enable row level security;
alter table public.minesweeper_leaderboard enable row level security;
alter table public.brick_breaker_leaderboard enable row level security;
alter table public.neon_flow_leaderboard enable row level security;
alter table public.player_global_stats enable row level security;

create policy "Public read players" on public.game_players for select using (true);
create policy "Public read results" on public.game_results for select using (true);
create policy "Public read minesweeper leaderboard" on public.minesweeper_leaderboard for select using (true);
create policy "Public read brick breaker leaderboard" on public.brick_breaker_leaderboard for select using (true);
create policy "Public read neon flow leaderboard" on public.neon_flow_leaderboard for select using (true);
create policy "Public read player global stats" on public.player_global_stats for select using (true);

create policy "Public create players"
on public.game_players
for insert
with check (length(trim(nickname)) between 2 and 24);

create policy "Public create results"
on public.game_results
for insert
with check (
  exists (
    select 1
    from public.game_players
    where game_players.id = game_results.player_id
  )
  and game_key in ('minesweeper', 'brick_breaker', 'neon_flow')
  and (
    (game_key = 'minesweeper' and difficulty in ('easy', 'medium', 'hard'))
    or (game_key = 'brick_breaker' and difficulty is null)
    or (game_key = 'neon_flow' and difficulty in ('easy', 'medium', 'hard', 'expert'))
  )
  and coalesce(score, 0) >= 0
  and coalesce(combo, 0) >= 0
  and coalesce(duration_seconds, 0) >= 0
  and jsonb_typeof(metadata) = 'object'
);

grant select, insert on public.game_players to anon, authenticated;
grant select, insert on public.game_results to anon, authenticated;
grant select on public.minesweeper_leaderboard to anon, authenticated;
grant select on public.brick_breaker_leaderboard to anon, authenticated;
grant select on public.neon_flow_leaderboard to anon, authenticated;
grant select on public.player_global_stats to anon, authenticated;
grant execute on function public.refresh_game_stats_tables() to postgres, service_role;
