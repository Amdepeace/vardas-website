-- Staff auth schema — initial migration (staff_roles, is_staff()); hotel tables here are retired in 0004.
-- Run this in Supabase SQL editor (or `supabase db push` if using the CLI).
-- Assumes auth.users already exists (managed by Supabase Auth).

create extension if not exists "pgcrypto";

-- ---------------- Staff roles ----------------
-- Links a Supabase auth user to their staff role.
-- Only rows in this table can access the admin console.
create table if not exists public.staff_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','manager','front_desk','housekeeping','engineer','spa','readonly')),
  display_name text,
  created_at timestamptz not null default now()
);

-- ---------------- Rooms ----------------
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  room_type text not null check (room_type in ('standard','deluxe','twin','suite')),
  floor int,
  view text,
  base_rate_etb numeric(10,2) not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------- Guests ----------------
create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  country text,
  is_vip boolean not null default false,
  loyalty_tier text check (loyalty_tier in ('bronze','gold','platinum')),
  notes text,
  total_stays int not null default 0,
  last_stay_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists guests_full_name_idx on public.guests using gin (to_tsvector('simple', full_name));
create index if not exists guests_email_idx on public.guests (lower(email));

-- ---------------- Bookings ----------------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,                -- human reference, e.g. BEL-12345
  guest_id uuid not null references public.guests(id) on delete restrict,
  room_id uuid not null references public.rooms(id) on delete restrict,
  checkin date not null,
  checkout date not null,
  status text not null default 'pending' check (status in ('pending','confirmed','checked_in','checked_out','cancelled','no_show')),
  adults int not null default 1,
  children int not null default 0,
  total_etb numeric(10,2),
  special_requests text,
  source text,                              -- direct, ota, phone, walk-in
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (checkout > checkin)
);

create index if not exists bookings_checkin_idx on public.bookings (checkin);
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_guest_idx on public.bookings (guest_id);
create index if not exists bookings_room_idx on public.bookings (room_id);

-- updated_at triggers
create or replace function public.touch_updated_at()
returns trigger as $$
begin new.updated_at := now(); return new; end;
$$ language plpgsql;

drop trigger if exists guests_touch on public.guests;
create trigger guests_touch before update on public.guests
  for each row execute function public.touch_updated_at();

drop trigger if exists bookings_touch on public.bookings;
create trigger bookings_touch before update on public.bookings
  for each row execute function public.touch_updated_at();

-- ---------------- RLS ----------------
alter table public.staff_roles enable row level security;
alter table public.rooms       enable row level security;
alter table public.guests      enable row level security;
alter table public.bookings    enable row level security;

-- Helper: is the calling user staff?
create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.staff_roles where user_id = auth.uid());
$$;

-- staff_roles: a staff member can read their own row; only admins can read all
drop policy if exists staff_self_read on public.staff_roles;
create policy staff_self_read on public.staff_roles
  for select using (auth.uid() = user_id);

-- rooms / guests / bookings: any staff member can read; only staff can write
drop policy if exists rooms_staff_read on public.rooms;
create policy rooms_staff_read on public.rooms for select using (public.is_staff());
drop policy if exists rooms_staff_write on public.rooms;
create policy rooms_staff_write on public.rooms for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists guests_staff_read on public.guests;
create policy guests_staff_read on public.guests for select using (public.is_staff());
drop policy if exists guests_staff_write on public.guests;
create policy guests_staff_write on public.guests for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists bookings_staff_read on public.bookings;
create policy bookings_staff_read on public.bookings for select using (public.is_staff());
drop policy if exists bookings_staff_write on public.bookings;
create policy bookings_staff_write on public.bookings for all using (public.is_staff()) with check (public.is_staff());

-- ---------------- Seed: rooms ----------------
insert into public.rooms (number, room_type, floor, view, base_rate_etb) values
  ('101','standard',1,'courtyard',5500),
  ('102','standard',1,'courtyard',5500),
  ('201','deluxe',  2,'garden',   7500),
  ('202','deluxe',  2,'garden',   7500),
  ('301','twin',    3,'courtyard',6800),
  ('401','suite',   4,'garden + city',14000)
on conflict (number) do nothing;
