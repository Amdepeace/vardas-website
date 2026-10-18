# Vardas Entertainment — vardasentertainment.com

One site for **Vardas** (lounge & club, 5th floor Getu Commercial Building, Bole) and **Vardas Venue** (premium event space), Addis Ababa.
Vite + React 18 + Tailwind + Supabase. Clean-room rebuild of the multi-venue nightclub pattern — recon in [`replica/`](replica/recon.md).

### What's on the site
- Design: the akom system — Inter (300 body · 500 labels · 900 uppercase display), Cormorant Garamond italic for quotes; ink #0A0A0A, paper #F8F8F6, one red #E84040, akom greys. The logo stays gold.
- Cinematic video hero (`public/media/vardas-hero*.mp4` — swap in new footage, same names), logo and imagery in `public/brand`, `public/gallery`
- Top nav with **Vardas ▾** and **Vardas Venue ▾** dropdowns; mobile drawer
- Events + event pages, **VIP table requests**, **Vardas Venue enquiries** (corporate / private / concert / wedding), gallery with lightbox, FAQ, menu, getting here, contact, work with us
- **Floating WhatsApp + Telegram support** (+251 911 522 856) with quick topics, email and call
- **Instagram embeds**: @vardaslounge and @vardas_venue
- **Mailbox**: every form reaches **vardasvenue@gmail.com** — through Edge Functions + Resend when configured, otherwise by opening the guest's mail app pre-addressed
- 360° slot on the Venue page: give `<Tour360 matterportId="…" />` a Matterport model id to go live

Edit venues, phone, email, nav, events, FAQ and gallery in **`src/data/site.js`**.

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
supabase/migrations/0004_retire_hotel_tables.sql  # drops the old hotel tables (destructive)
supabase/migrations/0005_vardas_entertainment.sql # contact messages, newsletter, venue on enquiries
supabase/seed_vardas.sql                    # places from src/data/places.json, starter zones/sections/policies
```

Edge Functions (`supabase/functions/`): `reserve`, `enquire`, `host` — set `RESEND_API_KEY` to email vardasvenue@gmail.com — see the README there for secrets and deploy commands.

**Staff console** at `/admin` (Supabase Auth; a row in `staff_roles` grants access): Tables · Menu & prices · Events · Enquiries.

## Structure

```
src/
  PublicApp.jsx          routes (react-router) + shell + reservation modal + host
  components/Shell.jsx   NAV_ITEMS, side rail, mobile header, footer
  components/primitives  Mark, Hero, CTA, Price, Tier, Placeholder…
  pages/                 Home, Menu, Club, Events, Hire, Tours, GettingHere, YourTerms, Artists, Careers, Contact
  data/venue.js          zones, policies, venue facts (mirrors seed_vardas.sql)
  data/places.json       24 places from the Addis POI & Safety Guide, tagged by relation to Vardas
  admin/                 staff console: ReservationsPage, MenuAdminPage, EventsAdminPage, EnquiriesPage
```

Design tokens live in `tailwind.config.js` (Paper / Ink / Red + hairline greys; Inter 300/500/900, Cormorant Garamond italic for quotes) — ported from the client's reference, see PRD §9.
Security headers and CSP: `vercel.json`. CI: `.github/workflows/ci.yml` (build; migrations apply on Postgres 15; RLS on every table).
