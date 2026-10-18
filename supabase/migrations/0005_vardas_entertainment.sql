-- Vardas Entertainment site: two venues, contact messages, newsletter.
alter table public.hire_enquiries add column if not exists venue text not null default 'vardas-venue'
  check (venue in ('vardas', 'vardas-venue'));

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  topic text not null default 'general',
  name text not null,
  email text not null,
  phone text,
  message text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;
alter table public.subscribers enable row level security;
create policy "staff all contact_messages" on public.contact_messages for all using (public.is_staff()) with check (public.is_staff());
create policy "staff all subscribers" on public.subscribers for all using (public.is_staff()) with check (public.is_staff());
-- No anon policies: writes arrive only through the `enquire` Edge Function (service role).
