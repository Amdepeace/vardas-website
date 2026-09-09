import { CTA, Hero, Kicker, SectionHead, Tier } from "../components/primitives";
import { VENUE } from "../data/venue";
import places from "../data/places.json";

const bole = places.places.find((p) => p.id === "bole");
const building = places.places.filter((p) => p.relation === "in-building");

/** Schematic of the block until MapLibre lands in Phase 2. Bole-centred, Vardas as origin. */
function BlockMap() {
  return (
    <div className="relative w-full aspect-[4/3] bg-ink border border-line overflow-hidden text-paper">
      <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full">
        {Array.from({ length: 14 }).map((_, i) => <line key={`v${i}`} x1={i * 30} y1="0" x2={i * 30} y2="300" stroke="#1e1e1e" strokeWidth=".6" />)}
        {Array.from({ length: 10 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 30} x2="400" y2={i * 30} stroke="#1e1e1e" strokeWidth=".6" />)}
        <path d="M0 150 L400 130" stroke="#E84040" strokeWidth="3" opacity=".9" />
        <text x="8" y="142" fontFamily="Inter" fontSize="9" fill="#EF6B6B" letterSpacing="2">AFRICA AVENUE</text>
        <rect x="170" y="90" width="60" height="42" fill="#E84040" opacity=".18" stroke="#E84040" strokeWidth="1" />
        <text x="176" y="84" fontFamily="Inter" fontSize="8" fill="#F8F8F6" letterSpacing="1.5">GETU COMMERCIAL</text>
        <g transform="translate(200,111)"><circle r="16" fill="#E84040" opacity=".2" /><circle r="8" fill="#E84040" opacity=".4" /><circle r="3" fill="#F8F8F6" /></g>
        <text x="216" y="116" fontFamily="Inter" fontWeight="700" fontSize="12" fill="#F8F8F6">Vardas · 5F</text>
        <g transform="translate(340,240)"><circle r="5" fill="none" stroke="#888888" strokeWidth="1" /><text x="-52" y="18" fontFamily="Inter" fontSize="8" fill="#888888" letterSpacing="1.5">BOLE INTL · 9 MIN</text></g>
        <text x="8" y="290" fontFamily="Inter" fontSize="8" fill="#888888" letterSpacing="1.5">SCHEMATIC · LIVE MAP IN PHASE 2</text>
      </svg>
    </div>
  );
}

export function GettingHerePage({ onReserve }) {
  return (
    <div className="page-enter page-enter-active">
      <Hero kicker="Getting here · and home" title="Fifth floor," em="Africa Avenue." label="Getting here hero · building entrance at night"
        intro={`${VENUE.address}. Lift from the street entrance. Nine minutes from Bole International. Bole is rated the city's best district for walking at night — and we still book your ride home.`} />
      <section className="density-sect max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-7"><BlockMap /></div>
        <div className="md:col-span-5 space-y-8">
          <div>
            <Kicker>Arriving</Kicker>
            <ul className="mt-4 space-y-3 text-sm text-grey-1 leading-relaxed">
              <li><b className="text-ink">Entrance</b> — Africa Avenue side of the Getu Commercial Building; lift to the 5th floor.</li>
              <li><b className="text-ink">Drop-off</b> — kerbside at the entrance; tell your driver "Getu building, Vardas".</li>
              <li><b className="text-ink">Parking</b> — building parking; ask the door team on arrival.</li>
              <li><b className="text-ink">From the airport</b> — about 9 minutes by car along Africa Avenue.</li>
            </ul>
          </div>
          <div className="border border-line bg-paper-2 p-5">
            <div className="flex items-center justify-between"><Kicker>Bole after dark</Kicker><Tier tier={bole.safety_tier} /></div>
            <p className="mt-3 text-sm text-grey-1 leading-relaxed">{bole.safety_notes}</p>
            <p className="mt-2 text-[11px] text-grey-2">Source: published safety guide · rating {bole.rating}/5</p>
          </div>
          <div className="border border-ink bg-ink text-paper p-6">
            <Kicker inverse>Going home</Kicker>
            <p className="mt-3 text-sm text-paper/75 leading-relaxed">Vetted drivers and partner apps only. Ask any staff member, scan the table QR, or tick "ride home" when you reserve. The driver gets your first name and the pickup — nothing else.</p>
            <CTA variant="brass" className="mt-5" onClick={() => onReserve({ ride: true })}>Reserve with a ride home</CTA>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper-2">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-16">
          <SectionHead kicker="In the building" title="Getu Commercial Center, floor by floor." intro="Neighbours in the same building — useful if you're early, or hungry before the club." />
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {building.map((p) => (
              <li key={p.id} className="border border-line bg-paper p-5">
                <h3 className="font-display text-lg text-ink">{p.name}</h3>
                <p className="label !tracking-[0.16em] text-grey-2 mt-1">{p.category}</p>
                <p className="text-sm text-grey-1 mt-2 leading-relaxed">{p.highlights}</p>
              </li>
            ))}
            <li className="border border-red bg-ink text-paper p-5"><h3 className="font-display text-lg">Vardas</h3><p className="label !tracking-[0.16em] text-red-soft mt-1">5th floor · terrace</p><p className="text-sm text-paper/70 mt-2">You're looking for us.</p></li>
          </ul>
          <div className="mt-10 flex flex-wrap gap-6 label !tracking-[0.2em] text-grey-2">
            {VENUE.emergency.map((e) => <span key={e.label}>{e.label} · <span className="text-ink">{e.number}</span></span>)}
          </div>
        </div>
      </section>
    </div>
  );
}
