# Vardas — website

Bar, restaurant and club on the 5th floor of the Getu Commercial Building, Africa Avenue, Bole, Addis Ababa.
Vite + React 18 + Tailwind + Supabase. Product requirements and roadmap: [`docs/PRD.md`](docs/PRD.md).

## Run

```sh
npm ci
cp .env.example .env.local        # add your Supabase URL + anon key (optional for a static preview)
npm run dev
```

Without Supabase configured the site runs in **preview mode**: reservations and the host reply locally and say so.

## Supabase

```sh
# in the SQL editor, in order:
supabase/migrations/0001_initial.sql        # staff_roles + is_staff() (hotel tables retired in 0004)
supabase/migrations/0002_vardas_core.sql    # menu, policies, zones, reservations, events, hire, artists, places, rides, advisories, tours, careers
supabase/migrations/0003_rate_limit.sql     # counters for Edge Functions
supabase/seed_vardas.sql                    # places from src/data/places.json, starter zones/sections/policies
```

Edge Functions (`supabase/functions/`): `reserve`, `host` — see the README there for secrets and deploy commands.

## Structure

```
src/
  PublicApp.jsx          routes (react-router) + shell + reservation modal + host
  components/Shell.jsx   NAV_ITEMS, side rail, mobile header, footer
  components/primitives  Mark, Hero, CTA, Price, Tier, Placeholder…
  pages/                 Home, Menu, Club, Events, Hire, Tours, GettingHere, YourTerms, Artists, Careers, Contact
  data/venue.js          zones, policies, venue facts (mirrors seed_vardas.sql)
  data/places.json       24 places from the Addis POI & Safety Guide, tagged by relation to Vardas
  admin/                 staff console (Supabase Auth + staff_roles)
```

Design tokens live in `tailwind.config.js` (Night / Brass / Smoke / Paper / Terrace / Ember; Bodoni Moda · Manrope · IBM Plex Mono).
Security headers and CSP: `vercel.json`. CI: `.github/workflows/ci.yml` (build; migrations apply on Postgres 15; RLS on every table).
