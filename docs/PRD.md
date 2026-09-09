# Vardas · Website PRD & Roadmap

**Client** Vardas Bar & Restaurant / Nightclub — 5th floor, Getu Commercial Building, Africa Avenue, Bole, Addis Ababa
**Version** 2.0 · **Date** 2026-09-09 · **Status** Scope approved, pre-build · **Branch** `claude/prd-roadmap-security-nav-cy070z`

> v2.0 replaces v1.0, which was written against the wrong client (Bellevue hotel). The codebase is the former Bellvue site and is being **rebranded** for Vardas.

---

## 1. Summary

Vardas is three venues in one address: a **restaurant & lounge** (international and Ethiopian kitchen, seasonal menus, hookah, terrace), a **nightclub** (DJs, live music, the Bole late-night circuit), and a **professional venue** (corporate and private hire, business lunch, artist and promoter bookings). Its public reputation is strong on design, music and food and weak on trust: the source data records pressure to buy expensive liquor (up to ETB 19,200), indoor smoking, and reports of unprofessional staff; the aggregate rating is 3.8/5.

The website's job is to make Vardas the venue people **choose in advance, not stumble into** — and to convert the trust problem into a public advantage with a "**Your Night, Your Terms**" pledge: every price published, no hidden bottle charges, smoke-free zones, a vetted ride home, visible staff standards.

### Decisions locked (2026-09-09)

| Decision | Choice |
|---|---|
| Codebase | Rebrand the existing Vite + React 18 + Tailwind + Supabase site; hotel pages retired, admin console kept |
| Three faces | Restaurant/Lounge · Club · Professional (corporate & private events, business lunch & after-work, artist/DJ & promoter portal, careers & suppliers) |
| Trust angle | **Answer criticisms head-on** — published menu prices, no-pressure pledge, smoke-free zones, ride-home partners, staff standards |
| Navigation & safety | Getting to Vardas safely · Bole after-dark guide (Vardas as anchor of the circuit) · In-building guide (Getu Commercial Center) · Guest safety promise |
| 3D previews | 360° self-hosted tours (Photo Sphere Viewer, auto-rotate walkthrough) behind a swappable `<Tour />` |
| Signature features | AI host (Claude) · Cinematic scroll · Digital guest-list / table pass (Apple/Google Wallet) · Multilingual + WhatsApp reservations |
| Template | 21st.dev **Cinematic Editorial**, re-tokenised for a nightlife brand |
| Data scope | From the 50-row Addis POI & Safety table: Vardas itself, the 4 Getu Commercial Center neighbours, Bole & Kazanchis districts, and the 17 clubs/lounges of the circuit (24 rows) |

---

## 2. Goals & metrics (90 days after launch)

| Goal | Metric | Target |
|---|---|---|
| Reservations become the default | Online + WhatsApp reservations / covers | ≥ 45 % |
| Trust repaired | Public rating (Google, Wanderlog blended) | 3.8 → ≥ 4.3 |
| Zero surprise bills | Disputes about drink pricing per month | 0 |
| Professional revenue | Private-hire enquiries per month; conversion | ≥ 12; ≥ 30 % |
| Business lunch | Lunch covers Mon–Fri | +40 % |
| Safe nights | Ride-home requests / late-night reservations | ≥ 50 % |
| Tours convert | Hire enquiry rate on zone pages with a 360° tour vs without | +30 % |
| Performance | Lighthouse mobile perf / a11y on Home, Menu, Club, Getting Here | ≥ 85 / ≥ 95 |

---

## 3. Users

1. **Night-out planner (20s–40s, local & diaspora)** — "What's on Friday, who's playing, what will it cost, how do I get home?"
2. **Business guest (Bole professional, expat, hotel guest)** — wants a lunch table or an after-work drink near the airport, without the club scene.
3. **Event organiser** — company launch or birthday; needs capacity, floor plan, packages, a quote, and to *see the room*.
4. **Artist / DJ / promoter** — tech specs, dates, how to pitch a night.
5. **Vardas staff & management** — menu edits, reservations board, hire pipeline, events calendar, tours, advisories, careers.

---

## 4. Data: the POI & Safety table, Vardas-centred

Source: `Addis_Ababa_Points_of_Interest_and_Safety_Guide.xlsx` → `src/data/places.json` (24 rows) → `public.places`.

| Relation | Rows | Use on the site |
|---|---|---|
| `self` | 1 | Vardas — facts (5th floor, Africa Ave; kitchen; hookah; live music & DJs; terrace; 3.8/5; ETB 1,600–19,200) and the four criticisms to answer |
| `in-building` | 4 | Getu Commercial Center neighbours (Middletown, Tokuma No.1, Yesitota, fast food) → floor guide |
| `district` | 2 | Bole (business district, good night-walking safety, English common) and Kazanchis → "where Vardas sits" |
| `circuit` | 17 | The clubs & lounges → Bole after-dark guide, each tagged `before` / `after` / `event` relative to Vardas |

`safety_tier` (`verified` 10 · `caution` 2 · `unverified` 10 · `closed` 1 · `self` 1) is derived from the source's safety column. The `caution` and `unverified` labels are shown for the *circuit*, not for Vardas; Vardas's own criticisms are answered by the trust layer (§5.2), not displayed as warnings.

Gaps for staff: no coordinates in the source (pin all 24 in the admin console); most circuit venues lack neighbourhood and price; `Upscale` is closed.

---

## 5. Features

### 5.1 Menu with every price published  `P0`
- `menu_sections` / `menu_items`: kitchen, grill, hookah, beer, spirits by glass, **bottles** — price in ETB on every line, bottle service clearly separated and labelled with its minimum.
- Zone minimum-spend published on the zone page (`zones.min_spend_etb`).
- "Estimate my night" widget: party size × drinks → expected bill range, using the source's ETB 1,600–19,200 span as the honest bracket.
- Staff edit in the admin console; `updated_at` shown on the page.

### 5.2 "Your Night, Your Terms" — trust layer  `P0`
Answers the four recorded criticisms, one by one, in public:
| Criticism (source) | Public answer |
|---|---|
| Liquor pressure up to ETB 19,200 | No-pressure pledge; bottle service only on request; prices on the table QR; bill preview before ordering |
| Smoking indoors | Smoke-free zones map (terrace vs lounge vs club floor), hookah confined to marked areas |
| Unprofessional staff | Published staff standards + training; named floor manager per night; feedback line answered in 24 h |
| Altitude × alcohol | "You're at 2,355 m" card on the menu and in the reservation confirmation; free water policy |
Stored in `policies`; surfaced on its own page, in the reservation confirmation, and on the table QR.

### 5.3 Reservations + WhatsApp  `P0`
- `reservations` for lunch / dinner / club; zone choice; party size; ride-home tick-box.
- WhatsApp Business Cloud API: enquiry → template confirmation → reminder → "ride home?" at 23:00.
- OTP-verified writes via Edge Function; rate-limited; staff board in admin.

### 5.4 Getting to Vardas safely  `P0`
- MapLibre map centred on Getu Commercial Building: entrance on Africa Avenue, lift to 5th floor, parking, drop-off point, walking time from Bole hotels and the airport.
- Bole's source night-safety rating (good; decent lighting; security) shown; Piazza/Merkato/Mexico "avoid at night" only as context for the return trip.
- **Ride-home partners** (`ride_partners`, `ride_requests`): vetted drivers and partner apps; request from the site, table QR or WhatsApp; status to guest.

### 5.5 Bole after-dark guide  `P1`
- The 17 circuit venues as *before / after Vardas* stops with their source safety line and tier; Vardas is the anchor of the night. `closed` venues hidden.
- Positions Vardas generously (a host, not a competitor); each card ends with "then back to Vardas / ride home".

### 5.6 In-building guide  `P1`
- Getu Commercial Center floor guide: Middletown, Tokuma No.1, Yesitota & others; "Vardas · 5th floor · terrace".

### 5.7 Guest safety promise  `P0`
- Page + confirmation footer: door and floor security, CCTV, women's safety policy, ID and capacity policy, designated-driver programme, emergency numbers (Police 991 · Ambulance 907 · floor manager line).
- Advisories (`advisories`) for closures, private events, corridor-development works.

### 5.8 360° tours — Matterport-style previews  `P0`
- Scenes: terrace, lounge, club floor, private rooms, bar, kitchen pass; 6–12 scenes. Insta360 X4 / Theta Z1 at 8K; tiled to 4K/2K in Supabase Storage `tours/`.
- Photo Sphere Viewer 5 with virtual-tour, autorotate and gallery plugins; "Play walkthrough" sequences scenes; hotspots authored in admin.
- Embedded on every zone page and in the private-hire enquiry flow ("see the room you're booking"). `<Tour slug="terrace" />` is the only public API.

### 5.9 Professional: events & private hire  `P1`
- Events calendar (`events`): club nights, live music, brunch, community; lineup, cover, dress code.
- Private hire: zone capacity, layouts, packages, `hire_enquiries` form with budget and date; 360° preview; 48-hour quote SLA.
- Business lunch & after-work: lunch menu, quiet zones, WiFi, "9 min from Bole International" positioning.

### 5.10 Professional: artists, promoters, careers, suppliers  `P2`
- Artist portal (`artists`, `artist_bookings`): profile, tech specs & rider download, date request, co-hosted nights (Zoya-style events).
- Careers (`job_openings`, `applications`): visible training standards (part of §5.2); supplier onboarding form.

### 5.11 AI host "Selam" (Claude)  `P1`
- Supabase Edge Function `host` → Anthropic Messages API, `claude-opus-5`, adaptive thinking, `effort: medium`, streaming; refusal fallbacks on; key only in Edge Function secrets.
- Cached grounding: published menu with prices, zones, tonight's event, policies, places table, advisories. Tools: `get_menu`, `tonight`, `reserve_table`, `request_ride`, `hire_enquiry`, `handoff_to_manager`.
- Guardrails: quotes prices only from `menu_items`; never upsells bottles unless asked; repeats the smoke-free / altitude notes when relevant; hands off complaints to a named manager.

### 5.12 Cinematic scroll — 21st.dev Cinematic Editorial  `P1`
| Section | Pattern | Vardas treatment |
|---|---|---|
| Hero | Video hero + text reveal | 10 s terrace-at-dusk → club-floor cut; headline "Fifth floor. Your terms." |
| Nav | Floating dock | Lunch · Dinner · Club · Events · Hire · Getting Here · Your Terms |
| Menu | Sticky-scroll reveal | Section locks, dishes scroll with prices always visible |
| Club | Spotlight cards | Tonight's lineup, cover, dress code |
| Hire | Sticky image + 360° CTA | Zone by zone |
| Circuit | Marquee → cards | The Bole night as a timeline: before · Vardas · after · ride home |
Lenis + Framer Motion, GSAP only where needed; `prefers-reduced-motion` respected.

### 5.13 Digital guest-list / table pass  `P2`
- Apple/Google Wallet pass for a reservation or guest-list entry: QR at the door, zone, minimum spend, ride-home button, emergency line. Skip-the-queue lane.

### 5.14 Multilingual  `P1`
- en · am (Noto Sans Ethiopic) · zh · ar (RTL) via `react-i18next`; menu names/descriptions translated with human review.

---

## 6. Data model (migration `0002_vardas_core.sql`)

`menu_sections` · `menu_items` · `policies` · `zones` · `reservations` · `events` · `hire_enquiries` · `artists` · `artist_bookings` · `places` · `ride_partners` · `ride_requests` · `advisories` · `tours` · `tour_scenes` · `tour_hotspots` · `job_openings` · `applications`. RLS on all: anon reads published/available/active; staff (`is_staff()` from 0001) full; guest writes only via Edge Functions. Migration `0003` retires the hotel tables (`rooms`, `bookings`, `guests`) after data export.

---

## 7. Security

### 7.1 Guest safety (product)
Trust pledge and safety promise as above; ride-home partner sees first name + pickup only; women's-safety and door policies published; advisories time-windowed; altitude and free-water notices.

### 7.2 Platform
| Area | Requirement |
|---|---|
| Auth | Supabase Auth; staff via `staff_roles` with roles `admin, manager, floor, kitchen, events, readonly`; MFA for admin/manager |
| RLS | Every table; nightly policy tests in CI |
| Secrets | Anthropic, WhatsApp, maps keys in Edge Function secrets only; quarterly rotation |
| Edge Functions | `host`, `reserve`, `request-ride`, `hire-enquiry`, `artist-apply`, `whatsapp-webhook` — Zod validation, per-IP + per-phone rate limits, audit log |
| Payments | Deposits for private hire via Chapa / Telebirr (hosted); no card data on Vardas systems |
| Web | CSP, HSTS, X-Frame-Options; headers in `vercel.json` |
| Privacy | Reservation PII purged 90 days after visit; consent for WhatsApp; notice in Amharic & English |
| PII in AI | Guest details reach Claude only after OTP; no PII in cached prompt |

---

## 8. Architecture (rebrand)

- Tokens: replace navy/gold/cream with the Vardas palette (see design spec, §9); Playfair/Inter → Bodoni Moda / Manrope / IBM Plex Mono.
- Routing: hash → `react-router-dom` (`/menu`, `/club`, `/events/:slug`, `/hire`, `/getting-here`, `/your-terms`, `/tours/:slug`, `/artists`, `/careers`).
- Retire pages: Suites, Spa, Gym, Circle, Offers. Reuse: Shell, primitives, BookingModal (→ ReservationModal), ConciergeWidget (→ Host), admin console (Bookings → Reservations, Guests → Contacts).
- New deps: `maplibre-gl`, `@photo-sphere-viewer/*`, `framer-motion`, `lenis`, `react-i18next`, `zod`; Edge Functions: `@anthropic-ai/sdk`.

## 9. Brand & design spec (for the rebrand)

- **Palette**: Night `#0E0B10` · Brass `#C8A452` · Smoke `#8C8A94` · Paper `#F5F1EA` · Terrace green `#2F6B4F` (verified/positive) · Ember `#D3572E` (caution). Dark-first on Club and Hero; paper on Menu, Hire, Your Terms.
- **Type**: Bodoni Moda (display, high-contrast glamour) · Manrope (body) · IBM Plex Mono (prices, data).
- **Rule**: prices are always set in mono, always visible; brass is spent on one element per viewport.

## 10. Roadmap (18 weeks)

| Phase | Weeks | Scope | Exit |
|---|---|---|---|
| 0 Rebrand foundation | 1–2 | Tokens, type, nav, react-router; migration 0002 + seed; Edge Function scaffold; CI (lint, build, RLS tests, Lighthouse) | Preview deployed; RLS green |
| 1 Menu · Trust · Reservations | 3–5 | Menu with prices; Your Night, Your Terms; reservations + WhatsApp templates (submit now); admin boards | Every item priced; first WhatsApp confirmation sent |
| 2 Getting Here · Safety promise | 5–7 | Map, ride-home partners, advisories, safety page; staff pin 24 places | Ride requested end-to-end in staging |
| 3 360° tours | 6–9 | Shoot (book week 3), pipeline, `<Tour />`, walkthrough, zone pages | All zones toured; LCP < 2.5 s |
| 4 Professional | 8–12 | Events calendar, private hire + deposits, business lunch, artist portal | First paid hire enquiry via site |
| 5 Cinematic · AI host · i18n | 11–15 | 21st.dev components, motion, Claude host, 4 languages | Perf ≥ 85; ≥ 60 % host deflection in shadow test |
| 6 Passes · Careers · Launch | 15–18 | Wallet passes, careers/suppliers, pen-test, staff training, launch | 0 critical findings; live |

## 11. Risks
| Risk | Mitigation |
|---|---|
| Publishing prices exposes margins to competitors | Accept; it is the trust strategy — review quarterly |
| Pledge not honoured on the floor | Manager sign-off nightly; feedback line; pledge tied to staff standards & training (careers) |
| Circuit venues object to being listed | Factual source lines only; opt-out contact; generous framing |
| WhatsApp template approval delay | Submit in Phase 1; SMS fallback |
| 360° assets on 4G | 2K tiles, lazy scenes, poster first |
| Claude cost/latency | Cached prompt, medium effort, streaming; alert at 2× forecast |

## 12. Open questions
1. Exact zones and capacities (terrace / lounge / club floor / private rooms)?
2. Current bottle-service minimums — will management commit to publishing them?
3. Ride-home: own drivers, partner app, or both?
4. Is there a Vardas logo/brand kit, or does §9 become the brand?
5. Who owns the nightly pledge sign-off (floor manager)?
