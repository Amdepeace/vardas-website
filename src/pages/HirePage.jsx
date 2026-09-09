import { useState } from "react";
import { CTA, Field, Hero, Kicker, Placeholder, Price, SectionHead } from "../components/primitives";
import { ZONES } from "../data/venue";

export function HirePage({ onNavigate, onToast }) {
  const [f, setF] = useState({ company: "", name: "", phone: "", kind: "corporate", date: "", guests: 40, zone: "private-1", brief: "" });
  const set = (k) => (e) => setF((d) => ({ ...d, [k]: e.target.value }));
  return (
    <div className="page-enter page-enter-active">
      <Hero kicker="Professional · events & private hire" title="Your launch." em="Our fifth floor." label="Hire hero · private room set for a launch"
        intro="Corporate nights, product launches, birthdays, weddings. Four zones with published capacity and minimums, a 360° walk-through of each, and a quote within 48 hours." />

      <section className="density-sect max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <SectionHead kicker="Zones" title="See the room before you book it." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ZONES.map((z) => (
            <div key={z.id} className="border border-line bg-paper-2">
              <Placeholder label={`${z.title} · 360°`} aspect="4/3" />
              <div className="p-5">
                <div className="flex justify-between items-baseline"><h3 className="font-display text-xl text-ink">{z.title}</h3><Price>up to {z.capacity}</Price></div>
                <p className="text-sm text-grey-1 mt-2 leading-relaxed">{z.blurb}</p>
                <p className="mt-3 label !tracking-[0.16em] text-grey-2">Minimum · published on request-to-quote</p>
                <button onClick={() => onNavigate("tours")} className="mt-3 label !tracking-[0.2em] text-red hover:text-ink">Walk through in 360° →</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <Kicker inverse>Request a quote</Kicker>
            <h2 className="font-display text-4xl mt-4 leading-tight">Tell us the night. We'll price it in 48 hours.</h2>
            <ul className="mt-8 space-y-3 text-sm text-paper/70">
              <li>· Published packages, no hidden service charge</li>
              <li>· Deposit by Chapa / Telebirr, hosted checkout</li>
              <li>· Own sound in the private room; DJ and live options</li>
              <li>· Business-lunch buyouts Monday to Friday</li>
            </ul>
          </div>
          <form className="md:col-span-7 grid sm:grid-cols-2 gap-5 [&_.field-line]:text-paper [&_.field-line]:border-paper/40 [&_label]:!text-paper/70"
            onSubmit={(e) => { e.preventDefault(); onToast("Enquiry noted — we reply within 48 hours"); }}>
            <Field label="Company"><input className="field-line" value={f.company} onChange={set("company")} /></Field>
            <Field label="Your name"><input className="field-line" required value={f.name} onChange={set("name")} /></Field>
            <Field label="Phone (WhatsApp)"><input className="field-line" required value={f.phone} onChange={set("phone")} /></Field>
            <Field label="Kind"><select className="field-line" value={f.kind} onChange={set("kind")}><option value="corporate">Corporate</option><option value="launch">Launch</option><option value="birthday">Birthday</option><option value="wedding">Wedding</option><option value="other">Other</option></select></Field>
            <Field label="Preferred date"><input type="date" className="field-line" value={f.date} onChange={set("date")} /></Field>
            <Field label="Guests"><input type="number" min="6" className="field-line" value={f.guests} onChange={set("guests")} /></Field>
            <Field label="Zone"><select className="field-line" value={f.zone} onChange={set("zone")}>{ZONES.map((z) => <option key={z.id} value={z.id}>{z.title} · up to {z.capacity}</option>)}</select></Field>
            <Field label="Brief"><input className="field-line" placeholder="Occasion, food, music, budget…" value={f.brief} onChange={set("brief")} /></Field>
            <div className="sm:col-span-2"><CTA type="submit" variant="brass">Request a quote →</CTA></div>
          </form>
        </div>
      </section>
    </div>
  );
}
