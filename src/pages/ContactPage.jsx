import { CTA, Hero, Kicker } from "../components/primitives";
import { VENUE } from "../data/venue";

export function ContactPage({ onReserve, onNavigate }) {
  return (
    <div className="page-enter page-enter-active">
      <Hero kicker="Contact" title="Talk to" em="a person." label="Contact hero · host desk"
        intro="WhatsApp is fastest. Every message is answered by the floor team, not a bot — unless you ask our host Selam, who says so." />
      <section className="density-sect max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20 grid md:grid-cols-3 gap-10">
        <div><Kicker>WhatsApp & phone</Kicker><p className="font-mono text-lg text-ink mt-4">{VENUE.whatsapp}</p><p className="text-sm text-grey-1 mt-2">Reservations, rides home, feedback.</p></div>
        <div><Kicker>Hours</Kicker><ul className="mt-4 space-y-2 text-sm text-grey-1">{VENUE.hours.map((h) => <li key={h.label}><b className="text-ink">{h.label}</b><br />{h.time}</li>)}</ul></div>
        <div><Kicker>Address</Kicker><p className="mt-4 text-sm text-grey-1 leading-relaxed">{VENUE.address}</p><button onClick={() => onNavigate("getting-here")} className="mt-3 label !tracking-[0.2em] text-red hover:text-ink">Getting here →</button></div>
        <div className="md:col-span-3 flex flex-wrap gap-3 pt-6 border-t border-line"><CTA variant="brass" onClick={() => onReserve()}>Reserve a table</CTA><CTA variant="ghost" onClick={() => onNavigate("hire")}>Enquire about private hire</CTA></div>
      </section>
    </div>
  );
}
