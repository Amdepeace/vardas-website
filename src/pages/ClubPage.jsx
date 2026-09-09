import { CTA, Hero, Kicker, Placeholder, SectionHead, Tier } from "../components/primitives";
import places from "../data/places.json";

const circuit = places.places.filter((p) => p.relation === "circuit" && p.safety_tier !== "closed");
const before = circuit.filter((p) => p.circuit_role === "before");
const after = circuit.filter((p) => p.circuit_role === "after");
const rest = circuit.filter((p) => !p.circuit_role);

function Card({ p }) {
  return (
    <li className="border border-line bg-paper-2 p-5 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl text-ink">{p.name}</h3>
        <Tier tier={p.safety_tier} />
      </div>
      <p className="label !tracking-[0.16em] text-muted">{p.category}{p.neighborhood ? ` · ${p.neighborhood}` : ""}</p>
      <p className="text-sm text-grey-1 leading-relaxed">{p.highlights}</p>
      {p.safety_notes && <p className="text-[12.5px] text-grey-2 leading-relaxed border-l-2 border-line pl-3 mt-1">{p.safety_notes}</p>}
    </li>
  );
}

export function ClubPage({ onNavigate, onReserve }) {
  return (
    <div className="page-enter page-enter-active">
      <Hero kicker="Club · Thu – Sat · from 22:00" title="The fifth floor" em="after dark." label="Club hero · DJ booth"
        intro="DJs and live music above Africa Avenue. Smart dress. Smoke-free floor. Cover, lineup and any minimum published before you arrive — and a vetted ride home when you leave.">
        <CTA variant="brass" onClick={() => onReserve({ service: "club", zone: "club-floor", time: "22:30" })}>Reserve for the club →</CTA>
        <CTA variant="ghost-light" onClick={() => onNavigate("events")}>What's on</CTA>
      </Hero>

      <section className="density-sect max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <SectionHead kicker="The Bole night" title="Before Vardas. After Vardas. Home." intro="Bole is the safest district in the city after dark — decent lighting, security, English spoken. This is the circuit around us, with what the guides say about each place, unedited. We're the anchor: start here, end here, and let us book the ride." />
        <div className="grid lg:grid-cols-3 gap-10">
          <div>
            <Kicker>Before · dinner & drinks</Kicker>
            <ul className="mt-5 space-y-4">{before.map((p) => <Card key={p.id} p={p} />)}</ul>
          </div>
          <div className="border-y lg:border-y-0 lg:border-x border-line py-8 lg:py-0 lg:px-10 flex flex-col">
            <Kicker>22:00 · Vardas</Kicker>
            <Placeholder label="Club floor · midnight" aspect="4/5" className="mt-5" />
            <p className="mt-5 text-sm text-grey-1 leading-relaxed">Fifth floor, Getu Commercial Building. Lift from the Africa Avenue entrance. Smart dress; no smoking on the floor. Ask for the floor manager by name.</p>
            <CTA variant="solid" className="mt-6" onClick={() => onNavigate("getting-here")}>Getting here safely</CTA>
          </div>
          <div>
            <Kicker>After · late</Kicker>
            <ul className="mt-5 space-y-4">{after.map((p) => <Card key={p.id} p={p} />)}</ul>
          </div>
        </div>
        <div className="mt-16">
          <Kicker>Also on the circuit · not yet verified by our team</Kicker>
          <ul className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{rest.map((p) => <Card key={p.id} p={p} />)}</ul>
          <p className="mt-6 text-[12px] text-muted max-w-2xl">Verified / caution / unverified come from published guides and travellers' reports; Vardas staff visit and re-rate the circuit monthly. Tell us if something has changed.</p>
        </div>
      </section>
    </div>
  );
}
