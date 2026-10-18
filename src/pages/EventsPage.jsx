import { useParams, Navigate } from "react-router-dom";
import { Button, EventCard, Heading, Label, PageHero, Section } from "../components/vx";
import { useEvents } from "../lib/events";
import { waLink } from "../lib/contact";

export function EventsPage() {
  const { slug } = useParams();
  const { events, live } = useEvents();
  if (slug) {
    const e = events.find((x) => x.slug === slug);
    if (!e) return <Navigate to="/vardas/events" replace />;
    return (
      <div>
        <PageHero image={e.image} label={`${e.kind} · ${e.date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} · ${e.time}`} title={e.title} intro={e.lineup.join(" · ")}>
          <Button to={`/vardas/tables?event=${e.slug}`}>Book a table for this night</Button>
          <Button href={waLink(`Hi Vardas, I'm coming to ${e.title} on ${e.date.toDateString()}.`)} target="_blank" variant="ghost">Ask on WhatsApp</Button>
        </PageHero>
        <Section>
          <dl className="grid sm:grid-cols-3 gap-px bg-edge border border-edge">
            {[["Doors", e.time], ["Cover", e.cover === null ? "Announced weekly" : e.cover === 0 ? "No cover" : `ETB ${e.cover}`], ["Dress", e.dress]].map(([k, v]) => (
              <div key={k} className="bg-night p-8"><dt className="vx-label text-gold">{k}</dt><dd className="vx-display text-xl text-cream mt-3">{v}</dd></div>
            ))}
          </dl>
          <p className="text-sm text-mute mt-8 max-w-2xl">Valid ID required. If a cover isn't listed here, it isn't charged at the door. Tables are confirmed by a host by phone.</p>
        </Section>
      </div>
    );
  }
  return (
    <div>
      <PageHero label="Vardas · programme" title="Upcoming" gold="events" intro="Live sets, resident DJs and guest nights on the fifth floor. Cover, lineup and dress code are published for every night." />
      <Section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{events.map((e) => <EventCard key={e.slug + e.date} e={e} />)}</div>
        {!live && <p className="text-xs text-mute-2 mt-8">Weekly programme shown. Specific nights and guest DJs appear here as they're announced.</p>}
      </Section>
    </div>
  );
}
