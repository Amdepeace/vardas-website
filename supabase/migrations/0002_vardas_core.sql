-- Vardas core schema — migration 0002
-- Core schema for Vardas Bar & Restaurant / Nightclub,
-- 5th floor, Getu Commercial Building, Africa Avenue, Bole.
-- Backs: published menu prices, reservations, trust layer, events & private
-- hire, artist bookings, Getting Here / Bole guide, ride-home partners,
-- advisories, 360° tours, careers. See docs/PRD.md §6.
-- The hotel tables from 0001 (rooms, bookings, guests) are retired in 0003.

create extension if not exists "pgcrypto";

-- ---------------- Menu with published prices (trust layer) ----------------
create table if not exists public.menu_sections (
  id text primary key,                       -- 'kitchen','grill','hookah','beer','spirits','bottles'
  title text not null,
  sort_order int not null default 0,
  service text not null check (service in ('lunch','dinner','club','all'))
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  section_id text not null references public.menu_sections(id) on delete cascade,
  name text not null,
  description text,
  price_etb numeric(10,2) not null,          -- every item has a price; no "ask staff"
  unit text not null default 'each',         -- 'each','glass','bottle','shisha'
  is_bottle_service boolean not null default false,
  seasonal boolean not null default false,
  available boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ---------------- Trust pledge + policies ----------------
create table if not exists public.policies (
  slug text primary key,                     -- 'no-pressure','smoke-free-zones','ride-home','staff-standards','womens-safety'
  title text not null,
  body_md text not null,
  published boolean not null default false,
  updated_at timestamptz not null default now()
);

-- ---------------- Zones & tables ----------------
create table if not exists public.zones (
  id text primary key,                       -- 'terrace','lounge','club-floor','private-1'
  title text not null,
  smoking_allowed boolean not null default false,
  capacity int,
  min_spend_etb numeric(10,2),               -- published up front
  tour_slug text                             -- links to tours.slug
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,                  -- VRD-12345
  guest_name text not null,
  phone text not null,
  email text,
  party_size int not null check (party_size > 0),
  zone_id text references public.zones(id),
  service text not null check (service in ('lunch','dinner','club')),
  starts_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending','confirmed','seated','completed','cancelled','no_show')),
  ride_home_requested boolean not null default false,
  notes text,
  source text not null default 'web' check (source in ('web','whatsapp','phone','walk-in','concierge')),
  created_at timestamptz not null default now()
);
create index if not exists reservations_when_idx on public.reservations (starts_at, status);

-- ---------------- Events, private hire, artists ----------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  kind text not null check (kind in ('club-night','live-music','brunch','private','corporate','community')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  lineup text[] not null default '{}',
  cover_etb numeric(10,2) default 0,
  dress_code text,
  poster_path text,
  published boolean not null default false
);

create table if not exists public.hire_enquiries (
  id uuid primary key default gen_random_uuid(),
  company text,
  contact_name text not null,
  phone text not null,
  email text,
  kind text not null check (kind in ('corporate','launch','birthday','wedding','other')),
  preferred_date date,
  guests int,
  zone_id text references public.zones(id),
  budget_etb numeric(12,2),
  brief text,
  status text not null default 'new' check (status in ('new','quoted','confirmed','lost')),
  created_at timestamptz not null default now()
);

create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null check (kind in ('dj','band','vocalist','comedian','promoter')),
  genres text[] not null default '{}',
  bio text,
  links jsonb not null default '{}',
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.artist_bookings (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  requested_date date not null,
  fee_etb numeric(12,2),
  tech_rider_path text,
  status text not null default 'requested' check (status in ('requested','offered','confirmed','declined')),
  created_at timestamptz not null default now()
);

-- ---------------- Getting Here / Bole guide ----------------
-- Seeded from src/data/places.json.
create table if not exists public.places (
  id text primary key,
  name text not null,
  relation text not null check (relation in ('self','in-building','district','circuit')),
  circuit_role text check (circuit_role in ('before','after','event')),
  category text not null,
  neighborhood text,
  highlights text,
  safety_notes text,
  safety_tier text not null default 'unverified' check (safety_tier in ('self','verified','caution','unverified','closed')),
  rating numeric(2,1),
  price_min_etb int,
  price_max_etb int,
  lat double precision,
  lng double precision,
  sources int[] not null default '{}',
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.ride_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,                        -- vetted driver or partner company (e.g. Ride, Feres)
  kind text not null check (kind in ('driver','company')),
  phone text not null,
  whatsapp text,
  vehicle text,
  plate text,
  vetted_at date,
  active boolean not null default true
);

create table if not exists public.ride_requests (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid references public.reservations(id) on delete set null,
  partner_id uuid references public.ride_partners(id) on delete set null,
  guest_phone text not null,
  dropoff text not null,
  requested_for timestamptz not null,
  status text not null default 'requested' check (status in ('requested','assigned','en_route','arrived','completed','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.advisories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  severity text not null check (severity in ('info','caution','critical')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_by uuid references auth.users(id)
);

-- ---------------- 360° tours ----------------
create table if not exists public.tours (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,                 -- 'terrace','club-floor','private-1','kitchen'
  title text not null,
  published boolean not null default false
);
create table if not exists public.tour_scenes (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  name text not null,
  panorama_path text not null,
  thumb_path text,
  initial_yaw numeric(6,2) default 0,
  initial_pitch numeric(6,2) default 0,
  sort_order int not null default 0
);
create table if not exists public.tour_hotspots (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid not null references public.tour_scenes(id) on delete cascade,
  target_scene_id uuid references public.tour_scenes(id) on delete cascade,
  yaw numeric(6,2) not null, pitch numeric(6,2) not null,
  label text, kind text not null default 'link' check (kind in ('link','info'))
);

-- ---------------- Careers & suppliers ----------------
create table if not exists public.job_openings (
  id uuid primary key default gen_random_uuid(),
  title text not null, team text not null, body_md text not null,
  published boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.job_openings(id) on delete set null,
  kind text not null check (kind in ('job','supplier')),
  name text not null, phone text not null, email text, message text, cv_path text,
  created_at timestamptz not null default now()
);

-- ---------------- RLS ----------------
do $$ declare t text; begin
  foreach t in array array['menu_sections','menu_items','policies','zones','reservations','events','hire_enquiries','artists','artist_bookings','places','ride_partners','ride_requests','advisories','tours','tour_scenes','tour_hotspots','job_openings','applications']
  loop execute format('alter table public.%I enable row level security', t); end loop;
end $$;

-- Public may read what is published / available / active.
create policy "public menu sections" on public.menu_sections for select using (true);
create policy "public menu items"    on public.menu_items    for select using (available);
create policy "public policies"      on public.policies      for select using (published);
create policy "public zones"         on public.zones         for select using (true);
create policy "public events"        on public.events        for select using (published);
create policy "public places"        on public.places        for select using (published);
create policy "public advisories"    on public.advisories    for select using (starts_at <= now() and (ends_at is null or ends_at > now()));
create policy "public tours"         on public.tours         for select using (published);
create policy "public scenes"        on public.tour_scenes   for select using (exists (select 1 from public.tours t where t.id = tour_id and t.published));
create policy "public hotspots"      on public.tour_hotspots for select using (exists (select 1 from public.tour_scenes s join public.tours t on t.id = s.tour_id where s.id = scene_id and t.published));
create policy "public jobs"          on public.job_openings  for select using (published);
create policy "public artists"       on public.artists       for select using (approved);

-- Staff (staff_roles from 0001 / is_staff()) has full access everywhere.
do $$ declare t text; begin
  foreach t in array array['menu_sections','menu_items','policies','zones','reservations','events','hire_enquiries','artists','artist_bookings','places','ride_partners','ride_requests','advisories','tours','tour_scenes','tour_hotspots','job_openings','applications']
  loop execute format('create policy "staff all %1$s" on public.%1$I for all using (public.is_staff()) with check (public.is_staff())', t); end loop;
end $$;

-- Guest writes (reservations, hire_enquiries, artist sign-ups, ride_requests,
-- applications) go through Edge Functions with the service role after
-- phone-OTP / rate-limit checks. Anonymous role has no insert policy. PRD §7.2
