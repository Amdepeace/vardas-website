import { Link } from "react-router-dom";
import { Button, EventCard, Heading, InstagramEmbed, Label, Section, VideoHero } from "../components/vx";
import { VENUES } from "../data/site";
import { useEvents } from "../lib/events";
import { waLink } from "../lib/contact";

function VenueCard({ v, cta }) {
  return (
    <Link to={v.path} className="group relative block overflow-hidden aspect-[4/5] sm:aspect-[16/12] lg:aspect-[4/5] border border-edge vx-focus">
      <img src={v.card || v.image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-night/10" />
      <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10">
        <p className="vx-label text-gold">{v.kind}</p>
        <h3 className="vx-display text-[2.4rem] sm:text-[3.2rem] text-cream mt-3">{v.name}</h3>
        <p className="text-mute mt-3 max-w-sm">{v.tagline}</p>
        <span className="inline-flex items-center gap-3 mt-7 vx-label text-cream group-hover:text-gold transition-colors">{cta} <span className="w-10 h-px bg-current transition-all group-hover:w-16" /></span>
      </div>
    </Link>
  );
}

export function HomePage() {
  const { events } = useEvents();
  return (
    <div>
      <VideoHero label="Vardas Entertainment">
        <img src="/brand/vardas-logo.png" alt="Vardas" className="w-[240px] sm:w-[340px] h-auto drop-shadow-[0_8px_40px_rgba(226,169,59,.35)]" />
        <p className="vx-display-light text-cream/90 text-sm sm:text-base mt-10">Addis Ababa</p>
        <div className="gold-rule w-40 my-6" />
        <div className="flex flex-wrap justify-center gap-3">
          <Button to="/vardas/tables">Book a VIP table</Button>
          <Button to="/venue/enquire" variant="ghost">Plan an event</Button>
        </div>
        <a href="#venues" className="absolute bottom-8 left-1/2 -translate-x-1/2 vx-label !text-[0.58rem] text-mute hover:text-gold flex flex-col items-center gap-3">Scroll<span className="w-px h-10 bg-gradient-to-b from-gold to-transparent" /></a>
      </VideoHero>

      <Section id="venues" className="!pt-24">
        <Heading center label="Two rooms, one name" title="Choose your" gold="night" />
        <div className="grid lg:grid-cols-2 gap-5 mt-14">
          <VenueCard v={VENUES.vardas} cta="Enter Vardas" />
          <VenueCard v={VENUES.venue} cta="Explore Vardas Venue" />
        </div>
      </Section>

      <Section tone="raised">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Heading label="At Vardas" title="Upcoming" gold="nights" />
          <Button to="/vardas/events" variant="outline">All events</Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">{events.slice(0, 3).map((e) => <EventCard key={e.slug} e={e} />)}</div>
      </Section>

      <section className="relative overflow-hidden bg-night">
        <img src="/gallery/vardas-night-18.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-night via-night/85 to-night/30" />
        <div className="relative max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-14 py-24 md:py-32 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Label>VIP tables</Label>
            <h2 className="vx-display text-[2rem] sm:text-[3rem] text-cream mt-4">Your table, <span className="gold-text">held.</span></h2>
            <p className="text-mute mt-6 max-w-md leading-[1.9]">Club floor, lounge, terrace or the private room. Tell us the night and the party size — a host confirms by phone with the zone, any minimum and your arrival time. Bottle service only when you ask.</p>
            <div className="flex flex-wrap gap-3 mt-9"><Button to="/vardas/tables">Request a table</Button><Button href={waLink("Hi Vardas, I'd like to book a VIP table for ")} target="_blank" variant="ghost">WhatsApp a host</Button></div>
          </div>
          <ul className="grid grid-cols-2 gap-px bg-edge border border-edge">
            {[["Club floor", "6 – 12 guests"], ["Lounge", "4 – 10 guests"], ["Terrace", "4 – 8 guests"], ["Private room", "up to 24"]].map(([z, s]) => (
              <li key={z} className="bg-night/90 p-6"><p className="vx-display text-lg text-cream">{z}</p><p className="text-sm text-mute mt-2">{s}</p></li>
            ))}
          </ul>
        </div>
      </section>

      <Section>
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <Label>Vardas Venue</Label>
            <h2 className="vx-display text-[2rem] sm:text-[3rem] text-cream mt-4">Built for the <span className="gold-text">big night.</span></h2>
            <ul className="mt-8 border-t border-edge">
              {VENUES.venue.offerings.map(([t]) => <li key={t} className="border-b border-edge py-4 flex justify-between items-center"><span className="text-cream">{t}</span><span className="text-gold">→</span></li>)}
            </ul>
            <div className="mt-9"><Button to="/venue/enquire">Plan your event</Button></div>
          </div>
          <div className="lg:col-span-7"><img src="/brand/vardas-venue-wordmark.jpg" alt="Vardas Venue" loading="lazy" className="w-full border border-edge" /></div>
        </div>
      </Section>

      <Section tone="raised">
        <Heading center label="Follow the nights" title="On" gold="Instagram" />
        <div className="grid md:grid-cols-2 gap-5 mt-12">
          <InstagramEmbed handle={VENUES.vardas.instagram.handle} url={VENUES.vardas.instagram.url} title="Vardas — lounge & club" />
          <InstagramEmbed handle={VENUES.venue.instagram.handle} url={VENUES.venue.instagram.url} title="Vardas Venue — events" />
        </div>
      </Section>
    </div>
  );
}
