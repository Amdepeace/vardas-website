# Recon map: LIV Nightclub marketing site (web) → Vardas Entertainment

Scope: the public marketing + booking slice — multi-venue switcher in the nav, cinematic
hero, per-venue landing, upcoming events, VIP table requests, private-event enquiries,
gallery, FAQ, contact, socials. **Not** ticketing checkout, artist catalogue or LIV's
own hospitality partnerships.
For: Vardas (lounge & club, 5th floor Getu Commercial Building, Bole) and Vardas Venue
(premium event space) — one site at **vardasentertainment.com**.
Date: 2026-10-18
Method: clean-room. Structure and UX patterns only, from public search results. The
site itself returned HTTP 403 through this environment's proxy, so no page HTML,
scripts, network calls, copy or imagery were read or kept. All Vardas copy, photos,
logo and video are the client's own.

## Sources

| # | source | URL | notes |
| --- | --- | --- | --- |
| 1 | marketing home | https://www.livnightclub.com/ | title shows the two-location model: "Miami Beach and Las Vegas" |
| 2 | location landing (city 2) | https://www.livnightclub.com/las-vegas/ | each city has its own landing + nav section |
| 3 | sister venue (dayclub) | https://www.livnightclub.com/lasvegas-liv-beach/ | second brand under one roof → our "Vardas Venue" |
| 4 | event detail pattern | https://www.livnightclub.com/miami/event/EVE112156200020261018/50-cent/ | /city/event/{id}/{slug}; date, headliner, tickets, VIP tables |
| 5 | event detail w/ table tiers | https://www.livnightclub.com/las-vegas/event/EVE-BKE7XK/sidepiece/ | table locations with minimum spend shown per event |
| 6 | special-events hub | https://www.livnightclub.com/miami/special-events/miami-music-week-2026/ | multi-night programmes grouped |
| 7 | FAQ | https://www.livnightclub.com/miami/faq/ | dress code, ID, table minimums, private events contact |
| 8 | artist landing | https://www.livnightclub.com/las-vegas-artists-dom-dolla/ | resident/headliner pages |
| 9 | client assets | logo PNG, "Vardas Venue" wordmark, venue banner, 2 Instagram accounts | supplied 2026-10-18 |

## Core loop

See what's on at a venue → request a VIP table (or a private event) → get confirmed by a host on the phone/chat.

## Screens

| ID | screen | route | purpose | key components | states seen |
| --- | --- | --- | --- | --- | --- |
| S01 | Home | / | brand film + choose a venue | video hero, venue switcher cards, events strip, socials, newsletter | video loading/poster, no events |
| S02 | Nav with venue dropdowns | global | jump into either venue | top bar, 2 dropdowns, Book CTA, mobile drawer | open, closed, mobile |
| S03 | Venue landing (club) | /vardas | the club's own front door | hero, tonight, events, tables CTA, info, IG feed | — |
| S04 | Events list | /vardas/events | upcoming nights | event cards (date, headliner, cover) | empty, filled |
| S05 | Event detail | /vardas/events/:slug | one night | hero, lineup, table CTA, policy | not found |
| S06 | VIP tables | /vardas/tables | request a table | zone tiers, request form | submitting, sent, error |
| S07 | FAQ | /vardas/faq | dress code, ID, minimums, rides | accordion | — |
| S08 | Venue landing (events space) | /venue | the second brand | hero banner, offerings, spaces, 360° slot, IG feed | — |
| S09 | Private-event enquiry | /venue/enquire | corporate / wedding / concert / party | typed form | submitting, sent, error |
| S10 | Gallery | /gallery | photos, filter by venue | masonry grid, lightbox, filter | empty |
| S11 | Contact | /contact | every channel | WhatsApp, Telegram, email, map, form | sent |
| S12 | Floating support | global | instant human contact | WhatsApp + Telegram + email dock | collapsed, open |
| S13 | Footer | global | venues, links, socials, legal | link columns, newsletter, IG | — |

## Flows

```
F01 Guest books a VIP table for Saturday
    S01 -> S02 (Vardas ▾ → VIP tables) -> S06 form -> sent (email + WhatsApp hand-off)
    happy path clicks: 4 (+ form fields)
    edge: no backend configured (mailto fallback), invalid phone, party > zone capacity
F02 Company enquires about a launch at Vardas Venue
    S01 -> venue card -> S08 -> "Enquire" -> S09 (type=corporate) -> sent
    happy path clicks: 3
    edge: date in the past, very large guest count
F03 Guest asks a quick question at 23:40
    any page -> S12 dock -> WhatsApp (prefilled) | Telegram
    happy path clicks: 2
F04 Guest checks what's on and how to dress
    S01 events strip -> S05 -> S07 FAQ
F05 Fan follows the brand
    S01/S03/S08 IG embed -> instagram.com/vardaslounge | /vardas_venue
```

## Components

| component | variants | states | used on |
| --- | --- | --- | --- |
| TopNav | transparent-over-hero, solid on scroll | dropdown open, mobile drawer | all |
| VenueDropdown | Vardas, Vardas Venue | open, hover, keyboard | S02 |
| VideoHero | full-bleed video, image fallback | loading/poster, reduced-motion | S01, S03, S08 |
| VenueCard | club, events space | hover zoom | S01 |
| EventCard | strip, list | past, upcoming, sold out | S01, S03, S04 |
| Form + Field | table, enquiry, contact, newsletter | idle, sending, sent, error | S06, S09, S11, S13 |
| SupportDock | collapsed, open | — | global |
| InstagramEmbed | profile | loading, blocked fallback | S01, S03, S08 |
| Gallery + Lightbox | filter by venue | open, next/prev | S10 |
| Accordion | — | open/closed | S07 |
| Button | gold solid, outline, ghost | hover, focus, disabled | all |

## Inferred data model

```
Venue        id (vardas | vardas-venue), name, kind (club | event-space), address, instagram
             evidence: sources 1–3 (two locations + sister venue)   confidence: high
Event        id, venue_id, slug, title, starts_at, lineup[], cover, dress_code, published
             evidence: sources 4–6                                   confidence: high
TableZone    id, venue_id, name, capacity, min_spend (per event)
             evidence: source 5 (table locations with minimums)      confidence: medium
TableRequest id, event_id?, zone_id, date, party_size, name, phone, email, notes, status
             evidence: S06 + source 5                                confidence: medium
Enquiry      id, venue_id, kind (corporate|wedding|concert|private), date, guests, budget, brief, status
             evidence: source 7 "private events team"                confidence: medium
Subscriber   email, created_at                                       confidence: guess
```

Relationships: Venue 1-n Event · Venue 1-n TableZone · Event 0-n TableRequest · Venue 1-n Enquiry.
Mapped onto the existing Vardas schema: events, zones, reservations, hire_enquiries (+ new subscribers).

## Feature matrix

See `features.csv`. Must: 16, should: 9, could: 5, skip: 4.

## Out of scope (cannot or should not be cloned)

- LIV's name, logo, photography, artist bookings, copy and ticketing partner — not ours.
- Paid ticketing checkout (needs an Ethiopian payment rail decision: Chapa / Telebirr).
- Celebrity artist pages — Vardas has no catalogue yet; artists portal exists instead.
- Hotel-resort integration (LIV sits inside a resort).

## Size

Screens 13, flows 5, entities 6. Hard parts: email delivery to a Gmail inbox without
exposing keys (Edge Function + Resend, mailto fallback); Instagram profile embeds
(Instagram may block framing — needs a graceful fallback); cinematic video weight on
Ethiopian mobile networks (poster-first, compressed loop). Size: **M** — the backend,
admin and data from the previous MVP are reused.

## Build result (2026-10-18)

Weighted parity (must 3 / should 2 / could 1, skips excluded): **95%** — every *must* row shipped.
Open: Amharic toggle, event countdown, multi-night programme hub, public artist profiles.
E2E: 28/28 flow checks pass (Playwright; F01–F05, nav, gallery, redirects, mobile drawer, no console errors).
