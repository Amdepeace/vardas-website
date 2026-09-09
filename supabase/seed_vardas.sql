-- Vardas seed — run after 0002_vardas_core.sql and 0003_rate_limit.sql.
-- Places come from src/data/places.json (Addis POI & Safety Guide, filtered).
-- Zones, menu sections and policies are STARTER rows for staff to replace.

insert into public.places (id, name, relation, circuit_role, category, neighborhood, highlights, safety_notes, safety_tier, rating, price_min_etb, price_max_etb, sources, published) values
  ('vardas', 'Vardas', 'self', null, 'Restaurant / Nightclub', 'Bole', 'Located on the 5th floor of Getu Commercial Building on Africa Avenue. Features international and traditional Ethiopian dishes (pizza, fish, beef, pasta), seasonal menus, hookah, beer, and liqueur. Known for interior design, live music, DJs, and outdoor seating.', 'Smoking allowed indoors. Be cautious of pressure to buy expensive liquor (up to ETB 19,200) and stay vigilant around security. High altitude may increase the effects of alcohol. Some reports of unprofessional staff.', 'self', 3.8, 1600, 19200, '{1,2,3,4,5}', true),
  ('atmosphere', 'Atmosphere', 'circuit', 'before', 'Cultural Center / Lounge', 'Bole Area', 'A cultural hub and pre-party spot known for late-night coffee, Iranian food (hummus), games, comedy shows, and events like Indian Cultural Day.', 'Welcoming atmosphere described as a hub for fun; recommended for any time of night. Use trusted drivers.', 'verified', null, null, null, '{1,6,7}', true),
  ('bole', 'Bole', 'district', null, 'Neighborhood / Business District', 'Bole', 'International business district near the airport; features modern infrastructure, expat-friendly amenities, international hotels, and chain restaurants.', 'Good night walking safety and excellent daytime safety. Decent lighting and security at night. English-speaking staff are common.', 'verified', 4.0, null, null, '{8}', true),
  ('kazanchis', 'Kazanchis', 'district', null, 'Neighborhood / Diplomatic District', 'Kazanchis', 'Diplomatic and professional hub featuring high-end restaurants, high security presence, and international standards.', 'Excellent daytime safety and good night safety. Lowest harassment risk in the city; recommended for being out late.', 'verified', 4.0, null, null, '{8}', true),
  ('midtown-ultra-lounge', 'Midtown Ultra Lounge', 'circuit', 'after', 'Nightclub / Lounge', null, 'Popular, "dope" spot for nightlife and dancing.', 'Watch alcohol consumption due to high altitude effects.', 'verified', null, null, null, '{1,3}', true),
  ('black-rose', 'Black Rose', 'circuit', 'before', 'Bar / Lounge', null, 'Chill, upscale spot for cocktails and professional socializing.', 'Quiet and professional environment.', 'verified', null, null, null, '{1}', true),
  ('monarch-hotel-360-lounge', 'Monarch Hotel 360 Lounge', 'circuit', 'before', 'Rooftop Lounge', null, 'Luxurious rooftop views featuring live DJs, cocktails, and a relaxed vibe.', 'Smart dress recommended. Avoid walking at night; use hotel taxis for transport.', 'verified', null, null, null, '{6}', true),
  ('jazzamba-lounge', 'Jazzamba Lounge', 'circuit', 'before', 'Jazz Lounge', 'Piazza', 'Historic hotspot inside the Taitu Hotel with a vintage ambiance; features up-and-coming Ethiopian jazz artists on weekends.', 'Located in a historic district; best to use a local guide for access and safe transport.', 'caution', null, null, null, '{6}', true),
  ('2000-habesha-cultural-club', '2000 Habesha Cultural Club', 'circuit', 'before', 'Cultural Club', null, 'High-energy venue featuring a mix of modern and traditional music, shoulder dancing, and audience participation.', 'High-energy environment; use trusted drivers or hotel taxis.', 'verified', null, null, null, '{6}', true),
  ('luna-lounge', 'Luna Lounge', 'circuit', 'after', 'Nightclub', null, 'Modern music venue with energetic DJs and a vibrant late-night crowd.', 'Stick to well-known clubs, dress smart, and use trusted transport.', 'caution', null, null, null, '{6}', true),
  ('illusion-lounge', 'Illusion Lounge', 'circuit', 'after', 'Lounge / Club', null, 'Also known as Catch; trendy and stylish venue featuring cocktails, music, and occasional live bands.', 'Recommended place to end the night. Stick to well-known venues for safety.', 'verified', null, null, null, '{6,3}', true),
  ('zoya', 'Zoya', 'circuit', 'event', 'Nightlife Event', null, 'Monthly event described as the "Mecca of house music" in Addis; features house, EDM, and techno.', 'Described as having an incredible, positive vibe.', 'verified', null, null, null, '{7}', true),
  ('wakanda', 'Wakanda', 'circuit', 'after', 'Nightclub', null, 'Popular nightclub noted for a high-energy "lit" atmosphere.', 'Part of the recommended local nightlife circuit.', 'verified', null, null, null, '{7}', true),
  ('upscale', 'Upscale', 'circuit', null, 'Lounge', null, 'Known for being a "chill" spot; currently closed as part of the "corridor development" project.', 'Temporarily closed with no relocation yet.', 'closed', null, null, null, '{3}', false),
  ('middletown', 'Middletown', 'in-building', null, 'Restaurant', 'Getu Commercial Center', 'Local dining establishment.', null, 'unverified', null, null, null, '{5}', true),
  ('tokuma-restaurant-no-1', 'Tokuma Restaurant No.1', 'in-building', null, 'Restaurant', 'Getu Commercial Center', 'Local dining establishment.', null, 'unverified', null, null, null, '{5}', true),
  ('yesitota-restaurant-gift', 'Yesitota Restaurant & Gift', 'in-building', null, 'Restaurant', 'Getu Commercial Center', 'Local dining establishment combined with a gift shop.', null, 'unverified', null, null, null, '{5}', true),
  ('fast-food', 'Fast food', 'in-building', null, 'Restaurant', 'Getu Commercial Center', 'Quick-service food outlet.', null, 'unverified', null, null, null, '{5}', true),
  ('black-pearl', 'Black Pearl', 'circuit', null, 'Club/Lounge', null, 'Nightlife spot for socializing with friends.', null, 'unverified', null, null, null, '{3}', true),
  ('cage', 'Cage', 'circuit', null, 'Club/Lounge', null, 'Local nightlife spot.', null, 'unverified', null, null, null, '{3}', true),
  ('flirt', 'Flirt', 'circuit', null, 'Club', null, 'One of the older, established clubs in the city.', null, 'unverified', null, null, null, '{3}', true),
  ('palmy', 'Palmy', 'circuit', null, 'Club/Lounge', null, 'Local nightlife spot.', null, 'unverified', null, null, null, '{3}', true),
  ('v-lounge', 'V Lounge', 'circuit', null, 'Lounge', null, 'Local nightlife spot.', null, 'unverified', null, null, null, '{3}', true),
  ('surrender', 'Surrender', 'circuit', null, 'Club/Lounge', null, 'Local nightlife spot.', null, 'unverified', null, null, null, '{3}', true)
on conflict (id) do update set name = excluded.name, relation = excluded.relation, circuit_role = excluded.circuit_role,
  category = excluded.category, neighborhood = excluded.neighborhood, highlights = excluded.highlights,
  safety_notes = excluded.safety_notes, safety_tier = excluded.safety_tier, rating = excluded.rating,
  price_min_etb = excluded.price_min_etb, price_max_etb = excluded.price_max_etb, sources = excluded.sources, updated_at = now();

insert into public.zones (id, title, smoking_allowed, capacity, min_spend_etb, tour_slug) values
  ('terrace',    'Terrace',        true,  80,  null, 'terrace'),
  ('lounge',     'Lounge',         false, 60,  null, 'lounge'),
  ('club-floor', 'Club floor',     false, 200, null, 'club-floor'),
  ('private-1',  'Private room I', false, 24,  null, 'private-1')
on conflict (id) do nothing;

insert into public.menu_sections (id, title, sort_order, service) values
  ('kitchen', 'Kitchen',                    1, 'all'),
  ('grill',   'Grill & fish',               2, 'all'),
  ('lunch',   'Business lunch',             3, 'lunch'),
  ('hookah',  'Hookah',                     4, 'all'),
  ('beer',    'Beer',                       5, 'all'),
  ('spirits', 'Spirits by the glass',       6, 'all'),
  ('bottles', 'Bottles (on request only)',  7, 'club')
on conflict (id) do nothing;

-- No starter menu_items on purpose: the trust pledge means no item is shown
-- without its real price. Staff enter the card in the admin console (Phase 1).

insert into public.policies (slug, title, body_md, published) values
  ('no-pressure',      'No pressure, ever',   'Every price on this site is the price you pay. Bottle service is available only when you ask for it, and its minimum is printed on the zone page. Ask for a bill preview at any time.', true),
  ('smoke-free-zones', 'Smoke-free zones',    'The lounge and club floor are smoke-free. Hookah and smoking are on the terrace, in marked areas only.', true),
  ('staff-standards',  'Our staff standards', 'A named floor manager is on duty every night. Every team member is trained on our pledge. Feedback is answered within 24 hours.', true),
  ('altitude',         'You are at 2,355 m',  'Addis Ababa sits at 2,355 m. Alcohol works faster and harder here. Water is free, always — just ask.', true),
  ('ride-home',        'A safe ride home',    'We work only with vetted drivers and partners. Ask any staff member, scan the table QR, or tick "ride home" when you reserve.', true),
  ('womens-safety',    'Women''s safety',     'Our door and floor teams are trained to intervene. If anyone makes you uncomfortable, tell any staff member — we will handle it quietly and immediately.', true)
on conflict (slug) do update set title = excluded.title, body_md = excluded.body_md, published = excluded.published, updated_at = now();
