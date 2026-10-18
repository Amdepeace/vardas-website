import { Button, PageHero, Section } from "../components/vx";
import { POLICIES } from "../data/venue";
export function YourTermsPage() {
  return (
    <div>
      <PageHero label="Vardas · your night, your terms" title="What guests told us." gold="What we changed." intro="Reviews praised the room, the music and the food — and named four problems. Here they are, with our answer to each." />
      <Section>
        <ol className="border-t border-edge max-w-5xl">
          {POLICIES.filter((p) => p.answers).map((p) => (
            <li key={p.slug} className="border-b border-edge py-10 grid md:grid-cols-2 gap-8">
              <div><p className="vx-label text-mute-2">They said</p><p className="font-serif italic text-[1.5rem] text-quote mt-3 leading-snug">“{p.answers}”</p></div>
              <div><p className="vx-label text-gold">We do</p><p className="vx-display text-xl text-cream mt-3">{p.title}</p><p className="text-mute mt-3 leading-relaxed">{p.body}</p></div>
            </li>
          ))}
        </ol>
        <div className="grid md:grid-cols-2 gap-5 mt-14 max-w-5xl">
          {POLICIES.filter((p) => !p.answers).map((p) => <div key={p.slug} className="bg-night-2 border border-edge p-7"><p className="vx-display text-lg text-cream">{p.title}</p><p className="text-sm text-mute mt-3 leading-relaxed">{p.body}</p></div>)}
        </div>
        <div className="mt-14"><Button to="/vardas/tables">Book on these terms</Button></div>
      </Section>
    </div>
  );
}
