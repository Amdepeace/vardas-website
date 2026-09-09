-- Fixed-window counters used by Edge Functions (see functions/_shared/ratelimit.ts).
create table if not exists public.rate_limits (
  key text not null,
  window_start timestamptz not null,
  hits int not null default 0,
  primary key (key, window_start)
);
alter table public.rate_limits enable row level security;   -- service role only; no policies.

create or replace function public.bump_rate_limit(p_key text, p_window timestamptz)
returns int language plpgsql security definer set search_path = public as $$
declare v int;
begin
  insert into public.rate_limits(key, window_start, hits) values (p_key, p_window, 1)
  on conflict (key, window_start) do update set hits = rate_limits.hits + 1
  returning hits into v;
  delete from public.rate_limits where window_start < now() - interval '2 days';
  return v;
end $$;
revoke all on function public.bump_rate_limit(text, timestamptz) from public, anon, authenticated;
