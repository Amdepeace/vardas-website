-- OPTIONAL: sample guests + bookings so the admin console isn't empty.
-- Run AFTER 0001_initial.sql, in the Supabase SQL editor.
-- Safe to re-run after `delete from bookings; delete from guests;`.

insert into public.guests (full_name, email, phone, country, is_vip, loyalty_tier, total_stays) values
  ('Hana Tesfaye',    'hana.t@example.com',     '+251 911 234 567',  'Ethiopia',      false, 'bronze',   1),
  ('Marcus Brown',    'mbrown@example.com',     '+1 415 555 0142',   'United States', true,  'platinum', 12),
  ('Liu Wei',         'liu.wei@example.com',    '+86 138 0013 8000', 'China',         false, 'gold',     4),
  ('Adaeze Okonkwo',  'adaeze.o@example.com',   '+234 803 555 0190', 'Nigeria',       false, null,       1),
  ('Sofia Ricci',     's.ricci@example.com',    '+39 339 555 0123',  'Italy',         true,  'gold',     6),
  ('Ahmed Al-Sayed',  'ahmed.s@example.com',    '+971 50 555 0123',  'United Arab Emirates', false, 'bronze', 2),
  ('Yohannes Bekele', 'y.bekele@example.com',   '+251 911 555 0188', 'Ethiopia',      false, null,       1);

-- Sample bookings spanning past / current / future
insert into public.bookings (ref, guest_id, room_id, checkin, checkout, status, adults, children, total_etb, source, special_requests)
select
  v.ref,
  (select id from public.guests where full_name = v.guest limit 1),
  (select id from public.rooms where number = v.room_no limit 1),
  v.checkin::date,
  v.checkout::date,
  v.status,
  v.adults,
  v.children,
  v.total_etb,
  v.source,
  v.notes
from (values
  ('BEL-10001', 'Hana Tesfaye',    '101', (current_date - 1)::text,  (current_date + 2)::text,  'checked_in', 1, 0, 16500,  'direct',  'Late check-in, vegetarian dinner'),
  ('BEL-10002', 'Marcus Brown',    '401', current_date::text,        (current_date + 3)::text,  'checked_in', 2, 0, 42000,  'direct',  'Anniversary — champagne on arrival'),
  ('BEL-10003', 'Liu Wei',         '201', (current_date + 1)::text,  (current_date + 5)::text,  'confirmed',  2, 1, 30000,  'ota',     null),
  ('BEL-10004', 'Adaeze Okonkwo',  '301', (current_date + 2)::text,  (current_date + 4)::text,  'pending',    2, 0, 13600,  'phone',   'Twin beds confirmed'),
  ('BEL-10005', 'Sofia Ricci',     '202', (current_date + 3)::text,  (current_date + 7)::text,  'confirmed',  2, 0, 30000,  'direct',  'Quiet room please'),
  ('BEL-10006', 'Hana Tesfaye',    '102', (current_date - 5)::text,  (current_date - 3)::text,  'checked_out',1, 0, 11000,  'direct',  null),
  ('BEL-10007', 'Marcus Brown',    '401', (current_date - 10)::text, (current_date - 7)::text,  'checked_out',2, 0, 42000,  'direct',  null),
  ('BEL-10008', 'Ahmed Al-Sayed',  '202', (current_date + 6)::text,  (current_date + 9)::text,  'pending',    1, 0, 22500,  'phone',   'Late arrival, 23:00'),
  ('BEL-10009', 'Yohannes Bekele', '102', (current_date - 2)::text,  current_date::text,         'checked_out',1, 0, 11000,  'walk-in', null)
) as v(ref, guest, room_no, checkin, checkout, status, adults, children, total_etb, source, notes);
