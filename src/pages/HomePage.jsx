import { CTA, Hero, Kicker, Placeholder, Price, Reveal, SectionHead } from "../components/primitives";
import { POLICIES, VENUE, ZONES } from "../data/venue";
import places from "../data/places.json";

const facts = places.vardas_facts;

export function HomePage({ onNavigate, onReserve }) {
  return (
    <div className="page-enter page-enter-active">
      <Hero tall kicker="Vardas · Bole · Addis Ababa" title="Fifth floor." em="Your terms."
        label="Home hero · terrace at dusk" caption="Wide shot from the terrace over Africa Avenue at blue hour; brass lamps just on."
        intro="Kitchen, terrace, hookah, live music and DJs above Africa Avenue — with every price published, smoke-free rooms, and a safe ride home.">
        <CTA variant="brass" onClick={() => onReserve()}>Reserve a table →</CTA>
        <CTA variant="ghost-light" onClick={() => onNavigate("menu")}>See the menu &amp; prices</CTA>
      </Hero>

      {/* The three faces */}
      <section className="density-sect max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <SectionHead kicker="One address, three nights" title="Lunch with a client. Dinner on the terrace. The club at midnight." />
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { id: "menu", k: "Restaurant & lounge", t: "Kitchen and terrace", b: "International and Ethiopian dishes, seasonal menus, hookah on the terrace. Business lunch Monday to Friday.", img: "Lounge interior" },
            { id: "club", k: "Club", t: "Thursday to Saturday", b: "DJs and live music on the fifth floor. The anchor of the Bole night — and the safest way home from it.", img: "Club floor lights" },
            { id: "hire", k: "Professional", t: "Events & private hire", b: "Launches, birthdays, corporate nights. Four zones, published minimums, and a 360° walk-through before you book.", img: "Private room set for dinner" },
          ].map((c, i) => (
            <Reveal key={c.id} delay={i * 100}>
              <button onClick={() => onNavigate(c.id)} className="text-left group w-full">
                <Placeholder label={c.img} aspect="4/5" />
                <Kicker className="mt-5">{c.k}</Kicker>
                <h3 className="font-serif text-2xl mt-2 text-night group-hover:text-brass transition-colors">{c.t}</h3>
                <p className="mt-2 text-sm text-ink/70 leading-relaxed">{c.b}</p>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-night text-paper">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-5">
            <Kicker className="!text-brass-soft">Your night, your terms</Kicker>
            <h2 className="font-serif text-4xl md:text-6xl leading-[1] mt-4">We heard what people said about us.</h2>
            <p className="mt-6 text-paper/70 max-w-md leading-relaxed">
              Reviews of Vardas praised the design, the music and the food — and criticised the pressure to buy bottles, the smoke, and the service. So we wrote it down and changed it, in public.
            </p>
            <CTA variant="ghost-light" className="mt-8" onClick={() => onNavigate("your-terms")}>Read the pledge</CTA>
          </div>
          <ul className="md:col-span-6 md:col-start-7 divide-y divide-paper/10">
            {POLICIES.slice(0, 4).map((p) => (
              <li key={p.slug} className="py-5 grid grid-cols-[auto,1fr] gap-4">
                <span className="material-symbols-outlined text-brass mt-0.5">check_circle</span>
                <div>
                  <h3 className="font-serif text-xl">{p.title}</h3>
                  <p className="text-sm text-paper/65 mt-1 leading-relaxed">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Zones */}
      <section className="density-sect max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <SectionHead kicker="The rooms" title="Four zones. Walk through them before you come." intro="Every zone has a 360° tour, a published capacity, and — where one applies — a published minimum. No surprises at the door." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ZONES.map((z) => (
            <button key={z.id} onClick={() => onNavigate("tours")} className="text-left group border border-line bg-paper-2 hover:border-brass transition-colors">
              <Placeholder label={`${z.title} · 360°`} aspect="4/3" />
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl text-night">{z.title}</h3>
                  <Price>{z.capacity} seats</Price>
                </div>
                <p className="mt-2 text-sm text-ink/70 leading-relaxed">{z.blurb}</p>
                <p className={`mt-3 font-mono text-[10px] uppercase tracking-[0.18em] ${z.smoking ? "text-ember" : "text-terrace"}`}>{z.smoking ? "Smoking · marked areas" : "Smoke-free"}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Facts & getting here */}
      <section className="border-y border-line bg-paper-2">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-16 grid md:grid-cols-4 gap-8">
          {[
            ["Where", VENUE.address],
            ["Spend", `${facts.spend_range_etb ? `ETB ${facts.spend_range_etb[0].toLocaleString()} – ${facts.spend_range_etb[1].toLocaleString()}` : "Published on the menu"} · every price on the menu`],
            ["Altitude", `${VENUE.altitude_m.toLocaleString()} m · water is free`],
            ["Home", "Vetted drivers and partners · ask any staff member"],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brass">{k}</p>
              <p className="mt-2 text-sm text-ink/80 leading-relaxed">{v}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
