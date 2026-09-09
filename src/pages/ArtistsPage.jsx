import { useState } from "react";
import { CTA, Field, Hero, Kicker } from "../components/primitives";
import { backendReady, enquire } from "../lib/api";

export function ArtistsPage({ onToast }) {
  const [f, setF] = useState({ name: "", kind: "dj", genres: "", links: "", phone: "", date: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((d) => ({ ...d, [k]: e.target.value }));
  async function submit(e) {
    e.preventDefault(); setBusy(true);
    try {
      if (backendReady) await enquire({ kind: "artist", name: f.name, act_kind: f.kind, genres: f.genres.split(",").map((g) => g.trim()).filter(Boolean), links: f.links ? { url: f.links } : {}, phone: f.phone, requested_date: f.date || undefined });
      onToast(backendReady ? "Thanks — the events team will reply" : "Preview mode — request not sent");
      setF({ name: "", kind: "dj", genres: "", links: "", phone: "", date: "" });
    } catch (ex) { onToast(ex.message); } finally { setBusy(false); }
  }
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
        <form className="md:col-span-7 grid sm:grid-cols-2 gap-5" onSubmit={submit}>
          <Field label="Act / name"><input className="field-line" required value={f.name} onChange={set("name")} /></Field>
          <Field label="Kind"><select className="field-line" value={f.kind} onChange={set("kind")}><option value="dj">DJ</option><option value="band">Band</option><option value="vocalist">Vocalist</option><option value="comedian">Comedian</option><option value="promoter">Promoter</option></select></Field>
          <Field label="Genres"><input className="field-line" placeholder="Ethio-jazz, amapiano…" value={f.genres} onChange={set("genres")} /></Field>
          <Field label="Link"><input className="field-line" placeholder="Instagram, SoundCloud, YouTube" value={f.links} onChange={set("links")} /></Field>
          <Field label="Phone (WhatsApp)"><input className="field-line" required value={f.phone} onChange={set("phone")} /></Field>
          <Field label="Requested date"><input type="date" className="field-line" value={f.date} onChange={set("date")} /></Field>
          <div className="sm:col-span-2"><CTA type="submit" variant="solid" disabled={busy}>{busy ? "Sending…" : "Request a date →"}</CTA></div>
        </form>
      </section>
    </div>
  );
}
