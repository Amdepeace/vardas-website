import { CTA, Field, Hero, Kicker, SectionHead } from "../components/primitives";

const STANDARDS = [
  ["Named floor manager", "One person owns the room every night. Guests can ask for them by name."],
  ["No pressure selling", "No commission on bottles. Ever. We pay for hospitality, not upsells."],
  ["Trained on the pledge", "Every hire learns Your Night, Your Terms before their first shift."],
  ["Safety first", "Door and floor teams trained to intervene early and quietly."],
];

export function CareersPage({ onToast }) {
  return (
    <div className="page-enter page-enter-active">
      <Hero kicker="Careers & suppliers" title="Work on" em="the fifth floor." label="Careers hero · team briefing before service"
        intro="We were told our service wasn't good enough. Fixing that starts with who we hire and how we pay them. These are our standards — in public, so you can hold us to them." />
      <section className="density-sect max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20">
        <SectionHead kicker="Standards" title="What working here means." />
        <ul className="grid sm:grid-cols-2 gap-5">
          {STANDARDS.map(([t, b]) => <li key={t} className="border border-line bg-paper-2 p-6"><h3 className="font-display text-xl text-ink">{t}</h3><p className="text-sm text-grey-1 mt-2 leading-relaxed">{b}</p></li>)}
        </ul>
        <div className="mt-20 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5"><Kicker>Open roles</Kicker><p className="mt-4 text-sm text-grey-1">Roles are published from the admin console. Until then, tell us what you do.</p></div>
          <form className="md:col-span-7 grid sm:grid-cols-2 gap-5" onSubmit={(e) => { e.preventDefault(); onToast("Received — we reply within a week"); }}>
            <Field label="I am a"><select className="field-line"><option>Job applicant</option><option>Supplier</option></select></Field>
            <Field label="Name"><input className="field-line" required /></Field>
            <Field label="Phone (WhatsApp)"><input className="field-line" required /></Field>
            <Field label="Email"><input type="email" className="field-line" /></Field>
            <Field label="Message"><input className="field-line" placeholder="Role or products, experience, availability" /></Field>
            <div className="sm:col-span-2"><CTA type="submit" variant="solid">Send →</CTA></div>
          </form>
        </div>
      </section>
    </div>
  );
}
