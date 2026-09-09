import { CTA, Hero, Placeholder, Price, SectionHead } from "../components/primitives";

// Starter calendar until events are published from the admin console.
const EVENTS = [
  { slug: "thursday-live", title: "Live Thursdays", kind: "live-music", when: "Every Thursday · 21:00", lineup: "Rotating Ethio-jazz and soul sets", cover: 0, dress: "Smart casual" },
  { slug: "friday-club", title: "Fifth Floor Fridays", kind: "club-night", when: "Every Friday · 22:00 – late", lineup: "Resident DJs · Afrobeats, amapiano, house", cover: null, dress: "Smart · no sportswear" },
  { slug: "saturday-club", title: "Saturday Sessions", kind: "club-night", when: "Every Saturday · 22:00 – late", lineup: "Guest DJ announced weekly", cover: null, dress: "Smart" },
  { slug: "business-lunch", title: "Business Lunch", kind: "brunch", when: "Mon – Fri · 12:00 – 15:00", lineup: "Two-course set menu · quiet lounge · WiFi", cover: 0, dress: "—" },
];

export function EventsPage({ onReserve }) {
  return (
    <div className="page-enter page-enter-active">
      <Hero kicker="Events" title="What's on" em="this week." label="Events hero · live set"
        intro="Cover, lineup and dress code are published for every night. Cover is never charged at the door if it isn't listed here." />
      <section className="density-sect max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20">
        <ul className="divide-y divide-line border-y border-line">
          {EVENTS.map((e) => (
            <li key={e.slug} className="py-8 grid md:grid-cols-[200px,1fr,auto] gap-6 items-center">
              <Placeholder label={e.title} aspect="4/3" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">{e.when}</p>
                <h2 className="font-serif text-3xl text-night mt-1">{e.title}</h2>
                <p className="text-sm text-ink/70 mt-2">{e.lineup}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted mt-3">Dress · {e.dress}</p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-3">
                <Price>{e.cover === null ? "Cover announced weekly" : e.cover === 0 ? "No cover" : `Cover ETB ${e.cover}`}</Price>
                <CTA variant="ghost" onClick={() => onReserve({ service: e.kind === "brunch" ? "lunch" : e.kind === "club-night" ? "club" : "dinner" })}>Reserve</CTA>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-[12px] text-muted">Starter calendar. Published events replace this list once entered in the admin console.</p>
      </section>
    </div>
  );
}
