grant usage on schema public to anon, authenticated;
grant select, insert on public.game_players to anon, authenticated;
grant select, insert on public.game_results to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
grant select on public.minesweeper_leaderboard to anon, authenticated;
grant select on public.brick_breaker_leaderboard to anon, authenticated;
grant select on public.neon_flow_leaderboard to anon, authenticated;
grant select on public.player_global_stats to anon, authenticated;
