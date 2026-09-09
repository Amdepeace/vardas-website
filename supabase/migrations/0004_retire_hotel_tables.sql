-- Retire the hotel-era tables from 0001 now that the Vardas schema (0002) is live.
-- Export anything you need first; this is destructive.
drop table if exists public.bookings cascade;
drop table if exists public.guests cascade;
drop table if exists public.rooms cascade;
