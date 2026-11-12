import { Link } from "react-router-dom";
import { Button, EventCard, Heading, InstagramEmbed, Section, VideoHero } from "../components/vx";
import { Reveal } from "../components/Reveal";
import { VENUES } from "../data/site";
import { useEvents } from "../lib/events";

export function HomePage() {
  const { events } = useEvents();
  return (
    <div>
      <VideoHero label="Vardas" />

      <Section>
        <Reveal><Heading as="h1" size="lg" title="Addis Ababa's night, on the fifth floor" intro="Vardas is the lounge and club above Africa Avenue in Bole — live bands, resident DJs and a laser-lit floor, four nights a week. Vardas Venue is our event space at Welo Sefer for concerts, corporate nights, weddings and private parties." /></Reveal>
        <Reveal><div className="flex flex-wrap justify-center gap-3 mt-9"><Button to="/vardas/events">Upcoming events</Button><Button to="/vardas/tables" variant="outline">Reserve a table</Button></div></Reveal>
      </Section>

      <Section tone="raised" className="!py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <h2 className="vx-display text-[1.5rem] sm:text-[2rem]">Upcoming events</h2>
          <Link to="/vardas/events" className="vx-link vx-label">View all →</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">{events.slice(0, 4).map((e, i) => <Reveal key={e.slug} delay={i * 80}><EventCard e={e} /></Reveal>)}</div>
      </Section>

      <section className="grid md:grid-cols-2">
        {[[VENUES.vardas, "/media/vardas-hero-poster.jpg", "Enter Vardas"], [VENUES.venue, "/media/venue-hero-poster.jpg", "Explore the venue"]].map(([v, img, cta]) => (
          <Link key={v.id} to={v.path} className="group relative block h-[60vh] min-h-[380px] overflow-hidden vx-focus">
            <img src={img} alt="" loading="lazy" className="vx-card-img absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-ink/55 group-hover:bg-ink/35 transition-colors duration-500" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <p className="vx-label text-grey-4">{v.kind}</p>
              <h2 className="vx-display text-[2rem] sm:text-[2.8rem] mt-2">{v.name}</h2>
              <span className="vx-label mt-5 inline-flex items-center gap-2">{cta} <span className="transition-transform group-hover:translate-x-1.5">→</span></span>
            </div>
          </Link>
        ))}
      </section>

      <Section>
        <Reveal><Heading title="Follow the night" intro="This week's line-ups and last night's photos, on Instagram." /></Reveal>
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <InstagramEmbed handle={VENUES.vardas.instagram.handle} url={VENUES.vardas.instagram.url} title="Vardas — lounge & club" />
          <InstagramEmbed handle={VENUES.venue.instagram.handle} url={VENUES.venue.instagram.url} title="Vardas Venue — events" />
        </div>
      </Section>
    </div>
  );
}
