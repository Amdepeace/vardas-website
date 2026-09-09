import { CTA, Field, Hero, Kicker, SectionHead } from "../components/primitives";

export function ArtistsPage({ onToast }) {
  return (
    <div className="page-enter page-enter-active">
      <Hero kicker="Professional · artists & promoters" title="Play the" em="fifth floor." label="Artists hero · live band on the lounge stage"
        intro="DJs, bands, vocalists, comedians, promoters. Tech specs and rider are public; dates are requested here and answered by the events team." />
      <section className="density-sect max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5 space-y-8">
          <div>
            <Kicker>Rooms & sound</Kicker>
            <ul className="mt-4 text-sm text-grey-1 space-y-2 leading-relaxed">
              <li>· Lounge stage — live sets, up to 60 seated</li>
              <li>· Club floor — DJ booth, up to 200 standing</li>
              <li>· Private room — own PA, closed-door showcases</li>
              <li>· Tech rider and stage plan: published on request in Phase 4</li>
            </ul>
          </div>
          <div>
            <Kicker>Co-hosted nights</Kicker>
            <p className="mt-4 text-sm text-grey-1 leading-relaxed">Promoters can pitch a monthly night. Door split, published cover, and our pledge applies to your guests too — no bottle pressure, ever.</p>
          </div>
        </div>
        <form className="md:col-span-7 grid sm:grid-cols-2 gap-5" onSubmit={(e) => { e.preventDefault(); onToast("Thanks — the events team will reply"); }}>
          <Field label="Act / name"><input className="field-line" required /></Field>
          <Field label="Kind"><select className="field-line"><option>DJ</option><option>Band</option><option>Vocalist</option><option>Comedian</option><option>Promoter</option></select></Field>
          <Field label="Genres"><input className="field-line" placeholder="Ethio-jazz, amapiano…" /></Field>
          <Field label="Links"><input className="field-line" placeholder="Instagram, SoundCloud, YouTube" /></Field>
          <Field label="Phone (WhatsApp)"><input className="field-line" required /></Field>
          <Field label="Requested date"><input type="date" className="field-line" /></Field>
          <div className="sm:col-span-2"><CTA type="submit" variant="solid">Request a date →</CTA></div>
        </form>
      </section>
    </div>
  );
}
